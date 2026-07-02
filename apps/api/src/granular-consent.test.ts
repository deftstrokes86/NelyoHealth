import { describe, expect, it } from "vitest";
import { createConsentRecordDraft } from "./granular-consent.js";

describe("granular consent model", () => {
  it("supports all required consent domains and versioned consent history", () => {
    const consent = createConsentRecordDraft({
      consentId: "consent-1",
      patientId: "patient-1",
      organizationId: "tenant-1",
      currentVersion: 2,
      updatedAt: "2026-07-02T00:00:00.000Z",
      versions: [
        {
          version: 1,
          status: "revoked",
          grantedDomains: ["telemedicine", "provider-data-sharing", "family-participation"],
          effectiveDate: "2026-01-01T00:00:00.000Z",
          revokedAt: "2026-06-01T00:00:00.000Z",
          revokedByActorId: "patient-1",
          revocationReason: "policy-change",
          createdAt: "2026-01-01T00:00:00.000Z",
          createdByActorId: "patient-1",
          supersededByVersion: 2
        },
        {
          version: 2,
          status: "granted",
          grantedDomains: [
            "telemedicine",
            "provider-data-sharing",
            "sponsor-participation",
            "family-participation",
            "caregiver-participation",
            "consultation-participants",
            "recording",
            "marketing",
            "research",
            "cross-border-processing",
            "emergency-access"
          ],
          effectiveDate: "2026-06-01T00:00:00.000Z",
          expiryDate: "2027-06-01T00:00:00.000Z",
          createdAt: "2026-06-01T00:00:00.000Z",
          createdByActorId: "patient-1"
        }
      ]
    });

    expect(consent).toMatchObject({
      currentVersion: 2,
      versions: [
        { version: 1, status: "revoked" },
        {
          version: 2,
          status: "granted",
          grantedDomains: [
            "telemedicine",
            "provider-data-sharing",
            "sponsor-participation",
            "family-participation",
            "caregiver-participation",
            "consultation-participants",
            "recording",
            "marketing",
            "research",
            "cross-border-processing",
            "emergency-access"
          ]
        }
      ]
    });
  });
});
