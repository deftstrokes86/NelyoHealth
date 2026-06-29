export interface AppointmentDraft {
  appointmentId: string;
  bookingId: string;
  scheduledFor: string;
  status: "scheduled" | "confirmed" | "cancelled";
}

export interface AppointmentDraftInput {
  appointmentId: string;
  bookingId: string;
  scheduledFor: string;
  status: "scheduled" | "confirmed" | "cancelled";
}

export function createAppointmentDraft(input: AppointmentDraftInput): AppointmentDraft {
  return {
    appointmentId: input.appointmentId,
    bookingId: input.bookingId,
    scheduledFor: input.scheduledFor,
    status: input.status
  };
}
