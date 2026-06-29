import { describe, expect, it } from "vitest";
import { createConsentDraft } from "./consents.js";

describe("consent draft contract", () => {
  it("creates a consent draft with the expected shape", () => {
    const consent = createConsentDraft({
      consentId: "consent-1",
      subjectId: "patient-1",
      grantedTo: "care-team",
      scope: "clinical-record-access",
      status: "granted",
      effectiveAt: "2026-07-01T00:00:00.000Z",
      revokedAt: null
    });

    expect(consent).toMatchObject({
      consentId: "consent-1",
      subjectId: "patient-1",
      grantedTo: "care-team",
      scope: "clinical-record-access",
      status: "granted",
      effectiveAt: "2026-07-01T00:00:00.000Z",
      revokedAt: null
    });
  });
});
