export interface IntakeDraftDto {
  intakeId: string;
  bookingId: string;
  summary: string;
  urgency: "low" | "medium" | "high";
  status: "draft" | "submitted";
}

export interface IntakeDraftRequestDto {
  intakeId: string;
  bookingId: string;
  summary: string;
  urgency: "low" | "medium" | "high";
  status: "draft" | "submitted";
}

export function createIntakeDraftDto(input: IntakeDraftRequestDto): IntakeDraftDto {
  return {
    intakeId: input.intakeId,
    bookingId: input.bookingId,
    summary: input.summary,
    urgency: input.urgency,
    status: input.status
  };
}
