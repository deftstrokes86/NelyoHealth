import { randomUUID } from "node:crypto";
import type { Pool, PoolClient } from "pg";
import {
  ExternalCallPolicy,
  PgAuditSink,
  PgOutboxStore,
  PgTransactionAdapter,
  createDomainEventEnvelope,
  insertLabOrder,
  insertLabResultObservation,
  loadLabOrder,
  runTransactionalCommand,
  setLabOrderStatus,
  type AuditSink,
  type CommandActor,
  type CommandAuditOutcome,
  type LabInterpretation,
  type LabOrderPriority,
  type PersistedLabOrder
} from "@nelyohealth/database";
import {
  composeResourceAccessDecision,
  resolveAndDecideResourceAccess,
  type ResolvedAuthorizationInputs,
  type ResourceAccessRequest
} from "./resource-authorization.js";
import type { AuthorizationPolicyDecisionDraft } from "./authorization-policy.js";

/**
 * Laboratory service (roadmap M5.6 — Laboratories).
 *
 * The authoritative lab-order resource and its result observations. Lifecycle
 * commands (order, record-result, cancel) run as transactional commands: the
 * state change, the canonical Lab* event, and the audit intent commit together or
 * not at all (M3 pattern).
 *
 * Access uses the `laboratory` Policy Decision Point resource. Ordering a lab is a
 * clinical WRITE, so it requires an active encounter (ABAC) on top of consent +
 * ReBAC + break-glass, and is decided BEFORE any write. Reads decide BEFORE
 * loading. Each dimension is read live, so a consent withdrawal / relationship
 * revocation / break-glass expiry propagates to the very next decision.
 *
 * PHI discipline: the test name/code, clinical reason, and result observations
 * (analyte, value, reference range, interpretation) live only in the
 * access-controlled record; events and audit details carry references and
 * non-clinical metadata (priority, status) only.
 */

const LABORATORY_RESOURCE = "laboratory";

export type LabOrderAccessContext = Omit<
  ResourceAccessRequest,
  "requestedResource" | "requestedAction"
>;

export interface LabSafeContext {
  requestId: string;
  correlationId: string;
  idempotencyKey: string;
  operationTag: string;
}

export interface LaboratoryServiceDeps {
  pool: Pool;
  transaction: PgTransactionAdapter;
  outbox: PgOutboxStore<Record<string, unknown>>;
  auditSink: AuditSink<PoolClient>;
  externalCallPolicy: ExternalCallPolicy;
}

export function createPgLaboratoryServiceDeps(pool: Pool): LaboratoryServiceDeps {
  return {
    pool,
    transaction: new PgTransactionAdapter(pool),
    outbox: new PgOutboxStore<Record<string, unknown>>(pool),
    auditSink: new PgAuditSink(),
    externalCallPolicy: new ExternalCallPolicy()
  };
}

// ---------- Order (decide-before-write) ----------

export interface OrderLabTestInput {
  consultationRef?: string;
  testCode?: string;
  /** Clinical; access-controlled; never travels in events or audit detail. */
  testName: string;
  priority: LabOrderPriority;
  clinicalReason?: string;
  orderedAt?: string;
  access: LabOrderAccessContext;
  actor: CommandActor;
  safeContext: LabSafeContext;
  now?: () => Date;
}

export type OrderLabTestOutcome =
  | { status: "ordered"; orderId: string }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft };

/**
 * Order a laboratory test for a patient. Authorization is decided BEFORE any
 * write — the `laboratory` write rule requires an active encounter (or declared
 * emergency) on top of consent + ReBAC + break-glass. Emits LabOrderPlaced.
 */
export async function orderLabTest(
  deps: LaboratoryServiceDeps,
  input: OrderLabTestInput
): Promise<OrderLabTestOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();

  const decision = await resolveAndDecideResourceAccess(deps.pool, {
    ...input.access,
    requestedResource: LABORATORY_RESOURCE,
    requestedAction: "write"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }

  const orderId = randomUUID();
  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "laboratory.order.place",
      aggregateId: orderId,
      action: "order",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      await insertLabOrder(ctx.client, {
        orderId,
        patientRef: input.access.patientId,
        orderingClinicianRef: input.access.actorId,
        organizationRef: input.access.organizationId,
        consultationRef: input.consultationRef,
        testCode: input.testCode,
        testName: input.testName,
        priority: input.priority,
        clinicalReason: input.clinicalReason,
        orderedAt: input.orderedAt ?? nowIso,
        createdAt: nowIso,
        updatedAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "LabOrderPlaced",
          aggregateId: orderId,
          safeContext: input.safeContext,
          payload: {
            orderRef: orderId,
            patientRef: input.access.patientId,
            orderingClinicianRef: input.access.actorId,
            organizationRef: input.access.organizationId,
            consultationRef: input.consultationRef ?? null,
            priority: input.priority
          }
        })
      );
      return {
        result: { status: "ordered" as const, orderId },
        audit: {
          outcome: "committed",
          safeDetails: {
            orderRef: orderId,
            patientRef: input.access.patientId,
            orderingClinicianRef: input.access.actorId,
            organizationRef: input.access.organizationId
          }
        }
      };
    }
  });

  return result;
}

// ---------- Record result ----------

export interface RecordLabResultInput {
  orderId: string;
  /** Clinical; access-controlled; never travels in events or audit detail. */
  analyteName: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  interpretation?: LabInterpretation;
  resultedByRef: string;
  resultedAt?: string;
  actor: CommandActor;
  safeContext: LabSafeContext;
  now?: () => Date;
}

export type RecordLabResultOutcome =
  | { status: "reported"; observationId: string }
  | { status: "not-found" }
  | { status: "not-resultable" };

/**
 * Report one result observation against an order (a panel reports several). The
 * order moves to 'resulted'. Emits LabResultReported (references + operational
 * status only — never the value or interpretation).
 */
export async function recordLabResult(
  deps: LaboratoryServiceDeps,
  input: RecordLabResultInput
): Promise<RecordLabResultOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const order = await withClient(deps.pool, (client) => loadLabOrder(client, input.orderId));
  if (!order) {
    return { status: "not-found" };
  }
  if (order.status === "cancelled") {
    return { status: "not-resultable" };
  }
  const observationId = randomUUID();

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "laboratory.result.record",
      aggregateId: input.orderId,
      action: "record-result",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      await insertLabResultObservation(ctx.client, {
        observationId,
        orderRef: input.orderId,
        analyteName: input.analyteName,
        value: input.value,
        unit: input.unit,
        referenceRange: input.referenceRange,
        interpretation: input.interpretation,
        resultedByRef: input.resultedByRef,
        resultedAt: input.resultedAt ?? nowIso,
        createdAt: nowIso
      });
      await setLabOrderStatus(ctx.client, {
        orderId: input.orderId,
        status: "resulted",
        updatedAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "LabResultReported",
          aggregateId: input.orderId,
          safeContext: input.safeContext,
          payload: {
            orderRef: input.orderId,
            observationRef: observationId,
            resultedByRef: input.resultedByRef,
            orderStatus: "resulted"
          }
        })
      );
      return {
        result: { status: "reported" as const, observationId },
        audit: {
          outcome: "committed",
          safeDetails: {
            orderRef: input.orderId,
            observationRef: observationId,
            resultedByRef: input.resultedByRef
          }
        }
      };
    }
  });

  return result;
}

// ---------- Cancel ----------

export interface CancelLabOrderInput {
  orderId: string;
  cancellationReasonCode: string;
  actor: CommandActor;
  safeContext: LabSafeContext;
  now?: () => Date;
}

export type CancelLabOrderOutcome =
  | { status: "cancelled"; orderId: string }
  | { status: "not-found" }
  | { status: "not-cancellable" };

/** Cancel a lab order that has not yet resulted. Emits LabOrderCancelled. */
export async function cancelLabOrder(
  deps: LaboratoryServiceDeps,
  input: CancelLabOrderInput
): Promise<CancelLabOrderOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const order = await withClient(deps.pool, (client) => loadLabOrder(client, input.orderId));
  if (!order) {
    return { status: "not-found" };
  }
  if (order.status !== "ordered" && order.status !== "collected") {
    return { status: "not-cancellable" };
  }

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "laboratory.order.cancel",
      aggregateId: input.orderId,
      action: "cancel",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx): Promise<{ result: CancelLabOrderOutcome; audit: CommandAuditOutcome }> => {
      await setLabOrderStatus(ctx.client, {
        orderId: input.orderId,
        status: "cancelled",
        cancellationReasonCode: input.cancellationReasonCode,
        updatedAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "LabOrderCancelled",
          aggregateId: input.orderId,
          safeContext: input.safeContext,
          payload: {
            orderRef: input.orderId,
            patientRef: order.patientRef,
            organizationRef: order.organizationRef,
            reasonCode: input.cancellationReasonCode
          }
        })
      );
      return {
        result: { status: "cancelled" as const, orderId: input.orderId },
        audit: {
          outcome: "committed",
          safeDetails: { orderRef: input.orderId, reasonCode: input.cancellationReasonCode }
        }
      };
    }
  });

  return result;
}

// ---------- Read (decide-before-load) ----------

export type ReadLabOrderOutcome =
  | { status: "allowed"; order: PersistedLabOrder; decision: AuthorizationPolicyDecisionDraft }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  | { status: "not-found"; decision: AuthorizationPolicyDecisionDraft };

/**
 * Read a lab order (with its result observations) through the full pipeline. The
 * decision is made BEFORE the order is loaded, so a denied decision never leaks
 * the test or its results. Returned only if it belongs to the authorized patient.
 */
export async function readLabOrder(
  deps: Pick<LaboratoryServiceDeps, "pool">,
  input: { orderId: string; access: LabOrderAccessContext }
): Promise<ReadLabOrderOutcome> {
  const decision = await resolveAndDecideResourceAccess(deps.pool, {
    ...input.access,
    requestedResource: LABORATORY_RESOURCE,
    requestedAction: "read"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }
  const order = await withClient(deps.pool, (client) => loadLabOrder(client, input.orderId));
  if (!order || order.patientRef !== input.access.patientId) {
    return { status: "not-found", decision };
  }
  return { status: "allowed", order, decision };
}

/** Pure composition entry point for unit tests (no database). */
export function decideLabOrderAccessFrom(
  access: LabOrderAccessContext,
  requestedAction: string,
  resolved: ResolvedAuthorizationInputs
): AuthorizationPolicyDecisionDraft {
  return composeResourceAccessDecision(
    { ...access, requestedResource: LABORATORY_RESOURCE, requestedAction },
    resolved
  );
}

async function withClient<T>(pool: Pool, fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
