import { describe, expect, it } from "vitest";
import {
  createDomainEventEnvelope,
  dispatchPendingOutboxEvents,
  ExternalCallPolicy,
  runTransactionalWorkWithOutbox,
  SyntheticInMemoryOutboxStore,
  SyntheticTransactionAdapter,
  type DomainEventConsumer,
  type OutboxEventRecord
} from "../../packages/database/src/index.js";

interface Payload extends Record<string, unknown> {
  ref: string;
}

async function seedEvent(
  outbox: SyntheticInMemoryOutboxStore<Payload>,
  eventId: string
): Promise<void> {
  const transaction = new SyntheticTransactionAdapter();
  const policy = new ExternalCallPolicy();
  await runTransactionalWorkWithOutbox({
    transaction,
    outbox,
    externalCallPolicy: policy,
    work: async (ctx) => {
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope<Payload>({
          eventId,
          eventType: "ThingHappened",
          aggregateId: "agg-1",
          safeContext: {
            requestId: "req",
            correlationId: "corr",
            idempotencyKey: `idem-${eventId}`,
            operationTag: "thing"
          },
          payload: { ref: "agg-1" }
        })
      );
      return null;
    }
  });
}

function recordingConsumer(name: string, seen: string[]): DomainEventConsumer<Payload> {
  return {
    name,
    consume: async (event: OutboxEventRecord<Payload>) => {
      seen.push(`${name}:${event.eventId}`);
    }
  };
}

describe("dispatchPendingOutboxEvents — fan-out to consumers", () => {
  it("delivers each event to every consumer and marks it dispatched when all succeed", async () => {
    const outbox = new SyntheticInMemoryOutboxStore<Payload>();
    await seedEvent(outbox, "evt-1");
    const auditSeen: string[] = [];
    const notifySeen: string[] = [];

    const stats = await dispatchPendingOutboxEvents({
      outbox,
      externalCallPolicy: new ExternalCallPolicy(),
      maxAttempts: 3,
      consumers: [recordingConsumer("audit", auditSeen), recordingConsumer("notify", notifySeen)]
    });

    expect(stats).toMatchObject({ dispatched: 1, retried: 0, deadLettered: 0 });
    expect(auditSeen).toEqual(["audit:evt-1"]);
    expect(notifySeen).toEqual(["notify:evt-1"]);
    expect(outbox.readById("evt-1")?.dispatchStatus).toBe("dispatched");
  });

  it("retries the whole event (re-offering to all consumers) when one consumer fails", async () => {
    const outbox = new SyntheticInMemoryOutboxStore<Payload>();
    await seedEvent(outbox, "evt-2");
    const auditSeen: string[] = [];
    let notifyAttempts = 0;

    const flakyNotify: DomainEventConsumer<Payload> = {
      name: "notify",
      consume: async () => {
        notifyAttempts += 1;
        if (notifyAttempts === 1) throw new Error("notify transient failure");
      }
    };
    const consumers = [recordingConsumer("audit", auditSeen), flakyNotify];

    const first = await dispatchPendingOutboxEvents({
      outbox,
      externalCallPolicy: new ExternalCallPolicy(),
      maxAttempts: 3,
      consumers
    });
    expect(first).toMatchObject({ dispatched: 0, retried: 1, deadLettered: 0 });
    expect(outbox.readById("evt-2")?.dispatchStatus).toBe("pending");

    const second = await dispatchPendingOutboxEvents({
      outbox,
      externalCallPolicy: new ExternalCallPolicy(),
      maxAttempts: 3,
      consumers
    });
    expect(second).toMatchObject({ dispatched: 1, retried: 0, deadLettered: 0 });
    expect(outbox.readById("evt-2")?.dispatchStatus).toBe("dispatched");

    // The audit consumer was re-offered the event on retry — at-least-once —
    // which is exactly why consumers must be idempotent by eventId.
    expect(auditSeen).toEqual(["audit:evt-2", "audit:evt-2"]);
    expect(notifyAttempts).toBe(2);
  });

  it("dead-letters the event once attempts reach maxAttempts", async () => {
    const outbox = new SyntheticInMemoryOutboxStore<Payload>();
    await seedEvent(outbox, "evt-3");
    const alwaysFails: DomainEventConsumer<Payload> = {
      name: "broken",
      consume: async () => {
        throw new Error("permanent failure");
      }
    };

    await dispatchPendingOutboxEvents({
      outbox,
      externalCallPolicy: new ExternalCallPolicy(),
      maxAttempts: 2,
      consumers: [alwaysFails]
    });
    expect(outbox.readById("evt-3")?.dispatchStatus).toBe("pending");

    const second = await dispatchPendingOutboxEvents({
      outbox,
      externalCallPolicy: new ExternalCallPolicy(),
      maxAttempts: 2,
      consumers: [alwaysFails]
    });
    expect(second).toMatchObject({ deadLettered: 1 });
    expect(outbox.readById("evt-3")?.dispatchStatus).toBe("dead-lettered");
  });

  it("accepts a single publisher for backward compatibility (treated as one consumer)", async () => {
    const outbox = new SyntheticInMemoryOutboxStore<Payload>();
    await seedEvent(outbox, "evt-4");
    const published: string[] = [];

    const stats = await dispatchPendingOutboxEvents({
      outbox,
      externalCallPolicy: new ExternalCallPolicy(),
      maxAttempts: 3,
      publisher: { publish: async (event) => void published.push(event.eventId) }
    });

    expect(stats).toMatchObject({ dispatched: 1 });
    expect(published).toEqual(["evt-4"]);
  });

  it("throws when neither a publisher nor consumers are provided", async () => {
    const outbox = new SyntheticInMemoryOutboxStore<Payload>();
    await expect(
      dispatchPendingOutboxEvents({
        outbox,
        externalCallPolicy: new ExternalCallPolicy(),
        maxAttempts: 3
      })
    ).rejects.toThrow(/requires a publisher or at least one consumer/);
  });
});
