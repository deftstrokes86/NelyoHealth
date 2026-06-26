import { describe, expect, it } from "vitest";
import { createReferralDraft } from "./referrals.js";

describe("referral draft contract", () => {
  it("creates a referral draft with the expected shape", () => {
    const referral = createReferralDraft({
      referralId: "referral-1",
      intakeId: "intake-1",
      providerId: "provider-1",
      reason: "Follow-up consultation",
      status: "draft"
    });

    expect(referral).toMatchObject({
      referralId: "referral-1",
      intakeId: "intake-1",
      providerId: "provider-1",
      reason: "Follow-up consultation",
      status: "draft"
    });
  });
});
