import { describe, expect, it } from "vitest";
import {
  beginWorkflowAttempt,
  createInitialWorkflowResilienceState,
  isWorkflowRetryDue,
  markWorkflowConnectionRestored,
  registerWorkflowSuccess,
  registerWorkflowTransientFailure
} from "./workflow-resilience.js";

describe("patient workflow resilience", () => {
  it("queues workflow when offline and schedules immediate retry after connection restore", () => {
    const initial = createInitialWorkflowResilienceState({
      workflowId: "wf-1",
      now: "2026-07-02T10:00:00.000Z"
    });

    const offlineQueued = beginWorkflowAttempt(initial, {
      now: "2026-07-02T10:00:10.000Z",
      connectionMode: "offline"
    });

    expect(offlineQueued.status).toBe("offline-queued");
    expect(offlineQueued.pendingDraftPersisted).toBe(true);

    const restored = markWorkflowConnectionRestored(
      offlineQueued,
      "2026-07-02T10:00:15.000Z"
    );

    expect(restored.status).toBe("retry-pending");
    expect(isWorkflowRetryDue(restored, "2026-07-02T10:00:15.000Z")).toBe(true);
  });

  it("uses deterministic backoff and fails after max attempts", () => {
    const initial = createInitialWorkflowResilienceState({
      workflowId: "wf-2",
      now: "2026-07-02T10:10:00.000Z",
      maxAttempts: 2
    });

    const attemptOne = beginWorkflowAttempt(initial, {
      now: "2026-07-02T10:10:01.000Z",
      connectionMode: "online"
    });
    const failedOne = registerWorkflowTransientFailure(attemptOne, {
      now: "2026-07-02T10:10:02.000Z",
      errorCode: "timeout",
      connectionMode: "degraded"
    });

    expect(failedOne.status).toBe("retry-pending");
    expect(failedOne.backoffMs).toBe(1000);
    expect(failedOne.nextRetryAt).toBe("2026-07-02T10:10:03.000Z");

    const attemptTwo = beginWorkflowAttempt(failedOne, {
      now: "2026-07-02T10:10:03.500Z",
      connectionMode: "online"
    });
    const failedTwo = registerWorkflowTransientFailure(attemptTwo, {
      now: "2026-07-02T10:10:04.000Z",
      errorCode: "timeout"
    });

    expect(failedTwo.status).toBe("failed");
    expect(failedTwo.nextRetryAt).toBeNull();
  });

  it("marks workflow successful and clears pending retry metadata", () => {
    const initial = createInitialWorkflowResilienceState({
      workflowId: "wf-3",
      now: "2026-07-02T10:20:00.000Z"
    });
    const attempt = beginWorkflowAttempt(initial, {
      now: "2026-07-02T10:20:01.000Z",
      connectionMode: "online"
    });
    const done = registerWorkflowSuccess(attempt, "2026-07-02T10:20:02.000Z");

    expect(done.status).toBe("succeeded");
    expect(done.pendingDraftPersisted).toBe(false);
    expect(done.nextRetryAt).toBeNull();
    expect(done.lastErrorCode).toBeNull();
  });
});
