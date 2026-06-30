export interface WorkerJobSafeContext {
  requestId: string;
  correlationId: string;
  idempotencyKey: string;
  operationTag: string;
}

export interface WorkerJobEnvelope<TPayload> {
  jobType: string;
  safeContext: WorkerJobSafeContext;
  payload: TPayload;
  attempt: number;
  maxAttempts: number;
  enqueuedAt: string;
}

export interface WorkerDeadLetterEntry<TPayload> {
  envelope: WorkerJobEnvelope<TPayload>;
  failedAt: string;
  reason: string;
}

export interface WorkerQueueHealthSnapshot {
  waiting: number;
  processed: number;
  completed: number;
  retried: number;
  deadLettered: number;
  deduplicated: number;
}

export type WorkerQueueProcessor<TPayload> = (
  envelope: WorkerJobEnvelope<TPayload>
) => Promise<void>;

export type WorkerQueueProcessResult<TPayload> =
  | {
      status: "empty";
    }
  | {
      status: "completed";
      envelope: WorkerJobEnvelope<TPayload>;
    }
  | {
      status: "retried";
      envelope: WorkerJobEnvelope<TPayload>;
      reason: string;
      nextAttempt: number;
    }
  | {
      status: "dead-lettered";
      envelope: WorkerJobEnvelope<TPayload>;
      reason: string;
    };

export interface WorkerQueuePort<TPayload> {
  enqueue(envelope: WorkerJobEnvelope<TPayload>): Promise<{
    accepted: boolean;
    deduplicated: boolean;
    fingerprint: string;
  }>;
  processNext(
    processor: WorkerQueueProcessor<TPayload>
  ): Promise<WorkerQueueProcessResult<TPayload>>;
  drain(
    processor: WorkerQueueProcessor<TPayload>,
    maxIterations?: number
  ): Promise<WorkerQueueProcessResult<TPayload>[]>;
  readDeadLetters(): Promise<WorkerDeadLetterEntry<TPayload>[]>;
  getHealthSnapshot(): Promise<WorkerQueueHealthSnapshot>;
}

const forbiddenPayloadKeyFragments = [
  "phi",
  "clinical",
  "secret",
  "password",
  "token",
  "provideraddress",
  "providernpi",
  "paymentcard"
] as const;

export class WorkerQueueRuntime<TPayload extends Record<string, unknown>> {
  constructor(private readonly queue: WorkerQueuePort<TPayload>) {}

  async enqueueJob(envelope: WorkerJobEnvelope<TPayload>): Promise<{
    accepted: boolean;
    deduplicated: boolean;
    fingerprint: string;
  }> {
    assertSafeSyntheticEnvelope(envelope);
    return this.queue.enqueue(envelope);
  }

  async processNext(
    processor: WorkerQueueProcessor<TPayload>
  ): Promise<WorkerQueueProcessResult<TPayload>> {
    return this.queue.processNext(processor);
  }

  async runUntilIdle(
    processor: WorkerQueueProcessor<TPayload>,
    maxIterations = 100
  ): Promise<WorkerQueueProcessResult<TPayload>[]> {
    return this.queue.drain(processor, maxIterations);
  }

  async getDeadLetters(): Promise<WorkerDeadLetterEntry<TPayload>[]> {
    return this.queue.readDeadLetters();
  }

  async getHealthSnapshot(): Promise<WorkerQueueHealthSnapshot> {
    return this.queue.getHealthSnapshot();
  }
}

export function assertSafeSyntheticEnvelope<TPayload extends Record<string, unknown>>(
  envelope: WorkerJobEnvelope<TPayload>
): void {
  if (!envelope.safeContext.correlationId || !envelope.safeContext.idempotencyKey) {
    throw new Error("Worker job envelope requires correlationId and idempotencyKey.");
  }

  for (const key of Object.keys(envelope.payload)) {
    const normalized = key.toLowerCase();
    for (const fragment of forbiddenPayloadKeyFragments) {
      if (normalized.includes(fragment)) {
        throw new Error(
          `Worker payload key '${key}' violates synthetic-safety constraints for queue jobs.`
        );
      }
    }
  }
}
