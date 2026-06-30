export interface QueueJobSafeContext {
  requestId: string;
  correlationId: string;
  idempotencyKey: string;
  operationTag: string;
}

export interface QueueJobEnvelope<TPayload> {
  jobType: string;
  safeContext: QueueJobSafeContext;
  payload: TPayload;
  attempt: number;
  maxAttempts: number;
  enqueuedAt: string;
}

export interface QueueDeadLetterEntry<TPayload> {
  envelope: QueueJobEnvelope<TPayload>;
  failedAt: string;
  reason: string;
}

export interface QueueHealthSnapshot {
  waiting: number;
  processed: number;
  completed: number;
  retried: number;
  deadLettered: number;
  deduplicated: number;
}

export interface QueueEnqueueResult {
  accepted: boolean;
  deduplicated: boolean;
  fingerprint: string;
}

export type QueueProcessor<TPayload> = (
  envelope: QueueJobEnvelope<TPayload>
) => Promise<void>;

export type QueueProcessResult<TPayload> =
  | {
      status: "empty";
    }
  | {
      status: "completed";
      envelope: QueueJobEnvelope<TPayload>;
    }
  | {
      status: "retried";
      envelope: QueueJobEnvelope<TPayload>;
      reason: string;
      nextAttempt: number;
    }
  | {
      status: "dead-lettered";
      envelope: QueueJobEnvelope<TPayload>;
      reason: string;
    };

export interface QueueAdapter<TPayload> {
  enqueue(envelope: QueueJobEnvelope<TPayload>): Promise<QueueEnqueueResult>;
  processNext(processor: QueueProcessor<TPayload>): Promise<QueueProcessResult<TPayload>>;
  drain(processor: QueueProcessor<TPayload>, maxIterations?: number): Promise<QueueProcessResult<TPayload>[]>;
  readDeadLetters(): Promise<QueueDeadLetterEntry<TPayload>[]>;
  getHealthSnapshot(): Promise<QueueHealthSnapshot>;
}

export function buildQueueFingerprint<TPayload>(
  envelope: QueueJobEnvelope<TPayload>
): string {
  return `${envelope.jobType}::${envelope.safeContext.idempotencyKey}`;
}
