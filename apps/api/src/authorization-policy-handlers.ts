import {
  type AuditIntentDraft,
  type AuthorizationPolicyDecisionDraft,
  type AuthorizationPolicyDecisionDraftInput
} from "./authorization-policy.js";

export function evaluateAuthorizationPolicyDecision(
  input: AuthorizationPolicyDecisionDraftInput
): AuthorizationPolicyDecisionDraft {
  let status: AuthorizationPolicyDecisionDraft["status"] = "allowed";
  let reasonCode: AuthorizationPolicyDecisionDraft["reasonCode"] = "allowed";
  let nextSteps: string[] = ["proceed"];

  if (!input.sameTenant) {
    status = "denied";
    reasonCode = "tenant-mismatch";
    nextSteps = ["select-correct-organization-context"];
  } else if (input.sessionStatus !== "active") {
    status = "denied";
    reasonCode = "stale-session";
    nextSteps = ["reauthenticate"];
  } else if (input.auditEventEditAttempt) {
    status = "denied";
    reasonCode = "audit-event-append-only";
    nextSteps = ["create-amendment-event"];
  } else if (input.impersonationAttempt && input.actorRole.includes("admin")) {
    status = "denied";
    reasonCode = "administrator-impersonation-denied";
    nextSteps = ["request-explicit-delegation"];
  } else if (input.sponsorPaymentOnly && input.requestedResource.startsWith("clinical")) {
    status = "denied";
    reasonCode = "sponsor-payment-no-clinical-access";
    nextSteps = ["request-clinical-authorization"];
  } else if (input.consentStatus !== "granted") {
    status = "denied";
    reasonCode = "consent-revoked";
    nextSteps = ["restore-consent"];
  } else if (input.requiresRelationship && input.relationshipStatus === "revoked") {
    status = "denied";
    reasonCode = "relationship-revoked";
    nextSteps = ["request-relationship-reinstatement"];
  } else if (input.requiresRelationship && input.relationshipStatus === "expired") {
    status = "denied";
    reasonCode = "relationship-expired";
    nextSteps = ["renew-relationship-verification"];
  } else if (input.breakGlassRequested && !input.breakGlassReason) {
    status = "challenge-required";
    reasonCode = "break-glass-reason-required";
    nextSteps = ["capture-break-glass-reason"];
  } else if (
    input.breakGlassRequested &&
    (input.breakGlassWindowMinutes ?? 0) > 15
  ) {
    status = "denied";
    reasonCode = "break-glass-window-exceeded";
    nextSteps = ["request-short-lived-break-glass"];
  }

  const auditIntent = createAuditIntent({
    input,
    status,
    reasonCode
  });

  return {
    decisionRequestId: input.decisionRequestId,
    status,
    reasonCode,
    breakGlassActive:
      input.breakGlassRequested && status === "allowed" && !!input.breakGlassReason,
    nextSteps,
    auditIntent,
    evaluatedAt: input.evaluatedAt
  };
}

function createAuditIntent(args: {
  input: AuthorizationPolicyDecisionDraftInput;
  status: AuthorizationPolicyDecisionDraft["status"];
  reasonCode: AuthorizationPolicyDecisionDraft["reasonCode"];
}): AuditIntentDraft {
  return {
    appendOnly: true,
    eventType: "authorization-policy-decision",
    actorId: args.input.actorId,
    patientId: args.input.patientId,
    organizationId: args.input.organizationId,
    requestedResource: args.input.requestedResource,
    requestedAction: args.input.requestedAction,
    purpose: args.input.purpose,
    decisionStatus: args.status,
    reasonCode: args.reasonCode,
    breakGlassUsed: args.input.breakGlassRequested,
    requestId: args.input.decisionRequestId,
    occurredAt: args.input.evaluatedAt
  };
}
