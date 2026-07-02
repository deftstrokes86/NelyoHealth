import { describe, expect, it } from "vitest";
import {
  InMemoryRelationshipRepository,
  RelationshipWorkflowService
} from "./relationship-workflows.js";

function createPendingRelationship(relationshipId: string, relationshipType: "guardian" | "household" | "sponsor" | "caregiver-delegation" | "emergency-contact" | "clinical-proxy") {
  return {
    relationshipId,
    relationshipType,
    actorId: "actor-1",
    patientId: "patient-1",
    organizationId: "tenant-1",
    lifecycle: {
      status: "none" as const,
      verificationMethod: "self-attested" as const,
      effectiveDate: "2026-01-01T00:00:00.000Z",
      expiryDate: "2027-01-01T00:00:00.000Z",
      permittedActions: ["read", "update-consent"],
      supportingDocuments: [],
      reviewHistory: []
    }
  };
}

describe("relationship workflow service", () => {
  it("runs verification, review approval, and document handling workflows", () => {
    const repository = new InMemoryRelationshipRepository();
    const workflows = new RelationshipWorkflowService(repository);

    workflows.createRelationship({
      relationship: createPendingRelationship("rel-1", "guardian")
    });

    const verified = workflows.verifyRelationship({
      relationshipId: "rel-1",
      verificationMethod: "legal-document",
      verifiedByActorId: "verifier-1",
      verifiedAt: "2026-01-02T00:00:00.000Z"
    });

    expect(verified.lifecycle.verificationMethod).toBe("legal-document");
    expect(verified.lifecycle.reviewHistory.at(-1)?.outcome).toBe("manual-review-required");

    const withDocument = workflows.addSupportingDocument({
      relationshipId: "rel-1",
      document: {
        documentId: "doc-1",
        documentType: "court-order",
        addedAt: "2026-01-02T01:00:00.000Z",
        addedByActorId: "verifier-1"
      }
    });

    expect(withDocument.lifecycle.supportingDocuments).toHaveLength(1);

    const approved = workflows.reviewRelationship({
      relationshipId: "rel-1",
      reviewedByActorId: "reviewer-1",
      reviewedAt: "2026-01-03T00:00:00.000Z",
      outcome: "approved"
    });

    expect(approved.lifecycle.status).toBe("active");
    expect(approved.lifecycle.reviewHistory.at(-1)?.outcome).toBe("approved");
  });

  it("supports all required relationship types in persistence-backed flows", () => {
    const repository = new InMemoryRelationshipRepository();
    const workflows = new RelationshipWorkflowService(repository);

    const types = [
      "guardian",
      "household",
      "sponsor",
      "caregiver-delegation",
      "emergency-contact",
      "clinical-proxy"
    ] as const;

    for (const [index, relationshipType] of types.entries()) {
      const relationshipId = `rel-type-${index}`;
      workflows.createRelationship({
        relationship: createPendingRelationship(relationshipId, relationshipType)
      });

      const approved = workflows.reviewRelationship({
        relationshipId,
        reviewedByActorId: "reviewer-1",
        reviewedAt: `2026-01-0${index + 1}T00:00:00.000Z`,
        outcome: "approved"
      });

      expect(approved.relationshipType).toBe(relationshipType);
      expect(approved.lifecycle.status).toBe("active");
    }
  });

  it("runs revocation and expiry automation workflows", () => {
    const repository = new InMemoryRelationshipRepository();
    const workflows = new RelationshipWorkflowService(repository);

    workflows.createRelationship({
      relationship: createPendingRelationship("rel-revoke", "caregiver-delegation")
    });

    workflows.reviewRelationship({
      relationshipId: "rel-revoke",
      reviewedByActorId: "reviewer-1",
      reviewedAt: "2026-01-03T00:00:00.000Z",
      outcome: "approved"
    });

    const revoked = workflows.revokeRelationship({
      relationshipId: "rel-revoke",
      revokedAt: "2026-02-01T00:00:00.000Z",
      revokedByActorId: "reviewer-1",
      reason: "withdrawn"
    });

    expect(revoked.lifecycle.status).toBe("revoked");
    expect(revoked.lifecycle.revocationInfo?.reason).toBe("withdrawn");

    workflows.createRelationship({
      relationship: {
        ...createPendingRelationship("rel-expire", "clinical-proxy"),
        lifecycle: {
          ...createPendingRelationship("rel-expire", "clinical-proxy").lifecycle,
          status: "active",
          expiryDate: "2026-01-10T00:00:00.000Z"
        }
      }
    });

    const expired = workflows.runExpiryAutomation("2026-01-11T00:00:00.000Z");
    expect(expired.map((entry) => entry.relationshipId)).toContain("rel-expire");

    const afterExpiry = workflows.getRelationship("rel-expire");
    expect(afterExpiry?.lifecycle.status).toBe("expired");
  });
});
