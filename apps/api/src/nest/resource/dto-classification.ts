import type {
  AppointmentDto,
  AppointmentSummaryDto,
  CareCircleMemberDto,
  NotificationDto,
  TimelineEntryDto,
  WardDto
} from "@nelyohealth/api-client";
import type { ClassificationMap, ProjectionContext } from "../../projection.js";

/**
 * Data classifications for the M7 HTTP read DTOs (roadmap M8.1). Each field declares
 * what it IS so the central projection layer enforces minimum-necessary disclosure
 * uniformly — references + capability labels are INTERNAL; a person ref is
 * SENSITIVE-PERSONAL-DATA; an appointment's reason-for-visit is PROTECTED-CLINICAL-DATA.
 * These reads carry NO provider identity/location or payment fields.
 */
export const TIMELINE_ENTRY_CLASSIFICATION: ClassificationMap<TimelineEntryDto> = {
  entryId: "INTERNAL",
  resourceDomain: "INTERNAL",
  entryType: "INTERNAL",
  aggregateRef: "INTERNAL",
  occurredAt: "INTERNAL"
};

export const CARE_CIRCLE_MEMBER_CLASSIFICATION: ClassificationMap<CareCircleMemberDto> = {
  memberRef: "INTERNAL",
  actorRef: "SENSITIVE-PERSONAL-DATA",
  relationshipType: "INTERNAL",
  membershipStatus: "INTERNAL",
  permittedActions: "INTERNAL",
  effectiveDate: "INTERNAL",
  expiryDate: "INTERNAL"
};

export const WARD_CLASSIFICATION: ClassificationMap<WardDto> = {
  patientRef: "SENSITIVE-PERSONAL-DATA",
  relationshipType: "INTERNAL",
  membershipStatus: "INTERNAL",
  permittedActions: "INTERNAL",
  effectiveDate: "INTERNAL",
  expiryDate: "INTERNAL"
};

export const NOTIFICATION_CLASSIFICATION: ClassificationMap<NotificationDto> = {
  notificationId: "INTERNAL",
  notificationType: "INTERNAL",
  channel: "INTERNAL",
  status: "INTERNAL",
  patientRef: "SENSITIVE-PERSONAL-DATA",
  targetRef: "INTERNAL",
  readAt: "INTERNAL",
  dispatchedAt: "INTERNAL"
};

export const APPOINTMENT_SUMMARY_CLASSIFICATION: ClassificationMap<AppointmentSummaryDto> = {
  appointmentId: "INTERNAL",
  clinicianRef: "INTERNAL",
  scheduledStart: "INTERNAL",
  scheduledEnd: "INTERNAL",
  appointmentType: "INTERNAL",
  status: "INTERNAL"
};

export const APPOINTMENT_CLASSIFICATION: ClassificationMap<AppointmentDto> = {
  appointmentId: "INTERNAL",
  patientRef: "SENSITIVE-PERSONAL-DATA",
  clinicianRef: "INTERNAL",
  organizationRef: "INTERNAL",
  scheduledStart: "INTERNAL",
  scheduledEnd: "INTERNAL",
  appointmentType: "INTERNAL",
  status: "INTERNAL",
  reasonForVisit: "PROTECTED-CLINICAL-DATA",
  cancellationReasonCode: "INTERNAL"
};

/**
 * The projection context for an M7 read: it runs only AFTER the resource access
 * decision allowed it, so the reader is authorized for the subject's identity +
 * clinical references these DTOs return. Provider identity/location and payment are
 * never in these reads, so those obligations stay false.
 */
export function authorizedReaderContext(purpose: string): ProjectionContext {
  return {
    purpose,
    identityAuthorized: true,
    clinicalAuthorized: true,
    providerDisclosureAuthorized: false,
    financeAuthorized: false
  };
}
