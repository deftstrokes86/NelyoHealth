export interface ReferralDraftDtoLike {
  referralId: string;
  intakeId: string;
  providerId: string;
  reason: string;
  status: "draft" | "submitted";
}

export interface ReferralViewModel {
  referralId: string;
  intakeId: string;
  providerId: string;
  reason: string;
  status: "draft" | "submitted";
}

export function createReferralViewModel(dto: ReferralDraftDtoLike): ReferralViewModel {
  return {
    referralId: dto.referralId,
    intakeId: dto.intakeId,
    providerId: dto.providerId,
    reason: dto.reason,
    status: dto.status
  };
}
