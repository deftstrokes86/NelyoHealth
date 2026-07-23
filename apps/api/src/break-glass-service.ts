import { randomUUID } from "node:crypto";
import type { Pool, PoolClient } from "pg";
import {
  ExternalCallPolicy,
  PgAuditSink,
  PgOutboxStore,
  PgTransactionAdapter,
  activateBreakGlassAccess as activateBreakGlassRow,
  createDomainEventEnvelope,
  insertBreakGlassAccess,
  loadActiveBreakGlassForSubject,
  loadBreakGlassAccess,
  markBreakGlassExpired,
  recordBreakGlassReview,
  runTransactionalCommand,
  type AuditSink,
  type BreakGlassReviewOutcome,
  type CommandActor,
  type CommandAuditOutcome,
  type PersistedBreakGlassAccess
} from "@nelyohealth/database";
import { evaluateAuthorizationPolicyDecision } from "./authorization-policy-handlers.js";
import type {
  AuthorizationPolicyDecisionDraft,
  AuthorizationPolicyDecisionDraftInput
} from "./authorization-policy.js";

/**
 * Break-glass service (roadmap M4.3 — Persisted Emergency Access).
 *
 * Two responsibilities, both server-side:
 *
 *  1. Emergency-access lifecycle commands. Request, activate, and review run as
 *     transactional commands: the break-glass state change, the
 *     BreakGlassRequested / BreakGlassActivated / BreakGlassExpired /
 *     BreakGlassReviewed event, and the audit intent all commit together or not
 *     at all (M3 pattern). Access is time-bounded (ttl <= 15 min) and expires
 *     automatically; activation past the window records an expiry instead.
 *
 *  2. Break-glass-gated authorization. The override is DERIVED from the CURRENT
 *     active grant at decision time and overlaid onto the existing Policy
 *     Decision Point. Nothing is cached (derive-don't-persist), so the override
 *     lapses the instant the window closes and a revocation/expiry propagates to
 *     the very next decision. The PDP keeps break-glass tightly constrained: a
 *     justification is mandatory and the emergency bypass fires only for a
 *     declared emergency with an emergency-care purpose.
 *
 * PHI discipline: the justification may carry clinical narrative, so it lives
 * only in the persisted (access-controlled) record. Events and audit details
 * carry the access_id reference and non-clinical metadata — never the
 * justification text. The PDP only needs the justification to EXIST (it checks
 * presence, never emits it).
 */

const MAX_TTL_MINUTES = 15;

export interface BreakGlassSafeContext {
  requestId: string;
  correlationId: string;
  idempotencyKey: string;
  operationTag: string;
}

export interface BreakGlassServiceDeps {
  pool: Pool;
  transaction: PgTransactionAdapter;
  outbox: PgOutboxStore<Record<string, unknown>>;
  auditSink: AuditSink<PoolClient>;
  externalCallPolicy: ExternalCallPolicy;
}

export function createPgBreakGlassServiceDeps(pool: Pool): BreakGlassServiceDeps {
  return {
    pool,
    transaction: new PgTransactionAdapter(pool),
    outbox: new PgOutboxStore<Record<string, unknown>>(pool),
    auditSink: new PgAuditSink(),
    externalCallPolicy: new ExternalCallPolicy()
  };
}

// ---------- Request ----------

export interface RequestBreakGlassInput {
  actorRef: string;
  patientRef: string;
  organizationRef: string;
  /** Immutable justification — persisted, access-controlled, never in events. */
  justification: string;
  ttlMinutes: number;
  actor: CommandActor;
  safeContext: BreakGlassSafeContext;
  now?: () => Date;
}

export type RequestBreakGlassOutcome =
  | { status: "requested"; accessId: string; expiresAt: string }
  | { status: "rejected"; reasonCode: "justification-required" | "invalid-ttl" };

/**
 * Request an emergency break-glass grant. Justification is mandatory and the ttl
 * is bounded to 15 minutes. Emits BreakGlassRequested (references only) iff the
 * request commits.
 */
export async function requestBreakGlassAccess(
  deps: BreakGlassServiceDeps,
  input: RequestBreakGlassInput
): Promise<RequestBreakGlassOutcome> {
  if (!input.justification.trim()) {
    return { status: "rejected", reasonCode: "justification-required" };
  }
  if (
    !Number.isInteger(input.ttlMinutes) ||
    input.ttlMinutes <= 0 ||
    input.ttlMinutes > MAX_TTL_MINUTES
  ) {
    return { status: "rejected", reasonCode: "invalid-ttl" };
  }

  const now = input.now?.() ?? new Date();
  const nowIso = now.toISOString();
  const expiresAt = new Date(now.getTime() + input.ttlMinutes * 60_000).toISOString();
  const accessId = randomUUID();

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "break-glass.access.request",
      aggregateId: accessId,
      action: "request",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      await insertBreakGlassAccess(ctx.client, {
        accessId,
        actorRef: input.actorRef,
        patientRef: input.patientRef,
        organizationRef: input.organizationRef,
        justification: input.justification,
        ttlMinutes: input.ttlMinutes,
        requestedAt: nowIso,
        expiresAt,
        createdAt: nowIso,
        updatedAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "BreakGlassRequested",
          aggregateId: accessId,
          safeContext: input.safeContext,
          payload: {
            accessRef: accessId,
            actorRef: input.actorRef,
            patientRef: input.patientRef,
            organizationRef: input.organizationRef,
            ttlMinutes: input.ttlMinutes,
            expiresAt
          }
        })
      );
      return {
        result: { status: "requested" as const, accessId, expiresAt },
        audit: {
          outcome: "committed",
          safeDetails: {
            accessRef: accessId,
            actorRef: input.actorRef,
            patientRef: input.patientRef,
            organizationRef: input.organizationRef,
            ttlMinutes: input.ttlMinutes
          }
        }
      };
    }
  });

  return result;
}

// ---------- Activate ----------

export interface ActivateBreakGlassInput {
  accessId: string;
  actor: CommandActor;
  safeContext: BreakGlassSafeContext;
  now?: () => Date;
}

export type ActivateBreakGlassOutcome =
  | { status: "active"; accessId: string; expiresAt: string }
  | { status: "expired"; accessId: string }
  | { status: "not-activatable"; accessId: string }
  | { status: "not-found" };

/**
 * Activate a requested grant — the moment emergency access is actually used.
 * Activating after the window has closed records an expiry instead. Emits
 * BreakGlassActivated (or BreakGlassExpired) iff it commits.
 */
export async function activateBreakGlassAccess(
  deps: BreakGlassServiceDeps,
  input: ActivateBreakGlassInput
): Promise<ActivateBreakGlassOutcome> {
  const now = input.now?.() ?? new Date();
  const nowIso = now.toISOString();
  const existing = await withClient(deps.pool, (client) =>
    loadBreakGlassAccess(client, input.accessId)
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
      name: "break-glass.access.activate",
      aggregateId: input.accessId,
      action: "activate",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (
      ctx
    ): Promise<{ result: ActivateBreakGlassOutcome; audit: CommandAuditOutcome }> => {
      const current = await loadBreakGlassAccess(ctx.client, input.accessId);
      if (!current) {
        return {
          result: { status: "not-found" as const },
          audit: { outcome: "noop", safeDetails: { accessRef: input.accessId } }
        };
      }
      if (current.status === "active") {
        return {
          result: {
            status: "active" as const,
            accessId: input.accessId,
            expiresAt: current.expiresAt
          },
          audit: { outcome: "noop", safeDetails: { accessRef: input.accessId } }
        };
      }
      if (current.status !== "requested") {
        return {
          result: { status: "not-activatable" as const, accessId: input.accessId },
          audit: { outcome: "noop", safeDetails: { accessRef: input.accessId } }
        };
      }

      // Requested: honor the time bound. Activation past expiry records an expiry.
      if (Date.parse(nowIso) > Date.parse(current.expiresAt)) {
        await markBreakGlassExpired(ctx.client, { accessId: input.accessId, updatedAt: nowIso });
        await ctx.enqueueDomainEvent(
          createDomainEventEnvelope({
            eventType: "BreakGlassExpired",
            aggregateId: input.accessId,
            safeContext: input.safeContext,
            payload: {
              accessRef: input.accessId,
              actorRef: current.actorRef,
              patientRef: current.patientRef,
              organizationRef: current.organizationRef
            }
          })
        );
        return {
          result: { status: "expired" as const, accessId: input.accessId },
          audit: {
            outcome: "committed",
            safeDetails: { accessRef: input.accessId, transition: "expired" }
          }
        };
      }

      const complianceNotificationRef = `bg-notify-${input.accessId}`;
      await activateBreakGlassRow(ctx.client, {
        accessId: input.accessId,
        activatedAt: nowIso,
        complianceNotifiedAt: nowIso,
        complianceNotificationRef,
        updatedAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "BreakGlassActivated",
          aggregateId: input.accessId,
          safeContext: input.safeContext,
          payload: {
            accessRef: input.accessId,
            actorRef: current.actorRef,
            patientRef: current.patientRef,
            organizationRef: current.organizationRef,
            expiresAt: current.expiresAt,
            complianceNotificationRef
          }
        })
      );
      return {
        result: {
          status: "active" as const,
          accessId: input.accessId,
          expiresAt: current.expiresAt
        },
        audit: {
          outcome: "committed",
          safeDetails: {
            accessRef: input.accessId,
            actorRef: current.actorRef,
            patientRef: current.patientRef,
            organizationRef: current.organizationRef,
            transition: "activated"
          }
        }
      };
    }
  });

  return result;
}

// ---------- Review ----------

export interface ReviewBreakGlassInput {
  accessId: string;
  outcome: BreakGlassReviewOutcome;
  reviewedByActorRef: string;
  reviewNotes?: string;
  actor: CommandActor;
  safeContext: BreakGlassSafeContext;
  now?: () => Date;
}

export type ReviewBreakGlassOutcome =
  | { status: "reviewed"; accessId: string }
  | { status: "not-found" };

/**
 * Record a post-incident review with reviewer attribution and an outcome. Emits
 * BreakGlassReviewed (references + outcome only) iff it commits.
 */
export async function reviewBreakGlassAccess(
  deps: BreakGlassServiceDeps,
  input: ReviewBreakGlassInput
): Promise<ReviewBreakGlassOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const existing = await withClient(deps.pool, (client) =>
    loadBreakGlassAccess(client, input.accessId)
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
      name: "break-glass.access.review",
      aggregateId: input.accessId,
      action: "review",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      await recordBreakGlassReview(ctx.client, {
        accessId: input.accessId,
        reviewedAt: nowIso,
        reviewedByActorRef: input.reviewedByActorRef,
        reviewOutcome: input.outcome,
        reviewNotes: input.reviewNotes,
        updatedAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "BreakGlassReviewed",
          aggregateId: input.accessId,
          safeContext: input.safeContext,
          payload: {
            accessRef: input.accessId,
            reviewedByActorRef: input.reviewedByActorRef,
            reviewOutcome: input.outcome
          }
        })
      );
      return {
        result: { status: "reviewed" as const, accessId: input.accessId },
        audit: {
          outcome: "committed",
          safeDetails: {
            accessRef: input.accessId,
            reviewedByActorRef: input.reviewedByActorRef,
            reviewOutcome: input.outcome
          }
        }
      };
    }
  });

  return result;
}

// ---------- Break-glass-gated authorization ----------

export async function loadBreakGlassForAuthorization(
  deps: Pick<BreakGlassServiceDeps, "pool">,
  input: { actorRef: string; patientRef: string; organizationRef: string }
): Promise<PersistedBreakGlassAccess | null> {
  return withClient(deps.pool, (client) => loadActiveBreakGlassForSubject(client, input));
}

export interface BreakGlassOverride {
  breakGlassRequested: boolean;
  breakGlassReason?: string;
  breakGlassWindowMinutes?: number;
}

/**
 * Derive the break-glass override from a persisted grant, evaluated against the
 * decision clock. A grant supplies the override only while it is 'active' AND its
 * window has not closed — expiry is derived here, so the override self-cancels the
 * moment it lapses. The justification is passed only as the presence signal the
 * PDP needs; the PDP never emits it.
 */
export function deriveBreakGlassOverride(
  access: PersistedBreakGlassAccess | null,
  evaluatedAtMs: number
): BreakGlassOverride {
  const active =
    access !== null &&
    access.status === "active" &&
    (Number.isNaN(evaluatedAtMs) || Date.parse(access.expiresAt) > evaluatedAtMs);
  if (!active || access === null) {
    return { breakGlassRequested: false };
  }
  return {
    breakGlassRequested: true,
    breakGlassReason: access.justification,
    breakGlassWindowMinutes: access.ttlMinutes
  };
}

export type BreakGlassAuthorizationBaseInput = Omit<
  AuthorizationPolicyDecisionDraftInput,
  "breakGlassRequested" | "breakGlassReason" | "breakGlassWindowMinutes"
>;

/**
 * Overlay the CURRENT persisted break-glass grant onto an authorization decision
 * and evaluate it. Because the grant is read live and its window checked against
 * the decision's own evaluatedAt, an expired grant contributes no override.
 */
export function decideAuthorizationWithBreakGlass(
  base: BreakGlassAuthorizationBaseInput,
  access: PersistedBreakGlassAccess | null
): AuthorizationPolicyDecisionDraft {
  const override = deriveBreakGlassOverride(access, Date.parse(base.evaluatedAt));
  return evaluateAuthorizationPolicyDecision({ ...base, ...override });
}

/**
 * Read the current active break-glass grant for the decision subject and evaluate
 * the authorization decision against it in one call.
 */
export async function decideAuthorizationForSubjectWithBreakGlass(
  deps: Pick<BreakGlassServiceDeps, "pool">,
  base: BreakGlassAuthorizationBaseInput
): Promise<AuthorizationPolicyDecisionDraft> {
  const access = await loadBreakGlassForAuthorization(deps, {
    actorRef: base.actorId,
    patientRef: base.patientId,
    organizationRef: base.organizationId
  });
  return decideAuthorizationWithBreakGlass(base, access);
}

async function withClient<T>(pool: Pool, fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
