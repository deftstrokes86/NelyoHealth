import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  ExternalCallPolicy,
  PgAuditSink,
  PgOutboxStore,
  PgTransactionAdapter,
  createDatabaseClient,
  createDatabasePool,
  createDomainEventEnvelope,
  createPerson,
  getPersonById,
  listAuditEventsForAggregate,
  readAuditEventById,
  runTransactionalCommand
} from "../../packages/database/src/index.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";

/**
 * Proves the M3.1 invariant against live Postgres: a command's state mutation
 * (nelyo_identity.person), the domain event it emits
 * (nelyo_foundation.transactional_outbox), and its audit intent
 * (nelyo_foundation.audit_event) all commit in ONE transaction — or, on
 * failure, none of them persist.
 */
describe.skipIf(!shouldRun)("transactional command (state + outbox + audit, one TX)", () => {
  const client = createDatabaseClient();
  const pool = createDatabasePool();
  const run = `tc-${Date.now()}`;
  const transaction = new PgTransactionAdapter(pool);
  const outbox = new PgOutboxStore<Record<string, unknown>>(pool);
  const auditSink = new PgAuditSink();
  const externalCallPolicy = new ExternalCallPolicy();
  const createdPersonIds: string[] = [];
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

  it("commits the person row, the outbox event, and the audit event together", async () => {
    const ctx = safeContext("ok");
    const aggregateId = `${run}-agg-ok`;

    const { result, auditId } = await runTransactionalCommand({
      transaction,
      outbox,
      auditSink,
      externalCallPolicy,
      command: {
        name: "identity.person.register",
        aggregateId,
        action: "register",
        actor: {
          accountRef: "acc-system",
          personaKind: "personal",
          actorRole: "patient",
          tenantRef: null
        },
        safeContext: ctx
      },
      work: async (workCtx) => {
        const person = await createPerson(workCtx.client, { displayName: `${run}-person-ok` });
        createdPersonIds.push(person.id);
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

    // State committed.
    const person = await getPersonById(client, result.id);
    expect(person?.id).toBe(result.id);

    // Outbox committed (pending).
    const outboxRows = await client.query(
      `SELECT event_type, dispatch_status FROM nelyo_foundation.transactional_outbox WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(outboxRows.rows).toHaveLength(1);
    expect(outboxRows.rows[0]).toMatchObject({
      event_type: "PersonRegistered",
      dispatch_status: "pending"
    });

    // Audit committed, referencing the same command.
    const audit = await readAuditEventById(client, auditId);
    expect(audit).toMatchObject({
      commandName: "identity.person.register",
      aggregateId,
      action: "register",
      outcome: "committed",
      correlationId: ctx.correlationId
    });
    expect(audit?.safeDetails).toMatchObject({ personRef: result.id });
  });

  it("persists nothing — not the person, outbox, or audit — when the work throws", async () => {
    const ctx = safeContext("fail");
    const aggregateId = `${run}-agg-fail`;
    const marker = `${run}-person-should-not-exist`;

    await expect(
      runTransactionalCommand({
        transaction,
        outbox,
        auditSink,
        externalCallPolicy,
        command: {
          name: "identity.person.register",
          aggregateId,
          action: "register",
          actor: {
            accountRef: "acc-system",
            personaKind: "personal",
            actorRole: "patient",
            tenantRef: null
          },
          safeContext: ctx
        },
        work: async (workCtx) => {
          await createPerson(workCtx.client, { displayName: marker });
          await workCtx.enqueueDomainEvent(
            createDomainEventEnvelope({
              eventType: "PersonRegistered",
              aggregateId,
              safeContext: ctx,
              payload: { personRef: "never" }
            })
          );
          throw new Error("synthetic failure after state + event + audit staged");
        }
      })
    ).rejects.toThrow(/synthetic failure/);

    // No person row.
    const persons = await client.query(
      `SELECT COUNT(*)::int AS count FROM nelyo_identity.person WHERE display_name = $1`,
      [marker]
    );
    expect(persons.rows[0].count).toBe(0);

    // No outbox row.
    const outboxRows = await client.query(
      `SELECT COUNT(*)::int AS count FROM nelyo_foundation.transactional_outbox WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(outboxRows.rows[0].count).toBe(0);

    // No audit row.
    const audits = await listAuditEventsForAggregate(client, aggregateId);
    expect(audits).toHaveLength(0);
  });
});
