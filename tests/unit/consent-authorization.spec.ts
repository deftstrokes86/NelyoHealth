import { describe, expect, it } from "vitest";
import type { PersistedConsentRecord } from "../../packages/database/src/index.js";
import {
  decideAuthorizationWithPersistedConsent,
  derivePersistedConsentStatus,
  mapPersistedConsentToDraft,
  type ConsentAuthorizationBaseInput
} from "../../apps/api/src/consent-service.js";

/**
 * M4.1 consent → authorization integration (pure, no database).
 *
 * Proves the core invariant of consent persistence: the authorization decision
 * reads the CURRENT persisted consent and derives status at decision time, so a
 * change in persisted state (a withdrawal, a narrowed re-grant, an expiry) is
 * reflected in the very next decision with no cached consent anywhere on the
 * path. This is the same decideAuthorizationWithPersistedConsent the runtime
 * calls after loading from Postgres — here it is driven with in-memory records
 * so the propagation property is asserted deterministically.
 */

const EVALUATED_AT = "2026-07-02T12:00:00.000Z";

/**
 * An otherwise-permissive decision context: RBAC, ABAC (non-consent), and
 * ReBAC all pass, so the CONSENT dimension is the sole deciding factor. The
 * requested action needs the telemedicine + provider-data-sharing domains.
 */
const base: ConsentAuthorizationBaseInput = {
  decisionRequestId: "consent-authz-unit-1",
  actorId: "actor-1",
  actorRole: "guardian",
  actorType: "guardian",
  organizationId: "tenant-1",
  patientId: "patient-1",
  relationshipType: "guardian",
  relationship: {
    relationshipId: "rel-1",
    relationshipType: "guardian",
    actorId: "actor-1",
    patientId: "patient-1",
    organizationId: "tenant-1",
    lifecycle: {
      status: "active",
      verificationMethod: "legal-document",
      effectiveDate: "2026-01-01T00:00:00.000Z",
      expiryDate: "2027-01-01T00:00:00.000Z",
      permittedActions: ["read", "update-consent"],
      supportingDocuments: [],
      reviewHistory: []
    }
  },
  requestedConsentDomains: ["telemedicine", "provider-data-sharing"],
  requestedResource: "clinical-record-summary",
  requestedAction: "read",
  purpose: "care-delivery",
  relationshipStatus: "active",
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

function grantedRecord(): PersistedConsentRecord {
  return {
    consentId: "consent-1",
    patientRef: "patient-1",
    organizationRef: "tenant-1",
    currentVersion: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    versions: [
      {
        version: 1,
        status: "granted",
        grantedDomains: ["telemedicine", "provider-data-sharing"],
        effectiveDate: "2026-01-01T00:00:00.000Z",
        createdAt: "2026-01-01T00:00:00.000Z",
        createdByActorRef: "patient-1"
      }
    ]
  };
}

/** What withdrawConsent persists: the current version flipped to 'revoked'. */
function withdraw(record: PersistedConsentRecord): PersistedConsentRecord {
  return {
    ...record,
    updatedAt: "2026-03-01T00:00:00.000Z",
    versions: record.versions.map((version) =>
      version.version === record.currentVersion
        ? {
            ...version,
            status: "revoked",
            revokedAt: "2026-03-01T00:00:00.000Z",
            revokedByActorRef: "patient-1",
            revocationReason: "patient-request"
          }
        : version
    )
  };
}

describe("M4.1 consent-gated authorization (persisted-consent read-through)", () => {
  it("denies with consent-missing when no consent is persisted (default-deny)", () => {
    const decision = decideAuthorizationWithPersistedConsent(base, null);
    expect(decision.status).toBe("denied");
    expect(decision.reasonCode).toBe("consent-missing");
  });

  it("allows when the current persisted version grants the required domains", () => {
    const decision = decideAuthorizationWithPersistedConsent(base, grantedRecord());
    expect(decision.status).toBe("allowed");
    expect(decision.reasonCode).toBe("allowed");
  });

  it("propagates a withdrawal to the very next decision (no cached consent)", () => {
    const granted = grantedRecord();
    // Same base decision, same subject — only the persisted state changes.
    expect(decideAuthorizationWithPersistedConsent(base, granted).status).toBe("allowed");

    const afterWithdrawal = decideAuthorizationWithPersistedConsent(base, withdraw(granted));
    expect(afterWithdrawal.status).toBe("denied");
    expect(afterWithdrawal.reasonCode).toBe("consent-revoked");
  });

  it("denies with consent-scope-not-granted when a re-grant narrows the domains", () => {
    // Version 1 granted both domains; version 2 supersedes with telemedicine only.
    const narrowed: PersistedConsentRecord = {
      ...grantedRecord(),
      currentVersion: 2,
      updatedAt: "2026-02-01T00:00:00.000Z",
      versions: [
        {
          version: 1,
          status: "granted",
          grantedDomains: ["telemedicine", "provider-data-sharing"],
          effectiveDate: "2026-01-01T00:00:00.000Z",
          supersededByVersion: 2,
          createdAt: "2026-01-01T00:00:00.000Z",
          createdByActorRef: "patient-1"
        },
        {
          version: 2,
          status: "granted",
          grantedDomains: ["telemedicine"],
          effectiveDate: "2026-02-01T00:00:00.000Z",
          createdAt: "2026-02-01T00:00:00.000Z",
          createdByActorRef: "patient-1"
        }
      ]
    };
    const decision = decideAuthorizationWithPersistedConsent(base, narrowed);
    expect(decision.status).toBe("denied");
    expect(decision.reasonCode).toBe("consent-scope-not-granted");
  });

  it("denies with consent-expired when the current version's expiry has passed", () => {
    const expired: PersistedConsentRecord = {
      ...grantedRecord(),
      versions: [
        {
          version: 1,
          status: "granted",
          grantedDomains: ["telemedicine", "provider-data-sharing"],
          effectiveDate: "2026-01-01T00:00:00.000Z",
          expiryDate: "2026-06-01T00:00:00.000Z", // before EVALUATED_AT
          createdAt: "2026-01-01T00:00:00.000Z",
          createdByActorRef: "patient-1"
        }
      ]
    };
    const decision = decideAuthorizationWithPersistedConsent(base, expired);
    expect(decision.status).toBe("denied");
    expect(decision.reasonCode).toBe("consent-expired");
  });

  it("derives ConsentStatus from the current version and maps to the PDP draft shape", () => {
    const granted = grantedRecord();
    expect(derivePersistedConsentStatus(granted)).toBe("granted");
    expect(derivePersistedConsentStatus(withdraw(granted))).toBe("revoked");

    const draft = mapPersistedConsentToDraft(granted);
    expect(draft).toMatchObject({
      consentId: "consent-1",
      patientId: "patient-1",
      organizationId: "tenant-1",
      currentVersion: 1
    });
    expect(draft.versions[0]).toMatchObject({
      version: 1,
      status: "granted",
      createdByActorId: "patient-1"
    });
    expect(draft.versions[0]?.grantedDomains).toEqual(["telemedicine", "provider-data-sharing"]);
  });
});
