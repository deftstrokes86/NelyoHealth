/**
 * Notification inbox HTTP contract (roadmap M7, exposes M6.2's read service).
 *
 * Self-scoped inbox. Reference-only delivery records: the DTO carries the type,
 * channel, status and deep-link refs — never the notification body. Internal
 * delivery plumbing (eventRef, templateId, providerMessageRef, failureReasonCode,
 * attemptCount, nextAttemptAt, recipientActorRef) is excluded by allowlist.
 */
export interface NotificationDto {
    notificationId: string;
    notificationType: string;
    channel: string;
    status: string;
    patientRef: string | null;
    targetRef: string | null;
    readAt: string | null;
    dispatchedAt: string | null;
}
export interface NotificationInboxDto {
    notifications: NotificationDto[];
}
/** Both terminal states are success to the caller (idempotent mark-read). */
export interface MarkNotificationReadResultDto {
    notificationId: string;
    status: "read" | "already-read";
}
export declare function createNotificationDto(fields: {
    notificationId: string;
    notificationType: string;
    channel: string;
    status: string;
    patientRef: string | null;
    targetRef: string | null;
    readAt: string | null;
    dispatchedAt: string | null;
}): NotificationDto;
//# sourceMappingURL=notifications.d.ts.map