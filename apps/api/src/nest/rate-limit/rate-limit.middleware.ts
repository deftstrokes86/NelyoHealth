import { Injectable, type NestMiddleware } from "@nestjs/common";
import type { NextFunction, Response } from "express";
import type { ApiRequestWithContext } from "../request-context.middleware.js";
import { createMeta } from "../api-envelope.js";
import {
  InProcessRateLimitStore,
  type RateLimitRule,
  type RateLimitStore
} from "./rate-limit-store.js";
import { ResilientRateLimiter } from "./resilient-rate-limiter.js";
import { ValkeyRateLimitStore } from "./valkey-rate-limit-store.js";
import { NetValkeyRateLimitClient } from "./valkey-resp-client.js";

/**
 * Boundary rate limiter (roadmap M7, ADR-0014). Tiered before the PEP guard:
 *  - pre-auth endpoints (/api/auth/*): strict PER-IP (brute-force + enumeration
 *    surface; pairs with the already-non-enumerating login failure);
 *  - everything else: moderate per-session (or per-IP when unauthenticated).
 * Valkey-backed (shared across instances) with a conservative in-process fallback:
 * if Valkey is unreachable the limiter degrades and logs — it never stops limiting.
 * 429 carries Retry-After and a uniform body (the limiter must not be an oracle).
 */
const WINDOW_MS = 60_000;
const AUTH_ENDPOINT_RULE: RateLimitRule = { limit: 100, windowMs: WINDOW_MS };
const AUTHENTICATED_RULE: RateLimitRule = { limit: 2_000, windowMs: WINDOW_MS };

function buildLimiter(): RateLimitStore {
  const host = process.env.NELYO_VALKEY_HOST ?? "127.0.0.1";
  const port = Number.parseInt(process.env.NELYO_LOCAL_VALKEY_PORT ?? "56379", 10);
  const primary = new ValkeyRateLimitStore(new NetValkeyRateLimitClient(host, port));
  const fallback = new InProcessRateLimitStore();
  return new ResilientRateLimiter(primary, fallback, (error) => {
    // Structured, secret-free degradation signal for log-based alerting.
    console.warn(
      `[rate-limit] Valkey unreachable — degraded to in-process limiter: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  });
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly limiter: RateLimitStore = buildLimiter();

  async use(req: ApiRequestWithContext, res: Response, next: NextFunction): Promise<void> {
    const isAuthEndpoint = req.path.startsWith("/api/auth/");
    const rule = isAuthEndpoint ? AUTH_ENDPOINT_RULE : AUTHENTICATED_RULE;
    const key = isAuthEndpoint
      ? `auth:ip:${clientIp(req)}`
      : `api:${sessionKey(req) ?? `ip:${clientIp(req)}`}`;

    const decision = await this.limiter.hit(key, rule);
    if (!decision.allowed) {
      res.setHeader("Retry-After", String(decision.retryAfterSeconds));
      res.status(429).json({
        data: null,
        meta: createMeta(
          req.requestId ?? "missing-request-id",
          req.correlationId ?? "missing-correlation-id",
          "api.rate-limit",
          "rate-limited"
        ),
        errors: [{ code: "RATE_LIMITED", message: "Too many requests." }]
      });
      return;
    }
    next();
  }
}

function clientIp(req: ApiRequestWithContext): string {
  return req.ip ?? req.socket?.remoteAddress ?? "unknown";
}

/** An opaque session credential keys the per-session bucket (used as a key, never logged). */
function sessionKey(req: ApiRequestWithContext): string | null {
  const authorization = req.header("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    const token = authorization.slice("bearer ".length).trim();
    return token ? `session:${token}` : null;
  }
  const sessionHeader = req.header("x-nelyo-session");
  return sessionHeader ? `session:${sessionHeader.trim()}` : null;
}
