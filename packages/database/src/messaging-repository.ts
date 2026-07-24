import type { ClientBase } from "pg";

/**
 * Messaging repository (roadmap M5.7 — Messages).
 *
 * Owns SQL for the secure-messaging aggregates in nelyo_messaging. Client-
 * parameterized so callers control the transaction boundary: mutations run inside
 * the transactional-command path (state + outbox + audit in one transaction).
 *
 * The thread subject and message bodies are loaded here for the access-controlled
 * record but the api layer keeps them out of events and audit.
 */

export type MessageThreadStatus = "open" | "closed";

export interface PersistedMessage {
  messageId: string;
  threadRef: string;
  senderRef: string;
  senderRole: string;
  body: string;
  sentAt: string;
  readAt?: string;
  readByRef?: string;
}

export interface PersistedMessageThread {
  threadId: string;
  patientRef: string;
  organizationRef: string;
  subject?: string;
  status: MessageThreadStatus;
  startedByRef: string;
  messages: PersistedMessage[];
  createdAt: string;
  updatedAt: string;
}

interface ThreadRow {
  thread_id: string;
  patient_ref: string;
  organization_ref: string;
  subject: string | null;
  status: MessageThreadStatus;
  started_by_ref: string;
  created_at: string | Date;
  updated_at: string | Date;
}

interface MessageRow {
  message_id: string;
  thread_ref: string;
  sender_ref: string;
  sender_role: string;
  body: string;
  sent_at: string | Date;
  read_at: string | Date | null;
  read_by_ref: string | null;
}

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toIsoOrUndefined(value: string | Date | null): string | undefined {
  return value === null ? undefined : toIso(value);
}

function mapMessage(row: MessageRow): PersistedMessage {
  return {
    messageId: row.message_id,
    threadRef: row.thread_ref,
    senderRef: row.sender_ref,
    senderRole: row.sender_role,
    body: row.body,
    sentAt: toIso(row.sent_at),
    readAt: toIsoOrUndefined(row.read_at),
    readByRef: row.read_by_ref ?? undefined
  };
}

function mapThread(row: ThreadRow, messages: PersistedMessage[]): PersistedMessageThread {
  return {
    threadId: row.thread_id,
    patientRef: row.patient_ref,
    organizationRef: row.organization_ref,
    subject: row.subject ?? undefined,
    status: row.status,
    startedByRef: row.started_by_ref,
    messages,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at)
  };
}

// ---------- Mutations (run inside the transactional command) ----------

export async function insertMessageThread(
  client: ClientBase,
  input: {
    threadId: string;
    patientRef: string;
    organizationRef: string;
    subject?: string;
    startedByRef: string;
    createdAt: string;
    updatedAt: string;
  }
): Promise<void> {
  await client.query(
    `INSERT INTO nelyo_messaging.message_thread
       (thread_id, patient_ref, organization_ref, subject, status, started_by_ref, created_at, updated_at)
     VALUES ($1, $2, $3, $4, 'open', $5, $6, $7)`,
    [
      input.threadId,
      input.patientRef,
      input.organizationRef,
      input.subject ?? null,
      input.startedByRef,
      input.createdAt,
      input.updatedAt
    ]
  );
}

export async function insertMessage(
  client: ClientBase,
  input: {
    messageId: string;
    threadRef: string;
    senderRef: string;
    senderRole: string;
    body: string;
    sentAt: string;
    createdAt: string;
  }
): Promise<void> {
  await client.query(
    `INSERT INTO nelyo_messaging.message
       (message_id, thread_ref, sender_ref, sender_role, body, sent_at, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      input.messageId,
      input.threadRef,
      input.senderRef,
      input.senderRole,
      input.body,
      input.sentAt,
      input.createdAt
    ]
  );
}

export async function touchMessageThread(
  client: ClientBase,
  input: { threadId: string; updatedAt: string }
): Promise<void> {
  await client.query(
    `UPDATE nelyo_messaging.message_thread SET updated_at = $2 WHERE thread_id = $1`,
    [input.threadId, input.updatedAt]
  );
}

export async function markMessageRead(
  client: ClientBase,
  input: { messageId: string; readByRef: string; readAt: string }
): Promise<boolean> {
  const result = await client.query(
    `UPDATE nelyo_messaging.message
        SET read_at = $2, read_by_ref = $3
      WHERE message_id = $1 AND read_at IS NULL`,
    [input.messageId, input.readAt, input.readByRef]
  );
  return (result.rowCount ?? 0) > 0;
}

export async function setMessageThreadStatus(
  client: ClientBase,
  input: { threadId: string; status: MessageThreadStatus; updatedAt: string }
): Promise<void> {
  await client.query(
    `UPDATE nelyo_messaging.message_thread SET status = $2, updated_at = $3 WHERE thread_id = $1`,
    [input.threadId, input.status, input.updatedAt]
  );
}

// ---------- Reads ----------

async function loadMessages(client: ClientBase, threadId: string): Promise<PersistedMessage[]> {
  const result = await client.query<MessageRow>(
    `SELECT message_id, thread_ref, sender_ref, sender_role, body, sent_at, read_at, read_by_ref
       FROM nelyo_messaging.message
      WHERE thread_ref = $1
      ORDER BY sent_at ASC`,
    [threadId]
  );
  return result.rows.map(mapMessage);
}

export async function loadMessageThread(
  client: ClientBase,
  threadId: string
): Promise<PersistedMessageThread | null> {
  const result = await client.query<ThreadRow>(
    `SELECT thread_id, patient_ref, organization_ref, subject, status, started_by_ref,
            created_at, updated_at
       FROM nelyo_messaging.message_thread WHERE thread_id = $1`,
    [threadId]
  );
  const row = result.rows[0];
  if (!row) return null;
  return mapThread(row, await loadMessages(client, threadId));
}

export async function loadMessage(
  client: ClientBase,
  messageId: string
): Promise<PersistedMessage | null> {
  const result = await client.query<MessageRow>(
    `SELECT message_id, thread_ref, sender_ref, sender_role, body, sent_at, read_at, read_by_ref
       FROM nelyo_messaging.message WHERE message_id = $1`,
    [messageId]
  );
  const row = result.rows[0];
  return row ? mapMessage(row) : null;
}

export async function listThreadsForPatient(
  client: ClientBase,
  input: { patientRef: string; organizationRef: string }
): Promise<PersistedMessageThread[]> {
  const result = await client.query<ThreadRow>(
    `SELECT thread_id, patient_ref, organization_ref, subject, status, started_by_ref,
            created_at, updated_at
       FROM nelyo_messaging.message_thread
      WHERE patient_ref = $1 AND organization_ref = $2
      ORDER BY updated_at DESC`,
    [input.patientRef, input.organizationRef]
  );
  const threads: PersistedMessageThread[] = [];
  for (const row of result.rows) {
    threads.push(mapThread(row, await loadMessages(client, row.thread_id)));
  }
  return threads;
}
