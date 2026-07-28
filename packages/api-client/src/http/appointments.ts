/**
 * Appointment booking HTTP contract (roadmap M7, exposes M5.2/M6.4's service).
 *
 * The representative WRITE loop: book / reschedule / cancel / read. Request DTOs
 * are the caller's INTENT only — never identity or authority (actor, patient,
 * org are server-derived from the ActingContext, never accepted from the body).
 * `reasonForVisit` is returned only on the authorized read (the reader passed
 * the full pipeline); it never travels in an event or the timeline.
 */
export interface AppointmentDto {
  appointmentId: string;
  patientRef: string;
  clinicianRef: string;
  organizationRef: string;
  scheduledStart: string;
  scheduledEnd: string;
  appointmentType: string;
  status: string;
  reasonForVisit: string | null;
  cancellationReasonCode: string | null;
}

/** A list-view summary (no clinical `reasonForVisit`) for the dashboard card. */
export interface AppointmentSummaryDto {
  appointmentId: string;
  clinicianRef: string;
  scheduledStart: string;
  scheduledEnd: string;
  appointmentType: string;
  status: string;
}

export interface AppointmentPageDto {
  appointments: AppointmentSummaryDto[];
  nextCursor: string | null;
}

export function createAppointmentSummaryDto(fields: {
  appointmentId: string;
  clinicianRef: string;
  scheduledStart: string;
  scheduledEnd: string;
  appointmentType: string;
  status: string;
}): AppointmentSummaryDto {
  return {
    appointmentId: fields.appointmentId,
    clinicianRef: fields.clinicianRef,
    scheduledStart: fields.scheduledStart,
    scheduledEnd: fields.scheduledEnd,
    appointmentType: fields.appointmentType,
    status: fields.status
  };
}

export interface BookAppointmentRequestDto {
  slotId: string;
  appointmentType: string;
  reasonForVisit?: string;
}

export interface RescheduleAppointmentRequestDto {
  newSlotId: string;
}

export interface CancelAppointmentRequestDto {
  cancellationReasonCode?: string;
}

export interface BookAppointmentResultDto {
  appointmentId: string;
  status: "booked";
}

export interface RescheduleAppointmentResultDto {
  appointmentId: string;
  status: "rescheduled";
}

export interface CancelAppointmentResultDto {
  appointmentId: string;
  status: "cancelled";
}

export function createAppointmentDto(fields: {
  appointmentId: string;
  patientRef: string;
  clinicianRef: string;
  organizationRef: string;
  scheduledStart: string;
  scheduledEnd: string;
  appointmentType: string;
  status: string;
  reasonForVisit: string | null;
  cancellationReasonCode: string | null;
}): AppointmentDto {
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
