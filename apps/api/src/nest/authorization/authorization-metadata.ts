import { SetMetadata } from "@nestjs/common";

/**
 * Declarative authorization metadata (roadmap M2.3).
 *
 * Routes declare their authorization posture with decorators rather than
 * embedding authorization logic in controllers/handlers. The mandatory PEP
 * guard (authorization.guard.ts) reads this metadata and enforces it before
 * any handler executes.
 *
 * Requirements here are PLATFORM-level only (session validity, auth level,
 * tenant context). No application/healthcare policy lives here.
 */

export const PUBLIC_ENDPOINT_KEY = "nelyo:public-endpoint";
export const AUTHORIZATION_REQUIREMENT_KEY = "nelyo:authorization-requirement";

export interface AuthorizationRequirement {
  /**
   * Require an elevated (MFA/step-up) session. A primary session receives a
   * challenge-required decision rather than a hard denial.
   */
  minAuthLevel?: "primary" | "elevated";
  /** Require a validated active organization tenant in the acting context. */
  requireActiveTenant?: boolean;
}

/**
 * Marks a route as public — the PEP guard bypasses authorization entirely.
 * This is the explicit, declarative public-endpoint allowlist. Use only for
 * routes that legitimately need no principal (liveness/readiness, synthetic
 * operational probes, unauthenticated authentication flows, docs).
 */
export const Public = (): MethodDecorator & ClassDecorator =>
  SetMetadata(PUBLIC_ENDPOINT_KEY, true);

/**
 * Declares platform authorization requirements for a protected route. Absent
 * an explicit requirement, protected routes still require an authenticated,
 * valid (non-revoked, non-stale) session — enforced by the guard by default.
 */
export const Authorize = (
  requirement: AuthorizationRequirement = {}
): MethodDecorator & ClassDecorator => SetMetadata(AUTHORIZATION_REQUIREMENT_KEY, requirement);
