export interface IntakeDraft {
  intakeId: string;
  bookingId: string;
  summary: string;
  urgency: "low" | "medium" | "high";
  status: "draft" | "submitted";
}

export interface IntakeDraftInput {
  intakeId: string;
  bookingId: string;
  summary: string;
  urgency: "low" | "medium" | "high";
  status: "draft" | "submitted";
}

export function createIntakeDraft(input: IntakeDraftInput): IntakeDraft {
  return {
    intakeId: input.intakeId,
    bookingId: input.bookingId,
    summary: input.summary,
    urgency: input.urgency,
    status: input.status
  };
}
