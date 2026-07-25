import { randomUUID } from "node:crypto";
import type { Pool } from "pg";
import { PgAuditSink, assertSafeAuditEvent, type AuditEventRecord } from "@nelyohealth/database";
import {
  resolveAndDecideResourceAccess,
  type ResourceAccessRequest
} from "./resource-authorization.js";
import {
  evaluateCapabilityWorkspaceAuthorization,
  type CapabilityWorkspaceDecisionInput
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
export async function resolveDecideAndAuditAccess(
  pool: Pool,
  request: ResourceAccessRequest
): Promise<AuthorizationPolicyDecisionDraft> {
  const decision = await resolveAndDecideResourceAccess(pool, request);
  if (decision.status !== "allowed") {
    await recordDeniedAccessAudit(pool, request, {
      outcome: decision.status,
      reasonCode: decision.reasonCode
    });
  }
  return decision;
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
