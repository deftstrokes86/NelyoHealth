export interface PrescriptionDraftDtoLike {
  prescriptionId: string;
  referralId: string;
  medicationName: string;
  dosage: string;
  status: "draft" | "issued" | "cancelled";
}

export interface PrescriptionViewModel {
  prescriptionId: string;
  referralId: string;
  medicationName: string;
  dosage: string;
  status: "draft" | "issued" | "cancelled";
}

export function createPrescriptionViewModel(dto: PrescriptionDraftDtoLike): PrescriptionViewModel {
  return {
    prescriptionId: dto.prescriptionId,
    referralId: dto.referralId,
    medicationName: dto.medicationName,
    dosage: dto.dosage,
    status: dto.status
  };
}
