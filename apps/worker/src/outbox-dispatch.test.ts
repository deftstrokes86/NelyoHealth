import { describe, expect, it, vi } from "vitest";
import { createOutboxDispatchRunner } from "./outbox-dispatch.js";

describe("createOutboxDispatchRunner", () => {
  it("runs a dispatch cycle and logs only when something was dispatched", async () => {
    const log = vi.fn();
    const runner = createOutboxDispatchRunner({
      runDispatch: async () => ({ dispatched: 2, retried: 1, deadLettered: 0 }),
      log
    });
    await runner.tick();
    expect(log).toHaveBeenCalledWith("outbox-dispatch", {
      dispatched: 2,
      retried: 1,
      deadLettered: 0
    });
  });

  it("stays quiet when there was nothing to dispatch", async () => {
    const log = vi.fn();
    const runner = createOutboxDispatchRunner({
      runDispatch: async () => ({ dispatched: 0, retried: 0, deadLettered: 0 }),
      log
    });
    await runner.tick();
    expect(log).not.toHaveBeenCalled();
  });

  it("is resilient — a dispatch failure is logged, not thrown (the worker keeps running)", async () => {
    const log = vi.fn();
    const runner = createOutboxDispatchRunner({
      runDispatch: async () => {
        throw new Error("database unavailable");
      },
      log
    });
    await expect(runner.tick()).resolves.toBeUndefined();
    expect(log).toHaveBeenCalledWith("outbox-dispatch-error", { reason: "database unavailable" });
  });
});
