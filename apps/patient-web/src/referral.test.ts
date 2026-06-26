import { describe, expect, it } from "vitest";
import { createReferralViewModel } from "./referral.js";

describe("patient web referral view model", () => {
  it("maps the dto into a patient-facing view model", () => {
    const viewModel = createReferralViewModel({
      referralId: "referral-4",
      intakeId: "intake-4",
      providerId: "provider-4",
      reason: "Specialist consult",
      status: "draft"
    });

    expect(viewModel).toMatchObject({
      referralId: "referral-4",
      intakeId: "intake-4",
      providerId: "provider-4",
      reason: "Specialist consult",
      status: "draft"
    });
  });
});
