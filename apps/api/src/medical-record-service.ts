import { randomUUID } from "node:crypto";
import type { Pool, PoolClient } from "pg";
import {
  ExternalCallPolicy,
  PgAuditSink,
  PgOutboxStore,
  PgTransactionAdapter,
  createDomainEventEnvelope,
  insertMedicalRecord,
  insertMedicalRecordEntry,
  loadMedicalRecord,
  loadMedicalRecordByPatientOrg,
  loadMedicalRecordEntry,
  runTransactionalCommand,
  setMedicalRecordEntryStatus,
  type AuditSink,
  type CommandActor,
  type MedicalRecordEntryType,
  type PersistedMedicalRecord
} from "@nelyohealth/database";
import {
  composeResourceAccessDecision,
  resolveAndDecideResourceAccess,
  type ResolvedAuthorizationInputs,
  type ResourceAccessRequest
} from "./resource-authorization.js";
import type { AuthorizationPolicyDecisionDraft } from "./authorization-policy.js";

/**
 * Medical-record service (roadmap M5.4 — Medical Records).
 *
 * The authoritative longitudinal clinical record. Lifecycle commands (open,
 * add-entry, amend-entry, void-entry) run as transactional commands: the state
 * change, the canonical MedicalRecord* event, and the audit intent commit
 * together or not at all (M3 pattern). Entries are append-only; a correction is a
 * new entry that supersedes the prior one, whose clinical content is immutable at
 * the database.
 *
 * Access reuses the pre-existing `clinical-record-summary` Policy Decision Point
 * resource (read / write / amend), so clinical writes already require an active
 * encounter (ABAC) in addition to consent + ReBAC + break-glass. Reads decide
 * BEFORE loading the record; writes decide BEFORE writing. Each dimension is read
 * live, so a consent withdrawal / relationship revocation / break-glass expiry
 * propagates to the very next decision.
 *
 * PHI discipline: clinical_content and diagnostic codes live only in the
 * access-controlled record; events and audit details carry references and the
 * entry TYPE (category) only.
 */

const CLINICAL_RESOURCE = "clinical-record-summary";

export type MedicalRecordAccessContext = Omit<
  ResourceAccessRequest,
  "requestedResource" | "requestedAction"
>;

export interface MedicalRecordSafeContext {
  requestId: string;
  correlationId: string;
  idempotencyKey: string;
  operationTag: string;
}

export interface MedicalRecordServiceDeps {
  pool: Pool;
  transaction: PgTransactionAdapter;
  outbox: PgOutboxStore<Record<string, unknown>>;
  auditSink: AuditSink<PoolClient>;
  externalCallPolicy: ExternalCallPolicy;
}

export function createPgMedicalRecordServiceDeps(pool: Pool): MedicalRecordServiceDeps {
  return {
    pool,
    transaction: new PgTransactionAdapter(pool),
    outbox: new PgOutboxStore<Record<string, unknown>>(pool),
    auditSink: new PgAuditSink(),
    externalCallPolicy: new ExternalCallPolicy()
  };
}

// ---------- Open ----------

export interface OpenMedicalRecordInput {
  patientRef: string;
  organizationRef: string;
  actor: CommandActor;
  safeContext: MedicalRecordSafeContext;
  now?: () => Date;
}

export type OpenMedicalRecordOutcome =
  | { status: "opened"; recordId: string }
  | { status: "rejected"; reasonCode: "record-exists" };

/** Open the clinical record for a patient within an organization. Emits MedicalRecordOpened. */
export async function openMedicalRecord(
  deps: MedicalRecordServiceDeps,
  input: OpenMedicalRecordInput
): Promise<OpenMedicalRecordOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const existing = await withClient(deps.pool, (client) =>
    loadMedicalRecordByPatientOrg(client, input.patientRef, input.organizationRef)
  );
  if (existing) {
    return { status: "rejected", reasonCode: "record-exists" };
  }
  const recordId = randomUUID();

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "medical-record.record.open",
      aggregateId: recordId,
      action: "open",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      await insertMedicalRecord(ctx.client, {
        recordId,
        patientRef: input.patientRef,
        organizationRef: input.organizationRef,
        createdAt: nowIso,
        updatedAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "MedicalRecordOpened",
          aggregateId: recordId,
          safeContext: input.safeContext,
          payload: {
            recordRef: recordId,
            patientRef: input.patientRef,
            organizationRef: input.organizationRef
          }
        })
      );
      return {
        result: { status: "opened" as const, recordId },
        audit: {
          outcome: "committed",
          safeDetails: {
            recordRef: recordId,
            patientRef: input.patientRef,
            organizationRef: input.organizationRef
          }
        }
      };
    }
  });

  return result;
}

// ---------- Add entry (decide-before-write) ----------

export interface AddMedicalRecordEntryInput {
  entryType: MedicalRecordEntryType;
  codeSystem?: string;
  code?: string;
  /** Clinical; access-controlled; immutable once written; never in events. */
  clinicalContent: string;
  recordedAt?: string;
  access: MedicalRecordAccessContext;
  actor: CommandActor;
  safeContext: MedicalRecordSafeContext;
  now?: () => Date;
}

export type AddMedicalRecordEntryOutcome =
  | { status: "added"; entryId: string }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  | { status: "record-not-found" };

/**
 * Append a clinical entry to a patient's record. Authorization is decided BEFORE
 * any write — the `clinical-record-summary` write rule requires an active
 * encounter (or a declared emergency) on top of consent + ReBAC + break-glass.
 * Emits MedicalRecordEntryAdded iff it commits.
 */
export async function addMedicalRecordEntry(
  deps: MedicalRecordServiceDeps,
  input: AddMedicalRecordEntryInput
): Promise<AddMedicalRecordEntryOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();

  const decision = await resolveAndDecideResourceAccess(deps.pool, {
    ...input.access,
    requestedResource: CLINICAL_RESOURCE,
    requestedAction: "write"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }

  const record = await withClient(deps.pool, (client) =>
    loadMedicalRecordByPatientOrg(client, input.access.patientId, input.access.organizationId)
  );
  if (!record) {
    return { status: "record-not-found" };
  }
  const entryId = randomUUID();

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "medical-record.entry.add",
      aggregateId: entryId,
      action: "add-entry",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      await insertMedicalRecordEntry(ctx.client, {
        entryId,
        recordId: record.recordId,
        entryType: input.entryType,
        authorRef: input.access.actorId,
        codeSystem: input.codeSystem,
        code: input.code,
        clinicalContent: input.clinicalContent,
        recordedAt: input.recordedAt ?? nowIso,
        createdAt: nowIso,
        updatedAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "MedicalRecordEntryAdded",
          aggregateId: entryId,
          safeContext: input.safeContext,
          payload: {
            recordRef: record.recordId,
            entryRef: entryId,
            entryType: input.entryType,
            authorRef: input.access.actorId
          }
        })
      );
      return {
        result: { status: "added" as const, entryId },
        audit: {
          outcome: "committed",
          safeDetails: {
            recordRef: record.recordId,
            entryRef: entryId,
            entryType: input.entryType,
            authorRef: input.access.actorId
          }
        }
      };
    }
  });

  return result;
}

// ---------- Amend entry (decide-before-write, append-only correction) ----------

export interface AmendMedicalRecordEntryInput {
  entryId: string;
  codeSystem?: string;
  code?: string;
  clinicalContent: string;
  recordedAt?: string;
  access: MedicalRecordAccessContext;
  actor: CommandActor;
  safeContext: MedicalRecordSafeContext;
  now?: () => Date;
}

export type AmendMedicalRecordEntryOutcome =
  | { status: "amended"; entryId: string; supersedesEntryId: string }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  | { status: "not-found" };

/**
 * Amend an entry by appending a NEW entry that supersedes it (the prior entry's
 * status moves to 'amended'; its clinical content is never rewritten). Emits
 * MedicalRecordEntryAmended.
 */
export async function amendMedicalRecordEntry(
  deps: MedicalRecordServiceDeps,
  input: AmendMedicalRecordEntryInput
): Promise<AmendMedicalRecordEntryOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();

  const decision = await resolveAndDecideResourceAccess(deps.pool, {
    ...input.access,
    requestedResource: CLINICAL_RESOURCE,
    requestedAction: "amend"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }

  const priorEntry = await withClient(deps.pool, (client) =>
    loadMedicalRecordEntry(client, input.entryId)
  );
  if (!priorEntry) {
    return { status: "not-found" };
  }
  const record = await withClient(deps.pool, (client) =>
    loadMedicalRecord(client, priorEntry.recordId)
  );
  if (!record || record.patientRef !== input.access.patientId) {
    return { status: "not-found" };
  }
  const newEntryId = randomUUID();

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "medical-record.entry.amend",
      aggregateId: newEntryId,
      action: "amend-entry",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      await insertMedicalRecordEntry(ctx.client, {
        entryId: newEntryId,
        recordId: priorEntry.recordId,
        entryType: priorEntry.entryType,
        authorRef: input.access.actorId,
        codeSystem: input.codeSystem,
        code: input.code,
        clinicalContent: input.clinicalContent,
        supersedesEntryRef: priorEntry.entryId,
        recordedAt: input.recordedAt ?? nowIso,
        createdAt: nowIso,
        updatedAt: nowIso
      });
      await setMedicalRecordEntryStatus(ctx.client, {
        entryId: priorEntry.entryId,
        status: "amended",
        updatedAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "MedicalRecordEntryAmended",
          aggregateId: newEntryId,
          safeContext: input.safeContext,
          payload: {
            recordRef: priorEntry.recordId,
            entryRef: newEntryId,
            supersedesEntryRef: priorEntry.entryId,
            entryType: priorEntry.entryType,
            authorRef: input.access.actorId
          }
        })
      );
      return {
        result: {
          status: "amended" as const,
          entryId: newEntryId,
          supersedesEntryId: priorEntry.entryId
        },
        audit: {
          outcome: "committed",
          safeDetails: {
            recordRef: priorEntry.recordId,
            entryRef: newEntryId,
            supersedesEntryRef: priorEntry.entryId,
            entryType: priorEntry.entryType
          }
        }
      };
    }
  });

  return result;
}

// ---------- Void entry (correction) ----------

export interface VoidMedicalRecordEntryInput {
  entryId: string;
  reasonCode: string;
  actor: CommandActor;
  safeContext: MedicalRecordSafeContext;
  now?: () => Date;
}

export type VoidMedicalRecordEntryOutcome =
  | { status: "voided"; entryId: string }
  | { status: "not-found" };

/** Mark an entry entered-in-error (its content is preserved). Emits MedicalRecordEntryVoided. */
export async function voidMedicalRecordEntry(
  deps: MedicalRecordServiceDeps,
  input: VoidMedicalRecordEntryInput
): Promise<VoidMedicalRecordEntryOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const priorEntry = await withClient(deps.pool, (client) =>
    loadMedicalRecordEntry(client, input.entryId)
  );
  if (!priorEntry) {
    return { status: "not-found" };
  }

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "medical-record.entry.void",
      aggregateId: input.entryId,
      action: "void-entry",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      await setMedicalRecordEntryStatus(ctx.client, {
        entryId: input.entryId,
        status: "entered-in-error",
        updatedAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "MedicalRecordEntryVoided",
          aggregateId: input.entryId,
          safeContext: input.safeContext,
          payload: {
            recordRef: priorEntry.recordId,
            entryRef: input.entryId,
            reasonCode: input.reasonCode
          }
        })
      );
      return {
        result: { status: "voided" as const, entryId: input.entryId },
        audit: {
          outcome: "committed",
          safeDetails: {
            recordRef: priorEntry.recordId,
            entryRef: input.entryId,
            reasonCode: input.reasonCode
          }
        }
      };
    }
  });

  return result;
}

// ---------- Read (decide-before-load) ----------

export type ReadMedicalRecordOutcome =
  | {
      status: "allowed";
      record: PersistedMedicalRecord;
      decision: AuthorizationPolicyDecisionDraft;
    }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  | { status: "not-found"; decision: AuthorizationPolicyDecisionDraft };

/**
 * Read a patient's clinical record through the full pipeline. The decision is
 * made BEFORE the record is loaded, so a denied decision never touches clinical
 * entries.
 */
export async function readMedicalRecord(
  deps: Pick<MedicalRecordServiceDeps, "pool">,
  input: { access: MedicalRecordAccessContext }
): Promise<ReadMedicalRecordOutcome> {
  const decision = await resolveAndDecideResourceAccess(deps.pool, {
    ...input.access,
    requestedResource: CLINICAL_RESOURCE,
    requestedAction: "read"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }
  const record = await withClient(deps.pool, (client) =>
    loadMedicalRecordByPatientOrg(client, input.access.patientId, input.access.organizationId)
  );
  if (!record) {
    return { status: "not-found", decision };
  }
  return { status: "allowed", record, decision };
}

/** Pure composition entry point for unit tests (no database). */
export function decideMedicalRecordAccessFrom(
  access: MedicalRecordAccessContext,
  requestedAction: string,
  resolved: ResolvedAuthorizationInputs
): AuthorizationPolicyDecisionDraft {
  return composeResourceAccessDecision(
    { ...access, requestedResource: CLINICAL_RESOURCE, requestedAction },
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
