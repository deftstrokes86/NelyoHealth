import { describe, expect, it } from "vitest";
import {
  createDomainEventEnvelope,
  ExternalCallPolicy,
  runTransactionalWorkWithOutbox,
  SyntheticInMemoryOutboxStore,
  SyntheticTransactionAdapter,
  type DomainEventEnvelope
} from "../../packages/database/src/index.js";

interface SyntheticPayload {
  syntheticTaskId: string;
  retryBucket: string;
}

function buildEvent(input: {
  eventId?: string;
  syntheticTaskId: string;
  correlationId: string;
  idempotencyKey: string;
  createdAt: string;
}): DomainEventEnvelope<SyntheticPayload> {
  return createDomainEventEnvelope<SyntheticPayload>({
    eventId: input.eventId,
    eventType: "synthetic.order.created",
    aggregateId: "order-1",
    safeContext: {
      requestId: "req-iss008",
      correlationId: input.correlationId,
      idempotencyKey: input.idempotencyKey,
      operationTag: "outbox.synthetic"
    },
    payload: {
      syntheticTaskId: input.syntheticTaskId,
      retryBucket: "standard"
    },
    createdAt: input.createdAt
  });
}

describe("database transaction and outbox foundation", () => {
  it("commits transactional work and inserts outbox event", async () => {
    const transaction = new SyntheticTransactionAdapter();
    const outbox = new SyntheticInMemoryOutboxStore<SyntheticPayload>();
    const policy = new ExternalCallPolicy();

    const result = await runTransactionalWorkWithOutbox({
      transaction,
      outbox,
      externalCallPolicy: policy,
      work: async (ctx) => {
        await ctx.enqueueDomainEvent(
          buildEvent({
            eventId: "evt-commit",
            syntheticTaskId: "task-1",
            correlationId: "corr-1",
            idempotencyKey: "idem-1",
            createdAt: "2026-06-30T00:00:00.000Z"
          })
        );
        return "ok";
      }
    });

    expect(result).toBe("ok");
    expect(transaction.getLifecycleEntries()).toEqual(["begin:tx-1", "commit:tx-1"]);
    expect(policy.isTransactionActive()).toBe(false);
    expect(outbox.listAll()).toHaveLength(1);
    expect(outbox.readById("evt-commit")?.dispatchStatus).toBe("pending");
  });

  it("rolls back transactional work when callback fails", async () => {
    const transaction = new SyntheticTransactionAdapter();
    const outbox = new SyntheticInMemoryOutboxStore<SyntheticPayload>();
    const policy = new ExternalCallPolicy();

    await expect(
      runTransactionalWorkWithOutbox({
        transaction,
        outbox,
        externalCallPolicy: policy,
        work: async (ctx) => {
          await ctx.enqueueDomainEvent(
            buildEvent({
              eventId: "evt-rollback",
              syntheticTaskId: "task-rollback",
              correlationId: "corr-rollback",
              idempotencyKey: "idem-rollback",
              createdAt: "2026-06-30T00:00:01.000Z"
            })
          );

          throw new Error("synthetic rollback");
        }
      })
    ).rejects.toThrow("synthetic rollback");

    expect(transaction.getLifecycleEntries()).toEqual(["begin:tx-1", "rollback:tx-1"]);
    expect(policy.isTransactionActive()).toBe(false);
  });

  it("blocks external calls inside an active transaction", async () => {
    const transaction = new SyntheticTransactionAdapter();
    const outbox = new SyntheticInMemoryOutboxStore<SyntheticPayload>();
    const policy = new ExternalCallPolicy();

    await expect(
      runTransactionalWorkWithOutbox({
        transaction,
        outbox,
        externalCallPolicy: policy,
        work: async (ctx) => {
          ctx.assertExternalCallAllowed("http-client.post");
          return "never";
        }
      })
    ).rejects.toThrow(/forbidden inside an active transaction/);

    expect(transaction.getLifecycleEntries()).toEqual(["begin:tx-1", "rollback:tx-1"]);
  });
});
