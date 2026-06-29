import { describe, expect, it } from "vitest";
import { createReferralAdvancedViewModel } from "./referral-advanced.js";

describe("patient web referral advanced view model", () => {
  it("maps the advanced dto into a patient-facing view model", () => {
    const viewModel = createReferralAdvancedViewModel({
      referralId: "referral-advanced-1",
      patientId: "patient-1",
      referringProviderId: "provider-1",
      receivingProviderId: null,
      status: "pending",
      specialty: "cardiology",
      reason: "specialist consult",
      createdAt: "2026-07-21T10:00:00.000Z",
      sentAt: null,
      respondedAt: null,
      completedAt: null,
      cancelledAt: null
    });

    expect(viewModel).toMatchObject({
      referralId: "referral-advanced-1",
      patientId: "patient-1",
      status: "pending",
      specialty: "cardiology"
    });
  });
});
