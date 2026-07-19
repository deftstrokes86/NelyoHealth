import type { ActingContext } from "../../acting-context-resolver.js";
import type { AuthorizationRequirement } from "./authorization-metadata.js";

/**
 * Centralized platform Policy Decision Point / PDS (roadmap M2.3).
 *
 * Returns exactly one of allowed | denied | challenge-required from
 * PLATFORM-level signals only: session validity, authentication level, and
 * tenant context. It deliberately contains NO application or healthcare
 * policy — resource/relationship/consent decisions belong to downstream
 * domain authorization when business routes land. Keeping this pure (a plain
 * function over an ActingContext) makes the platform decision independently
 * testable and reusable across runtimes.
 */

export type PolicyDecisionStatus = "allowed" | "denied" | "challenge-required";

export type PolicyDecisionReason =
  | "authorized"
  | "session-revoked"
  | "session-stale"
  | "step-up-required"
  | "tenant-context-required";

export interface PolicyDecision {
  status: PolicyDecisionStatus;
  reasonCode: PolicyDecisionReason;
}

export function decidePlatformPolicy(
  actingContext: ActingContext,
  requirement: AuthorizationRequirement = {}
): PolicyDecision {
  // A revoked session is a hard denial — no re-auth path.
  if (actingContext.sessionStatus === "revoked") {
    return { status: "denied", reasonCode: "session-revoked" };
  }
  // A stale (expired) session can be recovered by re-authenticating.
  if (actingContext.sessionStatus === "stale") {
    return { status: "challenge-required", reasonCode: "session-stale" };
  }
  // Step-up: an elevated requirement on a primary session challenges for MFA.
  if (requirement.minAuthLevel === "elevated" && actingContext.authLevel !== "elevated") {
    return { status: "challenge-required", reasonCode: "step-up-required" };
  }
  // A tenant-scoped route requires a validated active organization tenant.
  if (requirement.requireActiveTenant && !actingContext.activeTenantValid) {
    return { status: "denied", reasonCode: "tenant-context-required" };
  }
  return { status: "allowed", reasonCode: "authorized" };
}
