export type WorkflowConnectionMode = "online" | "degraded" | "offline";

export type WorkflowExecutionStatus =
  | "idle"
  | "loading"
  | "retry-pending"
  | "offline-queued"
  | "succeeded"
  | "failed";

export interface WorkflowResilienceState {
  workflowId: string;
  status: WorkflowExecutionStatus;
  connectionMode: WorkflowConnectionMode;
  attemptCount: number;
  maxAttempts: number;
  nextRetryAt: string | null;
  backoffMs: number;
  pendingDraftPersisted: boolean;
  lastErrorCode: string | null;
  lastUpdatedAt: string;
}

export interface CreateWorkflowResilienceStateInput {
  workflowId: string;
  now: string;
  maxAttempts?: number;
}

export interface WorkflowFailureInput {
  now: string;
  errorCode: string;
  connectionMode?: WorkflowConnectionMode;
}

export interface WorkflowAttemptInput {
  now: string;
  connectionMode: WorkflowConnectionMode;
}

export function createInitialWorkflowResilienceState(
  input: CreateWorkflowResilienceStateInput
): WorkflowResilienceState {
  return {
    workflowId: input.workflowId,
    status: "idle",
    connectionMode: "online",
    attemptCount: 0,
    maxAttempts: input.maxAttempts ?? 3,
    nextRetryAt: null,
    backoffMs: 0,
    pendingDraftPersisted: false,
    lastErrorCode: null,
    lastUpdatedAt: input.now
  };
}

function computeRetryBackoffMs(attemptCount: number): number {
  const unclamped = 1_000 * 2 ** Math.max(0, attemptCount - 1);
  return Math.min(unclamped, 30_000);
}

function toIsoWithOffset(now: string, offsetMs: number): string {
  const date = new Date(now);
  return new Date(date.getTime() + offsetMs).toISOString();
}

export function beginWorkflowAttempt(
  state: WorkflowResilienceState,
  input: WorkflowAttemptInput
): WorkflowResilienceState {
  if (input.connectionMode === "offline") {
    return {
      ...state,
      status: "offline-queued",
      connectionMode: "offline",
      pendingDraftPersisted: true,
      nextRetryAt: input.now,
      lastUpdatedAt: input.now
    };
  }

  return {
    ...state,
    status: "loading",
    connectionMode: input.connectionMode,
    attemptCount: state.attemptCount + 1,
    pendingDraftPersisted: state.pendingDraftPersisted,
    nextRetryAt: null,
    lastUpdatedAt: input.now
  };
}

export function registerWorkflowTransientFailure(
  state: WorkflowResilienceState,
  input: WorkflowFailureInput
): WorkflowResilienceState {
  const connectionMode = input.connectionMode ?? state.connectionMode;
  const retryable = state.attemptCount < state.maxAttempts;
  if (!retryable) {
    return {
      ...state,
      status: "failed",
      connectionMode,
      nextRetryAt: null,
      lastErrorCode: input.errorCode,
      lastUpdatedAt: input.now
    };
  }

  const backoffMs = computeRetryBackoffMs(state.attemptCount);
  const nextRetryAt = connectionMode === "offline" ? input.now : toIsoWithOffset(input.now, backoffMs);

  return {
    ...state,
    status: connectionMode === "offline" ? "offline-queued" : "retry-pending",
    connectionMode,
    backoffMs,
    nextRetryAt,
    pendingDraftPersisted: true,
    lastErrorCode: input.errorCode,
    lastUpdatedAt: input.now
  };
}

export function markWorkflowConnectionRestored(
  state: WorkflowResilienceState,
  now: string
): WorkflowResilienceState {
  if (state.status !== "offline-queued") {
    return state;
  }

  return {
    ...state,
    status: "retry-pending",
    connectionMode: "online",
    nextRetryAt: now,
    lastUpdatedAt: now
  };
}

export function isWorkflowRetryDue(state: WorkflowResilienceState, now: string): boolean {
  if (state.status !== "retry-pending") {
    return false;
  }
  if (!state.nextRetryAt) {
    return false;
  }
  return new Date(now).getTime() >= new Date(state.nextRetryAt).getTime();
}

export function registerWorkflowSuccess(
  state: WorkflowResilienceState,
  now: string
): WorkflowResilienceState {
  return {
    ...state,
    status: "succeeded",
    connectionMode: "online",
    nextRetryAt: null,
    backoffMs: 0,
    pendingDraftPersisted: false,
    lastErrorCode: null,
    lastUpdatedAt: now
  };
}