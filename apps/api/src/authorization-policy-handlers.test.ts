import { describe, expect, it } from "vitest";
import { evaluateAuthorizationPolicyDecision } from "./authorization-policy-handlers.js";

const baseInput = {
  decisionRequestId: "policy-base",
  actorId: "actor-1",
  actorRole: "guardian",
  organizationId: "tenant-1",
  patientId: "patient-1",
  requestedResource: "clinical-record-summary",
  requestedAction: "read",
  purpose: "care-delivery",
  consentStatus: "granted" as const,
  relationshipStatus: "active" as const,
  sessionStatus: "active" as const,
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
      reasonCode: "sponsor-payment-no-clinical-access"
    });
  });

  it("denies revoked consent immediately", () => {
    const decision = evaluateAuthorizationPolicyDecision({
      ...baseInput,
      consentStatus: "revoked"
    });

    expect(decision).toMatchObject({
      status: "denied",
      reasonCode: "consent-revoked"
    });
  });

  it("denies revoked relationship immediately", () => {
    const decision = evaluateAuthorizationPolicyDecision({
      ...baseInput,
      relationshipStatus: "revoked"
    });

    expect(decision).toMatchObject({
      status: "denied",
      reasonCode: "relationship-revoked"
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
