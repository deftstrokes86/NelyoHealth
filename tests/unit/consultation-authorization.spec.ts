import { describe, expect, it } from "vitest";
import type {
  PersistedBreakGlassAccess,
  PersistedConsentRecord,
  PersistedRelationship
} from "../../packages/database/src/index.js";
import {
  decideConsultationAccessFrom,
  type ConsultationAccessContext
} from "../../apps/api/src/consultation-service.js";
import type { ResolvedAuthorizationInputs } from "../../apps/api/src/resource-authorization.js";

/**
 * M5.3 consultation access governance (pure, no database).
 *
 * Consultations reuse the SAME composed pipeline (consent + ReBAC + break-glass)
 * as the earlier resources, for both read and conduct actions. This asserts the
 * composition end to end for the consultation resource, including that a consent
 * revocation flips the very next decision.
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
    permittedActions: ["read"],
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
    createdAt: "2026-07-02T11:59:00.000Z",
    updatedAt: "2026-07-02T11:59:00.000Z"
  };
}

function context(overrides: Partial<ConsultationAccessContext> = {}): ConsultationAccessContext {
  return {
    decisionRequestId: "cons-authz-1",
    actorId: PATIENT,
    actorRole: "patient",
    actorType: "patient",
    patientId: PATIENT,
    organizationId: ORG,
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

describe("M5.3 consultation access (composed consent + ReBAC + break-glass)", () => {
  it("denies a read with no access-control state (default-deny)", () => {
    const decision = decideConsultationAccessFrom(context(), "read", NO_INPUTS);
    expect(decision.status).toBe("denied");
    expect(decision.reasonCode).toBe("consent-missing");
  });

  it("allows a patient to read their own consultation with granted consent", () => {
    const decision = decideConsultationAccessFrom(context(), "read", {
      consent: grantedConsent(),
      relationship: null,
      breakGlass: null
    });
    expect(decision.status).toBe("allowed");
  });

  it("allows a clinician to conduct with granted consent", () => {
    const decision = decideConsultationAccessFrom(
      context({ actorId: "clinician-1", actorRole: "clinician", actorType: "clinician" }),
      "conduct",
      { consent: grantedConsent(), relationship: null, breakGlass: null }
    );
    expect(decision.status).toBe("allowed");
  });

  it("allows a guardian read with consent AND an active relationship", () => {
    const decision = decideConsultationAccessFrom(
      context({
        actorId: "guardian-1",
        actorRole: "guardian",
        actorType: "guardian",
        requiresRelationship: true,
        relationshipType: "guardian"
      }),
      "read",
      { consent: grantedConsent(), relationship: activeGuardian("guardian-1"), breakGlass: null }
    );
    expect(decision.status).toBe("allowed");
  });

  it("denies a guardian read without a relationship (ReBAC gate)", () => {
    const decision = decideConsultationAccessFrom(
      context({
        actorId: "guardian-1",
        actorRole: "guardian",
        actorType: "guardian",
        requiresRelationship: true,
        relationshipType: "guardian"
      }),
      "read",
      { consent: grantedConsent(), relationship: null, breakGlass: null }
    );
    expect(decision.status).toBe("denied");
    expect(decision.reasonCode).toBe("relationship-missing");
  });

  it("allows a clinician to conduct via break-glass in a declared emergency (no consent)", () => {
    const decision = decideConsultationAccessFrom(
      context({
        actorId: "clinician-1",
        actorRole: "clinician",
        actorType: "clinician",
        purpose: "emergency-care",
        emergencyStatus: "declared"
      }),
      "conduct",
      { consent: null, relationship: null, breakGlass: activeBreakGlass("clinician-1") }
    );
    expect(decision.status).toBe("allowed");
    expect(decision.breakGlassActive).toBe(true);
  });

  it("propagates a consent revocation to the very next conduct decision", () => {
    const ctx = context({ actorId: "clinician-1", actorRole: "clinician", actorType: "clinician" });
    expect(
      decideConsultationAccessFrom(ctx, "conduct", {
        consent: grantedConsent(),
        relationship: null,
        breakGlass: null
      }).status
    ).toBe("allowed");

    const afterRevoke = decideConsultationAccessFrom(ctx, "conduct", {
      consent: grantedConsent("revoked"),
      relationship: null,
      breakGlass: null
    });
    expect(afterRevoke.status).toBe("denied");
    expect(afterRevoke.reasonCode).toBe("consent-revoked");
  });
});
