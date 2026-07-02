import {
  createAuthorizationRelationshipDraft,
  type AuthorizationRelationshipDraft,
  type RelationshipReviewHistoryEntryDraft,
  type RelationshipSupportingDocumentDraft,
  type RelationshipVerificationMethod
} from "./relationship-model.js";

export interface RelationshipRepository {
  save(relationship: AuthorizationRelationshipDraft): AuthorizationRelationshipDraft;
  getById(relationshipId: string): AuthorizationRelationshipDraft | null;
  listByOrganization(organizationId: string): AuthorizationRelationshipDraft[];
  listAll(): AuthorizationRelationshipDraft[];
}

export class InMemoryRelationshipRepository implements RelationshipRepository {
  private readonly records = new Map<string, AuthorizationRelationshipDraft>();

  save(relationship: AuthorizationRelationshipDraft): AuthorizationRelationshipDraft {
    const copy = createAuthorizationRelationshipDraft(relationship);
    this.records.set(copy.relationshipId, copy);
    return createAuthorizationRelationshipDraft(copy);
  }

  getById(relationshipId: string): AuthorizationRelationshipDraft | null {
    const record = this.records.get(relationshipId);
    return record ? createAuthorizationRelationshipDraft(record) : null;
  }

  listByOrganization(organizationId: string): AuthorizationRelationshipDraft[] {
    return [...this.records.values()]
      .filter((relationship) => relationship.organizationId === organizationId)
      .map((relationship) => createAuthorizationRelationshipDraft(relationship));
  }

  listAll(): AuthorizationRelationshipDraft[] {
    return [...this.records.values()].map((relationship) =>
      createAuthorizationRelationshipDraft(relationship)
    );
  }
}

export interface CreateRelationshipInput {
  relationship: AuthorizationRelationshipDraft;
}

export interface VerifyRelationshipInput {
  relationshipId: string;
  verificationMethod: RelationshipVerificationMethod;
  verifiedByActorId: string;
  verifiedAt: string;
  notes?: string;
}

export interface ReviewRelationshipInput {
  relationshipId: string;
  reviewedByActorId: string;
  reviewedAt: string;
  outcome: RelationshipReviewHistoryEntryDraft["outcome"];
  notes?: string;
}

export interface AddRelationshipDocumentInput {
  relationshipId: string;
  document: RelationshipSupportingDocumentDraft;
}

export interface RevokeRelationshipInput {
  relationshipId: string;
  revokedAt: string;
  revokedByActorId: string;
  reason: string;
}

export class RelationshipWorkflowService {
  constructor(private readonly repository: RelationshipRepository) {}

  createRelationship(input: CreateRelationshipInput): AuthorizationRelationshipDraft {
    return this.repository.save(input.relationship);
  }

  verifyRelationship(input: VerifyRelationshipInput): AuthorizationRelationshipDraft {
    const relationship = this.mustGet(input.relationshipId);

    const verified = createAuthorizationRelationshipDraft({
      ...relationship,
      lifecycle: {
        ...relationship.lifecycle,
        verificationMethod: input.verificationMethod,
        reviewHistory: [
          ...relationship.lifecycle.reviewHistory,
          {
            reviewId: `review-verification-${input.verifiedAt}`,
            reviewedAt: input.verifiedAt,
            reviewedByActorId: input.verifiedByActorId,
            outcome: "manual-review-required",
            notes: input.notes ?? "verification-captured"
          }
        ]
      }
    });

    return this.repository.save(verified);
  }

  reviewRelationship(input: ReviewRelationshipInput): AuthorizationRelationshipDraft {
    const relationship = this.mustGet(input.relationshipId);

    const reviewed = createAuthorizationRelationshipDraft({
      ...relationship,
      lifecycle: {
        ...relationship.lifecycle,
        status: input.outcome === "approved" ? "active" : relationship.lifecycle.status,
        reviewHistory: [
          ...relationship.lifecycle.reviewHistory,
          {
            reviewId: `review-${input.reviewedAt}`,
            reviewedAt: input.reviewedAt,
            reviewedByActorId: input.reviewedByActorId,
            outcome: input.outcome,
            notes: input.notes
          }
        ]
      }
    });

    return this.repository.save(reviewed);
  }

  addSupportingDocument(input: AddRelationshipDocumentInput): AuthorizationRelationshipDraft {
    const relationship = this.mustGet(input.relationshipId);

    const updated = createAuthorizationRelationshipDraft({
      ...relationship,
      lifecycle: {
        ...relationship.lifecycle,
        supportingDocuments: [...relationship.lifecycle.supportingDocuments, input.document]
      }
    });

    return this.repository.save(updated);
  }

  revokeRelationship(input: RevokeRelationshipInput): AuthorizationRelationshipDraft {
    const relationship = this.mustGet(input.relationshipId);

    const revoked = createAuthorizationRelationshipDraft({
      ...relationship,
      lifecycle: {
        ...relationship.lifecycle,
        status: "revoked",
        revocationInfo: {
          revokedAt: input.revokedAt,
          revokedByActorId: input.revokedByActorId,
          reason: input.reason
        }
      }
    });

    return this.repository.save(revoked);
  }

  runExpiryAutomation(asOf: string): AuthorizationRelationshipDraft[] {
    const asOfMs = Date.parse(asOf);
    const expired: AuthorizationRelationshipDraft[] = [];

    for (const relationship of this.repository.listAll()) {
      const expiryMs = relationship.lifecycle.expiryDate
        ? Date.parse(relationship.lifecycle.expiryDate)
        : Number.NaN;

      if (
        relationship.lifecycle.status === "active" &&
        !Number.isNaN(expiryMs) &&
        !Number.isNaN(asOfMs) &&
        expiryMs <= asOfMs
      ) {
        const updated = createAuthorizationRelationshipDraft({
          ...relationship,
          lifecycle: {
            ...relationship.lifecycle,
            status: "expired"
          }
        });
        expired.push(this.repository.save(updated));
      }
    }

    return expired;
  }

  getRelationship(relationshipId: string): AuthorizationRelationshipDraft | null {
    return this.repository.getById(relationshipId);
  }

  private mustGet(relationshipId: string): AuthorizationRelationshipDraft {
    const relationship = this.repository.getById(relationshipId);
    if (!relationship) {
      throw new Error(`Relationship not found: ${relationshipId}`);
    }

    return relationship;
  }
}
