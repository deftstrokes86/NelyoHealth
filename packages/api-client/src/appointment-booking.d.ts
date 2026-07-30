export interface AppointmentScheduleDto {
    appointmentId: string;
    patientId: string;
    status: "pending" | "scheduled" | "confirmed" | "completed" | "cancelled";
    scheduledAt: string | null;
    confirmedAt: string | null;
    completedAt: string | null;
    cancelledAt: string | null;
}
export interface BookingDto {
    bookingId: string;
    patientId: string;
    providerId: string;
    status: "draft" | "requested" | "approved" | "denied" | "scheduled" | "completed" | "cancelled";
    appointmentId: string | null;
    createdAt: string | null;
    requestedAt: string | null;
    approvedAt: string | null;
    deniedAt: string | null;
    scheduledAt: string | null;
    completedAt: string | null;
    cancelledAt: string | null;
}
export declare function createAppointmentScheduleDto(input: Partial<AppointmentScheduleDto>): AppointmentScheduleDto;
export declare function createBookingDto(input: Partial<BookingDto>): BookingDto;
//# sourceMappingURL=appointment-booking.d.ts.map