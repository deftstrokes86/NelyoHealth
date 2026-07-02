import type { AuthorizationRelationshipDraft } from "./relationship-model.js";
import type { ConsentDomain, ConsentRecordDraft } from "./granular-consent.js";

export type ConsentStatus = "granted" | "revoked" | "expired";
export type RelationshipStatus = "active" | "revoked" | "expired" | "none";
export type SessionStatus = "active" | "stale" | "revoked";
export type AuthorizationActorRole =
  | "patient"
  | "guardian"
  | "sponsor"
  | "caregiver"
  | "clinician"
  | "support"
  | "organization-admin"
  | "platform-admin"
  | "payer"
  | "employer"
  | "hmo";
export type RelationshipType =
  | "guardian"
  | "household"
  | "sponsor"
  | "caregiver-delegation"
  | "emergency-contact"
  | "clinical-proxy"
  | "none";
export type EmergencyStatus = "none" | "declared";
export type AuthorizationPolicyDimensionStatus = "allowed" | "denied" | "challenge-required";

export interface AuthorizationPolicyDimensionOutcome {
  status: AuthorizationPolicyDimensionStatus;
  reasonCode: AuthorizationPolicyDecisionDraft["reasonCode"];
}

export interface AuthorizationPolicyDecisionDraftInput {
  decisionRequestId: string;
  actorId: string;
  actorRole: AuthorizationActorRole;
  actorType: "patient" | "guardian" | "sponsor" | "caregiver" | "clinician" | "support" | "admin";
  organizationId: string;
  patientId: string;
  relationshipType: RelationshipType;
  relationship?: AuthorizationRelationshipDraft;
  requestedConsentDomains: ConsentDomain[];
  consent?: ConsentRecordDraft;
  requestedResource: string;
  requestedAction: string;
  purpose: string;
  consentStatus: ConsentStatus;
  relationshipStatus: RelationshipStatus;
  sessionStatus: SessionStatus;
  activeEncounter: boolean;
  emergencyStatus: EmergencyStatus;
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
    | "rbac-policy-unmapped-deny-default"
    | "rbac-role-not-permitted"
    | "abac-purpose-not-allowed"
    | "abac-time-window-not-allowed"
    | "abac-encounter-required"
    | "tenant-mismatch"
    | "stale-session"
    | "consent-missing"
    | "consent-version-stale"
    | "consent-scope-not-granted"
    | "consent-not-yet-effective"
    | "consent-revoked"
    | "consent-expired"
    | "relationship-missing"
    | "relationship-not-yet-effective"
    | "relationship-action-not-permitted"
    | "relationship-revoked"
    | "relationship-expired"
    | "sponsor-payment-no-clinical-access"
    | "break-glass-reason-required"
    | "break-glass-window-exceeded"
    | "administrator-impersonation-denied"
    | "audit-event-append-only";
  dimensionOutcomes: {
    rbac: AuthorizationPolicyDimensionOutcome;
    abac: AuthorizationPolicyDimensionOutcome;
    rebac: AuthorizationPolicyDimensionOutcome;
  };
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
