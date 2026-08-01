import type {
  AppointmentDto,
  AppointmentSummaryDto,
  CareCircleMemberDto,
  NotificationDto,
  SurfaceDto,
  TimelineEntryDto,
  ToolContractDto,
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
 * Composition-surface classifications (roadmap M8.3e).
 *
 * A surface is STRUCTURE, not data: registry ids, labels, routes, ordering — nothing
 * clinical crosses this boundary, which is why almost every field is INTERNAL. The two
 * exceptions are the person refs (`subjectRef`, and the `organizationRef` of the active
 * tenant), which identify a human being and a tenant respectively and are classified
 * accordingly. Routing the surface through the projection layer keeps ONE disclosure
 * path for every read, so a future field that does carry meaning cannot be added without
 * declaring what it is.
 */
export const SURFACE_CLASSIFICATION: ClassificationMap<SurfaceDto> = {
  workspaceId: "INTERNAL",
  personaId: "INTERNAL",
  organizationRef: "INTERNAL",
  subjectRef: "SENSITIVE-PERSONAL-DATA",
  subjectIsSelf: "INTERNAL",
  careCircleRoleId: "INTERNAL",
  active: "INTERNAL",
  reasonCode: "INTERNAL",
  capabilities: "INTERNAL",
  navigation: "INTERNAL",
  dashboards: "INTERNAL",
  landingDashboardId: "INTERNAL",
  homepage: "INTERNAL",
  onboarding: "INTERNAL",
  experienceProfile: "INTERNAL",
  search: "INTERNAL",
  reports: "INTERNAL"
};

export const TOOL_CONTRACT_CLASSIFICATION: ClassificationMap<ToolContractDto> = {
  workspaceId: "INTERNAL",
  personaId: "INTERNAL",
  consumer: "INTERNAL",
  subjectRef: "SENSITIVE-PERSONAL-DATA",
  subjectIsSelf: "INTERNAL",
  careCircleRoleId: "INTERNAL",
  active: "INTERNAL",
  reasonCode: "INTERNAL",
  available: "INTERNAL",
  unavailable: "INTERNAL"
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
