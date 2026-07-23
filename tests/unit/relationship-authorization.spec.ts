import { describe, expect, it } from "vitest";
import type { PersistedRelationship } from "../../packages/database/src/index.js";
import {
  decideAuthorizationWithPersistedRelationship,
  mapPersistedRelationshipToDraft,
  type RelationshipAuthorizationBaseInput
} from "../../apps/api/src/relationship-service.js";

/**
 * M4.2 relationship → authorization integration (pure, no database).
 *
 * Proves the core invariant of relationship persistence: the ReBAC dimension
 * reads the CURRENT persisted relationship and derives status at decision time,
 * so a change in persisted state (a revocation, an expiry that has passed, a
 * re-establishment) is reflected in the very next decision with no cached
 * relationship on the path. Also exercises the dependent/minor and diaspora
 * family access patterns, which the soft-reference graph supports without any
 * cross-context coupling.
 */

const EVALUATED_AT = "2026-07-02T12:00:00.000Z";

/**
 * An otherwise-permissive decision context that REQUIRES a relationship, so the
 * ReBAC dimension is the sole deciding factor. Consent is granted; the read
 * action needs the relationship to permit "read".
 */
function base(
  actorId: string,
  patientId: string,
  organizationId: string
): RelationshipAuthorizationBaseInput {
  return {
    decisionRequestId: "rel-authz-unit-1",
    actorId,
    actorRole: "guardian",
    actorType: "guardian",
    organizationId,
    patientId,
    requestedConsentDomains: [],
    consent: {
      consentId: "consent-x",
      patientId,
      organizationId,
      currentVersion: 1,
      updatedAt: "2026-01-01T00:00:00.000Z",
      versions: [
        {
          version: 1,
          status: "granted",
          grantedDomains: [],
          effectiveDate: "2026-01-01T00:00:00.000Z",
          createdAt: "2026-01-01T00:00:00.000Z",
          createdByActorId: patientId
        }
      ]
    },
    consentStatus: "granted",
    requestedResource: "clinical-record-summary",
    requestedAction: "read",
    purpose: "care-delivery",
    sessionStatus: "active",
    activeEncounter: true,
    emergencyStatus: "none",
    sameTenant: true,
    sponsorPaymentOnly: false,
    requiresRelationship: true,
    breakGlassRequested: false,
    impersonationAttempt: false,
    auditEventEditAttempt: false,
    evaluatedAt: EVALUATED_AT
  };
}

function guardianOf(
  actorRef: string,
  patientRef: string,
  organizationRef: string
): PersistedRelationship {
  return {
    relationshipId: "rel-1",
    actorRef,
    patientRef,
    organizationRef,
    relationshipType: "guardian",
    status: "active",
    verificationMethod: "legal-document",
    effectiveDate: "2026-01-01T00:00:00.000Z",
    expiryDate: "2027-01-01T00:00:00.000Z",
    permittedActions: ["read", "update-consent"],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  };
}

/** What revokeRelationship persists: status revoked + revocation info. */
function revoke(record: PersistedRelationship): PersistedRelationship {
  return {
    ...record,
    status: "revoked",
    revokedAt: "2026-03-01T00:00:00.000Z",
    revokedByActorRef: "org-admin-1",
    revocationReason: "guardianship-ended",
    updatedAt: "2026-03-01T00:00:00.000Z"
  };
}

describe("M4.2 relationship-gated authorization (persisted-relationship read-through)", () => {
  it("denies with relationship-missing when none is persisted (default-deny)", () => {
    const decision = decideAuthorizationWithPersistedRelationship(
      base("guardian-1", "minor-1", "org-1"),
      null
    );
    expect(decision.status).toBe("denied");
    expect(decision.reasonCode).toBe("relationship-missing");
  });

  it("allows a guardian to act for a dependent minor (dependent access pattern)", () => {
    const decision = decideAuthorizationWithPersistedRelationship(
      base("guardian-1", "minor-1", "org-1"),
      guardianOf("guardian-1", "minor-1", "org-1")
    );
    expect(decision.status).toBe("allowed");
    expect(decision.reasonCode).toBe("allowed");
  });

  it("allows a diaspora caregiver whose org differs from the patient's residence", () => {
    // The relationship is scoped only by soft actor/patient/org refs — no
    // geographic or cross-context coupling. A caregiver abroad holds authority
    // over a patient through an org-scoped delegation.
    const caregiver: PersistedRelationship = {
      ...guardianOf("caregiver-abroad", "patient-home", "org-diaspora"),
      relationshipType: "caregiver-delegation"
    };
    const decision = decideAuthorizationWithPersistedRelationship(
      base("caregiver-abroad", "patient-home", "org-diaspora"),
      caregiver
    );
    expect(decision.status).toBe("allowed");
  });

  it("propagates a revocation to the very next decision (no cached relationship)", () => {
    const active = guardianOf("guardian-1", "minor-1", "org-1");
    expect(
      decideAuthorizationWithPersistedRelationship(base("guardian-1", "minor-1", "org-1"), active)
        .status
    ).toBe("allowed");

    const afterRevoke = decideAuthorizationWithPersistedRelationship(
      base("guardian-1", "minor-1", "org-1"),
      revoke(active)
    );
    expect(afterRevoke.status).toBe("denied");
    expect(afterRevoke.reasonCode).toBe("relationship-revoked");
  });

  it("derives expiry at decision time when expiry_date has passed", () => {
    const expiredByDate: PersistedRelationship = {
      ...guardianOf("guardian-1", "minor-1", "org-1"),
      expiryDate: "2026-06-01T00:00:00.000Z" // before EVALUATED_AT, status still 'active'
    };
    const decision = decideAuthorizationWithPersistedRelationship(
      base("guardian-1", "minor-1", "org-1"),
      expiredByDate
    );
    expect(decision.status).toBe("denied");
    expect(decision.reasonCode).toBe("relationship-expired");
  });

  it("denies with relationship-action-not-permitted when the action is outside scope", () => {
    const readOnly: PersistedRelationship = {
      ...guardianOf("guardian-1", "minor-1", "org-1"),
      permittedActions: ["update-consent"] // does not include "read"
    };
    const decision = decideAuthorizationWithPersistedRelationship(
      base("guardian-1", "minor-1", "org-1"),
      readOnly
    );
    expect(decision.status).toBe("denied");
    expect(decision.reasonCode).toBe("relationship-action-not-permitted");
  });

  it("maps a persisted relationship to the PDP draft shape", () => {
    const draft = mapPersistedRelationshipToDraft(revoke(guardianOf("g", "p", "o")));
    expect(draft).toMatchObject({
      relationshipId: "rel-1",
      relationshipType: "guardian",
      actorId: "g",
      patientId: "p",
      organizationId: "o"
    });
    expect(draft.lifecycle.status).toBe("revoked");
    expect(draft.lifecycle.revocationInfo).toMatchObject({ reason: "guardianship-ended" });
    expect(draft.lifecycle.permittedActions).toEqual(["read", "update-consent"]);
  });
});
