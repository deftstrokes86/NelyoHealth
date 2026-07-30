export function createNotificationDto(fields) {
    return {
        notificationId: fields.notificationId,
        notificationType: fields.notificationType,
        channel: fields.channel,
        status: fields.status,
        patientRef: fields.patientRef,
        targetRef: fields.targetRef,
        readAt: fields.readAt,
        dispatchedAt: fields.dispatchedAt
    };
}
//# sourceMappingURL=notifications.js.map