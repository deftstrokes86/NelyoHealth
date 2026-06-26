export interface ReferralDraftDto {
  referralId: string;
  intakeId: string;
  providerId: string;
  reason: string;
  status: "draft" | "submitted";
}

export interface ReferralDraftRequestDto {
  referralId: string;
  intakeId: string;
  providerId: string;
  reason: string;
  status: "draft" | "submitted";
}

export function createReferralDraftDto(input: ReferralDraftRequestDto): ReferralDraftDto {
  return {
    referralId: input.referralId,
    intakeId: input.intakeId,
    providerId: input.providerId,
    reason: input.reason,
    status: input.status
  };
}
