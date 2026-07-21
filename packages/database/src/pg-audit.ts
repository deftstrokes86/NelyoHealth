import { randomUUID } from "node:crypto";
import type { ClientBase, Pool, PoolClient } from "pg";
import type { AuditEventRecord, AuditSink } from "./transactional-command.js";
import type { DomainEventConsumer, OutboxEventRecord } from "./transaction-outbox.js";

/**
 * Postgres audit sink + unified audit trail (roadmap M3.1 / M3.2).
 *
 * PgAuditSink.record (M3.1) runs on the command's transaction client, writing
 * the command audit intent (source='command') atomically with the state.
 *
 * createAuditTrailConsumer (M3.2) is the dispatcher's audit subscriber: it
 * appends a row (source='event-dispatch') for each dispatched domain event
 * into the SAME nelyo_foundation.audit_event table, so command intents and the
 * business events they produced form one unified, queryable audit trail
 * (linked by correlation_id). It is idempotent under at-least-once redelivery
 * via the event_id unique index.
 *
 * The read helpers run on the pool (outside any transaction).
 */

export type AuditEventSource = "command" | "event-dispatch";

export interface PersistedAuditEvent extends AuditEventRecord {
  source: AuditEventSource;
  eventId: string | null;
}

interface AuditEventRow {
  audit_id: string;
  source: AuditEventSource;
  event_id: string | null;
  command_name: string;
  aggregate_id: string;
  action: string;
  outcome: string;
  actor_account_ref: string;
  actor_persona_kind: string;
  actor_role: string;
  tenant_ref: string | null;
  correlation_id: string;
  request_id: string;
  idempotency_key: string;
  safe_details: Record<string, unknown>;
  occurred_at: string | Date;
}

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapRow(row: AuditEventRow): PersistedAuditEvent {
  return {
    auditId: row.audit_id,
    source: row.source,
    eventId: row.event_id ?? null,
    commandName: row.command_name,
    aggregateId: row.aggregate_id,
    action: row.action,
    outcome: row.outcome,
    actorAccountRef: row.actor_account_ref,
    actorPersonaKind: row.actor_persona_kind,
    actorRole: row.actor_role,
    tenantRef: row.tenant_ref ?? null,
    correlationId: row.correlation_id,
    requestId: row.request_id,
    idempotencyKey: row.idempotency_key,
    safeDetails: row.safe_details ?? {},
    occurredAt: toIso(row.occurred_at)
  };
}

const AUDIT_COLUMNS =
  "audit_id, source, event_id, command_name, aggregate_id, action, outcome, " +
  "actor_account_ref, actor_persona_kind, actor_role, tenant_ref, correlation_id, " +
  "request_id, idempotency_key, safe_details, occurred_at";

export class PgAuditSink implements AuditSink<PoolClient> {
  async record(client: PoolClient, event: AuditEventRecord): Promise<void> {
    await client.query(
      `INSERT INTO nelyo_foundation.audit_event
         (audit_id, source, event_id, command_name, aggregate_id, action, outcome,
          actor_account_ref, actor_persona_kind, actor_role, tenant_ref, correlation_id,
          request_id, idempotency_key, safe_details, occurred_at)
       VALUES ($1, 'command', NULL, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        event.auditId,
        event.commandName,
        event.aggregateId,
        event.action,
        event.outcome,
        event.actorAccountRef,
        event.actorPersonaKind,
        event.actorRole,
        event.tenantRef,
        event.correlationId,
        event.requestId,
        event.idempotencyKey,
        JSON.stringify(event.safeDetails),
        event.occurredAt
      ]
    );
  }
}

/**
 * The dispatcher's audit subscriber (M3.2). Records each dispatched domain
 * event into the unified audit store, attributed to the dispatcher (the real
 * initiating actor is recoverable by joining on correlation_id to the
 * command audit row). Idempotent: redelivering the same event is a no-op.
 */
export function createAuditTrailConsumer(pool: Pool): DomainEventConsumer<Record<string, unknown>> {
  return {
    name: "audit-trail",
    consume: async (event: OutboxEventRecord<Record<string, unknown>>) => {
      await pool.query(
        `INSERT INTO nelyo_foundation.audit_event
           (audit_id, source, event_id, command_name, aggregate_id, action, outcome,
            actor_account_ref, actor_persona_kind, actor_role, tenant_ref, correlation_id,
            request_id, idempotency_key, safe_details, occurred_at)
         VALUES ($1, 'event-dispatch', $2, $3, $4, 'emitted', 'dispatched',
            'system:dispatcher', 'system', 'dispatcher', NULL, $5, $6, $7, '{}'::jsonb, NOW())
         ON CONFLICT (event_id) WHERE event_id IS NOT NULL DO NOTHING`,
        [
          randomUUID(),
          event.eventId,
          event.eventType,
          event.aggregateId,
          event.safeContext.correlationId,
          event.safeContext.requestId,
          event.safeContext.idempotencyKey
        ]
      );
    }
  };
}

export async function readAuditEventById(
  db: ClientBase | Pool,
  auditId: string
): Promise<PersistedAuditEvent | null> {
  const result = await db.query<AuditEventRow>(
    `SELECT ${AUDIT_COLUMNS} FROM nelyo_foundation.audit_event WHERE audit_id = $1`,
    [auditId]
  );
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

/** Unified audit trail for an aggregate — command intents and dispatched events together. */
export async function listAuditEventsForAggregate(
  db: ClientBase | Pool,
  aggregateId: string,
  limit = 50
): Promise<PersistedAuditEvent[]> {
  const result = await db.query<AuditEventRow>(
    `SELECT ${AUDIT_COLUMNS}
     FROM nelyo_foundation.audit_event
     WHERE aggregate_id = $1
     ORDER BY occurred_at DESC
     LIMIT $2`,
    [aggregateId, limit]
  );
  return result.rows.map(mapRow);
}

/**
 * Unified audit trail for a correlation id — links a command's audit intent to
 * the audit rows for every event that command produced.
 */
export async function listAuditTrailByCorrelation(
  db: ClientBase | Pool,
  correlationId: string,
  limit = 100
): Promise<PersistedAuditEvent[]> {
  const result = await db.query<AuditEventRow>(
    `SELECT ${AUDIT_COLUMNS}
     FROM nelyo_foundation.audit_event
     WHERE correlation_id = $1
     ORDER BY occurred_at ASC
     LIMIT $2`,
    [correlationId, limit]
  );
  return result.rows.map(mapRow);
}
