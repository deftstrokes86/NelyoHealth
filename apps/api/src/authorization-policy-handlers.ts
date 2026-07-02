import {
  type AuthorizationPolicyDimensionOutcome,
  type AuditIntentDraft,
  type AuthorizationPolicyDecisionDraft,
  type AuthorizationPolicyDecisionDraftInput
} from "./authorization-policy.js";

export function evaluateAuthorizationPolicyDecision(
  input: AuthorizationPolicyDecisionDraftInput
): AuthorizationPolicyDecisionDraft {
  const rbacOutcome = evaluateRbacOutcome(input);
  const abacOutcome = evaluateAbacOutcome(input);
  const rebacOutcome = evaluateRebacOutcome(input);

  const precedenceDecision = [rbacOutcome, abacOutcome, rebacOutcome].find(
    (outcome) => outcome.status !== "allowed"
  );

  const status = precedenceDecision?.status ?? "allowed";
  const reasonCode = precedenceDecision?.reasonCode ?? "allowed";
  const nextSteps = getNextSteps(reasonCode);

  const auditIntent = createAuditIntent({
    input,
    status,
    reasonCode
  });

  return {
    decisionRequestId: input.decisionRequestId,
    status,
    reasonCode,
    dimensionOutcomes: {
      rbac: rbacOutcome,
      abac: abacOutcome,
      rebac: rebacOutcome
    },
    breakGlassActive: input.breakGlassRequested && status === "allowed" && !!input.breakGlassReason,
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

function evaluateRbacOutcome(
  input: AuthorizationPolicyDecisionDraftInput
): AuthorizationPolicyDimensionOutcome {
  if (input.actorType === "admin" && !input.actorRole.includes("admin")) {
    return {
      status: "denied",
      reasonCode: "rbac-role-not-permitted"
    };
  }

  if (input.impersonationAttempt && input.actorRole.includes("admin")) {
    return {
      status: "denied",
      reasonCode: "administrator-impersonation-denied"
    };
  }

  if (input.sponsorPaymentOnly && input.requestedResource.startsWith("clinical")) {
    return {
      status: "denied",
      reasonCode: "sponsor-payment-no-clinical-access"
    };
  }

  const permittedActionsByRole: Record<string, string[]> = {
    guardian: ["read", "update-consent"],
    sponsor: ["read-billing", "read-payment-status"],
    "platform-admin": ["read-support", "manage-tenant-membership"],
    clinician: ["read", "write", "amend"],
    support: ["read-support"],
    patient: ["read", "write"],
    caregiver: ["read", "update-consent"]
  };
  const permittedActions = permittedActionsByRole[input.actorRole] ?? [];

  if (!permittedActions.includes(input.requestedAction)) {
    return {
      status: "denied",
      reasonCode: "rbac-role-not-permitted"
    };
  }

  return {
    status: "allowed",
    reasonCode: "allowed"
  };
}

function evaluateAbacOutcome(
  input: AuthorizationPolicyDecisionDraftInput
): AuthorizationPolicyDimensionOutcome {
  if (!input.sameTenant) {
    return {
      status: "denied",
      reasonCode: "tenant-mismatch"
    };
  }

  if (input.sessionStatus !== "active") {
    return {
      status: "denied",
      reasonCode: "stale-session"
    };
  }

  if (input.auditEventEditAttempt) {
    return {
      status: "denied",
      reasonCode: "audit-event-append-only"
    };
  }

  if (input.breakGlassRequested && !input.breakGlassReason) {
    return {
      status: "challenge-required",
      reasonCode: "break-glass-reason-required"
    };
  }

  if (input.breakGlassRequested && (input.breakGlassWindowMinutes ?? 0) > 15) {
    return {
      status: "denied",
      reasonCode: "break-glass-window-exceeded"
    };
  }

  const emergencyBypass =
    input.emergencyStatus === "declared" &&
    input.purpose === "emergency-care" &&
    input.breakGlassRequested &&
    Boolean(input.breakGlassReason);

  if (!emergencyBypass) {
    const consentOutcome = evaluateConsentOutcome(input);
    if (consentOutcome.status !== "allowed") {
      return consentOutcome;
    }
  }

  const allowedPurposesByAction: Record<string, string[]> = {
    read: ["care-delivery", "care-coordination", "emergency-care"],
    write: ["care-delivery", "emergency-care"],
    amend: ["care-delivery", "emergency-care"],
    "update-consent": ["care-delivery", "consent-management"],
    "read-billing": ["payment-operations"],
    "read-payment-status": ["payment-operations"],
    "read-support": ["support-operations"],
    "manage-tenant-membership": ["tenant-administration"]
  };
  const allowedPurposes = allowedPurposesByAction[input.requestedAction] ?? [];

  if (allowedPurposes.length > 0 && !allowedPurposes.includes(input.purpose)) {
    return {
      status: "denied",
      reasonCode: "abac-purpose-not-allowed"
    };
  }

  const evaluationHourUtc = new Date(input.evaluatedAt).getUTCHours();
  if (
    input.purpose === "support-operations" &&
    (evaluationHourUtc < 6 || evaluationHourUtc > 22) &&
    input.emergencyStatus !== "declared"
  ) {
    return {
      status: "denied",
      reasonCode: "abac-time-window-not-allowed"
    };
  }

  if (
    (input.requestedAction === "write" || input.requestedAction === "amend") &&
    !input.activeEncounter &&
    input.emergencyStatus !== "declared"
  ) {
    return {
      status: "denied",
      reasonCode: "abac-encounter-required"
    };
  }

  return {
    status: "allowed",
    reasonCode: "allowed"
  };
}

function evaluateConsentOutcome(
  input: AuthorizationPolicyDecisionDraftInput
): AuthorizationPolicyDimensionOutcome {
  if (!input.consent) {
    return {
      status: "denied",
      reasonCode: "consent-missing"
    };
  }

  if (input.consentStatus !== "granted") {
    return {
      status: "denied",
      reasonCode: input.consentStatus === "expired" ? "consent-expired" : "consent-revoked"
    };
  }

  const currentVersion = input.consent.versions.find(
    (version) => version.version === input.consent?.currentVersion
  );

  if (!currentVersion) {
    return {
      status: "denied",
      reasonCode: "consent-version-stale"
    };
  }

  const evaluatedAtMs = Date.parse(input.evaluatedAt);
  const effectiveAtMs = Date.parse(currentVersion.effectiveDate);

  if (
    !Number.isNaN(effectiveAtMs) &&
    !Number.isNaN(evaluatedAtMs) &&
    evaluatedAtMs < effectiveAtMs
  ) {
    return {
      status: "denied",
      reasonCode: "consent-not-yet-effective"
    };
  }

  const expiryAtMs = currentVersion.expiryDate ? Date.parse(currentVersion.expiryDate) : Number.NaN;
  if (!Number.isNaN(expiryAtMs) && !Number.isNaN(evaluatedAtMs) && evaluatedAtMs > expiryAtMs) {
    return {
      status: "denied",
      reasonCode: "consent-expired"
    };
  }

  if (currentVersion.status === "revoked") {
    return {
      status: "denied",
      reasonCode: "consent-revoked"
    };
  }

  if (currentVersion.status === "expired") {
    return {
      status: "denied",
      reasonCode: "consent-expired"
    };
  }

  const hasAllRequiredDomains = input.requestedConsentDomains.every((domain) =>
    currentVersion.grantedDomains.includes(domain)
  );
  if (!hasAllRequiredDomains) {
    return {
      status: "denied",
      reasonCode: "consent-scope-not-granted"
    };
  }

  return {
    status: "allowed",
    reasonCode: "allowed"
  };
}

function evaluateRebacOutcome(
  input: AuthorizationPolicyDecisionDraftInput
): AuthorizationPolicyDimensionOutcome {
  if (!input.requiresRelationship) {
    return {
      status: "allowed",
      reasonCode: "allowed"
    };
  }

  const relationship = input.relationship;

  if (!relationship || input.relationshipType === "none" || input.relationshipStatus === "none") {
    return {
      status: "denied",
      reasonCode: "relationship-missing"
    };
  }

  const evaluatedAtMs = Date.parse(input.evaluatedAt);
  const effectiveAtMs = Date.parse(relationship.lifecycle.effectiveDate);

  if (
    !Number.isNaN(effectiveAtMs) &&
    !Number.isNaN(evaluatedAtMs) &&
    evaluatedAtMs < effectiveAtMs
  ) {
    return {
      status: "denied",
      reasonCode: "relationship-not-yet-effective"
    };
  }

  const expiryAtMs = relationship.lifecycle.expiryDate
    ? Date.parse(relationship.lifecycle.expiryDate)
    : Number.NaN;

  if (!Number.isNaN(expiryAtMs) && !Number.isNaN(evaluatedAtMs) && evaluatedAtMs > expiryAtMs) {
    return {
      status: "denied",
      reasonCode: "relationship-expired"
    };
  }

  if (
    relationship.lifecycle.status === "revoked" ||
    Boolean(relationship.lifecycle.revocationInfo)
  ) {
    return {
      status: "denied",
      reasonCode: "relationship-revoked"
    };
  }

  if (relationship.lifecycle.status === "expired") {
    return {
      status: "denied",
      reasonCode: "relationship-expired"
    };
  }

  if (!relationship.lifecycle.permittedActions.includes(input.requestedAction)) {
    return {
      status: "denied",
      reasonCode: "relationship-action-not-permitted"
    };
  }

  return {
    status: "allowed",
    reasonCode: "allowed"
  };
}

function getNextSteps(reasonCode: AuthorizationPolicyDecisionDraft["reasonCode"]): string[] {
  const stepsByReason: Record<AuthorizationPolicyDecisionDraft["reasonCode"], string[]> = {
    allowed: ["proceed"],
    "rbac-role-not-permitted": ["request-role-assignment"],
    "abac-purpose-not-allowed": ["resubmit-with-allowed-purpose"],
    "abac-time-window-not-allowed": ["retry-within-policy-window"],
    "abac-encounter-required": ["start-or-link-encounter"],
    "tenant-mismatch": ["select-correct-organization-context"],
    "stale-session": ["reauthenticate"],
    "consent-missing": ["capture-consent-record"],
    "consent-version-stale": ["refresh-consent-version"],
    "consent-scope-not-granted": ["request-required-consent-scope"],
    "consent-not-yet-effective": ["wait-for-consent-effective-date"],
    "consent-revoked": ["restore-consent"],
    "consent-expired": ["renew-consent"],
    "relationship-missing": ["establish-relationship"],
    "relationship-not-yet-effective": ["wait-for-relationship-effective-date"],
    "relationship-action-not-permitted": ["request-expanded-relationship-permissions"],
    "relationship-revoked": ["request-relationship-reinstatement"],
    "relationship-expired": ["renew-relationship-verification"],
    "sponsor-payment-no-clinical-access": ["request-clinical-authorization"],
    "break-glass-reason-required": ["capture-break-glass-reason"],
    "break-glass-window-exceeded": ["request-short-lived-break-glass"],
    "administrator-impersonation-denied": ["request-explicit-delegation"],
    "audit-event-append-only": ["create-amendment-event"]
  };

  return stepsByReason[reasonCode];
}
