import type { RateLimitDecision, RateLimitRule, RateLimitStore } from "./rate-limit-store.js";

/**
 * Narrow Valkey command surface the store needs: atomically increment a key's
 * counter and (on first hit) set its window expiry, returning the new count.
 */
export interface ValkeyRateLimitClient {
  incrementInWindow(key: string, windowMs: number): Promise<number>;
}

/**
 * Valkey-backed fixed-window store (roadmap M7). Shared across API instances so a
 * limit holds regardless of which node serves a request. Any transport error
 * propagates so the ResilientRateLimiter can degrade to the in-process fallback.
 */
export class ValkeyRateLimitStore implements RateLimitStore {
  constructor(private readonly client: ValkeyRateLimitClient) {}

  async hit(key: string, rule: RateLimitRule): Promise<RateLimitDecision> {
    const count = await this.client.incrementInWindow(`ratelimit:${key}`, rule.windowMs);
    const allowed = count <= rule.limit;
    return {
      allowed,
      retryAfterSeconds: allowed ? 0 : Math.max(1, Math.ceil(rule.windowMs / 1000))
    };
  }
}
