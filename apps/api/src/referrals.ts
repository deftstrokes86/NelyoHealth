export interface ReferralDraft {
  referralId: string;
  intakeId: string;
  providerId: string;
  reason: string;
  status: "draft" | "submitted";
}

export interface ReferralDraftInput {
  referralId: string;
  intakeId: string;
  providerId: string;
  reason: string;
  status: "draft" | "submitted";
}

export function createReferralDraft(input: ReferralDraftInput): ReferralDraft {
  return {
    referralId: input.referralId,
    intakeId: input.intakeId,
    providerId: input.providerId,
    reason: input.reason,
    status: input.status
  };
}
