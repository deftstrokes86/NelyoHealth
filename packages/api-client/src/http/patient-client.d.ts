import type { ApiErrorItem } from "./envelope.js";
import type { TimelinePageDto } from "./timeline.js";
import type { NotificationInboxDto, MarkNotificationReadResultDto } from "./notifications.js";
import type { AppointmentDto, AppointmentPageDto, CancelAppointmentResultDto } from "./appointments.js";
import type { SessionContextDto } from "./session.js";
/**
 * The typed patient API client (roadmap M7.1). The single way the patient web shell
 * talks to the Nest API — server components and BFF route handlers call these
 * methods; nothing does raw `fetch`. Each method returns the API's `ApiEnvelope`
 * plus the HTTP status, so a caller can honour the boundary contract exactly:
 *   - 401 -> the shell redirects to sign-in;
 *   - anything else non-2xx (notably the uniform 404) -> the shell renders it as
 *     empty/absent, never distinguishing denied from not-found.
 * The client itself reshapes nothing (the BFF-is-a-proxy discipline, ADR-0014).
 */
export interface ApiResult<TData> {
    status: number;
    data: TData | null;
    errors: ApiErrorItem[];
}
export interface PatientApiClientConfig {
    baseUrl: string;
    /** Opaque session id (from the HttpOnly cookie); forwarded as the session header. */
    sessionToken: string;
    fetchImpl?: typeof fetch;
}
export interface PatientApiClient {
    getSessionContext(): Promise<ApiResult<SessionContextDto>>;
    getMyTimeline(params?: {
        limit?: number;
        cursor?: string;
    }): Promise<ApiResult<TimelinePageDto>>;
    getNotifications(): Promise<ApiResult<NotificationInboxDto>>;
    markNotificationRead(notificationId: string): Promise<ApiResult<MarkNotificationReadResultDto>>;
    getMyAppointments(params?: {
        limit?: number;
        cursor?: string;
    }): Promise<ApiResult<AppointmentPageDto>>;
    getAppointment(appointmentId: string): Promise<ApiResult<AppointmentDto>>;
    cancelAppointment(appointmentId: string, body?: {
        cancellationReasonCode?: string;
    }): Promise<ApiResult<CancelAppointmentResultDto>>;
}
export declare function createPatientApiClient(config: PatientApiClientConfig): PatientApiClient;
//# sourceMappingURL=patient-client.d.ts.map