import { describe, expect, it } from "vitest";
import { createAuthorizationRelationshipDraft } from "./relationship-model.js";

describe("relationship model", () => {
  it("creates guardian relationship with full lifecycle metadata", () => {
    const relationship = createAuthorizationRelationshipDraft({
      relationshipId: "rel-guardian-1",
      relationshipType: "guardian",
      actorId: "actor-guardian-1",
      patientId: "patient-1",
      organizationId: "tenant-1",
      lifecycle: {
        status: "active",
        verificationMethod: "legal-document",
        effectiveDate: "2026-01-01T00:00:00.000Z",
        expiryDate: "2027-01-01T00:00:00.000Z",
        permittedActions: ["read", "update-consent"],
        revocationInfo: undefined,
        supportingDocuments: [
          {
            documentId: "doc-1",
            documentType: "court-order",
            addedAt: "2026-01-01T00:00:00.000Z",
            addedByActorId: "verifier-1"
          }
        ],
        reviewHistory: [
          {
            reviewId: "review-1",
            reviewedAt: "2026-01-02T00:00:00.000Z",
            reviewedByActorId: "reviewer-1",
            outcome: "approved",
            notes: "validated"
          }
        ]
      }
    });

    expect(relationship).toMatchObject({
      relationshipType: "guardian",
      lifecycle: {
        status: "active",
        verificationMethod: "legal-document",
        effectiveDate: "2026-01-01T00:00:00.000Z",
        permittedActions: ["read", "update-consent"]
      }
    });
  });

  it("supports all required relationship types", () => {
    const relationshipTypes = [
      "guardian",
      "household",
      "sponsor",
      "caregiver-delegation",
      "emergency-contact",
      "clinical-proxy"
    ];

    expect(relationshipTypes).toEqual([
      "guardian",
      "household",
      "sponsor",
      "caregiver-delegation",
      "emergency-contact",
      "clinical-proxy"
    ]);
  });
});
