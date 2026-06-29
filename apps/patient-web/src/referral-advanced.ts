export interface ReferralDraftAdvancedDtoLike {
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

export interface ReferralAdvancedViewModel {
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

export function createReferralAdvancedViewModel(
  dto: ReferralDraftAdvancedDtoLike
): ReferralAdvancedViewModel {
  return {
    referralId: dto.referralId,
    patientId: dto.patientId,
    referringProviderId: dto.referringProviderId,
    receivingProviderId: dto.receivingProviderId,
    status: dto.status,
    specialty: dto.specialty,
    reason: dto.reason,
    createdAt: dto.createdAt,
    sentAt: dto.sentAt,
    respondedAt: dto.respondedAt,
    completedAt: dto.completedAt,
    cancelledAt: dto.cancelledAt
  };
}
