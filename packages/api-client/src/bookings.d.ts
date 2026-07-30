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
export declare function createBookingDraftDto(input: BookingDraftRequestDto): BookingDraftDto;
//# sourceMappingURL=bookings.d.ts.map