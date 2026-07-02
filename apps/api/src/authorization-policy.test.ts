import { describe, expect, it } from "vitest";
import { createAuthorizationPolicyDecisionDraftInput } from "./authorization-policy.js";

describe("authorization policy draft input contract", () => {
  it("creates a decision input payload with the expected shape", () => {
    const payload = createAuthorizationPolicyDecisionDraftInput({
      decisionRequestId: "policy-1",
      actorId: "actor-1",
      actorRole: "guardian",
      actorType: "guardian",
      organizationId: "tenant-1",
      patientId: "patient-1",
      relationshipType: "guardian",
      relationship: {
        relationshipId: "rel-1",
        relationshipType: "guardian",
        actorId: "actor-1",
        patientId: "patient-1",
        organizationId: "tenant-1",
        lifecycle: {
          status: "active",
          verificationMethod: "legal-document",
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
              outcome: "approved"
            }
          ]
        }
      },
      requestedConsentDomains: ["telemedicine", "provider-data-sharing"],
      consent: {
        consentId: "consent-1",
        patientId: "patient-1",
        organizationId: "tenant-1",
        currentVersion: 1,
        updatedAt: "2026-01-01T00:00:00.000Z",
        versions: [
          {
            version: 1,
            status: "granted",
            grantedDomains: ["telemedicine", "provider-data-sharing"],
            effectiveDate: "2026-01-01T00:00:00.000Z",
            expiryDate: "2027-01-01T00:00:00.000Z",
            createdAt: "2026-01-01T00:00:00.000Z",
            createdByActorId: "patient-1"
          }
        ]
      },
      requestedResource: "clinical-record-summary",
      requestedAction: "read",
      purpose: "care-delivery",
      consentStatus: "granted",
      relationshipStatus: "active",
      sessionStatus: "active",
      activeEncounter: true,
      emergencyStatus: "none",
      sameTenant: true,
      sponsorPaymentOnly: false,
      requiresRelationship: true,
      breakGlassRequested: false,
      impersonationAttempt: false,
      auditEventEditAttempt: false,
      evaluatedAt: "2026-07-02T12:00:00.000Z"
    });

    expect(payload).toMatchObject({
      decisionRequestId: "policy-1",
      actorRole: "guardian",
      relationshipType: "guardian",
      relationship: {
        relationshipType: "guardian",
        lifecycle: {
          verificationMethod: "legal-document"
        }
      },
      requestedConsentDomains: ["telemedicine", "provider-data-sharing"],
      consent: {
        currentVersion: 1
      },
      requestedResource: "clinical-record-summary",
      consentStatus: "granted",
      relationshipStatus: "active",
      sameTenant: true
    });
  });
});
