import { randomUUID } from "node:crypto";
import type { ClientBase, Pool, PoolClient } from "pg";
import { createDomainEventEnvelope } from "./transaction-outbox.js";
import type {
  DomainEventConsumer,
  DomainEventSafeContext,
  OutboxEventRecord
} from "./transaction-outbox.js";
import { PgOutboxStore } from "./pg-outbox.js";

/**
 * Notification orchestration store + consumer (roadmap M6.2).
 *
 * The dispatcher's notification subscriber turns selected patient-facing domain
 * events into reference-only messages delivered through an injected delivery port
 * (the communications adapter), and records a MINIMIZED delivery record — refs +
 * delivery metadata only, never PHI (Principle 12). Delivery-state changes emit
 * NotificationSent / NotificationFailed back through the outbox, so notifications
 * are themselves audited (including failures).
 *
 * Reliability (M6.2): at-most-once external send per (event, recipient, channel),
 * enforced by the store's UNIQUE constraint (insert-if-absent → send). A record
 * left 'queued' or 'failed' is the recovery target for `retryPendingNotifications`
 * — the recovery path (rebuild analog per ADR-0010). The delivery port is
 * dependency-inverted (a local interface) so this package does not depend on the
 * communications adapter; the worker injects it.
 *
 * Scope note (M6.2): the recipient is resolved from the event payload's patientRef
 * (the curated policy events all carry it), so this consumer stays decoupled from
 * resource loaders. Events whose recipient must be resolved from the aggregate
 * (e.g. LabResultReported, MessagePosted) are added later via the ADR-0010
 * load-current-state pattern.
 */

export type NotificationChannel = "email" | "sms" | "push";
export type NotificationStatus = "queued" | "sent" | "failed";

export interface PersistedNotification {
  notificationId: string;
  eventRef: string;
  notificationType: string;
  recipientActorRef: string;
  patientRef?: string;
  organizationRef?: string;
  targetRef?: string;
  channel: NotificationChannel;
  templateId: string;
  status: NotificationStatus;
  providerMessageRef?: string;
  failureReasonCode?: string;
  readAt?: string;
  dispatchedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Dependency-inverted delivery port. The worker injects an adapter over the
 * platform communications port; template variables are reference-only (no PHI).
 */
export interface NotificationDeliveryPort {
  deliver(message: {
    channel: NotificationChannel;
    recipient: string;
    templateId: string;
    templateVariables: Record<string, string>;
    safeContext: DomainEventSafeContext;
  }): Promise<{ messageRef: string; accepted: boolean }>;
}

interface NotificationRow {
  notification_id: string;
  event_ref: string;
  notification_type: string;
  recipient_actor_ref: string;
  patient_ref: string | null;
  organization_ref: string | null;
  target_ref: string | null;
  channel: NotificationChannel;
  template_id: string;
  status: NotificationStatus;
  provider_message_ref: string | null;
  failure_reason_code: string | null;
  read_at: string | Date | null;
  dispatched_at: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
}

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toIsoOrUndefined(value: string | Date | null): string | undefined {
  return value === null ? undefined : toIso(value);
}

const NOTIFICATION_COLUMNS =
  "notification_id, event_ref, notification_type, recipient_actor_ref, patient_ref, " +
  "organization_ref, target_ref, channel, template_id, status, provider_message_ref, " +
  "failure_reason_code, read_at, dispatched_at, created_at, updated_at";

function mapNotification(row: NotificationRow): PersistedNotification {
  return {
    notificationId: row.notification_id,
    eventRef: row.event_ref,
    notificationType: row.notification_type,
    recipientActorRef: row.recipient_actor_ref,
    patientRef: row.patient_ref ?? undefined,
    organizationRef: row.organization_ref ?? undefined,
    targetRef: row.target_ref ?? undefined,
    channel: row.channel,
    templateId: row.template_id,
    status: row.status,
    providerMessageRef: row.provider_message_ref ?? undefined,
    failureReasonCode: row.failure_reason_code ?? undefined,
    readAt: toIsoOrUndefined(row.read_at),
    dispatchedAt: toIsoOrUndefined(row.dispatched_at),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at)
  };
}

// ---------- Mutations ----------

/** Insert a queued notification; returns false if one already exists (idempotent). */
export async function insertQueuedNotification(
  client: ClientBase,
  input: {
    notificationId: string;
    eventRef: string;
    notificationType: string;
    recipientActorRef: string;
    patientRef?: string;
    organizationRef?: string;
    targetRef?: string;
    channel: NotificationChannel;
    templateId: string;
    createdAt: string;
  }
): Promise<boolean> {
  const result = await client.query(
    `INSERT INTO nelyo_notification.notification
       (notification_id, event_ref, notification_type, recipient_actor_ref, patient_ref,
        organization_ref, target_ref, channel, template_id, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'queued', $10, $10)
     ON CONFLICT (event_ref, recipient_actor_ref, channel) DO NOTHING
     RETURNING notification_id`,
    [
      input.notificationId,
      input.eventRef,
      input.notificationType,
      input.recipientActorRef,
      input.patientRef ?? null,
      input.organizationRef ?? null,
      input.targetRef ?? null,
      input.channel,
      input.templateId,
      input.createdAt
    ]
  );
  return (result.rowCount ?? 0) > 0;
}

export async function markNotificationSent(
  client: ClientBase,
  input: {
    notificationId: string;
    providerMessageRef: string;
    dispatchedAt: string;
    updatedAt: string;
  }
): Promise<void> {
  await client.query(
    `UPDATE nelyo_notification.notification
        SET status = 'sent', provider_message_ref = $2, failure_reason_code = NULL,
            dispatched_at = $3, updated_at = $4
      WHERE notification_id = $1`,
    [input.notificationId, input.providerMessageRef, input.dispatchedAt, input.updatedAt]
  );
}

export async function markNotificationFailed(
  client: ClientBase,
  input: { notificationId: string; failureReasonCode: string; updatedAt: string }
): Promise<void> {
  await client.query(
    `UPDATE nelyo_notification.notification
        SET status = 'failed', failure_reason_code = $2, updated_at = $3
      WHERE notification_id = $1`,
    [input.notificationId, input.failureReasonCode, input.updatedAt]
  );
}

export async function markNotificationRead(
  client: ClientBase,
  input: { notificationId: string; readAt: string }
): Promise<boolean> {
  const result = await client.query(
    `UPDATE nelyo_notification.notification SET read_at = $2, updated_at = $2
      WHERE notification_id = $1 AND read_at IS NULL`,
    [input.notificationId, input.readAt]
  );
  return (result.rowCount ?? 0) > 0;
}

// ---------- Reads ----------

export async function loadNotification(
  client: ClientBase,
  notificationId: string
): Promise<PersistedNotification | null> {
  const result = await client.query<NotificationRow>(
    `SELECT ${NOTIFICATION_COLUMNS} FROM nelyo_notification.notification WHERE notification_id = $1`,
    [notificationId]
  );
  const row = result.rows[0];
  return row ? mapNotification(row) : null;
}

export async function listNotificationsForRecipient(
  client: ClientBase,
  input: { recipientActorRef: string; limit?: number }
): Promise<PersistedNotification[]> {
  const result = await client.query<NotificationRow>(
    `SELECT ${NOTIFICATION_COLUMNS} FROM nelyo_notification.notification
      WHERE recipient_actor_ref = $1
      ORDER BY created_at DESC
      LIMIT $2`,
    [input.recipientActorRef, input.limit ?? 100]
  );
  return result.rows.map(mapNotification);
}

export async function listPendingNotificationDeliveries(
  client: ClientBase,
  input: { limit?: number }
): Promise<PersistedNotification[]> {
  const result = await client.query<NotificationRow>(
    `SELECT ${NOTIFICATION_COLUMNS} FROM nelyo_notification.notification
      WHERE status IN ('queued', 'failed')
      ORDER BY created_at ASC
      LIMIT $1`,
    [input.limit ?? 200]
  );
  return result.rows.map(mapNotification);
}

// ---------- Orchestration consumer ----------

interface NotificationSpec {
  notificationType: string;
  templateId: string;
  channel: NotificationChannel;
}

/**
 * Curated policy: which domain events notify the patient, with which template.
 * All listed events carry patientRef + organizationRef in their reference-only
 * payload, so the recipient resolves without loading the aggregate.
 */
const NOTIFICATION_POLICY: Record<string, NotificationSpec> = {
  AppointmentBooked: {
    notificationType: "appointment-booked",
    templateId: "notify.appointment.booked",
    channel: "email"
  },
  AppointmentCancelled: {
    notificationType: "appointment-cancelled",
    templateId: "notify.appointment.cancelled",
    channel: "email"
  },
  ConsultationScheduled: {
    notificationType: "consultation-scheduled",
    templateId: "notify.consultation.scheduled",
    channel: "email"
  },
  PrescriptionIssued: {
    notificationType: "prescription-issued",
    templateId: "notify.prescription.issued",
    channel: "email"
  },
  LabOrderPlaced: {
    notificationType: "lab-order-placed",
    templateId: "notify.lab.ordered",
    channel: "email"
  }
};

function readStringField(payload: Record<string, unknown>, key: string): string | undefined {
  const value = payload[key];
  return typeof value === "string" ? value : undefined;
}

async function withClient<T>(pool: Pool, fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}

/**
 * Atomically record the delivery outcome and emit the audit event
 * (NotificationSent / NotificationFailed, reference-only) back through the outbox.
 */
async function recordDeliveryOutcome(
  pool: Pool,
  outbox: PgOutboxStore<Record<string, unknown>>,
  input: {
    notificationId: string;
    safeContext: DomainEventSafeContext;
    recipientActorRef: string;
    patientRef?: string;
    organizationRef?: string;
    notificationType: string;
    channel: NotificationChannel;
    outcome:
      | { status: "sent"; providerMessageRef: string }
      | { status: "failed"; failureReasonCode: string };
  }
): Promise<void> {
  const nowIso = new Date().toISOString();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    if (input.outcome.status === "sent") {
      await markNotificationSent(client, {
        notificationId: input.notificationId,
        providerMessageRef: input.outcome.providerMessageRef,
        dispatchedAt: nowIso,
        updatedAt: nowIso
      });
    } else {
      await markNotificationFailed(client, {
        notificationId: input.notificationId,
        failureReasonCode: input.outcome.failureReasonCode,
        updatedAt: nowIso
      });
    }
    await outbox.insertPending(
      client,
      createDomainEventEnvelope({
        eventType: input.outcome.status === "sent" ? "NotificationSent" : "NotificationFailed",
        aggregateId: input.notificationId,
        safeContext: input.safeContext,
        payload: {
          notificationRef: input.notificationId,
          recipientActorRef: input.recipientActorRef,
          patientRef: input.patientRef ?? null,
          organizationRef: input.organizationRef ?? null,
          notificationType: input.notificationType,
          channel: input.channel,
          ...(input.outcome.status === "failed"
            ? { failureReasonCode: input.outcome.failureReasonCode }
            : {})
        }
      })
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Build the reference-only external message for a notification. Pure + exported so
 * the "no PHI beyond the trust boundary" invariant (Principle 12) is unit-testable
 * in isolation: the recipient is a reference, and the only template variables are
 * the notification type + soft refs — never a clinical body or free text.
 */
export function buildReferenceOnlyDeliveryMessage(
  notification: Pick<
    PersistedNotification,
    | "channel"
    | "recipientActorRef"
    | "templateId"
    | "notificationType"
    | "targetRef"
    | "organizationRef"
  >,
  safeContext: DomainEventSafeContext
): {
  channel: NotificationChannel;
  recipient: string;
  templateId: string;
  templateVariables: Record<string, string>;
  safeContext: DomainEventSafeContext;
} {
  return {
    channel: notification.channel,
    // Address resolution (actor -> email/phone) is a deployment adapter concern;
    // M6.2 passes the recipient reference. Reference-only variables — no PHI.
    recipient: notification.recipientActorRef,
    templateId: notification.templateId,
    templateVariables: {
      notificationType: notification.notificationType,
      targetRef: notification.targetRef ?? "",
      organizationRef: notification.organizationRef ?? ""
    },
    safeContext
  };
}

/** Attempt delivery for one queued/failed notification and record the outcome. */
async function deliverNotification(
  pool: Pool,
  outbox: PgOutboxStore<Record<string, unknown>>,
  delivery: NotificationDeliveryPort,
  notification: PersistedNotification,
  safeContext: DomainEventSafeContext
): Promise<void> {
  try {
    const receipt = await delivery.deliver(
      buildReferenceOnlyDeliveryMessage(notification, safeContext)
    );
    await recordDeliveryOutcome(pool, outbox, {
      notificationId: notification.notificationId,
      safeContext,
      recipientActorRef: notification.recipientActorRef,
      patientRef: notification.patientRef,
      organizationRef: notification.organizationRef,
      notificationType: notification.notificationType,
      channel: notification.channel,
      outcome: { status: "sent", providerMessageRef: receipt.messageRef }
    });
  } catch {
    // Delivery failed (gateway error / rejection). Record 'failed' + emit
    // NotificationFailed; the reason is a code, never the raw error text.
    await recordDeliveryOutcome(pool, outbox, {
      notificationId: notification.notificationId,
      safeContext,
      recipientActorRef: notification.recipientActorRef,
      patientRef: notification.patientRef,
      organizationRef: notification.organizationRef,
      notificationType: notification.notificationType,
      channel: notification.channel,
      outcome: { status: "failed", failureReasonCode: "delivery-error" }
    });
  }
}

/**
 * The dispatcher's notification subscriber (M6.2). On a policy-matched event it
 * inserts a queued record (idempotent by event/recipient/channel), then delivers
 * externally (outside any TX — ExternalCallPolicy-compliant) and records the
 * outcome + audit event. No-ops on every other event type.
 */
export function createNotificationOrchestrationConsumer(
  pool: Pool,
  delivery: NotificationDeliveryPort
): DomainEventConsumer<Record<string, unknown>> {
  const outbox = new PgOutboxStore<Record<string, unknown>>(pool);
  return {
    name: "notification-orchestration",
    consume: async (event: OutboxEventRecord<Record<string, unknown>>) => {
      const spec = NOTIFICATION_POLICY[event.eventType];
      if (!spec) {
        return;
      }
      const patientRef = readStringField(event.payload, "patientRef");
      if (!patientRef) {
        return;
      }
      const organizationRef = readStringField(event.payload, "organizationRef");
      const notificationId = randomUUID();

      const inserted = await withClient(pool, (client) =>
        insertQueuedNotification(client, {
          notificationId,
          eventRef: event.eventId,
          notificationType: spec.notificationType,
          recipientActorRef: patientRef,
          patientRef,
          organizationRef,
          targetRef: event.aggregateId,
          channel: spec.channel,
          templateId: spec.templateId,
          createdAt: new Date().toISOString()
        })
      );
      if (!inserted) {
        return; // at-most-once: already handled for this (event, recipient, channel)
      }

      await deliverNotification(
        pool,
        outbox,
        delivery,
        {
          notificationId,
          eventRef: event.eventId,
          notificationType: spec.notificationType,
          recipientActorRef: patientRef,
          patientRef,
          organizationRef,
          targetRef: event.aggregateId,
          channel: spec.channel,
          templateId: spec.templateId,
          status: "queued",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        event.safeContext
      );
    }
  };
}

/**
 * Recovery sweep (rebuild analog per ADR-0010): re-attempt delivery for records
 * left 'queued' or 'failed' (e.g. after a crash or a transient gateway outage).
 * Bounds delivery staleness to "never hours" — invoked by an operator/scheduled
 * job, never on the read path.
 */
export async function retryPendingNotifications(
  pool: Pool,
  delivery: NotificationDeliveryPort,
  input: { limit?: number; safeContext: DomainEventSafeContext }
): Promise<{ attempted: number }> {
  const outbox = new PgOutboxStore<Record<string, unknown>>(pool);
  const pending = await withClient(pool, (client) =>
    listPendingNotificationDeliveries(client, { limit: input.limit })
  );
  for (const notification of pending) {
    await deliverNotification(pool, outbox, delivery, notification, input.safeContext);
  }
  return { attempted: pending.length };
}
