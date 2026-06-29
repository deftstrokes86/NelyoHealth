import { describe, expect, it } from "vitest";
import { createConsentViewModel } from "./consent.js";

describe("patient web consent view model", () => {
  it("maps the dto into a patient-facing view model", () => {
    const viewModel = createConsentViewModel({
      consentId: "consent-4",
      subjectId: "patient-4",
      grantedTo: "care-team",
      scope: "care-team-access",
      status: "granted",
      effectiveAt: "2026-07-04T00:00:00.000Z",
      revokedAt: null
    });

    expect(viewModel).toMatchObject({
      consentId: "consent-4",
      subjectId: "patient-4",
      grantedTo: "care-team",
      scope: "care-team-access",
      status: "granted",
      effectiveAt: "2026-07-04T00:00:00.000Z",
      revokedAt: null
    });
  });
});
