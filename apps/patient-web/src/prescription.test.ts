import { describe, expect, it } from "vitest";
import { createPrescriptionViewModel } from "./prescription.js";

describe("patient web prescription view model", () => {
  it("maps the dto into a patient-facing view model", () => {
    const viewModel = createPrescriptionViewModel({
      prescriptionId: "prescription-4",
      referralId: "referral-4",
      medicationName: "Atorvastatin",
      dosage: "20mg",
      status: "draft"
    });

    expect(viewModel).toMatchObject({
      prescriptionId: "prescription-4",
      referralId: "referral-4",
      medicationName: "Atorvastatin",
      dosage: "20mg",
      status: "draft"
    });
  });
});
