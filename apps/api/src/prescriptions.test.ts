import { describe, expect, it } from "vitest";
import { createPrescriptionDraft } from "./prescriptions.js";

describe("prescription draft contract", () => {
  it("creates a prescription draft with the expected shape", () => {
    const prescription = createPrescriptionDraft({
      prescriptionId: "prescription-1",
      referralId: "referral-1",
      medicationName: "Lisinopril",
      dosage: "10mg",
      status: "draft"
    });

    expect(prescription).toMatchObject({
      prescriptionId: "prescription-1",
      referralId: "referral-1",
      medicationName: "Lisinopril",
      dosage: "10mg",
      status: "draft"
    });
  });
});
