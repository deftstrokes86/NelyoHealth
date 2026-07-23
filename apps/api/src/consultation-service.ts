import { randomUUID } from "node:crypto";
import type { Pool, PoolClient } from "pg";
import {
  ExternalCallPolicy,
  PgAuditSink,
  PgOutboxStore,
  PgTransactionAdapter,
  createDomainEventEnvelope,
  insertConsultation,
  insertConsultationParticipant,
  loadConsultation,
  markConsultationCancelled,
  markConsultationCompleted,
  markConsultationStarted,
  runTransactionalCommand,
  type ConsultationModality,
  type ConsultationParticipantRole,
  type ConsultationStatus,
  type AuditSink,
  type CommandActor,
  type PersistedConsultation
} from "@nelyohealth/database";
import {
  composeResourceAccessDecision,
  resolveAndDecideResourceAccess,
  type ResolvedAuthorizationInputs,
  type ResourceAccessRequest
} from "./resource-authorization.js";
import type { AuthorizationPolicyDecisionDraft } from "./authorization-policy.js";

/**
 * Consultation service (roadmap M5.3 — Consultations).
 *
 * The authoritative clinical-encounter resource. Lifecycle commands (schedule,
 * start, add-participant, complete, cancel) run as transactional commands: the
 * state change, the canonical Consultation* event, and the audit intent commit
 * together or not at all (M3 pattern).
 *
 * Access governance follows the M5.1/M5.2 discipline via the shared
 * resource-authorization composition (consent + ReBAC + break-glass). Reads
 * decide BEFORE loading the encounter; starting a consultation decides BEFORE
 * writing. Each dimension is read live, so a consent withdrawal / relationship
 * revocation / break-glass expiry propagates to the very next decision.
 *
 * PHI discipline: chief_complaint and clinical_notes live only in the
 * access-controlled record; events and audit details carry references and
 * non-clinical metadata only.
 */

export type ConsultationAccessContext = Omit<
  ResourceAccessRequest,
  "requestedResource" | "requestedAction"
>;

export interface ConsultationSafeContext {
  requestId: string;
  correlationId: string;
  idempotencyKey: string;
  operationTag: string;
}

export interface ConsultationServiceDeps {
  pool: Pool;
  transaction: PgTransactionAdapter;
  outbox: PgOutboxStore<Record<string, unknown>>;
  auditSink: AuditSink<PoolClient>;
  externalCallPolicy: ExternalCallPolicy;
}

export function createPgConsultationServiceDeps(pool: Pool): ConsultationServiceDeps {
  return {
    pool,
    transaction: new PgTransactionAdapter(pool),
    outbox: new PgOutboxStore<Record<string, unknown>>(pool),
    auditSink: new PgAuditSink(),
    externalCallPolicy: new ExternalCallPolicy()
  };
}

const ALLOWED_TRANSITIONS: Record<ConsultationStatus, ConsultationStatus[]> = {
  scheduled: ["in-progress", "cancelled"],
  "in-progress": ["completed", "cancelled"],
  completed: [],
  cancelled: []
};

// ---------- Schedule ----------

export interface ScheduleConsultationInput {
  appointmentRef?: string;
  patientRef: string;
  clinicianRef: string;
  organizationRef: string;
  modality: ConsultationModality;
  scheduledStart?: string;
  /** Clinical; access-controlled; never travels in events or audit detail. */
  chiefComplaint?: string;
  actor: CommandActor;
  safeContext: ConsultationSafeContext;
  now?: () => Date;
}

/** Schedule a clinical encounter. Emits ConsultationScheduled. */
export async function scheduleConsultation(
  deps: ConsultationServiceDeps,
  input: ScheduleConsultationInput
): Promise<{ status: "scheduled"; consultationId: string }> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const consultationId = randomUUID();

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "consultation.encounter.schedule",
      aggregateId: consultationId,
      action: "schedule",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      await insertConsultation(ctx.client, {
        consultationId,
        appointmentRef: input.appointmentRef,
        patientRef: input.patientRef,
        clinicianRef: input.clinicianRef,
        organizationRef: input.organizationRef,
        modality: input.modality,
        scheduledStart: input.scheduledStart,
        chiefComplaint: input.chiefComplaint,
        createdAt: nowIso,
        updatedAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "ConsultationScheduled",
          aggregateId: consultationId,
          safeContext: input.safeContext,
          payload: {
            consultationRef: consultationId,
            appointmentRef: input.appointmentRef ?? null,
            patientRef: input.patientRef,
            clinicianRef: input.clinicianRef,
            organizationRef: input.organizationRef,
            modality: input.modality,
            scheduledStart: input.scheduledStart ?? null
          }
        })
      );
      return {
        result: { status: "scheduled" as const, consultationId },
        audit: {
          outcome: "committed",
          safeDetails: {
            consultationRef: consultationId,
            patientRef: input.patientRef,
            clinicianRef: input.clinicianRef,
            organizationRef: input.organizationRef
          }
        }
      };
    }
  });

  return result;
}

// ---------- Start (decide-before-write) ----------

export interface StartConsultationInput {
  consultationId: string;
  access: ConsultationAccessContext;
  actor: CommandActor;
  safeContext: ConsultationSafeContext;
  now?: () => Date;
}

export type StartConsultationOutcome =
  | { status: "started"; consultationId: string }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  | { status: "not-found" }
  | { status: "invalid-transition"; fromStatus: ConsultationStatus };

/**
 * Start a scheduled consultation. Authorization is decided BEFORE the encounter
 * record is loaded, so a denied decision never touches the clinical record. Emits
 * ConsultationStarted iff it commits.
 */
export async function startConsultation(
  deps: ConsultationServiceDeps,
  input: StartConsultationInput
): Promise<StartConsultationOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();

  const decision = await resolveAndDecideResourceAccess(deps.pool, {
    ...input.access,
    requestedResource: "consultation",
    requestedAction: "conduct"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }

  const consultation = await withClient(deps.pool, (client) =>
    loadConsultation(client, input.consultationId)
  );
  if (!consultation || consultation.patientRef !== input.access.patientId) {
    return { status: "not-found" };
  }
  if (!ALLOWED_TRANSITIONS[consultation.status].includes("in-progress")) {
    return { status: "invalid-transition", fromStatus: consultation.status };
  }

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "consultation.encounter.start",
      aggregateId: input.consultationId,
      action: "start",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      await markConsultationStarted(ctx.client, {
        consultationId: input.consultationId,
        startedAt: nowIso,
        updatedAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "ConsultationStarted",
          aggregateId: input.consultationId,
          safeContext: input.safeContext,
          payload: {
            consultationRef: input.consultationId,
            patientRef: consultation.patientRef,
            clinicianRef: consultation.clinicianRef,
            organizationRef: consultation.organizationRef,
            startedAt: nowIso
          }
        })
      );
      return {
        result: { status: "started" as const, consultationId: input.consultationId },
        audit: {
          outcome: "committed",
          safeDetails: {
            consultationRef: input.consultationId,
            patientRef: consultation.patientRef,
            clinicianRef: consultation.clinicianRef
          }
        }
      };
    }
  });

  return result;
}

// ---------- Participants ----------

export interface AddConsultationParticipantInput {
  consultationId: string;
  participantRef: string;
  role: ConsultationParticipantRole;
  joinedAt?: string;
  actor: CommandActor;
  safeContext: ConsultationSafeContext;
  now?: () => Date;
}

export type AddConsultationParticipantOutcome =
  | { status: "added"; consultationId: string }
  | { status: "not-found" };

/** Add a participant to a consultation (telemedicine parties). Emits ConsultationParticipantAdded. */
export async function addConsultationParticipant(
  deps: ConsultationServiceDeps,
  input: AddConsultationParticipantInput
): Promise<AddConsultationParticipantOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const consultation = await withClient(deps.pool, (client) =>
    loadConsultation(client, input.consultationId)
  );
  if (!consultation) {
    return { status: "not-found" };
  }

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "consultation.encounter.add-participant",
      aggregateId: input.consultationId,
      action: "add-participant",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      await insertConsultationParticipant(ctx.client, {
        consultationId: input.consultationId,
        participantRef: input.participantRef,
        role: input.role,
        joinedAt: input.joinedAt,
        createdAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "ConsultationParticipantAdded",
          aggregateId: input.consultationId,
          safeContext: input.safeContext,
          payload: {
            consultationRef: input.consultationId,
            participantRef: input.participantRef,
            role: input.role
          }
        })
      );
      return {
        result: { status: "added" as const, consultationId: input.consultationId },
        audit: {
          outcome: "committed",
          safeDetails: {
            consultationRef: input.consultationId,
            participantRef: input.participantRef,
            role: input.role
          }
        }
      };
    }
  });

  return result;
}

// ---------- Complete ----------

export interface CompleteConsultationInput {
  consultationId: string;
  /** Clinical; access-controlled; never travels in events or audit detail. */
  clinicalNotes?: string;
  actor: CommandActor;
  safeContext: ConsultationSafeContext;
  now?: () => Date;
}

export type CompleteConsultationOutcome =
  | { status: "completed"; consultationId: string }
  | { status: "not-found" }
  | { status: "invalid-transition"; fromStatus: ConsultationStatus };

/** Complete an in-progress consultation, recording clinical notes. Emits ConsultationCompleted. */
export async function completeConsultation(
  deps: ConsultationServiceDeps,
  input: CompleteConsultationInput
): Promise<CompleteConsultationOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const consultation = await withClient(deps.pool, (client) =>
    loadConsultation(client, input.consultationId)
  );
  if (!consultation) {
    return { status: "not-found" };
  }
  if (!ALLOWED_TRANSITIONS[consultation.status].includes("completed")) {
    return { status: "invalid-transition", fromStatus: consultation.status };
  }

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "consultation.encounter.complete",
      aggregateId: input.consultationId,
      action: "complete",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      await markConsultationCompleted(ctx.client, {
        consultationId: input.consultationId,
        endedAt: nowIso,
        clinicalNotes: input.clinicalNotes,
        updatedAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "ConsultationCompleted",
          aggregateId: input.consultationId,
          safeContext: input.safeContext,
          payload: {
            consultationRef: input.consultationId,
            patientRef: consultation.patientRef,
            clinicianRef: consultation.clinicianRef,
            organizationRef: consultation.organizationRef,
            endedAt: nowIso
          }
        })
      );
      return {
        result: { status: "completed" as const, consultationId: input.consultationId },
        audit: {
          outcome: "committed",
          safeDetails: {
            consultationRef: input.consultationId,
            patientRef: consultation.patientRef,
            clinicianRef: consultation.clinicianRef
          }
        }
      };
    }
  });

  return result;
}

// ---------- Cancel ----------

export interface CancelConsultationInput {
  consultationId: string;
  cancellationReasonCode: string;
  actor: CommandActor;
  safeContext: ConsultationSafeContext;
  now?: () => Date;
}

export type CancelConsultationOutcome =
  | { status: "cancelled"; consultationId: string }
  | { status: "not-found" }
  | { status: "not-cancellable" };

/** Cancel a consultation before it completes. Emits ConsultationCancelled. */
export async function cancelConsultation(
  deps: ConsultationServiceDeps,
  input: CancelConsultationInput
): Promise<CancelConsultationOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const consultation = await withClient(deps.pool, (client) =>
    loadConsultation(client, input.consultationId)
  );
  if (!consultation) {
    return { status: "not-found" };
  }
  if (!ALLOWED_TRANSITIONS[consultation.status].includes("cancelled")) {
    return { status: "not-cancellable" };
  }

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "consultation.encounter.cancel",
      aggregateId: input.consultationId,
      action: "cancel",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      await markConsultationCancelled(ctx.client, {
        consultationId: input.consultationId,
        cancellationReasonCode: input.cancellationReasonCode,
        updatedAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "ConsultationCancelled",
          aggregateId: input.consultationId,
          safeContext: input.safeContext,
          payload: {
            consultationRef: input.consultationId,
            patientRef: consultation.patientRef,
            organizationRef: consultation.organizationRef,
            cancellationReasonCode: input.cancellationReasonCode
          }
        })
      );
      return {
        result: { status: "cancelled" as const, consultationId: input.consultationId },
        audit: {
          outcome: "committed",
          safeDetails: {
            consultationRef: input.consultationId,
            cancellationReasonCode: input.cancellationReasonCode
          }
        }
      };
    }
  });

  return result;
}

// ---------- Read (decide-before-load) ----------

export type ReadConsultationOutcome =
  | {
      status: "allowed";
      consultation: PersistedConsultation;
      decision: AuthorizationPolicyDecisionDraft;
    }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  | { status: "not-found"; decision: AuthorizationPolicyDecisionDraft };

/**
 * Read a consultation through the full pipeline. The decision is made BEFORE the
 * encounter is loaded, so a denied decision never leaks the chief complaint or
 * clinical notes. The consultation is returned only if it belongs to the
 * authorized patient.
 */
export async function readConsultation(
  deps: Pick<ConsultationServiceDeps, "pool">,
  input: { consultationId: string; access: ConsultationAccessContext }
): Promise<ReadConsultationOutcome> {
  const decision = await resolveAndDecideResourceAccess(deps.pool, {
    ...input.access,
    requestedResource: "consultation",
    requestedAction: "read"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }
  const consultation = await withClient(deps.pool, (client) =>
    loadConsultation(client, input.consultationId)
  );
  if (!consultation || consultation.patientRef !== input.access.patientId) {
    return { status: "not-found", decision };
  }
  return { status: "allowed", consultation, decision };
}

/** Pure composition entry point for unit tests (no database). */
export function decideConsultationAccessFrom(
  access: ConsultationAccessContext,
  requestedAction: string,
  resolved: ResolvedAuthorizationInputs
): AuthorizationPolicyDecisionDraft {
  return composeResourceAccessDecision(
    { ...access, requestedResource: "consultation", requestedAction },
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
