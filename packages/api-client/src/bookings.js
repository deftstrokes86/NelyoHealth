export function createBookingDraftDto(input) {
    return {
        bookingId: input.bookingId,
        patientId: input.patientId,
        providerId: input.providerId,
        scheduledAt: input.scheduledAt,
        status: input.status
    };
}
//# sourceMappingURL=bookings.js.map