import { describe, expect, it } from "vitest";
import { createConsentDraftDto } from "./consents.js";

describe("api client consent dto", () => {
  it("maps a consent draft request into a public dto", () => {
    const dto = createConsentDraftDto({
      consentId: "consent-2",
      subjectId: "patient-2",
      grantedTo: "care-team",
      scope: "result-release",
      status: "granted",
      effectiveAt: "2026-07-02T00:00:00.000Z",
      revokedAt: null
    });

    expect(dto).toMatchObject({
      consentId: "consent-2",
      subjectId: "patient-2",
      grantedTo: "care-team",
      scope: "result-release",
      status: "granted",
      effectiveAt: "2026-07-02T00:00:00.000Z",
      revokedAt: null
    });
  });
});
