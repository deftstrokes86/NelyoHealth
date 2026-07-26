import { randomUUID } from "node:crypto";
import type { Pool, PoolClient } from "pg";
import {
  ExternalCallPolicy,
  PgAuditSink,
  PgOutboxStore,
  PgTransactionAdapter,
  createDomainEventEnvelope,
  insertDocument,
  loadDocument,
  runTransactionalCommand,
  transitionDocumentStatusIf,
  type AuditSink,
  type CommandActor,
  type CommandAuditOutcome,
  type DocumentType,
  type PersistedDocument
} from "@nelyohealth/database";
import {
  composeResourceAccessDecision,
  type ResolvedAuthorizationInputs,
  type ResourceAccessRequest
} from "./resource-authorization.js";
import {
  decideCapabilityWorkspaceAndAudit,
  recordCommandRejectionAudit,
  resolveDecideAndAuditAccess,
  type CapabilityWriteAccessContext
} from "./access-audit.js";
import type { AuthorizationPolicyDecisionDraft } from "./authorization-policy.js";

/**
 * Document service (roadmap M5.8 — Documents).
 *
 * The authoritative document resource: access-controlled metadata for files whose
 * bytes live in object storage. Lifecycle commands (register, archive) run as
 * transactional commands: the state change, the canonical Document* event, and the
 * audit intent commit together or not at all (M3 pattern).
 *
 * Access uses the `document` Policy Decision Point resource. Uploading is a
 * non-encounter WRITE (the `upload` action does not trigger the ABAC encounter
 * constraint), decided BEFORE any write against consent + ReBAC + break-glass.
 * Reads decide BEFORE loading — and because the storage_key is only returned on an
 * allowed read, the read decision is what gates access to the underlying bytes.
 * Each dimension is read live, so a consent withdrawal / relationship revocation /
 * break-glass expiry propagates to the very next decision.
 *
 * PHI discipline: the title and storage_key live only in the access-controlled
 * record; events and audit details carry references and the document TYPE only.
 */

const DOCUMENT_RESOURCE = "document";

export type DocumentAccessContext = Omit<
  ResourceAccessRequest,
  "requestedResource" | "requestedAction"
>;

export interface DocumentSafeContext {
  requestId: string;
  correlationId: string;
  idempotencyKey: string;
  operationTag: string;
}

export interface DocumentServiceDeps {
  pool: Pool;
  transaction: PgTransactionAdapter;
  outbox: PgOutboxStore<Record<string, unknown>>;
  auditSink: AuditSink<PoolClient>;
  externalCallPolicy: ExternalCallPolicy;
}

export function createPgDocumentServiceDeps(pool: Pool): DocumentServiceDeps {
  return {
    pool,
    transaction: new PgTransactionAdapter(pool),
    outbox: new PgOutboxStore<Record<string, unknown>>(pool),
    auditSink: new PgAuditSink(),
    externalCallPolicy: new ExternalCallPolicy()
  };
}

// ---------- Register (decide-before-write) ----------

export interface RegisterDocumentInput {
  documentType: DocumentType;
  /** May reveal a condition; access-controlled; never in events. */
  title: string;
  /** Object-storage pointer to the protected bytes; access-controlled; never in events. */
  storageKey: string;
  contentType: string;
  sizeBytes?: number;
  uploadedAt?: string;
  access: DocumentAccessContext;
  actor: CommandActor;
  safeContext: DocumentSafeContext;
  now?: () => Date;
}

export type RegisterDocumentOutcome =
  | { status: "registered"; documentId: string }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft };

/**
 * Register a document's metadata (its bytes are already in object storage).
 * Authorization is decided BEFORE any write (upload action — no encounter
 * required). Emits DocumentRegistered.
 */
export async function registerDocument(
  deps: DocumentServiceDeps,
  input: RegisterDocumentInput
): Promise<RegisterDocumentOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();

  const decision = await resolveDecideAndAuditAccess(deps.pool, {
    ...input.access,
    requestedResource: DOCUMENT_RESOURCE,
    requestedAction: "upload"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }

  const documentId = randomUUID();
  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "document.document.register",
      aggregateId: documentId,
      action: "register",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      await insertDocument(ctx.client, {
        documentId,
        patientRef: input.access.patientId,
        organizationRef: input.access.organizationId,
        uploadedByRef: input.access.actorId,
        documentType: input.documentType,
        title: input.title,
        storageKey: input.storageKey,
        contentType: input.contentType,
        sizeBytes: input.sizeBytes,
        uploadedAt: input.uploadedAt ?? nowIso,
        createdAt: nowIso,
        updatedAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "DocumentRegistered",
          aggregateId: documentId,
          safeContext: input.safeContext,
          payload: {
            documentRef: documentId,
            patientRef: input.access.patientId,
            organizationRef: input.access.organizationId,
            uploadedByRef: input.access.actorId,
            documentType: input.documentType
          }
        })
      );
      return {
        result: { status: "registered" as const, documentId },
        audit: {
          outcome: "committed",
          safeDetails: {
            documentRef: documentId,
            patientRef: input.access.patientId,
            organizationRef: input.access.organizationId,
            documentType: input.documentType
          }
        }
      };
    }
  });

  return result;
}

// ---------- Archive ----------

export interface ArchiveDocumentInput {
  documentId: string;
  access: CapabilityWriteAccessContext;
  actor: CommandActor;
  safeContext: DocumentSafeContext;
  now?: () => Date;
}

export type ArchiveDocumentOutcome =
  | { status: "archived"; documentId: string }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  | { status: "not-owner" }
  | { status: "not-found" }
  | { status: "already-archived" };

/** Archive a document. DERIVED-AUTHORITY (ADR-0012) with NO consent chain (a
 * document is not a consent-bearing artifact): capability + workspace, then an
 * artifact-relationship (ownership) check. Authz FIRST; TOCTOU-safe conditional
 * archive. Emits DocumentArchived. */
export async function archiveDocument(
  deps: DocumentServiceDeps,
  input: ArchiveDocumentInput
): Promise<ArchiveDocumentOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const document = await withClient(deps.pool, (client) => loadDocument(client, input.documentId));
  if (!document) {
    return { status: "not-found" };
  }

  const decision = await decideCapabilityWorkspaceAndAudit(deps.pool, {
    ...input.access,
    subjectRef: document.patientRef,
    organizationId: document.organizationRef,
    requestedResource: DOCUMENT_RESOURCE,
    requestedAction: "archive"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }
  // Artifact-relationship: only the uploader (owner) may archive. Audited honestly.
  if (input.access.actorId !== document.uploadedByRef) {
    await recordCommandRejectionAudit(deps.pool, {
      actor: input.actor,
      safeContext: input.safeContext,
      aggregateId: input.documentId,
      resource: DOCUMENT_RESOURCE,
      action: "archive",
      outcome: "denied-not-owner",
      reasonCode: "not-document-owner"
    });
    return { status: "not-owner" };
  }

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "document.document.archive",
      aggregateId: input.documentId,
      action: "archive",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx): Promise<{ result: ArchiveDocumentOutcome; audit: CommandAuditOutcome }> => {
      // TOCTOU-safe: archive only an 'active' document; a raced archive yields
      // zero rows -> already-archived, nothing written.
      const archived = await transitionDocumentStatusIf(ctx.client, {
        documentId: input.documentId,
        expected: ["active"],
        next: "archived",
        updatedAt: nowIso
      });
      if (!archived) {
        return {
          result: { status: "already-archived" },
          audit: {
            outcome: "rejected-already-archived",
            safeDetails: { documentRef: input.documentId, reasonCode: "stale-artifact-state" }
          }
        };
      }
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "DocumentArchived",
          aggregateId: input.documentId,
          safeContext: input.safeContext,
          payload: {
            documentRef: input.documentId,
            patientRef: document.patientRef,
            organizationRef: document.organizationRef
          }
        })
      );
      return {
        result: { status: "archived" as const, documentId: input.documentId },
        audit: { outcome: "committed", safeDetails: { documentRef: input.documentId } }
      };
    }
  });

  return result;
}

// ---------- Read (decide-before-load; gates the storage pointer) ----------

export type ReadDocumentOutcome =
  | { status: "allowed"; document: PersistedDocument; decision: AuthorizationPolicyDecisionDraft }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  | { status: "not-found"; decision: AuthorizationPolicyDecisionDraft };

/**
 * Read a document's metadata (including the storage_key that unlocks the bytes)
 * through the full pipeline. The decision is made BEFORE the document is loaded,
 * so a denied decision never leaks the title or the storage pointer. Returned
 * only if it belongs to the authorized patient.
 */
export async function readDocument(
  deps: Pick<DocumentServiceDeps, "pool">,
  input: { documentId: string; access: DocumentAccessContext }
): Promise<ReadDocumentOutcome> {
  const decision = await resolveDecideAndAuditAccess(deps.pool, {
    ...input.access,
    requestedResource: DOCUMENT_RESOURCE,
    requestedAction: "read"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }
  const document = await withClient(deps.pool, (client) => loadDocument(client, input.documentId));
  if (!document || document.patientRef !== input.access.patientId) {
    return { status: "not-found", decision };
  }
  return { status: "allowed", document, decision };
}

/** Pure composition entry point for unit tests (no database). */
export function decideDocumentAccessFrom(
  access: DocumentAccessContext,
  requestedAction: string,
  resolved: ResolvedAuthorizationInputs
): AuthorizationPolicyDecisionDraft {
  return composeResourceAccessDecision(
    { ...access, requestedResource: DOCUMENT_RESOURCE, requestedAction },
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
