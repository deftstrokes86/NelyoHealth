import { describe, expect, it } from "vitest";
import { createReferralDraftDto } from "./referrals.js";

describe("api client referral dto", () => {
  it("maps a referral draft request into a public dto", () => {
    const dto = createReferralDraftDto({
      referralId: "referral-2",
      intakeId: "intake-2",
      providerId: "provider-2",
      reason: "Medication review",
      status: "draft"
    });

    expect(dto).toMatchObject({
      referralId: "referral-2",
      intakeId: "intake-2",
      providerId: "provider-2",
      reason: "Medication review",
      status: "draft"
    });
  });
});
