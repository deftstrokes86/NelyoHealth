import type { RateLimitDecision, RateLimitRule, RateLimitStore } from "./rate-limit-store.js";

/**
 * Resilient rate limiter (roadmap M7, ADR-0014).
 *
 * Uses a primary store (Valkey) and DEGRADES to a fallback (in-process) when the
 * primary errors — logging/alerting on the transition. It never fails open and
 * never throws through: a primary outage becomes conservative in-process limiting,
 * not "no limiting". After a primary error it stays on the fallback for a short
 * cooldown rather than hammering a dead backend on every request.
 */
const DEGRADE_COOLDOWN_MS = 10_000;

export class ResilientRateLimiter implements RateLimitStore {
  private degradedUntil = 0;

  constructor(
    private readonly primary: RateLimitStore,
    private readonly fallback: RateLimitStore,
    private readonly onDegrade: (error: unknown) => void = () => {}
  ) {}

  async hit(key: string, rule: RateLimitRule): Promise<RateLimitDecision> {
    const now = Date.now();
    if (now < this.degradedUntil) {
      return this.fallback.hit(key, rule);
    }
    try {
      return await this.primary.hit(key, rule);
    } catch (error) {
      this.degradedUntil = now + DEGRADE_COOLDOWN_MS;
      this.onDegrade(error);
      // Conservative: still enforce, via the fallback — never unlimited, never a 500.
      return this.fallback.hit(key, rule);
    }
  }
}
