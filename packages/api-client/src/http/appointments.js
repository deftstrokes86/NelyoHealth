export function createAppointmentSummaryDto(fields) {
    return {
        appointmentId: fields.appointmentId,
        clinicianRef: fields.clinicianRef,
        scheduledStart: fields.scheduledStart,
        scheduledEnd: fields.scheduledEnd,
        appointmentType: fields.appointmentType,
        status: fields.status
    };
}
export function createAppointmentDto(fields) {
    return {
        appointmentId: fields.appointmentId,
        patientRef: fields.patientRef,
        clinicianRef: fields.clinicianRef,
        organizationRef: fields.organizationRef,
        scheduledStart: fields.scheduledStart,
        scheduledEnd: fields.scheduledEnd,
        appointmentType: fields.appointmentType,
        status: fields.status,
        reasonForVisit: fields.reasonForVisit,
        cancellationReasonCode: fields.cancellationReasonCode
    };
}
//# sourceMappingURL=appointments.js.map