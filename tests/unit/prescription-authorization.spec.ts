import { describe, expect, it } from "vitest";
import type {
  PersistedBreakGlassAccess,
  PersistedConsentRecord,
  PersistedRelationship
} from "../../packages/database/src/index.js";
import {
  decidePrescriptionAccessFrom,
  type PrescriptionAccessContext
} from "../../apps/api/src/prescription-service.js";
import type { ResolvedAuthorizationInputs } from "../../apps/api/src/resource-authorization.js";

/**
 * M5.5 prescription access governance (pure, no database).
 *
 * Prescribing is a clinical WRITE, so it requires an active encounter (or a
 * declared emergency) on top of consent + ReBAC + break-glass. Reading follows
 * the standard composed pipeline. This asserts read/write composition, the
 * encounter-required rule, and consent revocation propagation.
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

function context(overrides: Partial<PrescriptionAccessContext> = {}): PrescriptionAccessContext {
  return {
    decisionRequestId: "rx-authz-1",
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

const clinician = {
  actorId: "clinician-1",
  actorRole: "clinician",
  actorType: "clinician"
} as const;

describe("M5.5 prescription access (composed pipeline + prescribe write constraint)", () => {
  it("denies a read with no access-control state (default-deny)", () => {
    const decision = decidePrescriptionAccessFrom(context(), "read", NO_INPUTS);
    expect(decision.status).toBe("denied");
    expect(decision.reasonCode).toBe("consent-missing");
  });

  it("allows a patient to read their own prescriptions with granted consent", () => {
    const decision = decidePrescriptionAccessFrom(context(), "read", {
      consent: grantedConsent(),
      relationship: null,
      breakGlass: null
    });
    expect(decision.status).toBe("allowed");
  });

  it("allows a clinician to prescribe during an active encounter with consent", () => {
    const decision = decidePrescriptionAccessFrom(
      context({ ...clinician, activeEncounter: true }),
      "write",
      { consent: grantedConsent(), relationship: null, breakGlass: null }
    );
    expect(decision.status).toBe("allowed");
  });

  it("denies prescribing with no active encounter (encounter-required)", () => {
    const decision = decidePrescriptionAccessFrom(
      context({ ...clinician, activeEncounter: false }),
      "write",
      { consent: grantedConsent(), relationship: null, breakGlass: null }
    );
    expect(decision.status).toBe("denied");
    expect(decision.reasonCode).toBe("abac-encounter-required");
  });

  it("allows a guardian read with consent AND an active relationship", () => {
    const decision = decidePrescriptionAccessFrom(
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

  it("allows an emergency prescription via break-glass (no consent, no encounter)", () => {
    const decision = decidePrescriptionAccessFrom(
      context({
        ...clinician,
        purpose: "emergency-care",
        emergencyStatus: "declared",
        activeEncounter: false
      }),
      "write",
      { consent: null, relationship: null, breakGlass: activeBreakGlass("clinician-1") }
    );
    expect(decision.status).toBe("allowed");
    expect(decision.breakGlassActive).toBe(true);
  });

  it("propagates a consent revocation to the very next prescribe decision", () => {
    const ctx = context({ ...clinician, activeEncounter: true });
    expect(
      decidePrescriptionAccessFrom(ctx, "write", {
        consent: grantedConsent(),
        relationship: null,
        breakGlass: null
      }).status
    ).toBe("allowed");

    const afterRevoke = decidePrescriptionAccessFrom(ctx, "write", {
      consent: grantedConsent("revoked"),
      relationship: null,
      breakGlass: null
    });
    expect(afterRevoke.status).toBe("denied");
    expect(afterRevoke.reasonCode).toBe("consent-revoked");
  });
});
