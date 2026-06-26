export interface BookingDraft {
  bookingId: string;
  patientId: string;
  providerId: string;
  scheduledAt: string;
  status: "pending" | "confirmed" | "cancelled";
}

export interface BookingDraftInput {
  bookingId: string;
  patientId: string;
  providerId: string;
  scheduledAt: string;
  status: "pending" | "confirmed" | "cancelled";
}

export function createBookingDraft(input: BookingDraftInput): BookingDraft {
  return {
    bookingId: input.bookingId,
    patientId: input.patientId,
    providerId: input.providerId,
    scheduledAt: input.scheduledAt,
    status: input.status
  };
}
