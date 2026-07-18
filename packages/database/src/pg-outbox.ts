import type { Pool, PoolClient } from "pg";
import type {
  DomainEventEnvelope,
  OutboxEventRecord,
  TransactionAdapter,
  TransactionalOutboxPort
} from "./transaction-outbox.js";

/**
 * Postgres implementations of the transactional-outbox ports (roadmap M1.2).
 *
 * Backs runTransactionalWorkWithOutbox / dispatchPendingOutboxEvents with the
 * nelyo_foundation.transactional_outbox table (migration 0002). insertPending
 * runs on the caller's transaction client; dispatch bookkeeping runs on the
 * pool outside any transaction (per the external-call policy).
 */

export class PgTransactionAdapter implements TransactionAdapter<PoolClient> {
  constructor(private readonly pool: Pool) {}

  async begin(): Promise<PoolClient> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      return client;
    } catch (error) {
      client.release();
      throw error;
    }
  }

  async commit(client: PoolClient): Promise<void> {
    try {
      await client.query("COMMIT");
    } finally {
      client.release();
    }
  }

  async rollback(client: PoolClient): Promise<void> {
    try {
      await client.query("ROLLBACK");
    } finally {
      client.release();
    }
  }
}

interface OutboxRow {
  event_id: string;
  event_type: string;
  aggregate_id: string;
  correlation_id: string;
  idempotency_key: string;
  operation_tag: string;
  payload_json: Record<string, unknown>;
  dispatch_status: OutboxEventRecord<Record<string, unknown>>["dispatchStatus"];
  dispatch_attempts: number;
  last_error: string | null;
  created_at: string | Date;
  dispatched_at: string | Date | null;
}

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

export class PgOutboxStore<
  TPayload extends Record<string, unknown>
> implements TransactionalOutboxPort<PoolClient, TPayload> {
  constructor(private readonly pool: Pool) {}

  async insertPending(client: PoolClient, event: DomainEventEnvelope<TPayload>): Promise<void> {
    await client.query(
      `INSERT INTO nelyo_foundation.transactional_outbox
         (event_id, event_type, aggregate_id, correlation_id, idempotency_key,
          operation_tag, payload_json, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        event.eventId,
        event.eventType,
        event.aggregateId,
        event.safeContext.correlationId,
        event.safeContext.idempotencyKey,
        event.safeContext.operationTag,
        JSON.stringify(event.payload),
        event.createdAt
      ]
    );
  }

  async listPending(limit: number): Promise<Array<OutboxEventRecord<TPayload>>> {
    const result = await this.pool.query<OutboxRow>(
      `SELECT event_id, event_type, aggregate_id, correlation_id, idempotency_key,
              operation_tag, payload_json, dispatch_status, dispatch_attempts,
              last_error, created_at, dispatched_at
       FROM nelyo_foundation.transactional_outbox
       WHERE dispatch_status = 'pending'
       ORDER BY created_at ASC
       LIMIT $1`,
      [limit]
    );
    return result.rows.map((row) => this.mapRow(row));
  }

  async markDispatched(eventId: string, dispatchedAt: string): Promise<void> {
    await this.pool.query(
      `UPDATE nelyo_foundation.transactional_outbox
       SET dispatch_status = 'dispatched', dispatched_at = $2, last_error = NULL
       WHERE event_id = $1`,
      [eventId, dispatchedAt]
    );
  }

  async markDispatchFailure(eventId: string, attempt: number, reason: string): Promise<void> {
    await this.pool.query(
      `UPDATE nelyo_foundation.transactional_outbox
       SET dispatch_attempts = $2, last_error = $3
       WHERE event_id = $1`,
      [eventId, attempt, reason]
    );
  }

  async markDeadLettered(eventId: string, attempt: number, reason: string): Promise<void> {
    await this.pool.query(
      `UPDATE nelyo_foundation.transactional_outbox
       SET dispatch_status = 'dead-lettered', dispatch_attempts = $2, last_error = $3
       WHERE event_id = $1`,
      [eventId, attempt, reason]
    );
  }

  async readByEventId(eventId: string): Promise<OutboxEventRecord<TPayload> | null> {
    const result = await this.pool.query<OutboxRow>(
      `SELECT event_id, event_type, aggregate_id, correlation_id, idempotency_key,
              operation_tag, payload_json, dispatch_status, dispatch_attempts,
              last_error, created_at, dispatched_at
       FROM nelyo_foundation.transactional_outbox
       WHERE event_id = $1`,
      [eventId]
    );
    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  private mapRow(row: OutboxRow): OutboxEventRecord<TPayload> {
    return {
      eventId: row.event_id,
      eventType: row.event_type,
      aggregateId: row.aggregate_id,
      safeContext: {
        requestId: "outbox-replay",
        correlationId: row.correlation_id,
        idempotencyKey: row.idempotency_key,
        operationTag: row.operation_tag
      },
      payload: row.payload_json as TPayload,
      createdAt: toIso(row.created_at),
      dispatchStatus: row.dispatch_status,
      dispatchAttempts: row.dispatch_attempts,
      lastError: row.last_error,
      dispatchedAt: row.dispatched_at ? toIso(row.dispatched_at) : null
    };
  }
}
