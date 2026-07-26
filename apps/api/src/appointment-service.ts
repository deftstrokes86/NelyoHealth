import { randomUUID } from "node:crypto";
import type { Pool, PoolClient } from "pg";
import {
  ExternalCallPolicy,
  PgAuditSink,
  PgOutboxStore,
  PgTransactionAdapter,
  createDomainEventEnvelope,
  insertAppointment,
  insertAvailabilitySlot,
  loadAppointment,
  loadAvailabilitySlot,
  runTransactionalCommand,
  setAppointmentSchedule,
  setAppointmentStatus,
  transitionSlotStatusIf,
  type AppointmentStatus,
  type AuditSink,
  type CommandActor,
  type CommandAuditOutcome,
  type PersistedAppointment
} from "@nelyohealth/database";
import {
  composeResourceAccessDecision,
  type ResolvedAuthorizationInputs,
  type ResourceAccessRequest
} from "./resource-authorization.js";
import {
  decideCapabilityWorkspaceAndAudit,
  recordDeniedAccessAudit,
  resolveDecideAndAuditAccess,
  type CapabilityWriteAccessContext
} from "./access-audit.js";
import type { AuthorizationPolicyDecisionDraft } from "./authorization-policy.js";

/**
 * Appointment service (roadmap M5.2 — Appointments).
 *
 * The authoritative Appointment resource and the availability it is booked
 * against. Lifecycle commands (open-slot, book, reschedule, cancel, status
 * transition) run as transactional commands: the state change, the canonical
 * event, and the audit intent commit together or not at all (M3 pattern). Slot
 * booking is conflict-free — a slot is claimed with a conditional update guarded
 * on status = 'open', so two concurrent bookings cannot both win.
 *
 * Access governance follows the M5.1 decide-BEFORE-load discipline via the shared
 * resource-authorization composition (consent + ReBAC + break-glass). Reads
 * decide before loading the appointment; booking decides before writing. Each
 * dimension is read live, so a consent withdrawal / relationship revocation /
 * break-glass expiry propagates to the very next appointment decision.
 *
 * PHI discipline: reason_for_visit lives only in the access-controlled record;
 * events and audit details carry references and scheduling metadata only.
 */

/** The composed-authorization inputs a caller supplies for an appointment access. */
export type AppointmentAccessContext = Omit<
  ResourceAccessRequest,
  "requestedResource" | "requestedAction"
>;

/**
 * Patient-subject write context (M6.4): the subject patientId + organization are
 * taken from the loaded appointment, so the caller supplies only the actor /
 * workspace / purpose part.
 */
export type AppointmentWriteAccessContext = Omit<
  AppointmentAccessContext,
  "patientId" | "organizationId"
>;

export interface AppointmentSafeContext {
  requestId: string;
  correlationId: string;
  idempotencyKey: string;
  operationTag: string;
}

export interface AppointmentServiceDeps {
  pool: Pool;
  transaction: PgTransactionAdapter;
  outbox: PgOutboxStore<Record<string, unknown>>;
  auditSink: AuditSink<PoolClient>;
  externalCallPolicy: ExternalCallPolicy;
}

export function createPgAppointmentServiceDeps(pool: Pool): AppointmentServiceDeps {
  return {
    pool,
    transaction: new PgTransactionAdapter(pool),
    outbox: new PgOutboxStore<Record<string, unknown>>(pool),
    auditSink: new PgAuditSink(),
    externalCallPolicy: new ExternalCallPolicy()
  };
}

const ALLOWED_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  requested: ["confirmed", "cancelled"],
  confirmed: ["checked-in", "cancelled", "no-show"],
  "checked-in": ["completed", "no-show"],
  completed: [],
  cancelled: [],
  "no-show": []
};

// ---------- Availability ----------

export interface OpenAvailabilitySlotInput {
  clinicianRef: string;
  organizationRef: string;
  startAt: string;
  endAt: string;
  access: CapabilityWriteAccessContext;
  actor: CommandActor;
  safeContext: AppointmentSafeContext;
  now?: () => Date;
}

export type OpenAvailabilitySlotOutcome =
  | { status: "opened"; slotId: string }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft };

/** Publish a bookable clinician window. ORG-INTERNAL (no patient subject): a
 * capability + workspace decision gates it. Emits AppointmentSlotOpened. */
export async function openAvailabilitySlot(
  deps: AppointmentServiceDeps,
  input: OpenAvailabilitySlotInput
): Promise<OpenAvailabilitySlotOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const slotId = randomUUID();

  const decision = await decideCapabilityWorkspaceAndAudit(deps.pool, {
    ...input.access,
    subjectRef: input.clinicianRef,
    organizationId: input.organizationRef,
    requestedResource: "availability-slot",
    requestedAction: "open-slot"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "appointment.availability.open",
      aggregateId: slotId,
      action: "open-slot",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      await insertAvailabilitySlot(ctx.client, {
        slotId,
        clinicianRef: input.clinicianRef,
        organizationRef: input.organizationRef,
        startAt: input.startAt,
        endAt: input.endAt,
        createdAt: nowIso,
        updatedAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "AppointmentSlotOpened",
          aggregateId: slotId,
          safeContext: input.safeContext,
          payload: {
            slotRef: slotId,
            clinicianRef: input.clinicianRef,
            organizationRef: input.organizationRef,
            startAt: input.startAt,
            endAt: input.endAt
          }
        })
      );
      return {
        result: { status: "opened" as const, slotId },
        audit: {
          outcome: "committed",
          safeDetails: {
            slotRef: slotId,
            clinicianRef: input.clinicianRef,
            organizationRef: input.organizationRef
          }
        }
      };
    }
  });

  return result;
}

// ---------- Book (decide-before-write) ----------

export interface BookAppointmentInput {
  slotId: string;
  appointmentType: string;
  /** Clinical; access-controlled; never travels in events or audit detail. */
  reasonForVisit?: string;
  access: AppointmentAccessContext;
  actor: CommandActor;
  safeContext: AppointmentSafeContext;
  now?: () => Date;
}

export type BookAppointmentOutcome =
  | { status: "booked"; appointmentId: string }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  | { status: "slot-not-found" }
  | { status: "slot-unavailable" };

/**
 * Book an appointment against an open slot. Authorization is decided BEFORE any
 * write; the slot is then claimed conflict-free and the appointment created in
 * one transaction. Emits AppointmentBooked iff the booking commits.
 */
export async function bookAppointment(
  deps: AppointmentServiceDeps,
  input: BookAppointmentInput
): Promise<BookAppointmentOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();

  const slot = await withClient(deps.pool, (client) => loadAvailabilitySlot(client, input.slotId));
  if (!slot || slot.status !== "open") {
    return slot ? { status: "slot-unavailable" } : { status: "slot-not-found" };
  }

  // Decide before writing: the patient subject governs consent / ReBAC / break-glass.
  const decision = await resolveDecideAndAuditAccess(deps.pool, {
    ...input.access,
    organizationId: slot.organizationRef,
    requestedResource: "appointment",
    requestedAction: "book"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }

  const appointmentId = randomUUID();
  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "appointment.booking.book",
      aggregateId: appointmentId,
      action: "book",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx): Promise<{ result: BookAppointmentOutcome; audit: CommandAuditOutcome }> => {
      const claimed = await transitionSlotStatusIf(ctx.client, {
        slotId: input.slotId,
        expected: "open",
        next: "booked",
        updatedAt: nowIso
      });
      if (!claimed) {
        return {
          result: { status: "slot-unavailable" as const },
          audit: { outcome: "noop", safeDetails: { slotRef: input.slotId } }
        };
      }
      await insertAppointment(ctx.client, {
        appointmentId,
        patientRef: input.access.patientId,
        clinicianRef: slot.clinicianRef,
        organizationRef: slot.organizationRef,
        slotRef: input.slotId,
        scheduledStart: slot.startAt,
        scheduledEnd: slot.endAt,
        appointmentType: input.appointmentType,
        reasonForVisit: input.reasonForVisit,
        status: "confirmed",
        createdAt: nowIso,
        updatedAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "AppointmentBooked",
          aggregateId: appointmentId,
          safeContext: input.safeContext,
          payload: {
            appointmentRef: appointmentId,
            patientRef: input.access.patientId,
            clinicianRef: slot.clinicianRef,
            organizationRef: slot.organizationRef,
            slotRef: input.slotId,
            scheduledStart: slot.startAt,
            scheduledEnd: slot.endAt,
            appointmentType: input.appointmentType
          }
        })
      );
      return {
        result: { status: "booked" as const, appointmentId },
        audit: {
          outcome: "committed",
          safeDetails: {
            appointmentRef: appointmentId,
            patientRef: input.access.patientId,
            clinicianRef: slot.clinicianRef,
            organizationRef: slot.organizationRef
          }
        }
      };
    }
  });

  return result;
}

// ---------- Reschedule ----------

export interface RescheduleAppointmentInput {
  appointmentId: string;
  newSlotId: string;
  access: AppointmentWriteAccessContext;
  actor: CommandActor;
  safeContext: AppointmentSafeContext;
  now?: () => Date;
}

export type RescheduleAppointmentOutcome =
  | { status: "rescheduled"; appointmentId: string }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  | { status: "not-found" }
  | { status: "slot-not-found" }
  | { status: "slot-unavailable" };

/** Move an appointment to a new open slot, freeing the old one. PATIENT-SUBJECT:
 * decide (full pipeline) before writing. Emits AppointmentRescheduled. */
export async function rescheduleAppointment(
  deps: AppointmentServiceDeps,
  input: RescheduleAppointmentInput
): Promise<RescheduleAppointmentOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const appointment = await withClient(deps.pool, (client) =>
    loadAppointment(client, input.appointmentId)
  );
  if (!appointment) {
    return { status: "not-found" };
  }

  const decision = await resolveDecideAndAuditAccess(deps.pool, {
    ...input.access,
    patientId: appointment.patientRef,
    organizationId: appointment.organizationRef,
    requestedResource: "appointment",
    requestedAction: "reschedule"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }

  const newSlot = await withClient(deps.pool, (client) =>
    loadAvailabilitySlot(client, input.newSlotId)
  );
  if (!newSlot) {
    return { status: "slot-not-found" };
  }

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "appointment.booking.reschedule",
      aggregateId: input.appointmentId,
      action: "reschedule",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (
      ctx
    ): Promise<{ result: RescheduleAppointmentOutcome; audit: CommandAuditOutcome }> => {
      const claimed = await transitionSlotStatusIf(ctx.client, {
        slotId: input.newSlotId,
        expected: "open",
        next: "booked",
        updatedAt: nowIso
      });
      if (!claimed) {
        return {
          result: { status: "slot-unavailable" as const },
          audit: { outcome: "noop", safeDetails: { appointmentRef: input.appointmentId } }
        };
      }
      if (appointment.slotRef) {
        await transitionSlotStatusIf(ctx.client, {
          slotId: appointment.slotRef,
          expected: "booked",
          next: "open",
          updatedAt: nowIso
        });
      }
      await setAppointmentSchedule(ctx.client, {
        appointmentId: input.appointmentId,
        slotRef: input.newSlotId,
        scheduledStart: newSlot.startAt,
        scheduledEnd: newSlot.endAt,
        updatedAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "AppointmentRescheduled",
          aggregateId: input.appointmentId,
          safeContext: input.safeContext,
          payload: {
            appointmentRef: input.appointmentId,
            patientRef: appointment.patientRef,
            previousStart: appointment.scheduledStart,
            previousEnd: appointment.scheduledEnd,
            newStart: newSlot.startAt,
            newEnd: newSlot.endAt,
            newSlotRef: input.newSlotId
          }
        })
      );
      return {
        result: { status: "rescheduled" as const, appointmentId: input.appointmentId },
        audit: {
          outcome: "committed",
          safeDetails: {
            appointmentRef: input.appointmentId,
            patientRef: appointment.patientRef,
            newSlotRef: input.newSlotId
          }
        }
      };
    }
  });

  return result;
}

// ---------- Cancel ----------

export interface CancelAppointmentInput {
  appointmentId: string;
  cancellationReasonCode: string;
  access: AppointmentWriteAccessContext;
  actor: CommandActor;
  safeContext: AppointmentSafeContext;
  now?: () => Date;
}

export type CancelAppointmentOutcome =
  | { status: "cancelled"; appointmentId: string }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  | { status: "not-found" }
  | { status: "not-cancellable" };

/** Cancel an appointment and free its slot. PATIENT-SUBJECT: decide (full
 * pipeline) before writing. Emits AppointmentCancelled. */
export async function cancelAppointment(
  deps: AppointmentServiceDeps,
  input: CancelAppointmentInput
): Promise<CancelAppointmentOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const appointment = await withClient(deps.pool, (client) =>
    loadAppointment(client, input.appointmentId)
  );
  if (!appointment) {
    return { status: "not-found" };
  }

  const decision = await resolveDecideAndAuditAccess(deps.pool, {
    ...input.access,
    patientId: appointment.patientRef,
    organizationId: appointment.organizationRef,
    requestedResource: "appointment",
    requestedAction: "cancel"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }
  if (!ALLOWED_TRANSITIONS[appointment.status].includes("cancelled")) {
    return { status: "not-cancellable" };
  }

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "appointment.booking.cancel",
      aggregateId: input.appointmentId,
      action: "cancel",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      await setAppointmentStatus(ctx.client, {
        appointmentId: input.appointmentId,
        status: "cancelled",
        cancellationReasonCode: input.cancellationReasonCode,
        updatedAt: nowIso
      });
      if (appointment.slotRef) {
        await transitionSlotStatusIf(ctx.client, {
          slotId: appointment.slotRef,
          expected: "booked",
          next: "open",
          updatedAt: nowIso
        });
      }
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "AppointmentCancelled",
          aggregateId: input.appointmentId,
          safeContext: input.safeContext,
          payload: {
            appointmentRef: input.appointmentId,
            patientRef: appointment.patientRef,
            organizationRef: appointment.organizationRef,
            cancellationReasonCode: input.cancellationReasonCode
          }
        })
      );
      return {
        result: { status: "cancelled" as const, appointmentId: input.appointmentId },
        audit: {
          outcome: "committed",
          safeDetails: {
            appointmentRef: input.appointmentId,
            cancellationReasonCode: input.cancellationReasonCode
          }
        }
      };
    }
  });

  return result;
}

// ---------- Status transition ----------

export interface TransitionAppointmentStatusInput {
  appointmentId: string;
  toStatus: AppointmentStatus;
  access: AppointmentWriteAccessContext;
  actor: CommandActor;
  safeContext: AppointmentSafeContext;
  now?: () => Date;
}

export type TransitionAppointmentStatusOutcome =
  | { status: "transitioned"; appointmentId: string; toStatus: AppointmentStatus }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  | { status: "not-found" }
  | { status: "invalid-transition"; fromStatus: AppointmentStatus }
  | { status: "state-owned-by-dedicated-command"; toStatus: AppointmentStatus };

/**
 * States reachable ONLY through their dedicated command (ADR-0012 multi-path
 * gate-equivalence): 'cancelled' is owned by cancelAppointment, so the generic
 * transition must not be a weaker path to it.
 */
const DEDICATED_COMMAND_STATES: readonly AppointmentStatus[] = ["cancelled"];

/** Advance an appointment's status through the validated lifecycle. Emits AppointmentStatusChanged. */
export async function transitionAppointmentStatus(
  deps: AppointmentServiceDeps,
  input: TransitionAppointmentStatusInput
): Promise<TransitionAppointmentStatusOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const appointment = await withClient(deps.pool, (client) =>
    loadAppointment(client, input.appointmentId)
  );
  if (!appointment) {
    return { status: "not-found" };
  }

  // Authz FIRST (ADR-0012): an unauthorized actor gets a uniform 'denied'
  // regardless of the requested toStatus, so transition-validity rejections below
  // can never leak state-machine shape to actors with no standing.
  const decision = await resolveDecideAndAuditAccess(deps.pool, {
    ...input.access,
    patientId: appointment.patientRef,
    organizationId: appointment.organizationRef,
    requestedResource: "appointment",
    requestedAction: "transition-status"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }

  // Post-authz validity: only authorized actors reach here. Each non-allow leaves
  // an audit row with an HONEST category (not "denied" — these are validity
  // rejections, not authorization denials).
  const validityRequest = {
    ...input.access,
    patientId: appointment.patientRef,
    requestedResource: "appointment",
    requestedAction: "transition-status"
  };
  // Multi-path gate-equivalence: 'cancelled' is owned by cancelAppointment.
  if (DEDICATED_COMMAND_STATES.includes(input.toStatus)) {
    await recordDeniedAccessAudit(deps.pool, validityRequest, {
      outcome: "state-owned-by-dedicated-command",
      reasonCode: "state-owned-by-dedicated-command"
    });
    return { status: "state-owned-by-dedicated-command", toStatus: input.toStatus };
  }
  if (!ALLOWED_TRANSITIONS[appointment.status].includes(input.toStatus)) {
    await recordDeniedAccessAudit(deps.pool, validityRequest, {
      outcome: "rejected-invalid-transition",
      reasonCode: "invalid-state-transition"
    });
    return { status: "invalid-transition", fromStatus: appointment.status };
  }
  const fromStatus = appointment.status;

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "appointment.booking.transition-status",
      aggregateId: input.appointmentId,
      action: "transition-status",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      await setAppointmentStatus(ctx.client, {
        appointmentId: input.appointmentId,
        status: input.toStatus,
        updatedAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "AppointmentStatusChanged",
          aggregateId: input.appointmentId,
          safeContext: input.safeContext,
          payload: {
            appointmentRef: input.appointmentId,
            patientRef: appointment.patientRef,
            fromStatus,
            toStatus: input.toStatus
          }
        })
      );
      return {
        result: {
          status: "transitioned" as const,
          appointmentId: input.appointmentId,
          toStatus: input.toStatus
        },
        audit: {
          outcome: "committed",
          safeDetails: {
            appointmentRef: input.appointmentId,
            patientRef: appointment.patientRef,
            fromStatus,
            toStatus: input.toStatus
          }
        }
      };
    }
  });

  return result;
}

// ---------- Read (decide-before-load) ----------

export type ReadAppointmentOutcome =
  | {
      status: "allowed";
      appointment: PersistedAppointment;
      decision: AuthorizationPolicyDecisionDraft;
    }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  | { status: "not-found"; decision: AuthorizationPolicyDecisionDraft };

/**
 * Read an appointment through the full pipeline. The decision is made BEFORE the
 * appointment is loaded, so a denied decision never leaks the reason for visit.
 * The appointment is returned only if it belongs to the authorized patient.
 */
export async function readAppointment(
  deps: Pick<AppointmentServiceDeps, "pool">,
  input: { appointmentId: string; access: AppointmentAccessContext }
): Promise<ReadAppointmentOutcome> {
  const decision = await resolveDecideAndAuditAccess(deps.pool, {
    ...input.access,
    requestedResource: "appointment",
    requestedAction: "read"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }
  const appointment = await withClient(deps.pool, (client) =>
    loadAppointment(client, input.appointmentId)
  );
  if (!appointment || appointment.patientRef !== input.access.patientId) {
    return { status: "not-found", decision };
  }
  return { status: "allowed", appointment, decision };
}

/** Pure composition entry point for unit tests (no database). */
export function decideAppointmentAccessFrom(
  access: AppointmentAccessContext,
  requestedAction: string,
  resolved: ResolvedAuthorizationInputs
): AuthorizationPolicyDecisionDraft {
  return composeResourceAccessDecision(
    { ...access, requestedResource: "appointment", requestedAction },
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
