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
export declare function createReferralDraftDto(input: ReferralDraftRequestDto): ReferralDraftDto;
//# sourceMappingURL=referrals.d.ts.map