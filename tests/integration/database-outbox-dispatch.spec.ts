import { describe, expect, it } from "vitest";
import {
  createDomainEventEnvelope,
  dispatchPendingOutboxEvents,
  ExternalCallPolicy,
  runTransactionalWorkWithOutbox,
  SyntheticInMemoryOutboxStore,
  SyntheticTransactionAdapter,
  type DomainEventPublisher,
  type OutboxEventRecord
} from "../../packages/database/src/index.js";

interface DispatchPayload extends Record<string, unknown> {
  syntheticTaskId: string;
  routeKey: string;
}

function createPublisher(options: {
  failForEventId?: string;
  failUntilAttempt?: number;
  delivered: string[];
}): DomainEventPublisher<DispatchPayload> {
  const attempts = new Map<string, number>();

  return {
    publish: async (event) => {
      const nextAttempt = (attempts.get(event.eventId) ?? 0) + 1;
      attempts.set(event.eventId, nextAttempt);

      if (
        options.failForEventId === event.eventId &&
        nextAttempt <= (options.failUntilAttempt ?? 0)
      ) {
        throw new Error(
          `Synthetic dispatch failure for ${event.eventId} at attempt ${nextAttempt}.`
        );
      }

      options.delivered.push(event.eventId);
    }
  };
}

function buildEvent(eventId: string, createdAt: string) {
  return createDomainEventEnvelope<DispatchPayload>({
    eventId,
    eventType: "synthetic.domain.updated",
    aggregateId: "aggregate-1",
    safeContext: {
      requestId: "req-dispatch",
      correlationId: `corr-${eventId}`,
      idempotencyKey: `idem-${eventId}`,
      operationTag: "outbox.dispatch"
    },
    payload: {
      syntheticTaskId: `task-${eventId}`,
      routeKey: "worker.synthetic"
    },
    createdAt
  });
}

describe("database outbox dispatch foundation", () => {
  it("dispatches pending events after transaction commit", async () => {
    const transaction = new SyntheticTransactionAdapter();
    const outbox = new SyntheticInMemoryOutboxStore<DispatchPayload>();
    const policy = new ExternalCallPolicy();
    const delivered: string[] = [];

    await runTransactionalWorkWithOutbox({
      transaction,
      outbox,
      externalCallPolicy: policy,
      work: async (ctx) => {
        await ctx.enqueueDomainEvent(buildEvent("evt-a", "2026-06-30T00:00:00.000Z"));
        await ctx.enqueueDomainEvent(buildEvent("evt-b", "2026-06-30T00:00:01.000Z"));
      }
    });

    const summary = await dispatchPendingOutboxEvents({
      outbox,
      publisher: createPublisher({ delivered }),
      externalCallPolicy: policy,
      maxAttempts: 3
    });

    expect(summary).toEqual({
      dispatched: 2,
      retried: 0,
      deadLettered: 0
    });
    expect(delivered).toEqual(["evt-a", "evt-b"]);

    const records = outbox.listAll();
    expect(records.every((record) => record.dispatchStatus === "dispatched")).toBe(true);
  });

  it("increments attempts and dead-letters when max attempts is reached", async () => {
    const outbox = new SyntheticInMemoryOutboxStore<DispatchPayload>();
    const policy = new ExternalCallPolicy();
    const delivered: string[] = [];

    const seedRecord = buildEvent("evt-dead", "2026-06-30T00:00:02.000Z");
    await outbox.insertPending({ txId: "tx-seed" }, seedRecord);

    const first = await dispatchPendingOutboxEvents({
      outbox,
      publisher: createPublisher({
        failForEventId: "evt-dead",
        failUntilAttempt: 2,
        delivered
      }),
      externalCallPolicy: policy,
      maxAttempts: 2
    });

    expect(first).toEqual({
      dispatched: 0,
      retried: 1,
      deadLettered: 0
    });

    const second = await dispatchPendingOutboxEvents({
      outbox,
      publisher: createPublisher({
        failForEventId: "evt-dead",
        failUntilAttempt: 2,
        delivered
      }),
      externalCallPolicy: policy,
      maxAttempts: 2
    });

    expect(second).toEqual({
      dispatched: 0,
      retried: 0,
      deadLettered: 1
    });

    const record = outbox.readById("evt-dead") as OutboxEventRecord<DispatchPayload>;
    expect(record.dispatchStatus).toBe("dead-lettered");
    expect(record.dispatchAttempts).toBe(2);
    expect(record.lastError).toContain("Synthetic dispatch failure");
    expect(delivered).toEqual([]);
  });
});
