/**
 * Rate-limit store port (roadmap M7, ADR-0014 edge hygiene).
 *
 * A fixed-window counter behind a narrow interface so the backend is swappable:
 * Valkey in production (shared across instances), an in-process map as the
 * conservative fallback when Valkey is unreachable. The limiter must never fail
 * OPEN (unlimited) nor hard-fail (500) — a limiter that disappears when its backend
 * dies is how brute-force windows open during an incident.
 */
export interface RateLimitRule {
  limit: number;
  windowMs: number;
}

export interface RateLimitDecision {
  allowed: boolean;
  retryAfterSeconds: number;
}

export interface RateLimitStore {
  hit(key: string, rule: RateLimitRule): Promise<RateLimitDecision>;
}

/** In-process fixed-window counter. The fallback (and fine for a single instance). */
export class InProcessRateLimitStore implements RateLimitStore {
  private readonly windows = new Map<string, { count: number; resetAt: number }>();

  async hit(key: string, rule: RateLimitRule): Promise<RateLimitDecision> {
    const now = Date.now();
    let window = this.windows.get(key);
    if (!window || now >= window.resetAt) {
      window = { count: 0, resetAt: now + rule.windowMs };
      this.windows.set(key, window);
    }
    window.count += 1;
    // Opportunistic cleanup so the map cannot grow unbounded across many keys.
    if (this.windows.size > 10_000) {
      for (const [candidateKey, candidate] of this.windows) {
        if (now >= candidate.resetAt) this.windows.delete(candidateKey);
      }
    }
    const allowed = window.count <= rule.limit;
    return {
      allowed,
      retryAfterSeconds: allowed ? 0 : Math.max(1, Math.ceil((window.resetAt - now) / 1000))
    };
  }
}
