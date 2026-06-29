export interface PrescriptionDraftAdvancedDtoLike {
  prescriptionId: string;
  patientId: string;
  providerId: string;
  medicationCode: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  status: "prescribed" | "verified" | "dispensed" | "completed" | "cancelled";
  prescribedAt: string;
  verifiedAt: string | null;
  dispensedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
}

export interface PrescriptionAdvancedViewModel {
  prescriptionId: string;
  patientId: string;
  providerId: string;
  medicationCode: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  status: "prescribed" | "verified" | "dispensed" | "completed" | "cancelled";
  prescribedAt: string;
  verifiedAt: string | null;
  dispensedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
}

export function createPrescriptionAdvancedViewModel(
  dto: PrescriptionDraftAdvancedDtoLike
): PrescriptionAdvancedViewModel {
  return {
    prescriptionId: dto.prescriptionId,
    patientId: dto.patientId,
    providerId: dto.providerId,
    medicationCode: dto.medicationCode,
    medicationName: dto.medicationName,
    dosage: dto.dosage,
    frequency: dto.frequency,
    status: dto.status,
    prescribedAt: dto.prescribedAt,
    verifiedAt: dto.verifiedAt,
    dispensedAt: dto.dispensedAt,
    completedAt: dto.completedAt,
    cancelledAt: dto.cancelledAt
  };
}
