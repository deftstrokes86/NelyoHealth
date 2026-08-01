/**
 * NelyoHealth HTTP contract (roadmap M7).
 *
 * The typed request/response DTOs + error envelope for the first HTTP slice
 * (timeline, care circle, notifications, appointment booking). The web shells
 * (M7.x) consume THIS contract; the server constructs every response through the
 * matching `create*Dto` (allowlist, field-by-field) so the two cannot drift and
 * no internal field leaks by omission (ADR-0014).
 */
export type { ApiEnvelope, ApiMeta, ApiErrorItem, ApiErrorCode } from "./envelope.js";
export {
  createTimelineEntryDto,
  type TimelineEntryDto,
  type TimelinePageDto,
  type TimelineResourceDomainDto,
  type ReadTimelineQueryDto
} from "./timeline.js";
export {
  createCareCircleMemberDto,
  createWardDto,
  type CareCircleMemberDto,
  type CareCircleDto,
  type WardDto,
  type WardsDto
} from "./care-circle.js";
export {
  createNotificationDto,
  type NotificationDto,
  type NotificationInboxDto,
  type MarkNotificationReadResultDto
} from "./notifications.js";
export {
  createAppointmentDto,
  createAppointmentSummaryDto,
  type AppointmentDto,
  type AppointmentSummaryDto,
  type AppointmentPageDto,
  type BookAppointmentRequestDto,
  type RescheduleAppointmentRequestDto,
  type CancelAppointmentRequestDto,
  type BookAppointmentResultDto,
  type RescheduleAppointmentResultDto,
  type CancelAppointmentResultDto
} from "./appointments.js";
export type { SessionContextDto } from "./session.js";
export {
  createSurfaceDto,
  createToolContractDto,
  type SurfaceDto,
  type SurfaceNavigationItemDto,
  type SurfaceWidgetDto,
  type SurfaceDashboardDto,
  type SurfaceExperienceDto,
  type SurfaceExperienceStepDto,
  type SurfaceSearchScopeDto,
  type SurfaceReportDto,
  type ToolContractDto,
  type ToolContractEntryDto,
  type WithheldToolDto
} from "./surface.js";
export {
  createPatientApiClient,
  type PatientApiClient,
  type PatientApiClientConfig,
  type ApiResult
} from "./patient-client.js";
