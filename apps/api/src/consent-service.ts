import { randomUUID } from "node:crypto";
import type { Pool, PoolClient } from "pg";
import {
  ExternalCallPolicy,
  PgAuditSink,
  PgOutboxStore,
  PgTransactionAdapter,
  createDomainEventEnvelope,
  insertConsentRecord,
  insertConsentVersion,
  loadConsentRecord,
  loadConsentRecordByPatientOrg,
  markConsentVersionRevoked,
  markConsentVersionSuperseded,
  runTransactionalCommand,
  setConsentRecordCurrentVersion,
  type AuditSink,
  type CommandActor,
  type CommandAuditOutcome,
  type PersistedConsentRecord
} from "@nelyohealth/database";
import type { ConsentDomain, ConsentRecordDraft } from "./granular-consent.js";
import { evaluateAuthorizationPolicyDecision } from "./authorization-policy-handlers.js";
import type {
  AuthorizationPolicyDecisionDraft,
  AuthorizationPolicyDecisionDraftInput,
  ConsentStatus
} from "./authorization-policy.js";

/**
 * Consent service (roadmap M4.1 — Consent Persistence).
 *
 * Two responsibilities, both server-side:
 *
 *  1. Consent lifecycle commands. Grant and withdrawal run as transactional
 *     commands: the consent state change, the ConsentGranted / ConsentWithdrawn
 *     event, and the audit intent all commit together or not at all (M3 pattern).
 *     Grant opens the record at version 1 or supersedes the current version;
 *     withdrawal flips the current version to 'revoked'. Versioning and
 *     optimistic concurrency are enforced by the (consent_id, version) primary
 *     key and the (patient, organization) uniqueness constraint — a losing
 *     concurrent writer rolls its whole command back.
 *
 *  2. Consent-gated authorization. The decision path reads the CURRENT persisted
 *     consent live and overlays it onto the existing Policy Decision Point
 *     (evaluateAuthorizationPolicyDecision). No consent status is cached on the
 *     authorization path (derive-don't-persist), so a withdrawal propagates to
 *     the very next decision. Default-deny holds: no persisted consent means the
 *     PDP denies with 'consent-missing'.
 *
 * Consent categories cross the wire as references, never bodies: events and
 * audit details carry consent/patient/organization ids, version numbers, and
 * consent-category labels only — no clinical content.
 */

export interface ConsentSafeContext {
  requestId: string;
  correlationId: string;
  idempotencyKey: string;
  operationTag: string;
}

export interface ConsentServiceDeps {
  pool: Pool;
  transaction: PgTransactionAdapter;
  outbox: PgOutboxStore<Record<string, unknown>>;
  auditSink: AuditSink<PoolClient>;
  externalCallPolicy: ExternalCallPolicy;
}

export function createPgConsentServiceDeps(pool: Pool): ConsentServiceDeps {
  return {
    pool,
    transaction: new PgTransactionAdapter(pool),
    outbox: new PgOutboxStore<Record<string, unknown>>(pool),
    auditSink: new PgAuditSink(),
    externalCallPolicy: new ExternalCallPolicy()
  };
}

// ---------- Grant ----------

export interface GrantConsentInput {
  patientRef: string;
  organizationRef: string;
  grantedDomains: ConsentDomain[];
  effectiveDate: string;
  expiryDate?: string;
  /** Who is granting — attributed as the version author and the command actor. */
  actor: CommandActor;
  safeContext: ConsentSafeContext;
  now?: () => Date;
}

export interface GrantConsentOutcome {
  status: "granted";
  consentId: string;
  version: number;
}

/**
 * Grant (or re-grant) consent for a patient within an organization. The first
 * grant opens the record at version 1; a subsequent grant supersedes the
 * current version with a new one. Emits ConsentGranted iff the grant commits.
 */
export async function grantConsent(
  deps: ConsentServiceDeps,
  input: GrantConsentInput
): Promise<GrantConsentOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  // Fix the aggregate id up front: reuse the existing record for this
  // (patient, organization), or mint a new one. A concurrent creator racing
  // us fails the (patient, organization) uniqueness constraint and rolls back.
  const existing = await withClient(deps.pool, (client) =>
    loadConsentRecordByPatientOrg(client, input.patientRef, input.organizationRef)
  );
  const consentId = existing?.consentId ?? randomUUID();

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "consent.grants.grant",
      aggregateId: consentId,
      action: "grant",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      const current = await loadConsentRecord(ctx.client, consentId);
      let version: number;
      if (!current) {
        version = 1;
        await insertConsentRecord(ctx.client, {
          consentId,
          patientRef: input.patientRef,
          organizationRef: input.organizationRef,
          currentVersion: version,
          createdAt: nowIso,
          updatedAt: nowIso
        });
        await insertConsentVersion(ctx.client, {
          consentId,
          version,
          status: "granted",
          grantedDomains: input.grantedDomains,
          effectiveDate: input.effectiveDate,
          expiryDate: input.expiryDate,
          createdAt: nowIso,
          createdByActorRef: input.actor.accountRef
        });
      } else {
        version = current.currentVersion + 1;
        await markConsentVersionSuperseded(ctx.client, {
          consentId,
          version: current.currentVersion,
          supersededByVersion: version
        });
        await insertConsentVersion(ctx.client, {
          consentId,
          version,
          status: "granted",
          grantedDomains: input.grantedDomains,
          effectiveDate: input.effectiveDate,
          expiryDate: input.expiryDate,
          createdAt: nowIso,
          createdByActorRef: input.actor.accountRef
        });
        await setConsentRecordCurrentVersion(ctx.client, {
          consentId,
          currentVersion: version,
          updatedAt: nowIso
        });
      }

      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "ConsentGranted",
          aggregateId: consentId,
          safeContext: input.safeContext,
          payload: {
            consentRef: consentId,
            patientRef: input.patientRef,
            organizationRef: input.organizationRef,
            version,
            grantedDomains: [...input.grantedDomains]
          }
        })
      );

      return {
        result: { status: "granted" as const, consentId, version },
        audit: {
          outcome: "committed",
          safeDetails: {
            consentRef: consentId,
            patientRef: input.patientRef,
            organizationRef: input.organizationRef,
            version,
            domainCount: input.grantedDomains.length
          }
        }
      };
    }
  });

  return result;
}

// ---------- Withdraw ----------

export interface WithdrawConsentInput {
  patientRef: string;
  organizationRef: string;
  /** Short operational label, never free clinical text. */
  revocationReason: string;
  actor: CommandActor;
  safeContext: ConsentSafeContext;
  now?: () => Date;
}

export type WithdrawConsentOutcome =
  | { status: "withdrawn"; consentId: string; version: number }
  | { status: "already-withdrawn"; consentId: string; version: number }
  | { status: "no-consent" };

/**
 * Withdraw consent for a patient within an organization: flip the current
 * version to 'revoked'. No record is a no-op (nothing to withdraw); an already
 * revoked current version is idempotent. Emits ConsentWithdrawn iff a live
 * grant was actually revoked.
 */
export async function withdrawConsent(
  deps: ConsentServiceDeps,
  input: WithdrawConsentInput
): Promise<WithdrawConsentOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const existing = await withClient(deps.pool, (client) =>
    loadConsentRecordByPatientOrg(client, input.patientRef, input.organizationRef)
  );
  if (!existing) {
    return { status: "no-consent" };
  }
  const consentId = existing.consentId;

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "consent.grants.withdraw",
      aggregateId: consentId,
      action: "withdraw",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx): Promise<{ result: WithdrawConsentOutcome; audit: CommandAuditOutcome }> => {
      const current = await loadConsentRecord(ctx.client, consentId);
      const currentVersion = current?.versions.find(
        (version) => version.version === current.currentVersion
      );
      if (!current || !currentVersion) {
        return {
          result: { status: "no-consent" as const },
          audit: { outcome: "noop", safeDetails: { consentRef: consentId } }
        };
      }
      if (currentVersion.status === "revoked") {
        return {
          result: {
            status: "already-withdrawn" as const,
            consentId,
            version: currentVersion.version
          },
          audit: {
            outcome: "noop",
            safeDetails: { consentRef: consentId, version: currentVersion.version }
          }
        };
      }

      await markConsentVersionRevoked(ctx.client, {
        consentId,
        version: currentVersion.version,
        revokedAt: nowIso,
        revokedByActorRef: input.actor.accountRef,
        revocationReason: input.revocationReason,
        updatedAt: nowIso
      });

      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "ConsentWithdrawn",
          aggregateId: consentId,
          safeContext: input.safeContext,
          payload: {
            consentRef: consentId,
            patientRef: input.patientRef,
            organizationRef: input.organizationRef,
            version: currentVersion.version,
            reasonCode: input.revocationReason
          }
        })
      );

      return {
        result: {
          status: "withdrawn" as const,
          consentId,
          version: currentVersion.version
        },
        audit: {
          outcome: "committed",
          safeDetails: {
            consentRef: consentId,
            patientRef: input.patientRef,
            organizationRef: input.organizationRef,
            version: currentVersion.version
          }
        }
      };
    }
  });

  return result;
}

// ---------- Consent-gated authorization ----------

/** Load the current persisted consent for a decision subject (read-only). */
export async function loadConsentForPatientOrg(
  deps: Pick<ConsentServiceDeps, "pool">,
  patientRef: string,
  organizationRef: string
): Promise<PersistedConsentRecord | null> {
  return withClient(deps.pool, (client) =>
    loadConsentRecordByPatientOrg(client, patientRef, organizationRef)
  );
}

/**
 * Map a persisted consent record to the ConsentRecordDraft shape the Policy
 * Decision Point consumes. Persisted domains were validated as ConsentDomain
 * at grant time; the assertion here is the persistence-boundary trust point.
 */
export function mapPersistedConsentToDraft(record: PersistedConsentRecord): ConsentRecordDraft {
  return {
    consentId: record.consentId,
    patientId: record.patientRef,
    organizationId: record.organizationRef,
    currentVersion: record.currentVersion,
    updatedAt: record.updatedAt,
    versions: record.versions.map((version) => ({
      version: version.version,
      status: version.status,
      grantedDomains: [...version.grantedDomains] as ConsentDomain[],
      effectiveDate: version.effectiveDate,
      expiryDate: version.expiryDate,
      revokedAt: version.revokedAt,
      revokedByActorId: version.revokedByActorRef,
      revocationReason: version.revocationReason,
      supersededByVersion: version.supersededByVersion,
      createdAt: version.createdAt,
      createdByActorId: version.createdByActorRef
    }))
  };
}

/**
 * Derive the authorization ConsentStatus from the CURRENT persisted version.
 * The PDP re-checks effective/expiry dates and domain scope; this only reports
 * the current version's lifecycle status. Absent a current version, deny-safe.
 */
export function derivePersistedConsentStatus(record: PersistedConsentRecord): ConsentStatus {
  const currentVersion = record.versions.find(
    (version) => version.version === record.currentVersion
  );
  return currentVersion?.status ?? "revoked";
}

export type ConsentAuthorizationBaseInput = Omit<
  AuthorizationPolicyDecisionDraftInput,
  "consent" | "consentStatus"
>;

/**
 * Overlay the CURRENT persisted consent onto an authorization decision and
 * evaluate it. This is the consent → authorization integration point: because
 * the persisted record is read live (not cached), a withdrawal recorded by
 * withdrawConsent is reflected in the very next call. No persisted consent
 * yields the PDP's default-deny ('consent-missing').
 */
export function decideAuthorizationWithPersistedConsent(
  base: ConsentAuthorizationBaseInput,
  persistedConsent: PersistedConsentRecord | null
): AuthorizationPolicyDecisionDraft {
  const consent = persistedConsent ? mapPersistedConsentToDraft(persistedConsent) : undefined;
  const consentStatus: ConsentStatus = persistedConsent
    ? derivePersistedConsentStatus(persistedConsent)
    : "revoked";
  return evaluateAuthorizationPolicyDecision({ ...base, consent, consentStatus });
}

/**
 * Read the current persisted consent for the decision subject and evaluate the
 * authorization decision against it in one call.
 */
export async function decideAuthorizationForPatientOrg(
  deps: Pick<ConsentServiceDeps, "pool">,
  base: ConsentAuthorizationBaseInput
): Promise<AuthorizationPolicyDecisionDraft> {
  const persisted = await loadConsentForPatientOrg(deps, base.patientId, base.organizationId);
  return decideAuthorizationWithPersistedConsent(base, persisted);
}

async function withClient<T>(pool: Pool, fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
