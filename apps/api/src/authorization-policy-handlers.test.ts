import { describe, expect, it } from "vitest";
import { evaluateAuthorizationPolicyDecision } from "./authorization-policy-handlers.js";

const baseInput = {
  decisionRequestId: "policy-base",
  actorId: "actor-1",
  actorRole: "guardian",
  actorType: "guardian" as const,
  organizationId: "tenant-1",
  patientId: "patient-1",
  relationshipType: "guardian" as const,
  relationship: {
    relationshipId: "rel-guardian-1",
    relationshipType: "guardian" as const,
    actorId: "actor-1",
    patientId: "patient-1",
    organizationId: "tenant-1",
    lifecycle: {
      status: "active" as const,
      verificationMethod: "legal-document" as const,
      effectiveDate: "2026-01-01T00:00:00.000Z",
      expiryDate: "2027-01-01T00:00:00.000Z",
      permittedActions: ["read", "update-consent"],
      supportingDocuments: [
        {
          documentId: "doc-1",
          documentType: "court-order",
          addedAt: "2026-01-01T00:00:00.000Z",
          addedByActorId: "reviewer-1"
        }
      ],
      reviewHistory: [
        {
          reviewId: "review-1",
          reviewedAt: "2026-01-02T00:00:00.000Z",
          reviewedByActorId: "reviewer-1",
          outcome: "approved" as const
        }
      ]
    }
  },
  requestedConsentDomains: ["telemedicine", "provider-data-sharing"] as const,
  consent: {
    consentId: "consent-1",
    patientId: "patient-1",
    organizationId: "tenant-1",
    currentVersion: 2,
    updatedAt: "2026-07-01T00:00:00.000Z",
    versions: [
      {
        version: 1,
        status: "revoked" as const,
        grantedDomains: ["telemedicine", "provider-data-sharing"],
        effectiveDate: "2026-01-01T00:00:00.000Z",
        revokedAt: "2026-05-01T00:00:00.000Z",
        revokedByActorId: "patient-1",
        revocationReason: "prior-version",
        createdAt: "2026-01-01T00:00:00.000Z",
        createdByActorId: "patient-1",
        supersededByVersion: 2
      },
      {
        version: 2,
        status: "granted" as const,
        grantedDomains: [
          "telemedicine",
          "provider-data-sharing",
          "sponsor-participation",
          "family-participation",
          "caregiver-participation",
          "consultation-participants",
          "recording",
          "marketing",
          "research",
          "cross-border-processing",
          "emergency-access"
        ],
        effectiveDate: "2026-06-01T00:00:00.000Z",
        expiryDate: "2027-06-01T00:00:00.000Z",
        createdAt: "2026-06-01T00:00:00.000Z",
        createdByActorId: "patient-1"
      }
    ]
  },
  requestedResource: "clinical-record-summary",
  requestedAction: "read",
  purpose: "care-delivery",
  consentStatus: "granted" as const,
  relationshipStatus: "active" as const,
  sessionStatus: "active" as const,
  activeEncounter: true,
  emergencyStatus: "none" as const,
  sameTenant: true,
  sponsorPaymentOnly: false,
  requiresRelationship: true,
  breakGlassRequested: false,
  impersonationAttempt: false,
  auditEventEditAttempt: false,
  evaluatedAt: "2026-07-02T12:00:00.000Z"
};

describe("authorization policy decision handler", () => {
  it("allows when all guards pass and emits append-only audit intent", () => {
    const decision = evaluateAuthorizationPolicyDecision(baseInput);

    expect(decision).toMatchObject({
      status: "allowed",
      reasonCode: "allowed",
      dimensionOutcomes: {
        rbac: { status: "allowed", reasonCode: "allowed" },
        abac: { status: "allowed", reasonCode: "allowed" },
        rebac: { status: "allowed", reasonCode: "allowed" }
      },
      auditIntent: {
        appendOnly: true,
        eventType: "authorization-policy-decision"
      }
    });
  });

  it("denies sponsor payment-only actor from clinical access", () => {
    const decision = evaluateAuthorizationPolicyDecision({
      ...baseInput,
      actorRole: "sponsor",
      sponsorPaymentOnly: true
    });

    expect(decision).toMatchObject({
      status: "denied",
      reasonCode: "sponsor-payment-no-clinical-access",
      dimensionOutcomes: {
        rbac: { status: "denied", reasonCode: "sponsor-payment-no-clinical-access" }
      }
    });
  });

  it("denies unsupported action for role as RBAC guard", () => {
    const decision = evaluateAuthorizationPolicyDecision({
      ...baseInput,
      actorRole: "guardian",
      requestedAction: "amend"
    });

    expect(decision).toMatchObject({
      status: "denied",
      reasonCode: "rbac-role-not-permitted",
      dimensionOutcomes: {
        rbac: { status: "denied", reasonCode: "rbac-role-not-permitted" }
      }
    });
  });

  it("denies revoked consent immediately", () => {
    const decision = evaluateAuthorizationPolicyDecision({
      ...baseInput,
      consentStatus: "revoked",
      consent: {
        ...baseInput.consent,
        versions: [
          {
            ...baseInput.consent.versions[0],
            version: 2,
            status: "revoked",
            revokedAt: "2026-07-02T00:00:00.000Z",
            revokedByActorId: "patient-1",
            revocationReason: "withdrawn"
          }
        ]
      }
    });

    expect(decision).toMatchObject({
      status: "denied",
      reasonCode: "consent-revoked"
    });
  });

  it("denies when required consent domain is not granted", () => {
    const decision = evaluateAuthorizationPolicyDecision({
      ...baseInput,
      requestedConsentDomains: ["telemedicine", "research"],
      consent: {
        ...baseInput.consent,
        versions: [
          {
            ...baseInput.consent.versions[1],
            grantedDomains: ["telemedicine", "provider-data-sharing"]
          }
        ]
      }
    });

    expect(decision).toMatchObject({
      status: "denied",
      reasonCode: "consent-scope-not-granted",
      dimensionOutcomes: {
        abac: { status: "denied", reasonCode: "consent-scope-not-granted" }
      }
    });
  });

  it("denies when consent version pointer is stale", () => {
    const decision = evaluateAuthorizationPolicyDecision({
      ...baseInput,
      consent: {
        ...baseInput.consent,
        currentVersion: 99
      }
    });

    expect(decision).toMatchObject({
      status: "denied",
      reasonCode: "consent-version-stale",
      dimensionOutcomes: {
        abac: { status: "denied", reasonCode: "consent-version-stale" }
      }
    });
  });

  it("denies when consent record is missing", () => {
    const decision = evaluateAuthorizationPolicyDecision({
      ...baseInput,
      consent: undefined
    });

    expect(decision).toMatchObject({
      status: "denied",
      reasonCode: "consent-missing",
      dimensionOutcomes: {
        abac: { status: "denied", reasonCode: "consent-missing" }
      }
    });
  });

  it("denies when current consent version is expired", () => {
    const decision = evaluateAuthorizationPolicyDecision({
      ...baseInput,
      consentStatus: "expired",
      consent: {
        ...baseInput.consent,
        versions: [
          {
            ...baseInput.consent.versions[1],
            status: "expired",
            expiryDate: "2026-01-01T00:00:00.000Z"
          }
        ]
      }
    });

    expect(decision).toMatchObject({
      status: "denied",
      reasonCode: "consent-expired",
      dimensionOutcomes: {
        abac: { status: "denied", reasonCode: "consent-expired" }
      }
    });
  });

  it("denies when consent has not reached effective time", () => {
    const decision = evaluateAuthorizationPolicyDecision({
      ...baseInput,
      consent: {
        ...baseInput.consent,
        versions: [
          {
            ...baseInput.consent.versions[1],
            effectiveDate: "2027-01-01T00:00:00.000Z"
          }
        ]
      }
    });

    expect(decision).toMatchObject({
      status: "denied",
      reasonCode: "consent-not-yet-effective",
      dimensionOutcomes: {
        abac: { status: "denied", reasonCode: "consent-not-yet-effective" }
      }
    });
  });

  it("denies write/amend when no active encounter exists", () => {
    const decision = evaluateAuthorizationPolicyDecision({
      ...baseInput,
      actorRole: "clinician",
      actorType: "clinician",
      requestedAction: "write",
      activeEncounter: false
    });

    expect(decision).toMatchObject({
      status: "denied",
      reasonCode: "abac-encounter-required",
      dimensionOutcomes: {
        abac: { status: "denied", reasonCode: "abac-encounter-required" }
      }
    });
  });

  it("denies support purpose outside allowed ABAC time window", () => {
    const decision = evaluateAuthorizationPolicyDecision({
      ...baseInput,
      actorRole: "support",
      actorType: "support",
      requestedAction: "read-support",
      purpose: "support-operations",
      evaluatedAt: "2026-07-02T02:00:00.000Z"
    });

    expect(decision).toMatchObject({
      status: "denied",
      reasonCode: "abac-time-window-not-allowed",
      dimensionOutcomes: {
        abac: { status: "denied", reasonCode: "abac-time-window-not-allowed" }
      }
    });
  });

  it("denies revoked relationship immediately", () => {
    const decision = evaluateAuthorizationPolicyDecision({
      ...baseInput,
      relationshipStatus: "revoked",
      relationship: {
        ...baseInput.relationship,
        lifecycle: {
          ...baseInput.relationship.lifecycle,
          status: "revoked",
          revocationInfo: {
            revokedAt: "2026-07-01T00:00:00.000Z",
            revokedByActorId: "admin-1",
            reason: "guardian-rights-ended"
          }
        }
      }
    });

    expect(decision).toMatchObject({
      status: "denied",
      reasonCode: "relationship-revoked"
    });
  });

  it("denies when relationship is required but missing", () => {
    const decision = evaluateAuthorizationPolicyDecision({
      ...baseInput,
      relationshipType: "none",
      relationshipStatus: "none",
      relationship: undefined
    });

    expect(decision).toMatchObject({
      status: "denied",
      reasonCode: "relationship-missing",
      dimensionOutcomes: {
        rebac: { status: "denied", reasonCode: "relationship-missing" }
      }
    });
  });

  it("denies when relationship is not yet effective", () => {
    const decision = evaluateAuthorizationPolicyDecision({
      ...baseInput,
      evaluatedAt: "2025-12-01T00:00:00.000Z",
      consent: {
        ...baseInput.consent,
        versions: [
          {
            ...baseInput.consent.versions[1],
            effectiveDate: "2025-01-01T00:00:00.000Z"
          }
        ]
      }
    });

    expect(decision).toMatchObject({
      status: "denied",
      reasonCode: "relationship-not-yet-effective",
      dimensionOutcomes: {
        rebac: { status: "denied", reasonCode: "relationship-not-yet-effective" }
      }
    });
  });

  it("denies when relationship permitted actions do not include requested action", () => {
    const decision = evaluateAuthorizationPolicyDecision({
      ...baseInput,
      requestedAction: "update-consent",
      relationship: {
        ...baseInput.relationship,
        lifecycle: {
          ...baseInput.relationship.lifecycle,
          permittedActions: ["read"]
        }
      }
    });

    expect(decision).toMatchObject({
      status: "denied",
      reasonCode: "relationship-action-not-permitted",
      dimensionOutcomes: {
        rebac: { status: "denied", reasonCode: "relationship-action-not-permitted" }
      }
    });
  });

  it("requires reason capture when break-glass is requested", () => {
    const decision = evaluateAuthorizationPolicyDecision({
      ...baseInput,
      breakGlassRequested: true
    });

    expect(decision).toMatchObject({
      status: "challenge-required",
      reasonCode: "break-glass-reason-required"
    });
  });

  it("allows emergency break-glass flow even when consent status is revoked", () => {
    const decision = evaluateAuthorizationPolicyDecision({
      ...baseInput,
      emergencyStatus: "declared",
      purpose: "emergency-care",
      breakGlassRequested: true,
      breakGlassReason: "critical-hemorrhage",
      consentStatus: "revoked"
    });

    expect(decision).toMatchObject({
      status: "allowed",
      reasonCode: "allowed",
      breakGlassActive: true,
      dimensionOutcomes: {
        abac: { status: "allowed", reasonCode: "allowed" }
      }
    });
  });

  it("denies audit-event edit attempts as append-only violations", () => {
    const decision = evaluateAuthorizationPolicyDecision({
      ...baseInput,
      auditEventEditAttempt: true
    });

    expect(decision).toMatchObject({
      status: "denied",
      reasonCode: "audit-event-append-only"
    });
  });

  it("denies silent admin impersonation attempts", () => {
    const decision = evaluateAuthorizationPolicyDecision({
      ...baseInput,
      actorRole: "platform-admin",
      impersonationAttempt: true
    });

    expect(decision).toMatchObject({
      status: "denied",
      reasonCode: "administrator-impersonation-denied"
    });
  });
});
