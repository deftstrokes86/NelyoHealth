import { randomUUID } from "node:crypto";
import type { Pool, PoolClient } from "pg";
import {
  ExternalCallPolicy,
  PgAuditSink,
  PgOutboxStore,
  PgTransactionAdapter,
  createDomainEventEnvelope,
  insertMessage,
  insertMessageThread,
  loadMessage,
  loadMessageThread,
  markMessageRead as markMessageReadRow,
  runTransactionalCommand,
  setMessageThreadStatus,
  touchMessageThread,
  type AuditSink,
  type CommandActor,
  type CommandAuditOutcome,
  type PersistedMessageThread
} from "@nelyohealth/database";
import {
  composeResourceAccessDecision,
  resolveAndDecideResourceAccess,
  type ResolvedAuthorizationInputs,
  type ResourceAccessRequest
} from "./resource-authorization.js";
import type { AuthorizationPolicyDecisionDraft } from "./authorization-policy.js";

/**
 * Messaging service (roadmap M5.7 — Messages).
 *
 * The authoritative secure-messaging resource: threads between a patient and
 * their care circle. Lifecycle commands (start-thread, post, mark-read, close)
 * run as transactional commands: the state change, the canonical Message* event,
 * and the audit intent commit together or not at all (M3 pattern).
 *
 * Access uses the `message` Policy Decision Point resource. Sending is a
 * non-encounter WRITE — the `send` action deliberately does NOT trigger the ABAC
 * encounter constraint, because patients message providers between visits — and
 * is decided BEFORE any write against consent + ReBAC + break-glass. Reads decide
 * BEFORE loading. Each dimension is read live, so a consent withdrawal /
 * relationship revocation / break-glass expiry propagates to the very next
 * decision.
 *
 * PHI discipline: the thread subject and message bodies live only in the
 * access-controlled record; events and audit details carry references and
 * non-clinical metadata (sender role, operational status) only.
 */

const MESSAGE_RESOURCE = "message";

export type MessageAccessContext = Omit<
  ResourceAccessRequest,
  "requestedResource" | "requestedAction"
>;

export interface MessageSafeContext {
  requestId: string;
  correlationId: string;
  idempotencyKey: string;
  operationTag: string;
}

export interface MessagingServiceDeps {
  pool: Pool;
  transaction: PgTransactionAdapter;
  outbox: PgOutboxStore<Record<string, unknown>>;
  auditSink: AuditSink<PoolClient>;
  externalCallPolicy: ExternalCallPolicy;
}

export function createPgMessagingServiceDeps(pool: Pool): MessagingServiceDeps {
  return {
    pool,
    transaction: new PgTransactionAdapter(pool),
    outbox: new PgOutboxStore<Record<string, unknown>>(pool),
    auditSink: new PgAuditSink(),
    externalCallPolicy: new ExternalCallPolicy()
  };
}

// ---------- Start thread (decide-before-write) ----------

export interface StartMessageThreadInput {
  /** May reveal a condition; access-controlled; never in events. */
  subject?: string;
  /** First message body; access-controlled; never in events. */
  body: string;
  access: MessageAccessContext;
  actor: CommandActor;
  safeContext: MessageSafeContext;
  now?: () => Date;
}

export type StartMessageThreadOutcome =
  | { status: "started"; threadId: string; messageId: string }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft };

/**
 * Start a message thread with an opening message. Authorization is decided BEFORE
 * any write (send action — no encounter required). Emits MessageThreadStarted.
 */
export async function startMessageThread(
  deps: MessagingServiceDeps,
  input: StartMessageThreadInput
): Promise<StartMessageThreadOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();

  const decision = await resolveAndDecideResourceAccess(deps.pool, {
    ...input.access,
    requestedResource: MESSAGE_RESOURCE,
    requestedAction: "send"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }

  const threadId = randomUUID();
  const messageId = randomUUID();
  const senderRole = String(input.access.actorRole);

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "messaging.thread.start",
      aggregateId: threadId,
      action: "start-thread",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      await insertMessageThread(ctx.client, {
        threadId,
        patientRef: input.access.patientId,
        organizationRef: input.access.organizationId,
        subject: input.subject,
        startedByRef: input.access.actorId,
        createdAt: nowIso,
        updatedAt: nowIso
      });
      await insertMessage(ctx.client, {
        messageId,
        threadRef: threadId,
        senderRef: input.access.actorId,
        senderRole,
        body: input.body,
        sentAt: nowIso,
        createdAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "MessageThreadStarted",
          aggregateId: threadId,
          safeContext: input.safeContext,
          payload: {
            threadRef: threadId,
            messageRef: messageId,
            patientRef: input.access.patientId,
            organizationRef: input.access.organizationId,
            startedByRef: input.access.actorId,
            senderRole
          }
        })
      );
      return {
        result: { status: "started" as const, threadId, messageId },
        audit: {
          outcome: "committed",
          safeDetails: {
            threadRef: threadId,
            messageRef: messageId,
            patientRef: input.access.patientId,
            organizationRef: input.access.organizationId,
            senderRole
          }
        }
      };
    }
  });

  return result;
}

// ---------- Post message (decide-before-write) ----------

export interface PostMessageInput {
  threadId: string;
  /** Access-controlled; never travels in events or audit detail. */
  body: string;
  access: MessageAccessContext;
  actor: CommandActor;
  safeContext: MessageSafeContext;
  now?: () => Date;
}

export type PostMessageOutcome =
  | { status: "posted"; messageId: string }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  | { status: "not-found" }
  | { status: "thread-closed" };

/**
 * Post a message to an existing open thread. Decided BEFORE any write (send
 * action — no encounter required). Emits MessagePosted.
 */
export async function postMessage(
  deps: MessagingServiceDeps,
  input: PostMessageInput
): Promise<PostMessageOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();

  const decision = await resolveAndDecideResourceAccess(deps.pool, {
    ...input.access,
    requestedResource: MESSAGE_RESOURCE,
    requestedAction: "send"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }

  const thread = await withClient(deps.pool, (client) => loadMessageThread(client, input.threadId));
  if (!thread || thread.patientRef !== input.access.patientId) {
    return { status: "not-found" };
  }
  if (thread.status !== "open") {
    return { status: "thread-closed" };
  }
  const messageId = randomUUID();
  const senderRole = String(input.access.actorRole);

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "messaging.message.post",
      aggregateId: input.threadId,
      action: "post-message",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      await insertMessage(ctx.client, {
        messageId,
        threadRef: input.threadId,
        senderRef: input.access.actorId,
        senderRole,
        body: input.body,
        sentAt: nowIso,
        createdAt: nowIso
      });
      await touchMessageThread(ctx.client, { threadId: input.threadId, updatedAt: nowIso });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "MessagePosted",
          aggregateId: input.threadId,
          safeContext: input.safeContext,
          payload: {
            threadRef: input.threadId,
            messageRef: messageId,
            senderRef: input.access.actorId,
            senderRole
          }
        })
      );
      return {
        result: { status: "posted" as const, messageId },
        audit: {
          outcome: "committed",
          safeDetails: {
            threadRef: input.threadId,
            messageRef: messageId,
            senderRef: input.access.actorId,
            senderRole
          }
        }
      };
    }
  });

  return result;
}

// ---------- Mark read ----------

export interface MarkMessageReadInput {
  messageId: string;
  readByRef: string;
  actor: CommandActor;
  safeContext: MessageSafeContext;
  now?: () => Date;
}

export type MarkMessageReadOutcome =
  | { status: "read"; messageId: string }
  | { status: "not-found" }
  | { status: "already-read" };

/** Mark a message read (a read receipt). Emits MessageRead. */
export async function markMessageAsRead(
  deps: MessagingServiceDeps,
  input: MarkMessageReadInput
): Promise<MarkMessageReadOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const message = await withClient(deps.pool, (client) => loadMessage(client, input.messageId));
  if (!message) {
    return { status: "not-found" };
  }

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "messaging.message.mark-read",
      aggregateId: input.messageId,
      action: "mark-read",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx): Promise<{ result: MarkMessageReadOutcome; audit: CommandAuditOutcome }> => {
      const marked = await markMessageReadRow(ctx.client, {
        messageId: input.messageId,
        readByRef: input.readByRef,
        readAt: nowIso
      });
      if (!marked) {
        return {
          result: { status: "already-read" as const },
          audit: { outcome: "noop", safeDetails: { messageRef: input.messageId } }
        };
      }
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "MessageRead",
          aggregateId: input.messageId,
          safeContext: input.safeContext,
          payload: {
            threadRef: message.threadRef,
            messageRef: input.messageId,
            readByRef: input.readByRef
          }
        })
      );
      return {
        result: { status: "read" as const, messageId: input.messageId },
        audit: {
          outcome: "committed",
          safeDetails: { messageRef: input.messageId, readByRef: input.readByRef }
        }
      };
    }
  });

  return result;
}

// ---------- Close thread ----------

export interface CloseMessageThreadInput {
  threadId: string;
  actor: CommandActor;
  safeContext: MessageSafeContext;
  now?: () => Date;
}

export type CloseMessageThreadOutcome =
  | { status: "closed"; threadId: string }
  | { status: "not-found" };

/** Close a message thread. Emits MessageThreadClosed. */
export async function closeMessageThread(
  deps: MessagingServiceDeps,
  input: CloseMessageThreadInput
): Promise<CloseMessageThreadOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const thread = await withClient(deps.pool, (client) => loadMessageThread(client, input.threadId));
  if (!thread) {
    return { status: "not-found" };
  }

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "messaging.thread.close",
      aggregateId: input.threadId,
      action: "close-thread",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      await setMessageThreadStatus(ctx.client, {
        threadId: input.threadId,
        status: "closed",
        updatedAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "MessageThreadClosed",
          aggregateId: input.threadId,
          safeContext: input.safeContext,
          payload: {
            threadRef: input.threadId,
            patientRef: thread.patientRef,
            organizationRef: thread.organizationRef
          }
        })
      );
      return {
        result: { status: "closed" as const, threadId: input.threadId },
        audit: { outcome: "committed", safeDetails: { threadRef: input.threadId } }
      };
    }
  });

  return result;
}

// ---------- Read (decide-before-load) ----------

export type ReadMessageThreadOutcome =
  | {
      status: "allowed";
      thread: PersistedMessageThread;
      decision: AuthorizationPolicyDecisionDraft;
    }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  | { status: "not-found"; decision: AuthorizationPolicyDecisionDraft };

/**
 * Read a message thread (with its messages) through the full pipeline. The
 * decision is made BEFORE the thread is loaded, so a denied decision never leaks
 * the subject or any message body. Returned only if it belongs to the authorized
 * patient.
 */
export async function readMessageThread(
  deps: Pick<MessagingServiceDeps, "pool">,
  input: { threadId: string; access: MessageAccessContext }
): Promise<ReadMessageThreadOutcome> {
  const decision = await resolveAndDecideResourceAccess(deps.pool, {
    ...input.access,
    requestedResource: MESSAGE_RESOURCE,
    requestedAction: "read"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }
  const thread = await withClient(deps.pool, (client) => loadMessageThread(client, input.threadId));
  if (!thread || thread.patientRef !== input.access.patientId) {
    return { status: "not-found", decision };
  }
  return { status: "allowed", thread, decision };
}

/** Pure composition entry point for unit tests (no database). */
export function decideMessageAccessFrom(
  access: MessageAccessContext,
  requestedAction: string,
  resolved: ResolvedAuthorizationInputs
): AuthorizationPolicyDecisionDraft {
  return composeResourceAccessDecision(
    { ...access, requestedResource: MESSAGE_RESOURCE, requestedAction },
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
