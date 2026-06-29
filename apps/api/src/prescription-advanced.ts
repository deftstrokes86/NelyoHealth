export interface PrescriptionDraftAdvanced {
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

export interface PrescriptionDraftAdvancedInput {
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

export function createPrescriptionDraftAdvanced(
  input: PrescriptionDraftAdvancedInput
): PrescriptionDraftAdvanced {
  return {
    prescriptionId: input.prescriptionId,
    patientId: input.patientId,
    providerId: input.providerId,
    medicationCode: input.medicationCode,
    medicationName: input.medicationName,
    dosage: input.dosage,
    frequency: input.frequency,
    status: input.status,
    prescribedAt: input.prescribedAt,
    verifiedAt: input.verifiedAt,
    dispensedAt: input.dispensedAt,
    completedAt: input.completedAt,
    cancelledAt: input.cancelledAt
  };
}
