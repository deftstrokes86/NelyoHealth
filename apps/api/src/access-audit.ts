import { randomUUID } from "node:crypto";
import type { Pool } from "pg";
import {
  PgAuditSink,
  assertSafeAuditEvent,
  type AuditEventRecord,
  type CommandActor
} from "@nelyohealth/database";
import {
  resolveAndDecideResourceAccess,
  type ResourceAccessRequest
} from "./resource-authorization.js";
import {
  evaluateCapabilityWorkspaceAuthorization,
  evaluateSelfAccessAuthorization,
  type CapabilityWorkspaceDecisionInput,
  type SelfAccessDecisionInput
} from "./authorization-policy-handlers.js";
import type { AuthorizationPolicyDecisionDraft } from "./authorization-policy.js";

/**
 * The caller-supplied part of a capability + workspace decision (ADR-0012): the
 * actor + workspace + purpose + clock. The resource/action are fixed by the
 * command, and the audit subject (`subjectRef`) + organization are derived by it
 * (from the loaded artifact for derived-authority, or the command input for
 * org-internal).
 */
export type CapabilityWriteAccessContext = Omit<
  CapabilityWorkspaceDecisionInput,
  "subjectRef" | "requestedResource" | "requestedAction" | "organizationId"
>;

/**
 * Deny-audit (roadmap M6.3b, Principle 11 — every denied access attempt must be
 * auditable). Decide-before-load / decide-before-write returns a decision draft;
 * before M6.3b a NON-ALLOW decision was never persisted, so denied attempts left
 * no trail (the window was permanently dark — nothing else recorded the actor,
 * subject, or reason of a denial).
 *
 * `resolveDecideAndAuditAccess` is a drop-in for `resolveAndDecideResourceAccess`
 * that additionally persists an append-only authorization audit event whenever the
 * decision is not "allowed". It is built entirely from the ResourceAccessRequest
 * (actor id/role/type, resource, action, subject, decision id, clock), so reads
 * and writes are audited uniformly with no extra parameters. The audit is the
 * DECISION only — a policy reasonCode + resource/action, never PHI — so it needs
 * no transaction.
 */
/** A delegated (cross-patient) access: the relationship + capacity it ran under (M7.2). */
export interface AccessDelegation {
  relationshipRef: string;
  derivedActorRole: string;
}

export async function resolveDecideAndAuditAccess(
  pool: Pool,
  request: ResourceAccessRequest,
  options?: { delegation?: AccessDelegation }
): Promise<AuthorizationPolicyDecisionDraft> {
  const decision = await resolveAndDecideResourceAccess(pool, request);
  if (decision.status !== "allowed") {
    await recordDeniedAccessAudit(pool, request, {
      outcome: decision.status,
      reasonCode: decision.reasonCode,
      extraSafeDetails: options?.delegation
        ? {
            selectedRelationshipRef: options.delegation.relationshipRef,
            derivedActorRole: options.delegation.derivedActorRole
          }
        : undefined
    });
  } else if (options?.delegation) {
    // Audit the ALLOWED delegated access — who acted for whom, under which
    // relationship + capacity — so a caregiver's access is traceable, not just "allowed".
    await recordDelegatedAccessAudit(pool, request, options.delegation);
  }
  return decision;
}

/** Persist an append-only audit for an ALLOWED delegated (cross-patient) access. */
export async function recordDelegatedAccessAudit(
  pool: Pool,
  request: Pick<
    ResourceAccessRequest,
    | "actorId"
    | "actorRole"
    | "actorType"
    | "patientId"
    | "requestedResource"
    | "requestedAction"
    | "purpose"
    | "decisionRequestId"
    | "evaluatedAt"
  >,
  delegation: AccessDelegation
): Promise<void> {
  await recordDeniedAccessAudit(pool, request, {
    outcome: "delegated-access-granted",
    reasonCode: "allowed",
    extraSafeDetails: {
      selectedRelationshipRef: delegation.relationshipRef,
      derivedActorRole: delegation.derivedActorRole
    }
  });
}

/**
 * Capability + workspace decide-and-audit (ADR-0012): the analog of
 * `resolveDecideAndAuditAccess` for org-internal and derived-authority operational
 * writes. Decides on capability + workspace (no consent), and persists a denied
 * audit on any non-allow. The artifact state machine (derived-authority) is the
 * caller's separate step.
 */
export async function decideCapabilityWorkspaceAndAudit(
  pool: Pool,
  input: CapabilityWorkspaceDecisionInput
): Promise<AuthorizationPolicyDecisionDraft> {
  const decision = evaluateCapabilityWorkspaceAuthorization(input);
  if (decision.status !== "allowed") {
    await recordDeniedAccessAudit(
      pool,
      {
        actorId: input.actorId,
        actorRole: input.actorRole,
        actorType: input.actorType,
        patientId: input.subjectRef,
        requestedResource: input.requestedResource,
        requestedAction: input.requestedAction,
        purpose: input.purpose,
        decisionRequestId: input.decisionRequestId,
        evaluatedAt: input.evaluatedAt
      },
      { outcome: decision.status, reasonCode: decision.reasonCode }
    );
  }
  return decision;
}

/**
 * Self-access decide-and-audit (ADR-0014): the analog for a data subject reaching
 * their OWN record. Decides on VERIFIED identity (not consent — consent governs
 * delegation, and self-access delegates nothing), and persists a denied audit on
 * any non-allow, uniformly with every other decision kind (kind: self). The
 * withdraw-all-consent-still-read-own invariant lives here: this path never reads a
 * consent record.
 */
export async function decideSelfAccessAndAudit(
  pool: Pool,
  input: SelfAccessDecisionInput
): Promise<AuthorizationPolicyDecisionDraft> {
  const decision = evaluateSelfAccessAuthorization(input);
  if (decision.status !== "allowed") {
    await recordDeniedAccessAudit(
      pool,
      {
        actorId: input.actorId,
        actorRole: input.actorRole,
        actorType: input.actorType,
        patientId: input.subjectRef,
        requestedResource: input.requestedResource,
        requestedAction: input.requestedAction,
        purpose: input.purpose,
        decisionRequestId: input.decisionRequestId,
        evaluatedAt: input.evaluatedAt
      },
      { outcome: decision.status, reasonCode: decision.reasonCode }
    );
  }
  return decision;
}

/** The actor half of a self-access decision (the subject/resource/action vary per call). */
export type SelfAccessActorContext = Pick<
  ResourceAccessRequest,
  | "decisionRequestId"
  | "actorId"
  | "actorRole"
  | "actorType"
  | "purpose"
  | "sessionStatus"
  | "evaluatedAt"
>;

/**
 * Convenience over `decideSelfAccessAndAudit` for callers that already hold a
 * resource access context: the caller has ALREADY determined (server-side) that the
 * actor is the data subject, so `subjectVerified` is asserted true here. Use only on
 * a verified-self branch.
 */
export function decideSelfAccessAndAuditFor(
  pool: Pool,
  actor: SelfAccessActorContext,
  opts: {
    subjectRef: string;
    requestedResource: string;
    requestedAction: string;
    restriction?: "none" | "restricted";
  }
): Promise<AuthorizationPolicyDecisionDraft> {
  return decideSelfAccessAndAudit(pool, {
    decisionRequestId: actor.decisionRequestId,
    actorId: actor.actorId,
    actorRole: actor.actorRole,
    actorType: actor.actorType,
    subjectRef: opts.subjectRef,
    subjectVerified: true,
    workspace: "personal",
    requestedResource: opts.requestedResource,
    requestedAction: opts.requestedAction,
    purpose: actor.purpose,
    sessionStatus: actor.sessionStatus,
    restriction: opts.restriction,
    evaluatedAt: actor.evaluatedAt
  });
}

/** Persist one denied/non-allow access decision as an append-only audit event. */
export async function recordDeniedAccessAudit(
  pool: Pool,
  request: Pick<
    ResourceAccessRequest,
    | "actorId"
    | "actorRole"
    | "actorType"
    | "patientId"
    | "requestedResource"
    | "requestedAction"
    | "purpose"
    | "decisionRequestId"
    | "evaluatedAt"
  >,
  input: { outcome: string; reasonCode: string; extraSafeDetails?: Record<string, unknown> }
): Promise<void> {
  const event: AuditEventRecord = {
    auditId: randomUUID(),
    commandName: `${request.requestedResource}.${request.requestedAction}`,
    aggregateId: request.patientId,
    action: request.requestedAction,
    outcome: input.outcome,
    actorAccountRef: request.actorId,
    // A decision carries no persona kind; attribute by the actor TYPE.
    actorPersonaKind: request.actorType,
    actorRole: request.actorRole,
    tenantRef: null,
    correlationId: request.decisionRequestId,
    requestId: request.decisionRequestId,
    idempotencyKey: `decision:${request.decisionRequestId}`,
    safeDetails: {
      reasonCode: input.reasonCode,
      resource: request.requestedResource,
      purpose: request.purpose,
      ...input.extraSafeDetails
    },
    occurredAt: request.evaluatedAt
  };
  assertSafeAuditEvent(event);
  const sink = new PgAuditSink();
  const client = await pool.connect();
  try {
    await sink.record(client, event);
  } finally {
    client.release();
  }
}

/**
 * Append-only audit for a non-allow on a command that carries a CommandActor +
 * safeContext (self-scoped rejections, artifact-relationship denials) rather than
 * a ResourceAccessRequest. The outcome category is honest (e.g. denied-not-recipient);
 * the caller-facing response is separately non-enumerating where required.
 */
export async function recordCommandRejectionAudit(
  pool: Pool,
  input: {
    actor: CommandActor;
    safeContext: { requestId: string; correlationId: string; idempotencyKey: string };
    aggregateId: string;
    resource: string;
    action: string;
    outcome: string;
    reasonCode: string;
  }
): Promise<void> {
  const event: AuditEventRecord = {
    auditId: randomUUID(),
    commandName: `${input.resource}.${input.action}`,
    aggregateId: input.aggregateId,
    action: input.action,
    outcome: input.outcome,
    actorAccountRef: input.actor.accountRef,
    actorPersonaKind: input.actor.personaKind,
    actorRole: input.actor.actorRole,
    tenantRef: input.actor.tenantRef ?? null,
    correlationId: input.safeContext.correlationId,
    requestId: input.safeContext.requestId,
    idempotencyKey: input.safeContext.idempotencyKey,
    safeDetails: { reasonCode: input.reasonCode, resource: input.resource },
    occurredAt: new Date().toISOString()
  };
  assertSafeAuditEvent(event);
  const sink = new PgAuditSink();
  const client = await pool.connect();
  try {
    await sink.record(client, event);
  } finally {
    client.release();
  }
}
