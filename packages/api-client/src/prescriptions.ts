export interface PrescriptionDraftDto {
  prescriptionId: string;
  referralId: string;
  medicationName: string;
  dosage: string;
  status: "draft" | "issued" | "cancelled";
}

export interface PrescriptionDraftRequestDto {
  prescriptionId: string;
  referralId: string;
  medicationName: string;
  dosage: string;
  status: "draft" | "issued" | "cancelled";
}

export function createPrescriptionDraftDto(
  input: PrescriptionDraftRequestDto
): PrescriptionDraftDto {
  return {
    prescriptionId: input.prescriptionId,
    referralId: input.referralId,
    medicationName: input.medicationName,
    dosage: input.dosage,
    status: input.status
  };
}
