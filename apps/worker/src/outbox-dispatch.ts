/**
 * Outbox dispatch runner (roadmap M3.3).
 *
 * Wraps a dispatch cycle in a resilient tick the long-lived worker calls on an
 * interval. A dispatch failure (e.g. the database being briefly unavailable)
 * must never crash the worker process — it is logged and the next tick retries.
 * The dispatch mechanics (fan-out to consumers, retry/DLQ) live in
 * @nelyohealth/database dispatchPendingOutboxEvents (M3.2); this is the runtime
 * seam that drives them.
 */

export interface OutboxDispatchStats {
  dispatched: number;
  retried: number;
  deadLettered: number;
}

export interface OutboxDispatchRunnerDeps {
  runDispatch: () => Promise<OutboxDispatchStats>;
  log: (message: string, extra?: Record<string, unknown>) => void;
}

export interface OutboxDispatchRunner {
  tick(): Promise<void>;
}

export function createOutboxDispatchRunner(deps: OutboxDispatchRunnerDeps): OutboxDispatchRunner {
  return {
    tick: async () => {
      try {
        const stats = await deps.runDispatch();
        if (stats.dispatched > 0 || stats.retried > 0 || stats.deadLettered > 0) {
          deps.log("outbox-dispatch", { ...stats });
        }
      } catch (error) {
        deps.log("outbox-dispatch-error", {
          reason: error instanceof Error ? error.message : String(error)
        });
      }
    }
  };
}
