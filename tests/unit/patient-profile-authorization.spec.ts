import { describe, expect, it } from "vitest";
import type {
  PersistedBreakGlassAccess,
  PersistedConsentRecord,
  PersistedRelationship
} from "../../packages/database/src/index.js";
import {
  decidePatientProfileAccessFrom,
  type PatientProfileAccessRequest,
  type ResolvedAuthorizationInputs
} from "../../apps/api/src/patient-profile-service.js";

/**
 * M5.1 patient-profile access governance (pure, no database).
 *
 * Proves the centerpiece of the Core Resource Platform: patient-profile access
 * composes ALL THREE M4 access-control dimensions — persisted consent (M4.1),
 * the relationship graph (M4.2), and break-glass (M4.3) — into a single Policy
 * Decision Point evaluation. Each scenario feeds hand-built persisted records so
 * the composition is asserted deterministically, and every dimension is read
 * live so a revocation flips the very next decision.
 */

const EVALUATED_AT = "2026-07-02T12:00:00.000Z";
const PATIENT = "patient-1";
const ORG = "org-1";

const NO_INPUTS: ResolvedAuthorizationInputs = {
  consent: null,
  relationship: null,
  breakGlass: null
};

function grantedConsent(status: "granted" | "revoked" = "granted"): PersistedConsentRecord {
  return {
    consentId: "consent-1",
    patientRef: PATIENT,
    organizationRef: ORG,
    currentVersion: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    versions: [
      {
        version: 1,
        status,
        grantedDomains: [],
        effectiveDate: "2026-01-01T00:00:00.000Z",
        createdAt: "2026-01-01T00:00:00.000Z",
        createdByActorRef: PATIENT
      }
    ]
  };
}

function activeGuardian(actorRef: string): PersistedRelationship {
  return {
    relationshipId: "rel-1",
    actorRef,
    patientRef: PATIENT,
    organizationRef: ORG,
    relationshipType: "guardian",
    status: "active",
    verificationMethod: "legal-document",
    effectiveDate: "2026-01-01T00:00:00.000Z",
    expiryDate: "2027-01-01T00:00:00.000Z",
    permittedActions: ["read", "update-profile"],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  };
}

function activeBreakGlass(actorRef: string): PersistedBreakGlassAccess {
  return {
    accessId: "bg-1",
    actorRef,
    patientRef: PATIENT,
    organizationRef: ORG,
    justification: "unconscious patient in ED",
    status: "active",
    ttlMinutes: 10,
    requestedAt: "2026-07-02T11:59:00.000Z",
    expiresAt: "2026-07-02T12:09:00.000Z",
    activatedAt: "2026-07-02T11:59:30.000Z",
    createdAt: "2026-07-02T11:59:00.000Z",
    updatedAt: "2026-07-02T11:59:30.000Z"
  };
}

function request(overrides: Partial<PatientProfileAccessRequest>): PatientProfileAccessRequest {
  return {
    decisionRequestId: "pp-authz-1",
    actorId: PATIENT,
    actorRole: "patient",
    actorType: "patient",
    patientId: PATIENT,
    organizationId: ORG,
    requestedAction: "read",
    purpose: "care-delivery",
    requiresRelationship: false,
    relationshipType: "none",
    requestedConsentDomains: [],
    sessionStatus: "active",
    sameTenant: true,
    emergencyStatus: "none",
    activeEncounter: true,
    evaluatedAt: EVALUATED_AT,
    ...overrides
  };
}

describe("M5.1 patient-profile access (composed consent + ReBAC + break-glass)", () => {
  it("denies with consent-missing when no access-control state exists (default-deny)", () => {
    const decision = decidePatientProfileAccessFrom(request({}), NO_INPUTS);
    expect(decision.status).toBe("denied");
    expect(decision.reasonCode).toBe("consent-missing");
  });

  it("allows a patient to read their own profile with granted consent", () => {
    const decision = decidePatientProfileAccessFrom(request({}), {
      consent: grantedConsent(),
      relationship: null,
      breakGlass: null
    });
    expect(decision.status).toBe("allowed");
  });

  it("allows a guardian with consent AND an active relationship", () => {
    const decision = decidePatientProfileAccessFrom(
      request({
        actorId: "guardian-1",
        actorRole: "guardian",
        actorType: "guardian",
        requiresRelationship: true,
        relationshipType: "guardian"
      }),
      { consent: grantedConsent(), relationship: activeGuardian("guardian-1"), breakGlass: null }
    );
    expect(decision.status).toBe("allowed");
  });

  it("denies a guardian who has consent but no relationship (ReBAC gate)", () => {
    const decision = decidePatientProfileAccessFrom(
      request({
        actorId: "guardian-1",
        actorRole: "guardian",
        actorType: "guardian",
        requiresRelationship: true,
        relationshipType: "guardian"
      }),
      { consent: grantedConsent(), relationship: null, breakGlass: null }
    );
    expect(decision.status).toBe("denied");
    expect(decision.reasonCode).toBe("relationship-missing");
  });

  it("denies a clinician without consent or break-glass", () => {
    const decision = decidePatientProfileAccessFrom(
      request({ actorId: "clinician-1", actorRole: "clinician", actorType: "clinician" }),
      NO_INPUTS
    );
    expect(decision.status).toBe("denied");
    expect(decision.reasonCode).toBe("consent-missing");
  });

  it("allows a clinician via the break-glass override in a declared emergency (no consent)", () => {
    const decision = decidePatientProfileAccessFrom(
      request({
        actorId: "clinician-1",
        actorRole: "clinician",
        actorType: "clinician",
        purpose: "emergency-care",
        emergencyStatus: "declared"
      }),
      { consent: null, relationship: null, breakGlass: activeBreakGlass("clinician-1") }
    );
    expect(decision.status).toBe("allowed");
    expect(decision.breakGlassActive).toBe(true);
  });

  it("propagates a consent revocation to the very next composed decision", () => {
    const req = request({
      actorId: "guardian-1",
      actorRole: "guardian",
      actorType: "guardian",
      requiresRelationship: true,
      relationshipType: "guardian"
    });
    expect(
      decidePatientProfileAccessFrom(req, {
        consent: grantedConsent(),
        relationship: activeGuardian("guardian-1"),
        breakGlass: null
      }).status
    ).toBe("allowed");

    const afterRevoke = decidePatientProfileAccessFrom(req, {
      consent: grantedConsent("revoked"),
      relationship: activeGuardian("guardian-1"),
      breakGlass: null
    });
    expect(afterRevoke.status).toBe("denied");
    expect(afterRevoke.reasonCode).toBe("consent-revoked");
  });
});
