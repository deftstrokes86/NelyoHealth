export interface ReferralDraftAdvanced {
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

export interface ReferralDraftAdvancedInput {
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

export function createReferralDraftAdvanced(input: ReferralDraftAdvancedInput): ReferralDraftAdvanced {
  return {
    referralId: input.referralId,
    patientId: input.patientId,
    referringProviderId: input.referringProviderId,
    receivingProviderId: input.receivingProviderId,
    status: input.status,
    specialty: input.specialty,
    reason: input.reason,
    createdAt: input.createdAt,
    sentAt: input.sentAt,
    respondedAt: input.respondedAt,
    completedAt: input.completedAt,
    cancelledAt: input.cancelledAt
  };
}
