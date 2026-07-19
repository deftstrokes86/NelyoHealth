import { describe, expect, it } from "vitest";
import type { ActingContext } from "../../acting-context-resolver.js";
import { decidePlatformPolicy } from "./policy-decision.js";

function actingContext(overrides: Partial<ActingContext> = {}): ActingContext {
  return {
    identity: { accountId: "acc-1", personId: "person-1" },
    sessionId: "sess-1",
    sessionStatus: "active",
    authLevel: "primary",
    activeTenantId: null,
    activeTenantValid: false,
    activeTenantReasonCode: "personal-context",
    workspace: "personal",
    persona: { kind: "personal", actorRole: "patient", actorRoles: ["patient"] },
    memberships: [],
    resolvedAt: new Date().toISOString(),
    ...overrides
  };
}

describe("decidePlatformPolicy", () => {
  it("allows an authenticated active session with no special requirement", () => {
    expect(decidePlatformPolicy(actingContext())).toEqual({
      status: "allowed",
      reasonCode: "authorized"
    });
  });

  it("denies a revoked session (hard, no re-auth path)", () => {
    expect(decidePlatformPolicy(actingContext({ sessionStatus: "revoked" }))).toEqual({
      status: "denied",
      reasonCode: "session-revoked"
    });
  });

  it("challenges a stale session for re-authentication", () => {
    expect(decidePlatformPolicy(actingContext({ sessionStatus: "stale" }))).toEqual({
      status: "challenge-required",
      reasonCode: "session-stale"
    });
  });

  it("challenges for step-up when an elevated requirement meets a primary session", () => {
    expect(
      decidePlatformPolicy(actingContext({ authLevel: "primary" }), { minAuthLevel: "elevated" })
    ).toEqual({ status: "challenge-required", reasonCode: "step-up-required" });
  });

  it("allows an elevated requirement when the session is already elevated", () => {
    expect(
      decidePlatformPolicy(actingContext({ authLevel: "elevated" }), { minAuthLevel: "elevated" })
    ).toEqual({ status: "allowed", reasonCode: "authorized" });
  });

  it("denies a tenant-scoped route without a validated active tenant", () => {
    expect(
      decidePlatformPolicy(actingContext({ activeTenantValid: false }), {
        requireActiveTenant: true
      })
    ).toEqual({ status: "denied", reasonCode: "tenant-context-required" });
  });

  it("allows a tenant-scoped route with a validated active tenant", () => {
    expect(
      decidePlatformPolicy(
        actingContext({
          activeTenantId: "org-1",
          activeTenantValid: true,
          workspace: "organization"
        }),
        { requireActiveTenant: true }
      )
    ).toEqual({ status: "allowed", reasonCode: "authorized" });
  });

  it("prioritizes a revoked session over an unmet step-up requirement", () => {
    expect(
      decidePlatformPolicy(actingContext({ sessionStatus: "revoked", authLevel: "primary" }), {
        minAuthLevel: "elevated"
      })
    ).toEqual({ status: "denied", reasonCode: "session-revoked" });
  });
});
