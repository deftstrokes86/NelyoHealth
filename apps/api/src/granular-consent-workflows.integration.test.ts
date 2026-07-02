import { describe, expect, it } from "vitest";
import { evaluateAuthorizationPolicyDecision } from "./authorization-policy-handlers.js";
import {
  GranularConsentWorkflowService,
  InMemoryConsentRepository
} from "./granular-consent-workflows.js";

function createAuthorizationInput(consent: ReturnType<GranularConsentWorkflowService["getConsentRecord"]>) {
  const currentVersion = consent?.versions.find((version) => version.version === consent.currentVersion);
  const consentStatus = currentVersion?.status === "expired" ? "expired" : currentVersion?.status === "revoked" ? "revoked" : "granted";

  return {
    decisionRequestId: "policy-consent-int-1",
    actorId: "actor-1",
    actorRole: "guardian" as const,
    actorType: "guardian" as const,
    organizationId: "tenant-1",
    patientId: "patient-1",
    relationshipType: "guardian" as const,
    relationship: {
      relationshipId: "rel-1",
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
        supportingDocuments: [],
        reviewHistory: []
      }
    },
    requestedConsentDomains: ["telemedicine", "provider-data-sharing"] as const,
    consent: consent ?? undefined,
    requestedResource: "clinical-record-summary",
    requestedAction: "read",
    purpose: "care-delivery",
    consentStatus,
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
}

describe("granular consent workflow integration with authorization", () => {
  it("applies domain toggles immediately through superseded consent versions", () => {
    const repository = new InMemoryConsentRepository();
    const workflows = new GranularConsentWorkflowService(repository);

    const beforeCreate = evaluateAuthorizationPolicyDecision(createAuthorizationInput(null));
    expect(beforeCreate.reasonCode).toBe("consent-missing");

    workflows.createConsentRecord({
      consentId: "consent-int-1",
      patientId: "patient-1",
      organizationId: "tenant-1",
      createdAt: "2026-01-01T00:00:00.000Z",
      createdByActorId: "patient-1",
      grantedDomains: ["telemedicine", "provider-data-sharing"],
      effectiveDate: "2026-01-01T00:00:00.000Z"
    });

    const afterGrant = evaluateAuthorizationPolicyDecision(
      createAuthorizationInput(workflows.getConsentRecord("consent-int-1"))
    );
    expect(afterGrant.reasonCode).toBe("allowed");

    workflows.supersedeConsentVersion({
      consentId: "consent-int-1",
      expectedCurrentVersion: 1,
      createdAt: "2026-02-01T00:00:00.000Z",
      createdByActorId: "patient-1",
      grantedDomains: ["telemedicine"],
      effectiveDate: "2026-02-01T00:00:00.000Z"
    });

    const afterToggle = evaluateAuthorizationPolicyDecision(
      createAuthorizationInput(workflows.getConsentRecord("consent-int-1"))
    );
    expect(afterToggle.reasonCode).toBe("consent-scope-not-granted");
  });

  it("applies revocation immediately after workflow transition", () => {
    const repository = new InMemoryConsentRepository();
    const workflows = new GranularConsentWorkflowService(repository);

    workflows.createConsentRecord({
      consentId: "consent-int-2",
      patientId: "patient-1",
      organizationId: "tenant-1",
      createdAt: "2026-01-01T00:00:00.000Z",
      createdByActorId: "patient-1",
      grantedDomains: ["telemedicine", "provider-data-sharing"],
      effectiveDate: "2026-01-01T00:00:00.000Z"
    });

    const beforeRevoke = evaluateAuthorizationPolicyDecision(
      createAuthorizationInput(workflows.getConsentRecord("consent-int-2"))
    );
    expect(beforeRevoke.reasonCode).toBe("allowed");

    workflows.revokeConsentVersion({
      consentId: "consent-int-2",
      targetVersion: 1,
      expectedCurrentVersion: 1,
      revokedAt: "2026-03-01T00:00:00.000Z",
      revokedByActorId: "patient-1",
      revocationReason: "withdrawn"
    });

    const afterRevoke = evaluateAuthorizationPolicyDecision(
      createAuthorizationInput(workflows.getConsentRecord("consent-int-2"))
    );
    expect(afterRevoke.reasonCode).toBe("consent-revoked");
  });
});
