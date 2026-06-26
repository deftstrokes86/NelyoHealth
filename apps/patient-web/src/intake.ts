export interface IntakeDraftDtoLike {
  intakeId: string;
  bookingId: string;
  summary: string;
  urgency: "low" | "medium" | "high";
  status: "draft" | "submitted";
}

export interface IntakeViewModel {
  intakeId: string;
  bookingId: string;
  summary: string;
  urgency: "low" | "medium" | "high";
  status: "draft" | "submitted";
}

export function createIntakeViewModel(dto: IntakeDraftDtoLike): IntakeViewModel {
  return {
    intakeId: dto.intakeId,
    bookingId: dto.bookingId,
    summary: dto.summary,
    urgency: dto.urgency,
    status: dto.status
  };
}
