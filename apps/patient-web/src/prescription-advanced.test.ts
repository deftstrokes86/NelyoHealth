import { describe, expect, it } from "vitest";
import { createPrescriptionAdvancedViewModel } from "./prescription-advanced.js";

describe("patient web prescription advanced view model", () => {
  it("maps the advanced dto into a patient-facing view model", () => {
    const viewModel = createPrescriptionAdvancedViewModel({
      prescriptionId: "prescription-advanced-1",
      patientId: "patient-1",
      providerId: "provider-1",
      medicationCode: "MED-100",
      medicationName: "Amoxicillin",
      dosage: "500mg",
      frequency: "bid",
      status: "prescribed",
      prescribedAt: "2026-07-21T10:00:00.000Z",
      verifiedAt: null,
      dispensedAt: null,
      completedAt: null,
      cancelledAt: null
    });

    expect(viewModel).toMatchObject({
      prescriptionId: "prescription-advanced-1",
      patientId: "patient-1",
      status: "prescribed",
      medicationName: "Amoxicillin"
    });
  });
});
