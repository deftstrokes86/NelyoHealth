import { describe, expect, it } from "vitest";
import { evaluateAuthorizationPolicyDecision } from "./authorization-policy-handlers.js";
import {
  InMemoryRelationshipRepository,
  RelationshipWorkflowService
} from "./relationship-workflows.js";

function createAuthorizationInput(
  relationship: ReturnType<RelationshipWorkflowService["getRelationship"]>,
  overrides: Partial<{ evaluatedAt: string }> = {}
) {
  return {
    decisionRequestId: "policy-integration-1",
    actorId: "actor-1",
    actorRole: "guardian" as const,
    actorType: "guardian" as const,
    organizationId: "tenant-1",
    patientId: "patient-1",
    relationshipType: relationship?.relationshipType ?? "none",
    relationship: relationship ?? undefined,
    requestedResource: "clinical-record-summary",
    requestedAction: "read",
    requestedConsentDomains: ["telemedicine", "provider-data-sharing"] as const,
    consent: {
      consentId: "consent-1",
      patientId: "patient-1",
      organizationId: "tenant-1",
      currentVersion: 1,
      updatedAt: "2026-01-01T00:00:00.000Z",
      versions: [
        {
          version: 1,
          status: "granted" as const,
          grantedDomains: ["telemedicine", "provider-data-sharing"],
          effectiveDate: "2026-01-01T00:00:00.000Z",
          expiryDate: "2027-01-01T00:00:00.000Z",
          createdAt: "2026-01-01T00:00:00.000Z",
          createdByActorId: "patient-1"
        }
      ]
    },
    purpose: "care-delivery",
    consentStatus: "granted" as const,
    relationshipStatus: relationship?.lifecycle.status ?? "none",
    sessionStatus: "active" as const,
    activeEncounter: true,
    emergencyStatus: "none" as const,
    sameTenant: true,
    sponsorPaymentOnly: false,
    requiresRelationship: true,
    breakGlassRequested: false,
    impersonationAttempt: false,
    auditEventEditAttempt: false,
    evaluatedAt: overrides.evaluatedAt ?? "2026-07-02T12:00:00.000Z"
  };
}

describe("relationship lifecycle integration with authorization", () => {
  it("applies approval and revocation transitions to authorization immediately", () => {
    const repository = new InMemoryRelationshipRepository();
    const workflows = new RelationshipWorkflowService(repository);

    workflows.createRelationship({
      relationship: {
        relationshipId: "rel-int-1",
        relationshipType: "guardian",
        actorId: "actor-1",
        patientId: "patient-1",
        organizationId: "tenant-1",
        lifecycle: {
          status: "none",
          verificationMethod: "self-attested",
          effectiveDate: "2026-01-01T00:00:00.000Z",
          expiryDate: "2027-01-01T00:00:00.000Z",
          permittedActions: ["read", "update-consent"],
          supportingDocuments: [],
          reviewHistory: []
        }
      }
    });

    const beforeApproval = evaluateAuthorizationPolicyDecision(
      createAuthorizationInput(workflows.getRelationship("rel-int-1"))
    );
    expect(beforeApproval.reasonCode).toBe("relationship-missing");

    workflows.verifyRelationship({
      relationshipId: "rel-int-1",
      verificationMethod: "legal-document",
      verifiedByActorId: "verifier-1",
      verifiedAt: "2026-01-02T00:00:00.000Z"
    });

    const afterVerification = evaluateAuthorizationPolicyDecision(
      createAuthorizationInput(workflows.getRelationship("rel-int-1"))
    );
    expect(afterVerification.reasonCode).toBe("relationship-missing");

    workflows.reviewRelationship({
      relationshipId: "rel-int-1",
      reviewedByActorId: "reviewer-1",
      reviewedAt: "2026-01-03T00:00:00.000Z",
      outcome: "approved"
    });

    const afterApproval = evaluateAuthorizationPolicyDecision(
      createAuthorizationInput(workflows.getRelationship("rel-int-1"))
    );
    expect(afterApproval.reasonCode).toBe("allowed");

    workflows.revokeRelationship({
      relationshipId: "rel-int-1",
      revokedAt: "2026-01-04T00:00:00.000Z",
      revokedByActorId: "reviewer-1",
      reason: "guardian-removed"
    });

    const afterRevocation = evaluateAuthorizationPolicyDecision(
      createAuthorizationInput(workflows.getRelationship("rel-int-1"))
    );
    expect(afterRevocation.reasonCode).toBe("relationship-revoked");
  });

  it("keeps authorization denied through document and rejected review transitions", () => {
    const repository = new InMemoryRelationshipRepository();
    const workflows = new RelationshipWorkflowService(repository);

    workflows.createRelationship({
      relationship: {
        relationshipId: "rel-int-3",
        relationshipType: "household",
        actorId: "actor-1",
        patientId: "patient-1",
        organizationId: "tenant-1",
        lifecycle: {
          status: "none",
          verificationMethod: "self-attested",
          effectiveDate: "2026-01-01T00:00:00.000Z",
          expiryDate: "2027-01-01T00:00:00.000Z",
          permittedActions: ["read"],
          supportingDocuments: [],
          reviewHistory: []
        }
      }
    });

    const beforeAnyTransition = evaluateAuthorizationPolicyDecision(
      createAuthorizationInput(workflows.getRelationship("rel-int-3"))
    );
    expect(beforeAnyTransition.reasonCode).toBe("relationship-missing");

    workflows.addSupportingDocument({
      relationshipId: "rel-int-3",
      document: {
        documentId: "doc-int-3",
        documentType: "household-proof",
        addedAt: "2026-01-02T00:00:00.000Z",
        addedByActorId: "verifier-1"
      }
    });

    const afterDocument = evaluateAuthorizationPolicyDecision(
      createAuthorizationInput(workflows.getRelationship("rel-int-3"))
    );
    expect(afterDocument.reasonCode).toBe("relationship-missing");

    workflows.reviewRelationship({
      relationshipId: "rel-int-3",
      reviewedByActorId: "reviewer-1",
      reviewedAt: "2026-01-03T00:00:00.000Z",
      outcome: "rejected"
    });

    const afterRejectedReview = evaluateAuthorizationPolicyDecision(
      createAuthorizationInput(workflows.getRelationship("rel-int-3"))
    );
    expect(afterRejectedReview.reasonCode).toBe("relationship-missing");
  });

  it("applies expiry automation transition to authorization immediately", () => {
    const repository = new InMemoryRelationshipRepository();
    const workflows = new RelationshipWorkflowService(repository);

    workflows.createRelationship({
      relationship: {
        relationshipId: "rel-int-2",
        relationshipType: "clinical-proxy",
        actorId: "actor-1",
        patientId: "patient-1",
        organizationId: "tenant-1",
        lifecycle: {
          status: "active",
          verificationMethod: "clinical-attestation",
          effectiveDate: "2026-01-01T00:00:00.000Z",
          expiryDate: "2026-01-05T00:00:00.000Z",
          permittedActions: ["read"],
          supportingDocuments: [],
          reviewHistory: []
        }
      }
    });

    const beforeExpiry = evaluateAuthorizationPolicyDecision(
      createAuthorizationInput(workflows.getRelationship("rel-int-2"), {
        evaluatedAt: "2026-01-04T00:00:00.000Z"
      })
    );
    expect(beforeExpiry.reasonCode).toBe("allowed");

    workflows.runExpiryAutomation("2026-01-06T00:00:00.000Z");

    const afterExpiry = evaluateAuthorizationPolicyDecision(
      createAuthorizationInput(workflows.getRelationship("rel-int-2"), {
        evaluatedAt: "2026-01-06T00:00:00.000Z"
      })
    );
    expect(afterExpiry.reasonCode).toBe("relationship-expired");
  });
});
