import { randomUUID } from "node:crypto";
import type { Pool, PoolClient } from "pg";
import {
  ExternalCallPolicy,
  PgAuditSink,
  PgOutboxStore,
  PgTransactionAdapter,
  createDomainEventEnvelope,
  insertRelationship,
  loadRelationship,
  loadRelationshipForSubject,
  markRelationshipRevoked,
  reactivateRelationship,
  runTransactionalCommand,
  setRelationshipVerificationMethod,
  type AuditSink,
  type CommandActor,
  type CommandAuditOutcome,
  type PersistedRelationship
} from "@nelyohealth/database";
import type {
  AuthorizationRelationshipDraft,
  RelationshipVerificationMethod
} from "./relationship-model.js";
import { evaluateAuthorizationPolicyDecision } from "./authorization-policy-handlers.js";
import type {
  AuthorizationPolicyDecisionDraft,
  AuthorizationPolicyDecisionDraftInput,
  RelationshipStatus,
  RelationshipType
} from "./authorization-policy.js";

/**
 * Relationship service (roadmap M4.2 — Relationship Persistence).
 *
 * Two responsibilities, both server-side:
 *
 *  1. Relationship lifecycle commands. Establish, verify, and revoke run as
 *     transactional commands: the relationship state change, the
 *     RelationshipEstablished / RelationshipVerified / RelationshipRevoked event,
 *     and the audit intent all commit together or not at all (M3 pattern).
 *     Establishing a relationship of an (actor, patient, organization, type) that
 *     already exists re-activates that row; revoke flips it to 'revoked'.
 *     Versioned auditability comes from the per-aggregate audit trail
 *     (aggregate = relationship_id), not a versions table.
 *
 *  2. Relationship-gated authorization. The ReBAC dimension reads the CURRENT
 *     persisted relationship live and overlays it onto the existing Policy
 *     Decision Point. Nothing is cached on the authorization path
 *     (derive-don't-persist), so a revocation propagates to the very next
 *     decision, and expiry is evaluated against expiry_date at decision time
 *     rather than requiring a batch flip. No persisted relationship (or
 *     relationshipType "none") yields the PDP's default-deny
 *     ('relationship-missing') whenever a relationship is required.
 *
 * Events and audit details carry references only (relationship/actor/patient/org
 * ids, relationship type, capability labels) — no clinical bodies.
 */

export interface RelationshipSafeContext {
  requestId: string;
  correlationId: string;
  idempotencyKey: string;
  operationTag: string;
}

export interface RelationshipServiceDeps {
  pool: Pool;
  transaction: PgTransactionAdapter;
  outbox: PgOutboxStore<Record<string, unknown>>;
  auditSink: AuditSink<PoolClient>;
  externalCallPolicy: ExternalCallPolicy;
}

export function createPgRelationshipServiceDeps(pool: Pool): RelationshipServiceDeps {
  return {
    pool,
    transaction: new PgTransactionAdapter(pool),
    outbox: new PgOutboxStore<Record<string, unknown>>(pool),
    auditSink: new PgAuditSink(),
    externalCallPolicy: new ExternalCallPolicy()
  };
}

// ---------- Establish ----------

export interface EstablishRelationshipInput {
  actorRef: string;
  patientRef: string;
  organizationRef: string;
  relationshipType: AuthorizationRelationshipDraft["relationshipType"];
  verificationMethod: RelationshipVerificationMethod;
  effectiveDate: string;
  expiryDate?: string;
  permittedActions: string[];
  actor: CommandActor;
  safeContext: RelationshipSafeContext;
  now?: () => Date;
}

export interface EstablishRelationshipOutcome {
  status: "established";
  relationshipId: string;
  reactivated: boolean;
}

/**
 * Establish (or re-activate) a relationship of a given type between an actor and
 * a patient within an organization. Emits RelationshipEstablished iff it commits.
 */
export async function establishRelationship(
  deps: RelationshipServiceDeps,
  input: EstablishRelationshipInput
): Promise<EstablishRelationshipOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  // Fix the aggregate id up front: reuse the existing (actor, patient, org, type)
  // relationship, or mint a new one. A concurrent creator racing us fails the
  // (actor, patient, org, type) uniqueness constraint and rolls back.
  const existing = await withClient(deps.pool, (client) =>
    loadRelationshipForSubject(client, {
      actorRef: input.actorRef,
      patientRef: input.patientRef,
      organizationRef: input.organizationRef,
      relationshipType: input.relationshipType
    })
  );
  const relationshipId = existing?.relationshipId ?? randomUUID();

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "relationship.graph.establish",
      aggregateId: relationshipId,
      action: "establish",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (
      ctx
    ): Promise<{ result: EstablishRelationshipOutcome; audit: CommandAuditOutcome }> => {
      const current = await loadRelationship(ctx.client, relationshipId);
      if (!current) {
        await insertRelationship(ctx.client, {
          relationshipId,
          actorRef: input.actorRef,
          patientRef: input.patientRef,
          organizationRef: input.organizationRef,
          relationshipType: input.relationshipType,
          status: "active",
          verificationMethod: input.verificationMethod,
          effectiveDate: input.effectiveDate,
          expiryDate: input.expiryDate,
          permittedActions: input.permittedActions,
          createdAt: nowIso,
          updatedAt: nowIso
        });
      } else {
        await reactivateRelationship(ctx.client, {
          relationshipId,
          verificationMethod: input.verificationMethod,
          effectiveDate: input.effectiveDate,
          expiryDate: input.expiryDate,
          permittedActions: input.permittedActions,
          updatedAt: nowIso
        });
      }

      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "RelationshipEstablished",
          aggregateId: relationshipId,
          safeContext: input.safeContext,
          payload: {
            relationshipRef: relationshipId,
            actorRef: input.actorRef,
            patientRef: input.patientRef,
            organizationRef: input.organizationRef,
            relationshipType: input.relationshipType,
            reactivated: Boolean(current)
          }
        })
      );

      return {
        result: {
          status: "established" as const,
          relationshipId,
          reactivated: Boolean(current)
        },
        audit: {
          outcome: "committed",
          safeDetails: {
            relationshipRef: relationshipId,
            actorRef: input.actorRef,
            patientRef: input.patientRef,
            organizationRef: input.organizationRef,
            relationshipType: input.relationshipType,
            reactivated: Boolean(current)
          }
        }
      };
    }
  });

  return result;
}

// ---------- Verify ----------

export interface VerifyRelationshipInput {
  relationshipId: string;
  verificationMethod: RelationshipVerificationMethod;
  actor: CommandActor;
  safeContext: RelationshipSafeContext;
  now?: () => Date;
}

export type VerifyRelationshipOutcome =
  | { status: "verified"; relationshipId: string }
  | { status: "not-found" };

/** Record a verification method for a relationship. Emits RelationshipVerified. */
export async function verifyRelationship(
  deps: RelationshipServiceDeps,
  input: VerifyRelationshipInput
): Promise<VerifyRelationshipOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const existing = await withClient(deps.pool, (client) =>
    loadRelationship(client, input.relationshipId)
  );
  if (!existing) {
    return { status: "not-found" };
  }

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "relationship.graph.verify",
      aggregateId: input.relationshipId,
      action: "verify",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      await setRelationshipVerificationMethod(ctx.client, {
        relationshipId: input.relationshipId,
        verificationMethod: input.verificationMethod,
        updatedAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "RelationshipVerified",
          aggregateId: input.relationshipId,
          safeContext: input.safeContext,
          payload: {
            relationshipRef: input.relationshipId,
            actorRef: existing.actorRef,
            patientRef: existing.patientRef,
            organizationRef: existing.organizationRef,
            relationshipType: existing.relationshipType,
            verificationMethod: input.verificationMethod
          }
        })
      );
      return {
        result: { status: "verified" as const, relationshipId: input.relationshipId },
        audit: {
          outcome: "committed",
          safeDetails: {
            relationshipRef: input.relationshipId,
            verificationMethod: input.verificationMethod
          }
        }
      };
    }
  });

  return result;
}

// ---------- Revoke ----------

export interface RevokeRelationshipInput {
  relationshipId: string;
  /** Short operational label, never free clinical text. */
  revocationReason: string;
  actor: CommandActor;
  safeContext: RelationshipSafeContext;
  now?: () => Date;
}

export type RevokeRelationshipOutcome =
  | { status: "revoked"; relationshipId: string }
  | { status: "already-revoked"; relationshipId: string }
  | { status: "not-found" };

/**
 * Revoke a relationship: flip it to 'revoked' and record who/when/why. No such
 * relationship is a no-op; an already revoked relationship is idempotent. Emits
 * RelationshipRevoked iff a live relationship was actually revoked.
 */
export async function revokeRelationship(
  deps: RelationshipServiceDeps,
  input: RevokeRelationshipInput
): Promise<RevokeRelationshipOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const existing = await withClient(deps.pool, (client) =>
    loadRelationship(client, input.relationshipId)
  );
  if (!existing) {
    return { status: "not-found" };
  }

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "relationship.graph.revoke",
      aggregateId: input.relationshipId,
      action: "revoke",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (
      ctx
    ): Promise<{ result: RevokeRelationshipOutcome; audit: CommandAuditOutcome }> => {
      const current = await loadRelationship(ctx.client, input.relationshipId);
      if (!current) {
        return {
          result: { status: "not-found" as const },
          audit: { outcome: "noop", safeDetails: { relationshipRef: input.relationshipId } }
        };
      }
      if (current.status === "revoked") {
        return {
          result: { status: "already-revoked" as const, relationshipId: input.relationshipId },
          audit: { outcome: "noop", safeDetails: { relationshipRef: input.relationshipId } }
        };
      }

      await markRelationshipRevoked(ctx.client, {
        relationshipId: input.relationshipId,
        revokedAt: nowIso,
        revokedByActorRef: input.actor.accountRef,
        revocationReason: input.revocationReason,
        updatedAt: nowIso
      });

      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "RelationshipRevoked",
          aggregateId: input.relationshipId,
          safeContext: input.safeContext,
          payload: {
            relationshipRef: input.relationshipId,
            actorRef: current.actorRef,
            patientRef: current.patientRef,
            organizationRef: current.organizationRef,
            relationshipType: current.relationshipType,
            reasonCode: input.revocationReason
          }
        })
      );

      return {
        result: { status: "revoked" as const, relationshipId: input.relationshipId },
        audit: {
          outcome: "committed",
          safeDetails: {
            relationshipRef: input.relationshipId,
            relationshipType: current.relationshipType
          }
        }
      };
    }
  });

  return result;
}

// ---------- Relationship-gated authorization ----------

export async function loadRelationshipForAuthorization(
  deps: Pick<RelationshipServiceDeps, "pool">,
  input: { actorRef: string; patientRef: string; organizationRef: string; relationshipType: string }
): Promise<PersistedRelationship | null> {
  return withClient(deps.pool, (client) => loadRelationshipForSubject(client, input));
}

/**
 * Map a persisted relationship to the AuthorizationRelationshipDraft shape the
 * Policy Decision Point consumes. Persisted labels were validated by the schema
 * CHECK constraints; the assertion here is the persistence-boundary trust point.
 */
export function mapPersistedRelationshipToDraft(
  record: PersistedRelationship
): AuthorizationRelationshipDraft {
  return {
    relationshipId: record.relationshipId,
    relationshipType: record.relationshipType,
    actorId: record.actorRef,
    patientId: record.patientRef,
    organizationId: record.organizationRef,
    lifecycle: {
      status: record.status,
      verificationMethod: record.verificationMethod as RelationshipVerificationMethod,
      effectiveDate: record.effectiveDate,
      expiryDate: record.expiryDate,
      permittedActions: [...record.permittedActions],
      revocationInfo: record.revokedAt
        ? {
            revokedAt: record.revokedAt,
            revokedByActorId: record.revokedByActorRef ?? "unknown",
            reason: record.revocationReason ?? "unspecified"
          }
        : undefined,
      supportingDocuments: [],
      reviewHistory: []
    }
  } as AuthorizationRelationshipDraft;
}

export type RelationshipAuthorizationBaseInput = Omit<
  AuthorizationPolicyDecisionDraftInput,
  "relationship" | "relationshipType" | "relationshipStatus"
>;

/**
 * Overlay the CURRENT persisted relationship onto an authorization decision and
 * evaluate it. Because the relationship is read live (not cached), a revocation
 * recorded by revokeRelationship — or an expiry that has passed — is reflected in
 * the very next call. No persisted relationship yields the PDP's default-deny
 * ('relationship-missing') when a relationship is required.
 */
export function decideAuthorizationWithPersistedRelationship(
  base: RelationshipAuthorizationBaseInput,
  persistedRelationship: PersistedRelationship | null
): AuthorizationPolicyDecisionDraft {
  const relationship = persistedRelationship
    ? mapPersistedRelationshipToDraft(persistedRelationship)
    : undefined;
  const relationshipType: RelationshipType = persistedRelationship
    ? (persistedRelationship.relationshipType as RelationshipType)
    : "none";
  const relationshipStatus: RelationshipStatus = persistedRelationship
    ? persistedRelationship.status
    : "none";
  return evaluateAuthorizationPolicyDecision({
    ...base,
    relationship,
    relationshipType,
    relationshipStatus
  });
}

/**
 * Read the current persisted relationship of the given type for the decision
 * subject and evaluate the authorization decision against it in one call.
 */
export async function decideAuthorizationForSubject(
  deps: Pick<RelationshipServiceDeps, "pool">,
  base: RelationshipAuthorizationBaseInput,
  relationshipType: string
): Promise<AuthorizationPolicyDecisionDraft> {
  const persisted = await loadRelationshipForAuthorization(deps, {
    actorRef: base.actorId,
    patientRef: base.patientId,
    organizationRef: base.organizationId,
    relationshipType
  });
  return decideAuthorizationWithPersistedRelationship(base, persisted);
}

async function withClient<T>(pool: Pool, fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
