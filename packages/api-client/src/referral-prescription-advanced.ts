export interface ReferralDraftAdvancedDto {
  referralId: string;
  patientId: string;
  referringProviderId: string;
  receivingProviderId: string | null;
  status: "pending" | "sent" | "accepted" | "declined" | "completed" | "cancelled";
  specialty: string;
  reason: string;
  createdAt: string;
  sentAt: string | null;
  respondedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
}

export interface PrescriptionDraftAdvancedDto {
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

export function createReferralDraftAdvancedDto(
  input: Partial<ReferralDraftAdvancedDto>
): ReferralDraftAdvancedDto {
  return {
    referralId: input.referralId ?? "",
    patientId: input.patientId ?? "",
    referringProviderId: input.referringProviderId ?? "",
    receivingProviderId: input.receivingProviderId ?? null,
    status: input.status ?? "pending",
    specialty: input.specialty ?? "",
    reason: input.reason ?? "",
    createdAt: input.createdAt ?? "",
    sentAt: input.sentAt ?? null,
    respondedAt: input.respondedAt ?? null,
    completedAt: input.completedAt ?? null,
    cancelledAt: input.cancelledAt ?? null
  };
}

export function createPrescriptionDraftAdvancedDto(
  input: Partial<PrescriptionDraftAdvancedDto>
): PrescriptionDraftAdvancedDto {
  return {
    prescriptionId: input.prescriptionId ?? "",
    patientId: input.patientId ?? "",
    providerId: input.providerId ?? "",
    medicationCode: input.medicationCode ?? "",
    medicationName: input.medicationName ?? "",
    dosage: input.dosage ?? "",
    frequency: input.frequency ?? "",
    status: input.status ?? "prescribed",
    prescribedAt: input.prescribedAt ?? "",
    verifiedAt: input.verifiedAt ?? null,
    dispensedAt: input.dispensedAt ?? null,
    completedAt: input.completedAt ?? null,
    cancelledAt: input.cancelledAt ?? null
  };
}
