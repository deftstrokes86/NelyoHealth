export type RelationshipLifecycleStatus = "active" | "revoked" | "expired" | "none";
export type RelationshipVerificationMethod =
  | "government-id"
  | "clinical-attestation"
  | "organization-attestation"
  | "legal-document"
  | "self-attested";

export interface RelationshipSupportingDocumentDraft {
  documentId: string;
  documentType: string;
  addedAt: string;
  addedByActorId: string;
}

export interface RelationshipReviewHistoryEntryDraft {
  reviewId: string;
  reviewedAt: string;
  reviewedByActorId: string;
  outcome: "approved" | "rejected" | "manual-review-required";
  notes?: string;
}

export interface RelationshipRevocationInfoDraft {
  revokedAt: string;
  revokedByActorId: string;
  reason: string;
}

export interface RelationshipLifecycleDraft {
  status: RelationshipLifecycleStatus;
  verificationMethod: RelationshipVerificationMethod;
  effectiveDate: string;
  expiryDate?: string;
  permittedActions: string[];
  revocationInfo?: RelationshipRevocationInfoDraft;
  supportingDocuments: RelationshipSupportingDocumentDraft[];
  reviewHistory: RelationshipReviewHistoryEntryDraft[];
}

interface RelationshipBaseDraft {
  relationshipId: string;
  actorId: string;
  patientId: string;
  organizationId: string;
  lifecycle: RelationshipLifecycleDraft;
}

export interface GuardianRelationship extends RelationshipBaseDraft {
  relationshipType: "guardian";
}

export interface HouseholdRelationship extends RelationshipBaseDraft {
  relationshipType: "household";
}

export interface SponsorRelationship extends RelationshipBaseDraft {
  relationshipType: "sponsor";
}

export interface CaregiverDelegation extends RelationshipBaseDraft {
  relationshipType: "caregiver-delegation";
}

export interface EmergencyContact extends RelationshipBaseDraft {
  relationshipType: "emergency-contact";
}

export interface ClinicalProxy extends RelationshipBaseDraft {
  relationshipType: "clinical-proxy";
}

export type AuthorizationRelationshipDraft =
  | GuardianRelationship
  | HouseholdRelationship
  | SponsorRelationship
  | CaregiverDelegation
  | EmergencyContact
  | ClinicalProxy;

export function createAuthorizationRelationshipDraft(
  input: AuthorizationRelationshipDraft
): AuthorizationRelationshipDraft {
  return {
    ...input,
    lifecycle: {
      ...input.lifecycle,
      permittedActions: [...input.lifecycle.permittedActions],
      supportingDocuments: [...input.lifecycle.supportingDocuments],
      reviewHistory: [...input.lifecycle.reviewHistory]
    }
  };
}
