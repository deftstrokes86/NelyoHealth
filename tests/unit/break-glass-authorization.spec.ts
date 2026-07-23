import { describe, expect, it } from "vitest";
import type { PersistedBreakGlassAccess } from "../../packages/database/src/index.js";
import {
  decideAuthorizationWithBreakGlass,
  deriveBreakGlassOverride,
  type BreakGlassAuthorizationBaseInput
} from "../../apps/api/src/break-glass-service.js";

/**
 * M4.3 break-glass → authorization integration (pure, no database).
 *
 * Proves the emergency override flows from a persisted, time-bounded grant and
 * is derived at decision time: an active, unexpired grant supplies the override
 * (which bypasses the consent gate ONLY in a declared emergency-care context);
 * an expired or absent grant supplies nothing, so the decision falls back to
 * default-deny. The base context has NO consent, so break-glass is exactly what
 * flips allowed/denied.
 */

const EVALUATED_AT = "2026-07-02T12:00:00.000Z";
const EVALUATED_AT_MS = Date.parse(EVALUATED_AT);

/** Clinician in a declared emergency-care context, but with NO persisted consent. */
function emergencyBase(
  overrides: Partial<BreakGlassAuthorizationBaseInput> = {}
): BreakGlassAuthorizationBaseInput {
  return {
    decisionRequestId: "bg-authz-unit-1",
    actorId: "clinician-1",
    actorRole: "clinician",
    actorType: "clinician",
    organizationId: "tenant-1",
    patientId: "patient-1",
    relationshipType: "none",
    relationshipStatus: "none",
    requestedConsentDomains: ["telemedicine"],
    consent: undefined,
    consentStatus: "revoked",
    requestedResource: "clinical-record-summary",
    requestedAction: "read",
    purpose: "emergency-care",
    sessionStatus: "active",
    activeEncounter: true,
    emergencyStatus: "declared",
    sameTenant: true,
    sponsorPaymentOnly: false,
    requiresRelationship: false,
    impersonationAttempt: false,
    auditEventEditAttempt: false,
    evaluatedAt: EVALUATED_AT,
    ...overrides
  };
}

function activeGrant(
  overrides: Partial<PersistedBreakGlassAccess> = {}
): PersistedBreakGlassAccess {
  return {
    accessId: "bg-1",
    actorRef: "clinician-1",
    patientRef: "patient-1",
    organizationRef: "tenant-1",
    justification: "unconscious patient in ED — need medication history",
    status: "active",
    ttlMinutes: 10,
    requestedAt: "2026-07-02T11:59:00.000Z",
    expiresAt: "2026-07-02T12:09:00.000Z", // after EVALUATED_AT
    activatedAt: "2026-07-02T11:59:30.000Z",
    createdAt: "2026-07-02T11:59:00.000Z",
    updatedAt: "2026-07-02T11:59:30.000Z",
    ...overrides
  };
}

describe("M4.3 break-glass override derivation", () => {
  it("supplies the override only for an active, unexpired grant", () => {
    expect(deriveBreakGlassOverride(activeGrant(), EVALUATED_AT_MS)).toEqual({
      breakGlassRequested: true,
      breakGlassReason: "unconscious patient in ED — need medication history",
      breakGlassWindowMinutes: 10
    });
  });

  it("supplies no override when the window has closed (auto-expire at decision time)", () => {
    const expiredByClock = activeGrant({ expiresAt: "2026-07-02T11:55:00.000Z" });
    expect(deriveBreakGlassOverride(expiredByClock, EVALUATED_AT_MS)).toEqual({
      breakGlassRequested: false
    });
  });

  it("supplies no override for a non-active status or no grant", () => {
    expect(deriveBreakGlassOverride(activeGrant({ status: "requested" }), EVALUATED_AT_MS)).toEqual(
      {
        breakGlassRequested: false
      }
    );
    expect(deriveBreakGlassOverride(activeGrant({ status: "expired" }), EVALUATED_AT_MS)).toEqual({
      breakGlassRequested: false
    });
    expect(deriveBreakGlassOverride(null, EVALUATED_AT_MS)).toEqual({ breakGlassRequested: false });
  });
});

describe("M4.3 break-glass-gated authorization (persisted-grant read-through)", () => {
  it("denies (consent-missing) with no break-glass grant in an emergency", () => {
    const decision = decideAuthorizationWithBreakGlass(emergencyBase(), null);
    expect(decision.status).toBe("denied");
    expect(decision.reasonCode).toBe("consent-missing");
  });

  it("allows via the emergency override when an active grant is present", () => {
    const decision = decideAuthorizationWithBreakGlass(emergencyBase(), activeGrant());
    expect(decision.status).toBe("allowed");
    expect(decision.breakGlassActive).toBe(true);
  });

  it("re-denies the instant the grant's window closes (no cached override)", () => {
    const base = emergencyBase();
    expect(decideAuthorizationWithBreakGlass(base, activeGrant()).status).toBe("allowed");

    const expiredByClock = activeGrant({ expiresAt: "2026-07-02T11:55:00.000Z" });
    const after = decideAuthorizationWithBreakGlass(base, expiredByClock);
    expect(after.status).toBe("denied");
    expect(after.reasonCode).toBe("consent-missing");
  });

  it("does NOT bypass consent outside a declared emergency-care context (tightly constrained)", () => {
    // Same active grant, but the request is routine care — the emergency bypass
    // must not fire, so the missing consent still governs.
    const routine = emergencyBase({ purpose: "care-delivery", emergencyStatus: "none" });
    const decision = decideAuthorizationWithBreakGlass(routine, activeGrant());
    expect(decision.status).toBe("denied");
    expect(decision.reasonCode).toBe("consent-missing");
  });
});
