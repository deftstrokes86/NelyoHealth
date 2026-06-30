import {
  buildQueueFingerprint,
  type QueueAdapter,
  type QueueDeadLetterEntry,
  type QueueEnqueueResult,
  type QueueHealthSnapshot,
  type QueueJobEnvelope,
  type QueueProcessResult,
  type QueueProcessor
} from "./queue-envelope.js";

export class SyntheticQueueAdapter<TPayload> implements QueueAdapter<TPayload> {
  private readonly waiting: Array<QueueJobEnvelope<TPayload>> = [];
  private readonly deadLetters: Array<QueueDeadLetterEntry<TPayload>> = [];
  private readonly seenFingerprints = new Set<string>();

  private readonly counters: QueueHealthSnapshot = {
    waiting: 0,
    processed: 0,
    completed: 0,
    retried: 0,
    deadLettered: 0,
    deduplicated: 0
  };

  async enqueue(envelope: QueueJobEnvelope<TPayload>): Promise<QueueEnqueueResult> {
    const fingerprint = buildQueueFingerprint(envelope);
    if (this.seenFingerprints.has(fingerprint)) {
      this.counters.deduplicated += 1;
      return {
        accepted: false,
        deduplicated: true,
        fingerprint
      };
    }

    this.seenFingerprints.add(fingerprint);
    this.waiting.push(envelope);
    this.syncWaitingCount();

    return {
      accepted: true,
      deduplicated: false,
      fingerprint
    };
  }

  async processNext(
    processor: QueueProcessor<TPayload>
  ): Promise<QueueProcessResult<TPayload>> {
    const envelope = this.waiting.shift();
    this.syncWaitingCount();

    if (!envelope) {
      return {
        status: "empty"
      };
    }

    this.counters.processed += 1;

    try {
      await processor(envelope);
      this.counters.completed += 1;
      return {
        status: "completed",
        envelope
      };
    } catch (error) {
      const reason = toErrorReason(error);
      if (envelope.attempt < envelope.maxAttempts) {
        const retriedEnvelope: QueueJobEnvelope<TPayload> = {
          ...envelope,
          attempt: envelope.attempt + 1
        };
        this.waiting.push(retriedEnvelope);
        this.syncWaitingCount();
        this.counters.retried += 1;

        return {
          status: "retried",
          envelope,
          reason,
          nextAttempt: retriedEnvelope.attempt
        };
      }

      this.deadLetters.push({
        envelope,
        failedAt: new Date().toISOString(),
        reason
      });
      this.counters.deadLettered += 1;

      return {
        status: "dead-lettered",
        envelope,
        reason
      };
    }
  }

  async drain(
    processor: QueueProcessor<TPayload>,
    maxIterations = 100
  ): Promise<QueueProcessResult<TPayload>[]> {
    const results: QueueProcessResult<TPayload>[] = [];

    for (let iteration = 0; iteration < maxIterations; iteration += 1) {
      const result = await this.processNext(processor);
      results.push(result);
      if (result.status === "empty") {
        break;
      }
    }

    return results;
  }

  async readDeadLetters(): Promise<QueueDeadLetterEntry<TPayload>[]> {
    return [...this.deadLetters];
  }

  async getHealthSnapshot(): Promise<QueueHealthSnapshot> {
    return {
      ...this.counters,
      waiting: this.waiting.length
    };
  }

  private syncWaitingCount(): void {
    this.counters.waiting = this.waiting.length;
  }
}

function toErrorReason(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Queue processor failed for an unknown reason.";
}
