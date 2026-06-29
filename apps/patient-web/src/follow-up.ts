export interface FollowUpDraftDtoLike {
  followUpId: string;
  diagnosticResultId: string;
  scheduledFor: string;
  status: "scheduled" | "completed" | "cancelled";
}

export interface FollowUpViewModel {
  followUpId: string;
  diagnosticResultId: string;
  scheduledFor: string;
  status: "scheduled" | "completed" | "cancelled";
}

export function createFollowUpViewModel(dto: FollowUpDraftDtoLike): FollowUpViewModel {
  return {
    followUpId: dto.followUpId,
    diagnosticResultId: dto.diagnosticResultId,
    scheduledFor: dto.scheduledFor,
    status: dto.status
  };
}
