import type { ApiEnvelope, ApiErrorItem } from "./envelope.js";
import type { TimelinePageDto } from "./timeline.js";
import type { NotificationInboxDto, MarkNotificationReadResultDto } from "./notifications.js";
import type {
  AppointmentDto,
  AppointmentPageDto,
  CancelAppointmentResultDto
} from "./appointments.js";
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
  getMyTimeline(params?: { limit?: number; cursor?: string }): Promise<ApiResult<TimelinePageDto>>;
  getNotifications(): Promise<ApiResult<NotificationInboxDto>>;
  markNotificationRead(notificationId: string): Promise<ApiResult<MarkNotificationReadResultDto>>;
  getMyAppointments(params?: {
    limit?: number;
    cursor?: string;
  }): Promise<ApiResult<AppointmentPageDto>>;
  getAppointment(appointmentId: string): Promise<ApiResult<AppointmentDto>>;
  cancelAppointment(
    appointmentId: string,
    body?: { cancellationReasonCode?: string }
  ): Promise<ApiResult<CancelAppointmentResultDto>>;
}

export function createPatientApiClient(config: PatientApiClientConfig): PatientApiClient {
  const doFetch = config.fetchImpl ?? fetch;
  const base = config.baseUrl.replace(/\/$/, "");

  async function call<T>(
    path: string,
    init?: { method?: string; body?: unknown }
  ): Promise<ApiResult<T>> {
    const headers: Record<string, string> = { "x-nelyo-session": config.sessionToken };
    if (init?.body !== undefined) headers["content-type"] = "application/json";
    const response = await doFetch(`${base}${path}`, {
      method: init?.method ?? "GET",
      headers,
      body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
      cache: "no-store"
    });
    const envelope = (await response
      .json()
      .catch(() => ({ data: null, errors: [] }))) as ApiEnvelope<T>;
    return { status: response.status, data: envelope.data, errors: envelope.errors ?? [] };
  }

  function query(params?: { limit?: number; cursor?: string }): string {
    const search = new URLSearchParams();
    if (params?.limit !== undefined) search.set("limit", String(params.limit));
    if (params?.cursor) search.set("cursor", params.cursor);
    const qs = search.toString();
    return qs ? `?${qs}` : "";
  }

  return {
    getSessionContext: () => call<SessionContextDto>("/api/session/context"),
    getMyTimeline: (params) => call<TimelinePageDto>(`/api/me/timeline${query(params)}`),
    getNotifications: () => call<NotificationInboxDto>("/api/notifications"),
    markNotificationRead: (notificationId) =>
      call<MarkNotificationReadResultDto>(
        `/api/notifications/${encodeURIComponent(notificationId)}/read`,
        { method: "POST", body: {} }
      ),
    getMyAppointments: (params) => call<AppointmentPageDto>(`/api/me/appointments${query(params)}`),
    getAppointment: (appointmentId) =>
      call<AppointmentDto>(`/api/appointments/${encodeURIComponent(appointmentId)}`),
    cancelAppointment: (appointmentId, body) =>
      call<CancelAppointmentResultDto>(
        `/api/appointments/${encodeURIComponent(appointmentId)}/cancel`,
        { method: "POST", body: body ?? {} }
      )
  };
}
