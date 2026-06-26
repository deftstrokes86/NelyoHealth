export interface PrescriptionDraft {
  prescriptionId: string;
  referralId: string;
  medicationName: string;
  dosage: string;
  status: "draft" | "issued" | "cancelled";
}

export interface PrescriptionDraftInput {
  prescriptionId: string;
  referralId: string;
  medicationName: string;
  dosage: string;
  status: "draft" | "issued" | "cancelled";
}

export function createPrescriptionDraft(input: PrescriptionDraftInput): PrescriptionDraft {
  return {
    prescriptionId: input.prescriptionId,
    referralId: input.referralId,
    medicationName: input.medicationName,
    dosage: input.dosage,
    status: input.status
  };
}
