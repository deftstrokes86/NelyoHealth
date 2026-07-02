import { describe, expect, it } from "vitest";
import { createAuthorizationPolicyDecisionDraftInput } from "./authorization-policy.js";

describe("authorization policy draft input contract", () => {
  it("creates a decision input payload with the expected shape", () => {
    const payload = createAuthorizationPolicyDecisionDraftInput({
      decisionRequestId: "policy-1",
      actorId: "actor-1",
      actorRole: "guardian",
      organizationId: "tenant-1",
      patientId: "patient-1",
      requestedResource: "clinical-record-summary",
      requestedAction: "read",
      purpose: "care-delivery",
      consentStatus: "granted",
      relationshipStatus: "active",
      sessionStatus: "active",
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
      requestedResource: "clinical-record-summary",
      consentStatus: "granted",
      relationshipStatus: "active",
      sameTenant: true
    });
  });
});
