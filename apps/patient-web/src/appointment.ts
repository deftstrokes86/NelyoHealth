export interface AppointmentDraftDtoLike {
  appointmentId: string;
  bookingId: string;
  scheduledFor: string;
  status: "scheduled" | "confirmed" | "cancelled";
}

export interface AppointmentViewModel {
  appointmentId: string;
  bookingId: string;
  scheduledFor: string;
  status: "scheduled" | "confirmed" | "cancelled";
}

export function createAppointmentViewModel(dto: AppointmentDraftDtoLike): AppointmentViewModel {
  return {
    appointmentId: dto.appointmentId,
    bookingId: dto.bookingId,
    scheduledFor: dto.scheduledFor,
    status: dto.status
  };
}
