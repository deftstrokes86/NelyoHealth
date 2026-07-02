import { describe, expect, it } from "vitest";
import { evaluateAuthorizationPolicyDecision } from "./authorization-policy-handlers.js";
import {
  BreakGlassExpiredError,
  BreakGlassWorkflowService,
  InMemoryBreakGlassRepository,
  InMemoryComplianceNotifier
} from "./break-glass-workflows.js";

function baseAuthorizationInput(overrides: Record<string, unknown> = {}) {
  return {
    decisionRequestId: "policy-break-glass-int-1",
    actorId: "clinician-1",
    actorRole: "clinician" as const,
    actorType: "clinician" as const,
    organizationId: "tenant-1",
    patientId: "patient-1",
    relationshipType: "none" as const,
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
          createdAt: "2026-01-01T00:00:00.000Z",
          createdByActorId: "patient-1"
        }
      ]
    },
    requestedResource: "clinical-record-summary",
    requestedAction: "read",
    purpose: "emergency-care",
    consentStatus: "granted" as const,
    relationshipStatus: "none" as const,
    sessionStatus: "active" as const,
    activeEncounter: true,
    emergencyStatus: "declared" as const,
    sameTenant: true,
    sponsorPaymentOnly: false,
    requiresRelationship: false,
    breakGlassRequested: true,
    breakGlassReason: "life-threatening-emergency",
    breakGlassWindowMinutes: 10,
    impersonationAttempt: false,
    auditEventEditAttempt: false,
    evaluatedAt: "2026-07-02T12:00:00.000Z",
    ...overrides
  };
}

describe("break-glass workflow integration", () => {
  it("supports request, activation, review, and patient history with compliance notifications", () => {
    const repository = new InMemoryBreakGlassRepository();
    const notifier = new InMemoryComplianceNotifier();
    const service = new BreakGlassWorkflowService(repository, notifier);

    const decision = evaluateAuthorizationPolicyDecision(baseAuthorizationInput());
    expect(decision.reasonCode).toBe("allowed");
    expect(decision.breakGlassActive).toBe(true);

    service.requestAccess({
      accessId: "bg-int-1",
      actorId: "clinician-1",
      patientId: "patient-1",
      organizationId: "tenant-1",
      reason: "life-threatening-emergency",
      requestedAt: "2026-07-02T12:00:00.000Z",
      ttlMinutes: 10
    });

    const active = service.activateAccess({
      accessId: "bg-int-1",
      activatedAt: "2026-07-02T12:01:00.000Z"
    });
    expect(active.status).toBe("active");

    const reviewed = service.reviewAccess({
      accessId: "bg-int-1",
      reviewId: "review-int-1",
      reviewedByActorId: "compliance-1",
      reviewedAt: "2026-07-02T12:30:00.000Z",
      outcome: "approved",
      notes: "review complete"
    });
    expect(reviewed.status).toBe("review-completed");

    const patientHistory = service.listPatientVisibleHistory({
      patientId: "patient-1",
      organizationId: "tenant-1"
    });
    expect(patientHistory).toHaveLength(1);
    expect(patientHistory[0]).toMatchObject({
      accessId: "bg-int-1",
      reviewOutcome: "approved"
    });
    expect(notifier.notifications).toHaveLength(1);
  });

  it("fails activation after expiry to enforce short-lived windows end-to-end", () => {
    const repository = new InMemoryBreakGlassRepository();
    const notifier = new InMemoryComplianceNotifier();
    const service = new BreakGlassWorkflowService(repository, notifier);

    service.requestAccess({
      accessId: "bg-int-2",
      actorId: "clinician-1",
      patientId: "patient-1",
      organizationId: "tenant-1",
      reason: "life-threatening-emergency",
      requestedAt: "2026-07-02T12:00:00.000Z",
      ttlMinutes: 1
    });

    expect(() =>
      service.activateAccess({
        accessId: "bg-int-2",
        activatedAt: "2026-07-02T12:03:00.000Z"
      })
    ).toThrowError(BreakGlassExpiredError);

    const policyDecision = evaluateAuthorizationPolicyDecision(
      baseAuthorizationInput({ breakGlassWindowMinutes: 20 })
    );
    expect(policyDecision.reasonCode).toBe("break-glass-window-exceeded");
  });
});
