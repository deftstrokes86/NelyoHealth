import { Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Req } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  createNotificationDto,
  type ApiEnvelope,
  type MarkNotificationReadResultDto,
  type NotificationInboxDto
} from "@nelyohealth/api-client";
import {
  listMyNotifications,
  markMyNotificationRead,
  type NotificationServiceDeps
} from "../../notification-service.js";
import { createMeta } from "../api-envelope.js";
import { Authorize } from "../authorization/authorization-metadata.js";
import type { AuthenticatedRequest } from "../authorization/authorization.guard.js";
import { projectExact } from "../../projection.js";
import { ResourceUnavailableException } from "./resource-http.js";
import { NOTIFICATION_CLASSIFICATION, authorizedReaderContext } from "./dto-classification.js";
import { NOTIFICATION_SERVICE_DEPS } from "./resource-tokens.js";

/**
 * Notification inbox HTTP surface (roadmap M7, M6.2 + ADR-0014). Self-scoped by
 * construction: the recipient is the session's own actor (server-supplied, never a
 * client parameter). mark-read is refused for a notification the caller does not
 * own, and both refusal and absence collapse to a single 404 (non-enumeration).
 */
@Controller("api")
@ApiTags("notifications")
export class NotificationsController {
  constructor(@Inject(NOTIFICATION_SERVICE_DEPS) private readonly deps: NotificationServiceDeps) {}

  @Get("notifications")
  @Authorize()
  @ApiOperation({ summary: "List the authenticated actor's own notifications" })
  @ApiOkResponse({ description: "Notification inbox envelope" })
  async listInbox(@Req() req: AuthenticatedRequest): Promise<ApiEnvelope<NotificationInboxDto>> {
    const notifications = await listMyNotifications(this.deps, {
      recipientActorRef: req.actingContext!.identity.accountId
    });
    return {
      data: {
        notifications: notifications.map((notification) =>
          projectExact(
            createNotificationDto({
              notificationId: notification.notificationId,
              notificationType: notification.notificationType,
              channel: notification.channel,
              status: notification.status,
              patientRef: notification.patientRef ?? null,
              targetRef: notification.targetRef ?? null,
              readAt: notification.readAt ?? null,
              dispatchedAt: notification.dispatchedAt ?? null
            }),
            NOTIFICATION_CLASSIFICATION,
            authorizedReaderContext("api.notifications.list")
          )
        )
      },
      meta: this.meta(req, "api.notifications.list"),
      errors: []
    };
  }

  @Post("notifications/:notificationId/read")
  @Authorize()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Mark one of the caller's own notifications read" })
  @ApiOkResponse({ description: "Mark-read result envelope" })
  async markRead(
    @Req() req: AuthenticatedRequest,
    @Param("notificationId") notificationId: string
  ): Promise<ApiEnvelope<MarkNotificationReadResultDto>> {
    const outcome = await markMyNotificationRead(this.deps, {
      notificationId,
      actorRef: req.actingContext!.identity.accountId
    });
    // Not-mine and not-found are indistinguishable at the boundary (single 404).
    if (outcome.status === "not-found" || outcome.status === "forbidden") {
      throw new ResourceUnavailableException();
    }
    return {
      data: { notificationId: outcome.notificationId, status: outcome.status },
      meta: this.meta(req, "api.notifications.mark-read"),
      errors: []
    };
  }

  private meta(req: AuthenticatedRequest, operationTag: string) {
    return createMeta(
      req.requestId ?? "missing-request-id",
      req.correlationId ?? "missing-correlation-id",
      operationTag,
      "self"
    );
  }
}
