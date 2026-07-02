import { describe, expect, it } from "vitest";
import { evaluateAuthorizationPolicyDecision } from "./authorization-policy-handlers.js";

const baseInput = {
  decisionRequestId: "policy-endpoint",
  actorId: "actor-endpoint-1",
  actorRole: "guardian" as const,
  actorType: "guardian" as const,
  organizationId: "tenant-1",
  patientId: "patient-1",
  relationshipType: "guardian" as const,
  relationship: {
    relationshipId: "rel-endpoint-1",
    relationshipType: "guardian" as const,
    actorId: "actor-endpoint-1",
    patientId: "patient-1",
    organizationId: "tenant-1",
    lifecycle: {
      status: "active" as const,
      verificationMethod: "legal-document" as const,
      effectiveDate: "2026-01-01T00:00:00.000Z",
      expiryDate: "2027-01-01T00:00:00.000Z",
      permittedActions: ["read", "update-consent"],
      supportingDocuments: [],
      reviewHistory: []
    }
  },
  requestedConsentDomains: ["telemedicine", "provider-data-sharing"] as const,
  consent: {
    consentId: "consent-endpoint-1",
    patientId: "patient-1",
    organizationId: "tenant-1",
    currentVersion: 1,
    updatedAt: "2026-07-01T00:00:00.000Z",
    versions: [
      {
        version: 1,
        status: "granted" as const,
        grantedDomains: ["telemedicine", "provider-data-sharing"],
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

describe("authorization policy endpoint-level coverage", () => {
  it("allows at least one mapped combination per protected resource endpoint", () => {
    const allowedCases = [
      {
        actorRole: "guardian" as const,
        actorType: "guardian" as const,
        requestedResource: "clinical-record-summary",
        requestedAction: "read",
        purpose: "care-delivery"
      },
      {
        actorRole: "sponsor" as const,
        actorType: "sponsor" as const,
        requestedResource: "billing-ledger",
        requestedAction: "read-billing",
        purpose: "payment-operations",
        requiresRelationship: false,
        relationshipType: "none" as const,
        relationshipStatus: "none" as const,
        relationship: undefined,
        requestedConsentDomains: [] as string[]
      },
      {
        actorRole: "hmo" as const,
        actorType: "sponsor" as const,
        requestedResource: "payment-status",
        requestedAction: "read-payment-status",
        purpose: "payment-operations",
        requiresRelationship: false,
        relationshipType: "none" as const,
        relationshipStatus: "none" as const,
        relationship: undefined,
        requestedConsentDomains: [] as string[]
      },
      {
        actorRole: "support" as const,
        actorType: "support" as const,
        requestedResource: "support-case",
        requestedAction: "read-support",
        purpose: "support-operations",
        requiresRelationship: false,
        relationshipType: "none" as const,
        relationshipStatus: "none" as const,
        relationship: undefined,
        requestedConsentDomains: [] as string[]
      },
      {
        actorRole: "organization-admin" as const,
        actorType: "admin" as const,
        requestedResource: "tenant-membership",
        requestedAction: "manage-tenant-membership",
        purpose: "tenant-administration",
        requiresRelationship: false,
        relationshipType: "none" as const,
        relationshipStatus: "none" as const,
        relationship: undefined,
        requestedConsentDomains: [] as string[]
      },
      {
        actorRole: "caregiver" as const,
        actorType: "caregiver" as const,
        requestedResource: "consultation-room",
        requestedAction: "read",
        purpose: "care-delivery"
      }
    ];

    for (const allowedCase of allowedCases) {
      const decision = evaluateAuthorizationPolicyDecision({
        ...baseInput,
        ...allowedCase
      });
      expect(decision.status).toBe("allowed");
      expect(decision.reasonCode).toBe("allowed");
    }
  });

  it("denies unmapped combinations for each protected endpoint by default", () => {
    const denyByDefaultCases = [
      {
        actorRole: "payer" as const,
        actorType: "sponsor" as const,
        requestedResource: "clinical-record-summary",
        requestedAction: "read",
        purpose: "care-delivery"
      },
      {
        actorRole: "guardian" as const,
        actorType: "guardian" as const,
        requestedResource: "billing-ledger",
        requestedAction: "read-billing",
        purpose: "payment-operations"
      },
      {
        actorRole: "support" as const,
        actorType: "support" as const,
        requestedResource: "tenant-membership",
        requestedAction: "manage-tenant-membership",
        purpose: "tenant-administration"
      },
      {
        actorRole: "sponsor" as const,
        actorType: "sponsor" as const,
        requestedResource: "support-case",
        requestedAction: "read-support",
        purpose: "support-operations",
        requiresRelationship: false,
        relationshipType: "none" as const,
        relationshipStatus: "none" as const,
        relationship: undefined,
        requestedConsentDomains: [] as string[]
      }
    ];

    for (const denyCase of denyByDefaultCases) {
      const decision = evaluateAuthorizationPolicyDecision({
        ...baseInput,
        ...denyCase
      });

      expect(decision.status).toBe("denied");
      expect(decision.reasonCode).toBe("rbac-policy-unmapped-deny-default");
      expect(decision.dimensionOutcomes.rbac).toMatchObject({
        status: "denied",
        reasonCode: "rbac-policy-unmapped-deny-default"
      });
    }
  });
});
