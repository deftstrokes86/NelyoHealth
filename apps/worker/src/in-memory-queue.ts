import type {
  WorkerDeadLetterEntry,
  WorkerJobEnvelope,
  WorkerQueueHealthSnapshot,
  WorkerQueuePort,
  WorkerQueueProcessResult,
  WorkerQueueProcessor
} from "./worker-runtime.js";

/**
 * Deterministic in-memory WorkerQueuePort.
 *
 * Baseline implementation backing the long-lived worker process and tests.
 * The Redis-compatible backplane binding (ADR-P02-003) replaces this behind
 * the same port when the event dispatcher lands (roadmap M3.x); the port
 * contract — dedupe by idempotency fingerprint, bounded retry, dead-letter —
 * is identical.
 */
export class InMemoryWorkerQueue<TPayload extends Record<string, unknown>>
  implements WorkerQueuePort<TPayload>
{
  private readonly waiting: WorkerJobEnvelope<TPayload>[] = [];
  private readonly deadLetters: WorkerDeadLetterEntry<TPayload>[] = [];
  private readonly seenFingerprints = new Set<string>();
  private processed = 0;
  private completed = 0;
  private retried = 0;
  private deduplicated = 0;

  async enqueue(envelope: WorkerJobEnvelope<TPayload>): Promise<{
    accepted: boolean;
    deduplicated: boolean;
    fingerprint: string;
  }> {
    const fingerprint = `${envelope.jobType}:${envelope.safeContext.idempotencyKey}`;
    if (this.seenFingerprints.has(fingerprint)) {
      this.deduplicated += 1;
      return { accepted: false, deduplicated: true, fingerprint };
    }
    this.seenFingerprints.add(fingerprint);
    this.waiting.push(envelope);
    return { accepted: true, deduplicated: false, fingerprint };
  }

  async processNext(
    processor: WorkerQueueProcessor<TPayload>
  ): Promise<WorkerQueueProcessResult<TPayload>> {
    const envelope = this.waiting.shift();
    if (!envelope) {
      return { status: "empty" };
    }
    this.processed += 1;
    try {
      await processor(envelope);
      this.completed += 1;
      return { status: "completed", envelope };
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      const nextAttempt = envelope.attempt + 1;
      if (nextAttempt >= envelope.maxAttempts) {
        this.deadLetters.push({
          envelope,
          failedAt: new Date().toISOString(),
          reason
        });
        return { status: "dead-lettered", envelope, reason };
      }
      this.retried += 1;
      this.waiting.push({ ...envelope, attempt: nextAttempt });
      return { status: "retried", envelope, reason, nextAttempt };
    }
  }

  async drain(
    processor: WorkerQueueProcessor<TPayload>,
    maxIterations = 100
  ): Promise<WorkerQueueProcessResult<TPayload>[]> {
    const results: WorkerQueueProcessResult<TPayload>[] = [];
    for (let iteration = 0; iteration < maxIterations; iteration += 1) {
      const result = await this.processNext(processor);
      results.push(result);
      if (result.status === "empty") break;
    }
    return results;
  }

  async readDeadLetters(): Promise<WorkerDeadLetterEntry<TPayload>[]> {
    return [...this.deadLetters];
  }

  async getHealthSnapshot(): Promise<WorkerQueueHealthSnapshot> {
    return {
      waiting: this.waiting.length,
      processed: this.processed,
      completed: this.completed,
      retried: this.retried,
      deadLettered: this.deadLetters.length,
      deduplicated: this.deduplicated
    };
  }
}
