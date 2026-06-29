export interface AppointmentDraftDto {
  appointmentId: string;
  bookingId: string;
  scheduledFor: string;
  status: "scheduled" | "confirmed" | "cancelled";
}

export interface AppointmentDraftRequestDto {
  appointmentId: string;
  bookingId: string;
  scheduledFor: string;
  status: "scheduled" | "confirmed" | "cancelled";
}

export function createAppointmentDraftDto(input: AppointmentDraftRequestDto): AppointmentDraftDto {
  return {
    appointmentId: input.appointmentId,
    bookingId: input.bookingId,
    scheduledFor: input.scheduledFor,
    status: input.status
  };
}
