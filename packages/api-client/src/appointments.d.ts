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
export declare function createAppointmentDraftDto(input: AppointmentDraftRequestDto): AppointmentDraftDto;
//# sourceMappingURL=appointments.d.ts.map