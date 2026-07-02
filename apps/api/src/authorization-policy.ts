export type ConsentStatus = "granted" | "revoked" | "expired";
export type RelationshipStatus = "active" | "revoked" | "expired" | "none";
export type SessionStatus = "active" | "stale" | "revoked";

export interface AuthorizationPolicyDecisionDraftInput {
  decisionRequestId: string;
  actorId: string;
  actorRole: string;
  organizationId: string;
  patientId: string;
  requestedResource: string;
  requestedAction: string;
  purpose: string;
  consentStatus: ConsentStatus;
  relationshipStatus: RelationshipStatus;
  sessionStatus: SessionStatus;
  sameTenant: boolean;
  sponsorPaymentOnly: boolean;
  requiresRelationship: boolean;
  breakGlassRequested: boolean;
  breakGlassReason?: string;
  breakGlassWindowMinutes?: number;
  impersonationAttempt: boolean;
  auditEventEditAttempt: boolean;
  evaluatedAt: string;
}

export interface AuditIntentDraft {
  appendOnly: true;
  eventType: "authorization-policy-decision";
  actorId: string;
  patientId: string;
  organizationId: string;
  requestedResource: string;
  requestedAction: string;
  purpose: string;
  decisionStatus: "allowed" | "denied" | "challenge-required";
  reasonCode: AuthorizationPolicyDecisionDraft["reasonCode"];
  breakGlassUsed: boolean;
  requestId: string;
  occurredAt: string;
}

export interface AuthorizationPolicyDecisionDraft {
  decisionRequestId: string;
  status: "allowed" | "denied" | "challenge-required";
  reasonCode:
    | "allowed"
    | "tenant-mismatch"
    | "stale-session"
    | "consent-revoked"
    | "relationship-revoked"
    | "relationship-expired"
    | "sponsor-payment-no-clinical-access"
    | "break-glass-reason-required"
    | "break-glass-window-exceeded"
    | "administrator-impersonation-denied"
    | "audit-event-append-only";
  breakGlassActive: boolean;
  nextSteps: string[];
  auditIntent: AuditIntentDraft;
  evaluatedAt: string;
}

export function createAuthorizationPolicyDecisionDraftInput(
  input: AuthorizationPolicyDecisionDraftInput
): AuthorizationPolicyDecisionDraftInput {
  return {
    ...input
  };
}
