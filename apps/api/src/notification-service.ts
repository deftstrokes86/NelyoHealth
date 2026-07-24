import type { Pool, PoolClient } from "pg";
import {
  listNotificationsForRecipient,
  loadNotification,
  markNotificationRead,
  type PersistedNotification
} from "@nelyohealth/database";

/**
 * Notification read service (roadmap M6.2).
 *
 * The recipient's own notification inbox: a self-scoped view of the reference-only
 * delivery records produced by the notification orchestration consumer. Because a
 * notification is addressed to the recipient and carries no PHI (type + refs
 * only), the inbox is self-scoped — the caller supplies their authenticated actor
 * id (enforced upstream by the session / PEP layer), and mark-read is refused for
 * a notification the caller does not own.
 */

export interface NotificationServiceDeps {
  pool: Pool;
}

export function createPgNotificationServiceDeps(pool: Pool): NotificationServiceDeps {
  return { pool };
}

/** List the authenticated actor's notifications, newest first. */
export async function listMyNotifications(
  deps: NotificationServiceDeps,
  input: { recipientActorRef: string; limit?: number }
): Promise<PersistedNotification[]> {
  return withClient(deps.pool, (client) =>
    listNotificationsForRecipient(client, {
      recipientActorRef: input.recipientActorRef,
      limit: input.limit
    })
  );
}

export type MarkNotificationReadOutcome =
  | { status: "read"; notificationId: string }
  | { status: "already-read"; notificationId: string }
  | { status: "not-found" }
  | { status: "forbidden" };

/** Mark one of the actor's own notifications read; refused if not theirs. */
export async function markMyNotificationRead(
  deps: NotificationServiceDeps,
  input: { notificationId: string; actorRef: string; now?: () => Date }
): Promise<MarkNotificationReadOutcome> {
  const notification = await withClient(deps.pool, (client) =>
    loadNotification(client, input.notificationId)
  );
  if (!notification) {
    return { status: "not-found" };
  }
  if (notification.recipientActorRef !== input.actorRef) {
    return { status: "forbidden" };
  }
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const marked = await withClient(deps.pool, (client) =>
    markNotificationRead(client, { notificationId: input.notificationId, readAt: nowIso })
  );
  return marked
    ? { status: "read", notificationId: input.notificationId }
    : { status: "already-read", notificationId: input.notificationId };
}

async function withClient<T>(pool: Pool, fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
