export function createAppointmentDraftDto(input) {
    return {
        appointmentId: input.appointmentId,
        bookingId: input.bookingId,
        scheduledFor: input.scheduledFor,
        status: input.status
    };
}
//# sourceMappingURL=appointments.js.map