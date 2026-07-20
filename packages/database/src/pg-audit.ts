import type { ClientBase, Pool, PoolClient } from "pg";
import type { AuditEventRecord, AuditSink } from "./transactional-command.js";

/**
 * Postgres audit sink (roadmap M3.1).
 *
 * PgAuditSink.record runs on the command's transaction client, so the audit
 * row is written inside the same transaction as the state it describes. The
 * read helpers run on the pool (outside any transaction) for verification and
 * later audit queries.
 */

interface AuditEventRow {
  audit_id: string;
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

function mapRow(row: AuditEventRow): AuditEventRecord {
  return {
    auditId: row.audit_id,
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
  "audit_id, command_name, aggregate_id, action, outcome, actor_account_ref, " +
  "actor_persona_kind, actor_role, tenant_ref, correlation_id, request_id, " +
  "idempotency_key, safe_details, occurred_at";

export class PgAuditSink implements AuditSink<PoolClient> {
  async record(client: PoolClient, event: AuditEventRecord): Promise<void> {
    await client.query(
      `INSERT INTO nelyo_foundation.audit_event
         (audit_id, command_name, aggregate_id, action, outcome, actor_account_ref,
          actor_persona_kind, actor_role, tenant_ref, correlation_id, request_id,
          idempotency_key, safe_details, occurred_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
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

export async function readAuditEventById(
  db: ClientBase | Pool,
  auditId: string
): Promise<AuditEventRecord | null> {
  const result = await db.query<AuditEventRow>(
    `SELECT ${AUDIT_COLUMNS} FROM nelyo_foundation.audit_event WHERE audit_id = $1`,
    [auditId]
  );
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

export async function listAuditEventsForAggregate(
  db: ClientBase | Pool,
  aggregateId: string,
  limit = 50
): Promise<AuditEventRecord[]> {
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
