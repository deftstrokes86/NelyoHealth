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

export function createFollowUpDraftDto(input: FollowUpDraftRequestDto): FollowUpDraftDto {
  return {
    followUpId: input.followUpId,
    diagnosticResultId: input.diagnosticResultId,
    scheduledFor: input.scheduledFor,
    status: input.status
  };
}
