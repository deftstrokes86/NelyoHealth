import { describe, expect, it } from "vitest";
import { SyntheticQueueAdapter } from "../../packages/platform-adapters/src/index.js";
import {
  assertSafeSyntheticEnvelope,
  buildDeterministicJobEnvelope,
  type DeterministicSyntheticJobPayload,
  WorkerQueueRuntime
} from "../../apps/worker/src/index.js";

describe("worker queue envelope safety", () => {
  it("rejects payload keys that imply sensitive data", async () => {
    const runtime = new WorkerQueueRuntime<DeterministicSyntheticJobPayload>(
      new SyntheticQueueAdapter<DeterministicSyntheticJobPayload>()
    );

    const unsafeEnvelope = {
      ...buildDeterministicJobEnvelope({
        syntheticTaskId: "task-unsafe",
        requestId: "req-unsafe",
        correlationId: "corr-unsafe",
        idempotencyKey: "idem-unsafe",
        operationTag: "worker.synthetic.safety"
      }),
      payload: {
        syntheticTaskId: "task-unsafe",
        failUntilAttempt: 0,
        providerAddress: "never-allowed"
      }
    };

    await expect(runtime.enqueueJob(unsafeEnvelope as never)).rejects.toThrow(
      /violates synthetic-safety constraints/
    );
  });

  it("accepts a deterministic synthetic envelope with safe keys", () => {
    const envelope = buildDeterministicJobEnvelope({
      syntheticTaskId: "task-safe",
      requestId: "req-safe",
      correlationId: "corr-safe",
      idempotencyKey: "idem-safe",
      operationTag: "worker.synthetic.safety"
    });

    expect(() => assertSafeSyntheticEnvelope(envelope)).not.toThrow();
  });
});
