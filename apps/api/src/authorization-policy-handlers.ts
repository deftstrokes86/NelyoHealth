import {
  type AuthorizationActorRole,
  type AuthorizationPolicyDimensionOutcome,
  type AuditIntentDraft,
  type AuthorizationPolicyDecisionDraft,
  type AuthorizationPolicyDecisionDraftInput
} from "./authorization-policy.js";

interface AuthorizationPolicyRule {
  actorRole: AuthorizationActorRole;
  resource: string;
  action: string;
  purposes: string[];
}

const policyRules: AuthorizationPolicyRule[] = [
  {
    actorRole: "patient",
    resource: "clinical-record-summary",
    action: "read",
    purposes: ["care-delivery", "care-coordination", "emergency-care"]
  },
  {
    actorRole: "patient",
    resource: "clinical-record-summary",
    action: "write",
    purposes: ["care-delivery", "emergency-care"]
  },
  {
    actorRole: "patient",
    resource: "consent-preferences",
    action: "update-consent",
    purposes: ["consent-management"]
  },
  // Patient-profile resource (roadmap M5.1). Access is still gated by the full
  // pipeline: an RBAC match here only opens the door for the consent / ReBAC /
  // break-glass dimensions to decide.
  {
    actorRole: "patient",
    resource: "patient-profile",
    action: "read",
    purposes: ["care-delivery", "care-coordination"]
  },
  {
    actorRole: "patient",
    resource: "patient-profile",
    action: "update-profile",
    purposes: ["care-delivery"]
  },
  {
    actorRole: "guardian",
    resource: "patient-profile",
    action: "read",
    purposes: ["care-delivery", "care-coordination", "emergency-care"]
  },
  {
    actorRole: "caregiver",
    resource: "patient-profile",
    action: "read",
    purposes: ["care-delivery", "care-coordination"]
  },
  {
    actorRole: "clinician",
    resource: "patient-profile",
    action: "read",
    purposes: ["care-delivery", "care-coordination", "emergency-care"]
  },
  {
    actorRole: "clinician",
    resource: "patient-profile",
    action: "update-profile",
    purposes: ["care-delivery"]
  },
  // Appointment resource (roadmap M5.2). Read and book flow through the full
  // pipeline; an RBAC match only opens the door for consent / ReBAC / break-glass.
  {
    actorRole: "patient",
    resource: "appointment",
    action: "read",
    purposes: ["care-delivery", "care-coordination"]
  },
  {
    actorRole: "patient",
    resource: "appointment",
    action: "book",
    purposes: ["care-delivery", "care-coordination"]
  },
  {
    actorRole: "guardian",
    resource: "appointment",
    action: "read",
    purposes: ["care-delivery", "care-coordination", "emergency-care"]
  },
  {
    actorRole: "guardian",
    resource: "appointment",
    action: "book",
    purposes: ["care-delivery", "care-coordination"]
  },
  {
    actorRole: "caregiver",
    resource: "appointment",
    action: "read",
    purposes: ["care-delivery", "care-coordination"]
  },
  {
    actorRole: "clinician",
    resource: "appointment",
    action: "read",
    purposes: ["care-delivery", "care-coordination", "emergency-care"]
  },
  // Consultation resource (roadmap M5.3). Read and conduct flow through the full
  // pipeline; an RBAC match only opens the door for consent / ReBAC / break-glass.
  {
    actorRole: "patient",
    resource: "consultation",
    action: "read",
    purposes: ["care-delivery", "care-coordination"]
  },
  {
    actorRole: "guardian",
    resource: "consultation",
    action: "read",
    purposes: ["care-delivery", "care-coordination", "emergency-care"]
  },
  {
    actorRole: "caregiver",
    resource: "consultation",
    action: "read",
    purposes: ["care-delivery", "care-coordination"]
  },
  {
    actorRole: "clinician",
    resource: "consultation",
    action: "read",
    purposes: ["care-delivery", "care-coordination", "emergency-care"]
  },
  {
    actorRole: "clinician",
    resource: "consultation",
    action: "conduct",
    purposes: ["care-delivery", "emergency-care"]
  },
  // Prescription resource (roadmap M5.5). Read for the care circle; prescribing is
  // a clinical WRITE (encounter-required via ABAC) restricted to clinicians.
  {
    actorRole: "patient",
    resource: "prescription",
    action: "read",
    purposes: ["care-delivery", "care-coordination"]
  },
  {
    actorRole: "guardian",
    resource: "prescription",
    action: "read",
    purposes: ["care-delivery", "care-coordination", "emergency-care"]
  },
  {
    actorRole: "caregiver",
    resource: "prescription",
    action: "read",
    purposes: ["care-delivery", "care-coordination"]
  },
  {
    actorRole: "clinician",
    resource: "prescription",
    action: "read",
    purposes: ["care-delivery", "care-coordination", "emergency-care"]
  },
  {
    actorRole: "clinician",
    resource: "prescription",
    action: "write",
    purposes: ["care-delivery", "emergency-care"]
  },
  // Laboratory resource (roadmap M5.6). Read for the care circle; ordering a lab
  // is a clinical WRITE (encounter-required via ABAC) restricted to clinicians.
  {
    actorRole: "patient",
    resource: "laboratory",
    action: "read",
    purposes: ["care-delivery", "care-coordination"]
  },
  {
    actorRole: "guardian",
    resource: "laboratory",
    action: "read",
    purposes: ["care-delivery", "care-coordination", "emergency-care"]
  },
  {
    actorRole: "caregiver",
    resource: "laboratory",
    action: "read",
    purposes: ["care-delivery", "care-coordination"]
  },
  {
    actorRole: "clinician",
    resource: "laboratory",
    action: "read",
    purposes: ["care-delivery", "care-coordination", "emergency-care"]
  },
  {
    actorRole: "clinician",
    resource: "laboratory",
    action: "write",
    purposes: ["care-delivery", "emergency-care"]
  },
  // Secure messaging resource (roadmap M5.7). Read + send for the care circle.
  // Sending is a non-encounter write (patients message providers between visits),
  // so it uses the 'send' action, which does not trigger the encounter constraint.
  {
    actorRole: "patient",
    resource: "message",
    action: "read",
    purposes: ["care-delivery", "care-coordination"]
  },
  {
    actorRole: "patient",
    resource: "message",
    action: "send",
    purposes: ["care-delivery", "care-coordination"]
  },
  {
    actorRole: "guardian",
    resource: "message",
    action: "read",
    purposes: ["care-delivery", "care-coordination", "emergency-care"]
  },
  {
    actorRole: "guardian",
    resource: "message",
    action: "send",
    purposes: ["care-delivery", "care-coordination"]
  },
  {
    actorRole: "caregiver",
    resource: "message",
    action: "read",
    purposes: ["care-delivery", "care-coordination"]
  },
  {
    actorRole: "caregiver",
    resource: "message",
    action: "send",
    purposes: ["care-delivery", "care-coordination"]
  },
  {
    actorRole: "clinician",
    resource: "message",
    action: "read",
    purposes: ["care-delivery", "care-coordination", "emergency-care"]
  },
  {
    actorRole: "clinician",
    resource: "message",
    action: "send",
    purposes: ["care-delivery", "care-coordination", "emergency-care"]
  },
  // Document resource (roadmap M5.8). Read + upload for the care circle. Uploading
  // is a non-encounter write (a patient may upload an insurance card between
  // visits), so it uses the 'upload' action, which does not trigger the encounter
  // constraint. An authorized read is what grants access to the storage pointer.
  {
    actorRole: "patient",
    resource: "document",
    action: "read",
    purposes: ["care-delivery", "care-coordination"]
  },
  {
    actorRole: "patient",
    resource: "document",
    action: "upload",
    purposes: ["care-delivery", "care-coordination"]
  },
  {
    actorRole: "guardian",
    resource: "document",
    action: "read",
    purposes: ["care-delivery", "care-coordination", "emergency-care"]
  },
  {
    actorRole: "guardian",
    resource: "document",
    action: "upload",
    purposes: ["care-delivery", "care-coordination"]
  },
  {
    actorRole: "caregiver",
    resource: "document",
    action: "read",
    purposes: ["care-delivery", "care-coordination"]
  },
  {
    actorRole: "clinician",
    resource: "document",
    action: "read",
    purposes: ["care-delivery", "care-coordination", "emergency-care"]
  },
  {
    actorRole: "clinician",
    resource: "document",
    action: "upload",
    purposes: ["care-delivery", "care-coordination", "emergency-care"]
  },
  {
    actorRole: "guardian",
    resource: "clinical-record-summary",
    action: "read",
    purposes: ["care-delivery", "care-coordination", "emergency-care"]
  },
  {
    actorRole: "guardian",
    resource: "consent-preferences",
    action: "update-consent",
    purposes: ["consent-management"]
  },
  {
    actorRole: "caregiver",
    resource: "clinical-record-summary",
    action: "read",
    purposes: ["care-delivery", "care-coordination"]
  },
  {
    actorRole: "caregiver",
    resource: "consultation-room",
    action: "read",
    purposes: ["care-delivery"]
  },
  {
    actorRole: "clinician",
    resource: "clinical-record-summary",
    action: "read",
    purposes: ["care-delivery", "care-coordination", "emergency-care"]
  },
  {
    actorRole: "clinician",
    resource: "clinical-record-summary",
    action: "write",
    purposes: ["care-delivery", "emergency-care"]
  },
  {
    actorRole: "clinician",
    resource: "clinical-record-summary",
    action: "amend",
    purposes: ["care-delivery", "emergency-care"]
  },
  {
    actorRole: "sponsor",
    resource: "billing-ledger",
    action: "read-billing",
    purposes: ["payment-operations"]
  },
  {
    actorRole: "sponsor",
    resource: "payment-status",
    action: "read-payment-status",
    purposes: ["payment-operations"]
  },
  {
    actorRole: "payer",
    resource: "billing-ledger",
    action: "read-billing",
    purposes: ["payment-operations"]
  },
  {
    actorRole: "payer",
    resource: "payment-status",
    action: "read-payment-status",
    purposes: ["payment-operations"]
  },
  {
    actorRole: "employer",
    resource: "billing-ledger",
    action: "read-billing",
    purposes: ["payment-operations"]
  },
  {
    actorRole: "hmo",
    resource: "billing-ledger",
    action: "read-billing",
    purposes: ["payment-operations"]
  },
  {
    actorRole: "hmo",
    resource: "payment-status",
    action: "read-payment-status",
    purposes: ["payment-operations"]
  },
  {
    actorRole: "support",
    resource: "support-case",
    action: "read-support",
    purposes: ["support-operations"]
  },
  {
    actorRole: "organization-admin",
    resource: "tenant-membership",
    action: "manage-tenant-membership",
    purposes: ["tenant-administration"]
  },
  {
    actorRole: "platform-admin",
    resource: "tenant-membership",
    action: "manage-tenant-membership",
    purposes: ["tenant-administration"]
  },
  {
    actorRole: "platform-admin",
    resource: "support-case",
    action: "read-support",
    purposes: ["support-operations"]
  }
];

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

  const matchingRule = findPolicyRule(input);
  if (!matchingRule) {
    return {
      status: "denied",
      reasonCode: "rbac-policy-unmapped-deny-default"
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
  const matchingRule = findPolicyRule(input);
  if (!matchingRule) {
    return {
      status: "denied",
      reasonCode: "rbac-policy-unmapped-deny-default"
    };
  }

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

  if (!matchingRule.purposes.includes(input.purpose)) {
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
    "rbac-policy-unmapped-deny-default": ["request-policy-exception-review"],
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

function findPolicyRule(
  input: AuthorizationPolicyDecisionDraftInput
): AuthorizationPolicyRule | undefined {
  return policyRules.find(
    (rule) =>
      rule.actorRole === input.actorRole &&
      rule.resource === input.requestedResource &&
      rule.action === input.requestedAction
  );
}
