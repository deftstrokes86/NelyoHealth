export interface FollowUpDraftDto {
    followUpId: string;
    diagnosticResultId: string;
    scheduledFor: string;
    status: "scheduled" | "completed" | "cancelled";
}
export interface FollowUpDraftRequestDto {
    followUpId: string;
    diagnosticResultId: string;
    scheduledFor: string;
    status: "scheduled" | "completed" | "cancelled";
}
export declare function createFollowUpDraftDto(input: FollowUpDraftRequestDto): FollowUpDraftDto;
//# sourceMappingURL=follow-ups.d.ts.map