export interface BookingDraftDto {
  bookingId: string;
  patientId: string;
  providerId: string;
  scheduledAt: string;
  status: "pending" | "confirmed" | "cancelled";
}

export interface BookingDraftRequestDto {
  bookingId: string;
  patientId: string;
  providerId: string;
  scheduledAt: string;
  status: "pending" | "confirmed" | "cancelled";
}

export function createBookingDraftDto(input: BookingDraftRequestDto): BookingDraftDto {
  return {
    bookingId: input.bookingId,
    patientId: input.patientId,
    providerId: input.providerId,
    scheduledAt: input.scheduledAt,
    status: input.status
  };
}
