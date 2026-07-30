export function createAppointmentScheduleDto(input) {
    return {
        appointmentId: input.appointmentId ?? "",
        patientId: input.patientId ?? "",
        status: input.status ?? "pending",
        scheduledAt: input.scheduledAt ?? null,
        confirmedAt: input.confirmedAt ?? null,
        completedAt: input.completedAt ?? null,
        cancelledAt: input.cancelledAt ?? null
    };
}
export function createBookingDto(input) {
    return {
        bookingId: input.bookingId ?? "",
        patientId: input.patientId ?? "",
        providerId: input.providerId ?? "",
        status: input.status ?? "draft",
        appointmentId: input.appointmentId ?? null,
        createdAt: input.createdAt ?? null,
        requestedAt: input.requestedAt ?? null,
        approvedAt: input.approvedAt ?? null,
        deniedAt: input.deniedAt ?? null,
        scheduledAt: input.scheduledAt ?? null,
        completedAt: input.completedAt ?? null,
        cancelledAt: input.cancelledAt ?? null
    };
}
//# sourceMappingURL=appointment-booking.js.map