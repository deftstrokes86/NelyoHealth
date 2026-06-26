import { describe, expect, it } from "vitest";
import { createPrescriptionDraftDto } from "./prescriptions.js";

describe("api client prescription dto", () => {
  it("maps a prescription draft request into a public dto", () => {
    const dto = createPrescriptionDraftDto({
      prescriptionId: "prescription-2",
      referralId: "referral-2",
      medicationName: "Metformin",
      dosage: "500mg",
      status: "draft"
    });

    expect(dto).toMatchObject({
      prescriptionId: "prescription-2",
      referralId: "referral-2",
      medicationName: "Metformin",
      dosage: "500mg",
      status: "draft"
    });
  });
});
