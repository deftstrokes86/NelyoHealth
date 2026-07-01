import type { WorkerJobEnvelope, WorkerQueueProcessor } from "./worker-runtime.js";

export interface DeterministicSyntheticJobPayload extends Record<string, unknown> {
  syntheticTaskId: string;
  failUntilAttempt: number;
}

export interface DeterministicJobAuditEntry {
  syntheticTaskId: string;
  attempt: number;
  correlationId: string;
  status: "processing" | "completed";
}

export function buildDeterministicJobEnvelope(input: {
  syntheticTaskId: string;
  requestId: string;
  correlationId: string;
  idempotencyKey: string;
  operationTag: string;
  failUntilAttempt?: number;
  maxAttempts?: number;
}): WorkerJobEnvelope<DeterministicSyntheticJobPayload> {
  return {
    jobType: "synthetic.deterministic",
    safeContext: {
      requestId: input.requestId,
      correlationId: input.correlationId,
      idempotencyKey: input.idempotencyKey,
      operationTag: input.operationTag
    },
    payload: {
      syntheticTaskId: input.syntheticTaskId,
      failUntilAttempt: input.failUntilAttempt ?? 0
    },
    attempt: 1,
    maxAttempts: input.maxAttempts ?? 3,
    enqueuedAt: new Date().toISOString()
  };
}

export function createDeterministicJobProcessor(
  auditTrail: DeterministicJobAuditEntry[]
): WorkerQueueProcessor<DeterministicSyntheticJobPayload> {
  return async (envelope) => {
    auditTrail.push({
      syntheticTaskId: envelope.payload.syntheticTaskId,
      attempt: envelope.attempt,
      correlationId: envelope.safeContext.correlationId,
      status: "processing"
    });

    if (envelope.attempt <= envelope.payload.failUntilAttempt) {
      throw new Error(
        `Synthetic deterministic failure for ${envelope.payload.syntheticTaskId} at attempt ${envelope.attempt}.`
      );
    }

    auditTrail.push({
      syntheticTaskId: envelope.payload.syntheticTaskId,
      attempt: envelope.attempt,
      correlationId: envelope.safeContext.correlationId,
      status: "completed"
    });
  };
}
