import { randomUUID } from "node:crypto";
import type { Pool, PoolClient } from "pg";
import {
  ExternalCallPolicy,
  PgAuditSink,
  PgOutboxStore,
  PgTransactionAdapter,
  claimPrescriptionFill,
  createDomainEventEnvelope,
  insertPrescription,
  insertPrescriptionDispense,
  loadPrescription,
  markPrescriptionCancelled,
  runTransactionalCommand,
  type AuditSink,
  type CommandActor,
  type CommandAuditOutcome,
  type ControlledSchedule,
  type PersistedPrescription
} from "@nelyohealth/database";
import {
  composeResourceAccessDecision,
  type ResolvedAuthorizationInputs,
  type ResourceAccessRequest
} from "./resource-authorization.js";
import {
  decideCapabilityWorkspaceAndAudit,
  resolveDecideAndAuditAccess,
  type CapabilityWriteAccessContext
} from "./access-audit.js";
import type { AuthorizationPolicyDecisionDraft } from "./authorization-policy.js";

/**
 * Prescription service (roadmap M5.5 — Prescriptions).
 *
 * The authoritative medication-prescription resource. Lifecycle commands
 * (prescribe, dispense, cancel) run as transactional commands: the state change,
 * the canonical Prescription* event, and the audit intent commit together or not
 * at all (M3 pattern). Dispensing is conflict-free — a fill is claimed with a
 * conditional decrement guarded on status = 'active' AND refills_remaining > 0.
 *
 * Access uses the `prescription` Policy Decision Point resource. Prescribing is a
 * clinical WRITE, so it requires an active encounter (ABAC) on top of consent +
 * ReBAC + break-glass, and is decided BEFORE any write. Reads decide BEFORE
 * loading. Each dimension is read live, so a consent withdrawal / relationship
 * revocation / break-glass expiry propagates to the very next decision.
 *
 * PHI discipline: medication, dosage, indication, code, and controlled schedule
 * live only in the access-controlled record; events and audit details carry
 * references and non-clinical metadata (refill counts, status) only.
 */

const PRESCRIPTION_RESOURCE = "prescription";

export type PrescriptionAccessContext = Omit<
  ResourceAccessRequest,
  "requestedResource" | "requestedAction"
>;

export interface PrescriptionSafeContext {
  requestId: string;
  correlationId: string;
  idempotencyKey: string;
  operationTag: string;
}

export interface PrescriptionServiceDeps {
  pool: Pool;
  transaction: PgTransactionAdapter;
  outbox: PgOutboxStore<Record<string, unknown>>;
  auditSink: AuditSink<PoolClient>;
  externalCallPolicy: ExternalCallPolicy;
}

export function createPgPrescriptionServiceDeps(pool: Pool): PrescriptionServiceDeps {
  return {
    pool,
    transaction: new PgTransactionAdapter(pool),
    outbox: new PgOutboxStore<Record<string, unknown>>(pool),
    auditSink: new PgAuditSink(),
    externalCallPolicy: new ExternalCallPolicy()
  };
}

// ---------- Prescribe (decide-before-write) ----------

export interface PrescribeMedicationInput {
  consultationRef?: string;
  /** Clinical; access-controlled; never travels in events or audit detail. */
  medicationName: string;
  medicationCode?: string;
  codeSystem?: string;
  dosageInstructions: string;
  quantity?: string;
  refillsAuthorized: number;
  controlledSchedule?: ControlledSchedule;
  indication?: string;
  prescribedAt?: string;
  expiresAt?: string;
  access: PrescriptionAccessContext;
  actor: CommandActor;
  safeContext: PrescriptionSafeContext;
  now?: () => Date;
}

export type PrescribeMedicationOutcome =
  | { status: "issued"; prescriptionId: string }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  | { status: "rejected"; reasonCode: "invalid-refills" };

/**
 * Issue a prescription for a patient. Authorization is decided BEFORE any write —
 * the `prescription` write rule requires an active encounter (or declared
 * emergency) on top of consent + ReBAC + break-glass. Emits PrescriptionIssued.
 */
export async function prescribeMedication(
  deps: PrescriptionServiceDeps,
  input: PrescribeMedicationInput
): Promise<PrescribeMedicationOutcome> {
  if (!Number.isInteger(input.refillsAuthorized) || input.refillsAuthorized < 1) {
    return { status: "rejected", reasonCode: "invalid-refills" };
  }
  const nowIso = (input.now?.() ?? new Date()).toISOString();

  const decision = await resolveDecideAndAuditAccess(deps.pool, {
    ...input.access,
    requestedResource: PRESCRIPTION_RESOURCE,
    requestedAction: "write"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }

  const prescriptionId = randomUUID();
  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "prescription.rx.prescribe",
      aggregateId: prescriptionId,
      action: "prescribe",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      await insertPrescription(ctx.client, {
        prescriptionId,
        patientRef: input.access.patientId,
        prescriberRef: input.access.actorId,
        organizationRef: input.access.organizationId,
        consultationRef: input.consultationRef,
        medicationName: input.medicationName,
        medicationCode: input.medicationCode,
        codeSystem: input.codeSystem,
        dosageInstructions: input.dosageInstructions,
        quantity: input.quantity,
        refillsAuthorized: input.refillsAuthorized,
        controlledSchedule: input.controlledSchedule,
        indication: input.indication,
        prescribedAt: input.prescribedAt ?? nowIso,
        expiresAt: input.expiresAt,
        createdAt: nowIso,
        updatedAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "PrescriptionIssued",
          aggregateId: prescriptionId,
          safeContext: input.safeContext,
          payload: {
            prescriptionRef: prescriptionId,
            patientRef: input.access.patientId,
            prescriberRef: input.access.actorId,
            organizationRef: input.access.organizationId,
            consultationRef: input.consultationRef ?? null,
            refillsAuthorized: input.refillsAuthorized
          }
        })
      );
      return {
        result: { status: "issued" as const, prescriptionId },
        audit: {
          outcome: "committed",
          safeDetails: {
            prescriptionRef: prescriptionId,
            patientRef: input.access.patientId,
            prescriberRef: input.access.actorId,
            organizationRef: input.access.organizationId
          }
        }
      };
    }
  });

  return result;
}

// ---------- Dispense (conflict-free) ----------

export interface DispensePrescriptionInput {
  prescriptionId: string;
  dispensedByRef: string;
  quantityDispensed?: string;
  access: CapabilityWriteAccessContext;
  actor: CommandActor;
  safeContext: PrescriptionSafeContext;
  now?: () => Date;
}

export type DispensePrescriptionOutcome =
  | {
      status: "dispensed";
      dispenseId: string;
      refillsRemaining: number;
      prescriptionStatus: string;
    }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  | { status: "not-found" }
  | { status: "not-dispensable" };

/**
 * Dispense one fill. DERIVED-AUTHORITY (ADR-0012): the pharmacist's standing flows
 * from the prescription, so we decide on capability + workspace (consent chain
 * INHERITED, not re-evaluated — a validly-issued Rx stays dispensable even after
 * consent withdrawal), then claim the fill via a CONDITIONAL update that is atomic
 * with the state check (TOCTOU-safe): if the Rx was cancelled/completed in between,
 * zero rows change and the dispense is refused + audited. Emits PrescriptionDispensed.
 */
export async function dispensePrescription(
  deps: PrescriptionServiceDeps,
  input: DispensePrescriptionInput
): Promise<DispensePrescriptionOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const existing = await withClient(deps.pool, (client) =>
    loadPrescription(client, input.prescriptionId)
  );
  if (!existing) {
    return { status: "not-found" };
  }

  const decision = await decideCapabilityWorkspaceAndAudit(deps.pool, {
    ...input.access,
    subjectRef: existing.patientRef,
    organizationId: existing.organizationRef,
    requestedResource: "prescription",
    requestedAction: "dispense"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }
  const dispenseId = randomUUID();

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "prescription.rx.dispense",
      aggregateId: input.prescriptionId,
      action: "dispense",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (
      ctx
    ): Promise<{ result: DispensePrescriptionOutcome; audit: CommandAuditOutcome }> => {
      const claimed = await claimPrescriptionFill(ctx.client, {
        prescriptionId: input.prescriptionId,
        updatedAt: nowIso
      });
      if (!claimed) {
        // TOCTOU guard: the Rx changed state between decide and write (e.g. a
        // concurrent cancel) — conditional claim affected zero rows. Refuse +
        // audit as a stale-artifact-state denial; nothing was written.
        return {
          result: { status: "not-dispensable" as const },
          audit: {
            outcome: "denied-stale-artifact-state",
            safeDetails: {
              prescriptionRef: input.prescriptionId,
              reasonCode: "stale-artifact-state"
            }
          }
        };
      }
      await insertPrescriptionDispense(ctx.client, {
        dispenseId,
        prescriptionRef: input.prescriptionId,
        dispensedByRef: input.dispensedByRef,
        quantityDispensed: input.quantityDispensed,
        dispensedAt: nowIso,
        createdAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "PrescriptionDispensed",
          aggregateId: input.prescriptionId,
          safeContext: input.safeContext,
          payload: {
            prescriptionRef: input.prescriptionId,
            patientRef: existing.patientRef,
            dispenseRef: dispenseId,
            dispensedByRef: input.dispensedByRef,
            refillsRemaining: claimed.refillsRemaining,
            status: claimed.status
          }
        })
      );
      return {
        result: {
          status: "dispensed" as const,
          dispenseId,
          refillsRemaining: claimed.refillsRemaining,
          prescriptionStatus: claimed.status
        },
        audit: {
          outcome: "committed",
          safeDetails: {
            prescriptionRef: input.prescriptionId,
            patientRef: existing.patientRef,
            dispenseRef: dispenseId,
            refillsRemaining: claimed.refillsRemaining
          }
        }
      };
    }
  });

  return result;
}

// ---------- Cancel ----------

export interface CancelPrescriptionInput {
  prescriptionId: string;
  cancellationReasonCode: string;
  access: CapabilityWriteAccessContext;
  actor: CommandActor;
  safeContext: PrescriptionSafeContext;
  now?: () => Date;
}

export type CancelPrescriptionOutcome =
  | { status: "cancelled"; prescriptionId: string }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  | { status: "not-found" }
  | { status: "not-cancellable" };

/** Cancel an active prescription. DERIVED-AUTHORITY (ADR-0012): capability +
 * workspace decision, then a CONDITIONAL cancel (atomic state guard). This is the
 * artifact's own stop mechanism (never a consent check). Emits PrescriptionCancelled. */
export async function cancelPrescription(
  deps: PrescriptionServiceDeps,
  input: CancelPrescriptionInput
): Promise<CancelPrescriptionOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const existing = await withClient(deps.pool, (client) =>
    loadPrescription(client, input.prescriptionId)
  );
  if (!existing) {
    return { status: "not-found" };
  }

  const decision = await decideCapabilityWorkspaceAndAudit(deps.pool, {
    ...input.access,
    subjectRef: existing.patientRef,
    organizationId: existing.organizationRef,
    requestedResource: "prescription",
    requestedAction: "cancel"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }
  if (existing.status !== "active") {
    return { status: "not-cancellable" };
  }

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "prescription.rx.cancel",
      aggregateId: input.prescriptionId,
      action: "cancel",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (
      ctx
    ): Promise<{ result: CancelPrescriptionOutcome; audit: CommandAuditOutcome }> => {
      const cancelled = await markPrescriptionCancelled(ctx.client, {
        prescriptionId: input.prescriptionId,
        cancellationReasonCode: input.cancellationReasonCode,
        updatedAt: nowIso
      });
      if (!cancelled) {
        return {
          result: { status: "not-cancellable" as const },
          audit: { outcome: "noop", safeDetails: { prescriptionRef: input.prescriptionId } }
        };
      }
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "PrescriptionCancelled",
          aggregateId: input.prescriptionId,
          safeContext: input.safeContext,
          payload: {
            prescriptionRef: input.prescriptionId,
            patientRef: existing.patientRef,
            organizationRef: existing.organizationRef,
            reasonCode: input.cancellationReasonCode
          }
        })
      );
      return {
        result: { status: "cancelled" as const, prescriptionId: input.prescriptionId },
        audit: {
          outcome: "committed",
          safeDetails: {
            prescriptionRef: input.prescriptionId,
            reasonCode: input.cancellationReasonCode
          }
        }
      };
    }
  });

  return result;
}

// ---------- Read (decide-before-load) ----------

export type ReadPrescriptionOutcome =
  | {
      status: "allowed";
      prescription: PersistedPrescription;
      decision: AuthorizationPolicyDecisionDraft;
    }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  | { status: "not-found"; decision: AuthorizationPolicyDecisionDraft };

/**
 * Read a prescription through the full pipeline. The decision is made BEFORE the
 * prescription is loaded, so a denied decision never leaks the medication,
 * dosage, or indication. Returned only if it belongs to the authorized patient.
 */
export async function readPrescription(
  deps: Pick<PrescriptionServiceDeps, "pool">,
  input: { prescriptionId: string; access: PrescriptionAccessContext }
): Promise<ReadPrescriptionOutcome> {
  const decision = await resolveDecideAndAuditAccess(deps.pool, {
    ...input.access,
    requestedResource: PRESCRIPTION_RESOURCE,
    requestedAction: "read"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }
  const prescription = await withClient(deps.pool, (client) =>
    loadPrescription(client, input.prescriptionId)
  );
  if (!prescription || prescription.patientRef !== input.access.patientId) {
    return { status: "not-found", decision };
  }
  return { status: "allowed", prescription, decision };
}

/** Pure composition entry point for unit tests (no database). */
export function decidePrescriptionAccessFrom(
  access: PrescriptionAccessContext,
  requestedAction: string,
  resolved: ResolvedAuthorizationInputs
): AuthorizationPolicyDecisionDraft {
  return composeResourceAccessDecision(
    { ...access, requestedResource: PRESCRIPTION_RESOURCE, requestedAction },
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
