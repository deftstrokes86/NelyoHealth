export interface FollowUpDraft {
  followUpId: string;
  diagnosticResultId: string;
  scheduledFor: string;
  status: "scheduled" | "completed" | "cancelled";
}

export interface FollowUpDraftInput {
  followUpId: string;
  diagnosticResultId: string;
  scheduledFor: string;
  status: "scheduled" | "completed" | "cancelled";
}

export function createFollowUpDraft(input: FollowUpDraftInput): FollowUpDraft {
  return {
    followUpId: input.followUpId,
    diagnosticResultId: input.diagnosticResultId,
    scheduledFor: input.scheduledFor,
    status: input.status
  };
}
