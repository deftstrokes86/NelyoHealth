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
  type CommandAuditOutcome,
  type PersistedConsultation
} from "@nelyohealth/database";
import {
  composeResourceAccessDecision,
  type ResolvedAuthorizationInputs,
  type ResourceAccessRequest
} from "./resource-authorization.js";
import { recordDeniedAccessAudit, resolveDecideAndAuditAccess } from "./access-audit.js";
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

/**
 * Patient-subject write context (M6.4): the subject patientId + organization are
 * the consultation's (from the input for schedule, or the loaded encounter for
 * add-participant / complete / cancel), so the caller supplies only the actor /
 * workspace / purpose part.
 */
export type ConsultationWriteAccessContext = Omit<
  ConsultationAccessContext,
  "patientId" | "organizationId"
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
  access: ConsultationWriteAccessContext;
  actor: CommandActor;
  safeContext: ConsultationSafeContext;
  now?: () => Date;
}

export type ScheduleConsultationOutcome =
  | { status: "scheduled"; consultationId: string }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft };

/** Schedule a clinical encounter. Emits ConsultationScheduled. */
export async function scheduleConsultation(
  deps: ConsultationServiceDeps,
  input: ScheduleConsultationInput
): Promise<ScheduleConsultationOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();

  // PATIENT-SUBJECT (ADR-0012): scheduling a clinical encounter for a patient;
  // decide (full pipeline) before any write. The subject is the input patient.
  const decision = await resolveDecideAndAuditAccess(deps.pool, {
    ...input.access,
    patientId: input.patientRef,
    organizationId: input.organizationRef,
    requestedResource: "consultation",
    requestedAction: "schedule"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }

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

  const decision = await resolveDecideAndAuditAccess(deps.pool, {
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
  access: ConsultationWriteAccessContext;
  actor: CommandActor;
  safeContext: ConsultationSafeContext;
  now?: () => Date;
}

export type AddConsultationParticipantOutcome =
  | { status: "added"; consultationId: string }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  | { status: "not-found" };

/** Add a participant to a consultation (telemedicine parties). PATIENT-SUBJECT:
 * decide (full pipeline) before writing. Emits ConsultationParticipantAdded. */
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

  const decision = await resolveDecideAndAuditAccess(deps.pool, {
    ...input.access,
    patientId: consultation.patientRef,
    organizationId: consultation.organizationRef,
    requestedResource: "consultation",
    requestedAction: "add-participant"
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
            patientRef: consultation.patientRef,
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
            patientRef: consultation.patientRef,
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
  access: ConsultationWriteAccessContext;
  actor: CommandActor;
  safeContext: ConsultationSafeContext;
  now?: () => Date;
}

export type CompleteConsultationOutcome =
  | { status: "completed"; consultationId: string }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
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

  // Authz FIRST (patient-subject).
  const decision = await resolveDecideAndAuditAccess(deps.pool, {
    ...input.access,
    patientId: consultation.patientRef,
    organizationId: consultation.organizationRef,
    requestedResource: "consultation",
    requestedAction: "complete"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }
  // Transition validity (ADR-0012 taxonomy): a deterministic machine-forbidden
  // transition from the LOADED state -> rejected-invalid-transition (pre-check).
  // A valid request that later loses the conditional-write race -> stale (below).
  if (!ALLOWED_TRANSITIONS[consultation.status].includes("completed")) {
    await recordDeniedAccessAudit(
      deps.pool,
      {
        ...input.access,
        patientId: consultation.patientRef,
        requestedResource: "consultation",
        requestedAction: "complete"
      },
      { outcome: "rejected-invalid-transition", reasonCode: "invalid-state-transition" }
    );
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
    work: async (
      ctx
    ): Promise<{ result: CompleteConsultationOutcome; audit: CommandAuditOutcome }> => {
      const advanced = await markConsultationCompleted(ctx.client, {
        consultationId: input.consultationId,
        endedAt: nowIso,
        clinicalNotes: input.clinicalNotes,
        updatedAt: nowIso
      });
      if (!advanced) {
        // Pre-check passed but the conditional write raced -> stale, not invalid.
        return {
          result: { status: "invalid-transition", fromStatus: consultation.status },
          audit: {
            outcome: "denied-stale-artifact-state",
            safeDetails: {
              consultationRef: input.consultationId,
              reasonCode: "stale-artifact-state"
            }
          }
        };
      }
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
  access: ConsultationWriteAccessContext;
  actor: CommandActor;
  safeContext: ConsultationSafeContext;
  now?: () => Date;
}

export type CancelConsultationOutcome =
  | { status: "cancelled"; consultationId: string }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  | { status: "not-found" }
  | { status: "not-cancellable" };

/** Cancel a consultation before it completes. PATIENT-SUBJECT: decide (full
 * pipeline) first, then a TOCTOU-safe conditional cancel. Emits ConsultationCancelled. */
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

  const decision = await resolveDecideAndAuditAccess(deps.pool, {
    ...input.access,
    patientId: consultation.patientRef,
    organizationId: consultation.organizationRef,
    requestedResource: "consultation",
    requestedAction: "cancel"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }
  // Deterministic machine-forbidden transition -> rejected-invalid-transition.
  if (!ALLOWED_TRANSITIONS[consultation.status].includes("cancelled")) {
    await recordDeniedAccessAudit(
      deps.pool,
      {
        ...input.access,
        patientId: consultation.patientRef,
        requestedResource: "consultation",
        requestedAction: "cancel"
      },
      { outcome: "rejected-invalid-transition", reasonCode: "invalid-state-transition" }
    );
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
    work: async (
      ctx
    ): Promise<{ result: CancelConsultationOutcome; audit: CommandAuditOutcome }> => {
      const cancelled = await markConsultationCancelled(ctx.client, {
        consultationId: input.consultationId,
        cancellationReasonCode: input.cancellationReasonCode,
        updatedAt: nowIso
      });
      if (!cancelled) {
        return {
          result: { status: "not-cancellable" },
          audit: {
            outcome: "denied-stale-artifact-state",
            safeDetails: {
              consultationRef: input.consultationId,
              reasonCode: "stale-artifact-state"
            }
          }
        };
      }
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
  const decision = await resolveDecideAndAuditAccess(deps.pool, {
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
