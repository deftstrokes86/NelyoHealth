import { describe, expect, it, vi } from "vitest";
import {
  InProcessRateLimitStore,
  type RateLimitStore
} from "../../apps/api/src/nest/rate-limit/rate-limit-store.js";
import { ResilientRateLimiter } from "../../apps/api/src/nest/rate-limit/resilient-rate-limiter.js";

/**
 * M7, ADR-0014 Ruling 2: when the primary (Valkey) store is unreachable the limiter
 * must DEGRADE to a conservative in-process limiter — never fail open (unlimited) and
 * never hard-fail (throw) — and log the degradation. A limiter that silently
 * disappears when its backend dies is how brute-force windows open in an incident.
 */
describe("ResilientRateLimiter degradation", () => {
  const rule = { limit: 2, windowMs: 60_000 };

  it("uses the primary when it is healthy", async () => {
    const primary: RateLimitStore = {
      hit: vi.fn().mockResolvedValue({ allowed: true, retryAfterSeconds: 0 })
    };
    const limiter = new ResilientRateLimiter(primary, new InProcessRateLimitStore());
    await limiter.hit("k", rule);
    expect(primary.hit).toHaveBeenCalledTimes(1);
  });

  it("falls back to in-process enforcement (not unlimited, not a throw) when the primary errors, and logs", async () => {
    const primary: RateLimitStore = {
      hit: vi.fn().mockRejectedValue(new Error("valkey unreachable"))
    };
    const onDegrade = vi.fn();
    const limiter = new ResilientRateLimiter(primary, new InProcessRateLimitStore(), onDegrade);

    const first = await limiter.hit("brute-key", rule);
    const second = await limiter.hit("brute-key", rule);
    const third = await limiter.hit("brute-key", rule);

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(false); // NOT fail-open
    expect(third.retryAfterSeconds).toBeGreaterThan(0);
    expect(onDegrade).toHaveBeenCalled();
  });

  it("stays on the fallback for a cooldown rather than hammering a dead primary each hit", async () => {
    const primary: RateLimitStore = {
      hit: vi.fn().mockRejectedValue(new Error("down"))
    };
    const limiter = new ResilientRateLimiter(primary, new InProcessRateLimitStore());
    await limiter.hit("k", rule);
    await limiter.hit("k", rule);
    await limiter.hit("k", rule);
    expect(primary.hit).toHaveBeenCalledTimes(1);
  });
});
