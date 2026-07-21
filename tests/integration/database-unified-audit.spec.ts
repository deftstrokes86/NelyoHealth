import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  ExternalCallPolicy,
  PgAuditSink,
  PgOutboxStore,
  PgTransactionAdapter,
  createAuditTrailConsumer,
  createDatabaseClient,
  createDatabasePool,
  createDomainEventEnvelope,
  createPerson,
  dispatchPendingOutboxEvents,
  listAuditEventsForAggregate,
  listAuditTrailByCorrelation,
  runTransactionalCommand
} from "../../packages/database/src/index.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";

/**
 * M3.2: a command's audit intent (source='command', in-TX) and the audit rows
 * the dispatcher's subscriber writes for the events it produced
 * (source='event-dispatch') land in one unified audit_event store, queryable
 * together and linked by correlation id — and the audit subscriber is
 * idempotent under at-least-once redelivery.
 */
describe.skipIf(!shouldRun)("unified audit (command intent + dispatched events, one store)", () => {
  const client = createDatabaseClient();
  const pool = createDatabasePool();
  const run = `ua-${Date.now()}`;
  const transaction = new PgTransactionAdapter(pool);
  const outbox = new PgOutboxStore<Record<string, unknown>>(pool);
  const auditSink = new PgAuditSink();
  const auditConsumer = createAuditTrailConsumer(pool);
  const policy = new ExternalCallPolicy();
  const correlationIds: string[] = [];

  beforeAll(async () => {
    await client.connect();
  });

  afterAll(async () => {
    for (const correlationId of correlationIds) {
      await client.query(`DELETE FROM nelyo_foundation.audit_event WHERE correlation_id = $1`, [
        correlationId
      ]);
      await client.query(
        `DELETE FROM nelyo_foundation.transactional_outbox WHERE correlation_id = $1`,
        [correlationId]
      );
    }
    await client.query(`DELETE FROM nelyo_identity.person WHERE display_name LIKE $1`, [`${run}%`]);
    await client.end();
    await pool.end();
  });

  function safeContext(tag: string) {
    const correlationId = `corr-${run}-${tag}`;
    correlationIds.push(correlationId);
    return {
      requestId: `req-${run}-${tag}`,
      correlationId,
      idempotencyKey: `idem-${run}-${tag}`,
      operationTag: "identity.person.register"
    };
  }

  it("unifies the command audit and the dispatched-event audit for one aggregate", async () => {
    const ctx = safeContext("unify");
    const aggregateId = `${run}-agg`;

    await runTransactionalCommand({
      transaction,
      outbox,
      auditSink,
      externalCallPolicy: policy,
      command: {
        name: "identity.person.register",
        aggregateId,
        action: "register",
        actor: {
          accountRef: "acc-1",
          personaKind: "personal",
          actorRole: "patient",
          tenantRef: null
        },
        safeContext: ctx
      },
      work: async (workCtx) => {
        const person = await createPerson(workCtx.client, { displayName: `${run}-person` });
        await workCtx.enqueueDomainEvent(
          createDomainEventEnvelope({
            eventType: "PersonRegistered",
            aggregateId,
            safeContext: ctx,
            payload: { personRef: person.id }
          })
        );
        return {
          result: person,
          audit: { outcome: "committed", safeDetails: { personRef: person.id } }
        };
      }
    });

    // Before dispatch: only the command audit intent exists.
    let trail = await listAuditTrailByCorrelation(client, ctx.correlationId);
    expect(trail.map((r) => r.source)).toEqual(["command"]);

    // Dispatch fans the event out to the audit subscriber.
    const stats = await dispatchPendingOutboxEvents({
      outbox,
      externalCallPolicy: policy,
      maxAttempts: 3,
      consumers: [auditConsumer]
    });
    expect(stats.dispatched).toBeGreaterThanOrEqual(1);

    // After dispatch: command intent + dispatched-event audit, unified.
    trail = await listAuditTrailByCorrelation(client, ctx.correlationId);
    expect(trail).toHaveLength(2);
    const command = trail.find((r) => r.source === "command");
    const event = trail.find((r) => r.source === "event-dispatch");
    expect(command).toMatchObject({
      commandName: "identity.person.register",
      action: "register",
      outcome: "committed",
      actorAccountRef: "acc-1"
    });
    expect(event).toMatchObject({
      commandName: "PersonRegistered",
      action: "emitted",
      outcome: "dispatched",
      actorAccountRef: "system:dispatcher"
    });
    expect(event?.eventId).toBeTruthy();

    // The same aggregate query returns both sources.
    const byAggregate = await listAuditEventsForAggregate(client, aggregateId);
    expect(byAggregate.map((r) => r.source).sort()).toEqual(["command", "event-dispatch"]);
  });

  it("is idempotent — redelivering the same event records exactly one audit row", async () => {
    const ctx = safeContext("idem");
    const event = createDomainEventEnvelope({
      eventType: "PersonRegistered",
      aggregateId: `${run}-agg-idem`,
      safeContext: ctx,
      payload: { personRef: "p-idem" }
    });
    const record = {
      ...event,
      dispatchStatus: "pending" as const,
      dispatchAttempts: 0,
      lastError: null,
      dispatchedAt: null
    };

    await auditConsumer.consume(record);
    await auditConsumer.consume(record); // redelivery

    const rows = await client.query(
      `SELECT COUNT(*)::int AS count FROM nelyo_foundation.audit_event WHERE event_id = $1`,
      [event.eventId]
    );
    expect(rows.rows[0].count).toBe(1);
  });
});
