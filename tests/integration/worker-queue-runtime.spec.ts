import { describe, expect, it } from "vitest";
import { SyntheticQueueAdapter } from "../../packages/platform-adapters/src/index.js";
import {
  buildDeterministicJobEnvelope,
  createDeterministicJobProcessor,
  type DeterministicJobAuditEntry,
  type DeterministicSyntheticJobPayload,
  WorkerQueueRuntime
} from "../../apps/worker/src/index.js";

describe("worker queue runtime foundation", () => {
  it("processes a synthetic job with deterministic retry and correlation propagation", async () => {
    const adapter = new SyntheticQueueAdapter<DeterministicSyntheticJobPayload>();
    const runtime = new WorkerQueueRuntime<DeterministicSyntheticJobPayload>(adapter);
    const auditTrail: DeterministicJobAuditEntry[] = [];

    const enqueueResult = await runtime.enqueueJob(
      buildDeterministicJobEnvelope({
        syntheticTaskId: "task-retry-once",
        requestId: "req-iss007-1",
        correlationId: "corr-iss007-1",
        idempotencyKey: "idem-iss007-1",
        operationTag: "worker.synthetic.retry",
        failUntilAttempt: 1,
        maxAttempts: 3
      })
    );

    expect(enqueueResult).toMatchObject({
      accepted: true,
      deduplicated: false
    });

    const results = await runtime.runUntilIdle(createDeterministicJobProcessor(auditTrail));
    const statuses = results.map((entry) => entry.status);

    expect(statuses).toEqual(["retried", "completed", "empty"]);
    expect(auditTrail).toMatchObject([
      {
        syntheticTaskId: "task-retry-once",
        attempt: 1,
        correlationId: "corr-iss007-1",
        status: "processing"
      },
      {
        syntheticTaskId: "task-retry-once",
        attempt: 2,
        correlationId: "corr-iss007-1",
        status: "processing"
      },
      {
        syntheticTaskId: "task-retry-once",
        attempt: 2,
        correlationId: "corr-iss007-1",
        status: "completed"
      }
    ]);

    const health = await runtime.getHealthSnapshot();
    expect(health).toMatchObject({
      waiting: 0,
      processed: 2,
      completed: 1,
      retried: 1,
      deadLettered: 0,
      deduplicated: 0
    });
  });

  it("moves terminal failures to dead-letter queue after max attempts", async () => {
    const adapter = new SyntheticQueueAdapter<DeterministicSyntheticJobPayload>();
    const runtime = new WorkerQueueRuntime<DeterministicSyntheticJobPayload>(adapter);

    await runtime.enqueueJob(
      buildDeterministicJobEnvelope({
        syntheticTaskId: "task-dead-letter",
        requestId: "req-iss007-2",
        correlationId: "corr-iss007-2",
        idempotencyKey: "idem-iss007-2",
        operationTag: "worker.synthetic.dead-letter",
        failUntilAttempt: 5,
        maxAttempts: 2
      })
    );

    await runtime.runUntilIdle(createDeterministicJobProcessor([]));
    const deadLetters = await runtime.getDeadLetters();

    expect(deadLetters).toHaveLength(1);
    expect(deadLetters[0]).toMatchObject({
      envelope: {
        jobType: "synthetic.deterministic",
        attempt: 2,
        safeContext: {
          correlationId: "corr-iss007-2"
        }
      }
    });
    expect(deadLetters[0].reason).toContain("Synthetic deterministic failure");

    const health = await runtime.getHealthSnapshot();
    expect(health.deadLettered).toBe(1);
  });

  it("deduplicates by job type and idempotency key", async () => {
    const adapter = new SyntheticQueueAdapter<DeterministicSyntheticJobPayload>();
    const runtime = new WorkerQueueRuntime<DeterministicSyntheticJobPayload>(adapter);

    const envelope = buildDeterministicJobEnvelope({
      syntheticTaskId: "task-idempotent",
      requestId: "req-iss007-3",
      correlationId: "corr-iss007-3",
      idempotencyKey: "idem-iss007-3",
      operationTag: "worker.synthetic.idempotent",
      failUntilAttempt: 0,
      maxAttempts: 2
    });

    const first = await runtime.enqueueJob(envelope);
    const second = await runtime.enqueueJob({
      ...envelope,
      enqueuedAt: new Date(Date.now() + 1000).toISOString()
    });

    expect(first.accepted).toBe(true);
    expect(second).toMatchObject({
      accepted: false,
      deduplicated: true
    });

    await runtime.runUntilIdle(createDeterministicJobProcessor([]));
    const health = await runtime.getHealthSnapshot();

    expect(health.completed).toBe(1);
    expect(health.deduplicated).toBe(1);
  });
});
