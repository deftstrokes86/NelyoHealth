import { createHash, randomUUID } from "node:crypto";
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
 * NotificationSent / NotificationFailed / NotificationDeadLettered back through the
 * outbox, so notifications are themselves audited (including failures).
 *
 * Reliability (M6.2 + review hardening):
 *  - At-most-once ROWS per (event, recipient, channel) via the store UNIQUE +
 *    insert-if-absent.
 *  - At-most-once actual SENDS is NOT guaranteed by the row constraint alone: a
 *    crash after the external send succeeds but before the outcome commits leaves
 *    the record re-sendable. That window is closed at the GATEWAY: every delivery
 *    (initial and every retry) carries a STABLE provider idempotency key derived
 *    from the (event_ref, recipient, channel) tuple (`deriveProviderIdempotencyKey`),
 *    so a compliant gateway dedups the re-send. If the gateway does not honor
 *    idempotency keys, the guarantee degrades to at-least-once (a bounded, at-most-
 *    one-per-backoff-window duplicate) — an explicit adapter contract.
 *  - Bounded recovery: a failed record backs off exponentially (`next_attempt_at`)
 *    and, at `maxAttempts`, moves to the terminal 'dead-lettered' state (emitting
 *    NotificationDeadLettered as the alert signal) instead of retrying forever.
 *    `retryPendingNotifications` is the sweep the worker schedules.
 *  - Retention: terminal records are purged after a retention window
 *    (`purgeNotificationsOlderThan`); in-flight records are never purged.
 *
 * The delivery port is dependency-inverted (a local interface) so this package
 * does not depend on the communications adapter; the worker injects it.
 *
 * Scope note (M6.2): the recipient is resolved from the event payload's patientRef
 * (the curated policy events all carry it), so this consumer stays decoupled from
 * resource loaders. Events whose recipient must be resolved from the aggregate
 * (e.g. LabResultReported, MessagePosted) are added later via the ADR-0010
 * load-current-state pattern.
 */

export type NotificationChannel = "email" | "sms" | "push";
export type NotificationStatus = "queued" | "sent" | "failed" | "dead-lettered";

export interface NotificationRetryPolicy {
  /** Attempts (initial + retries) before a record is dead-lettered. */
  maxAttempts: number;
  /** Base backoff in seconds; the nth failure waits base * 2^(n-1). */
  backoffBaseSeconds: number;
}

export const DEFAULT_NOTIFICATION_RETRY_POLICY: NotificationRetryPolicy = {
  maxAttempts: 5,
  backoffBaseSeconds: 30
};

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
  attemptCount: number;
  nextAttemptAt?: string;
  readAt?: string;
  dispatchedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Dependency-inverted delivery port. The worker injects an adapter over the
 * platform communications port; template variables are reference-only (no PHI),
 * and `safeContext.idempotencyKey` carries the stable provider dedup key.
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
  attempt_count: number;
  next_attempt_at: string | Date | null;
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
  "failure_reason_code, attempt_count, next_attempt_at, read_at, dispatched_at, " +
  "created_at, updated_at";

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
    attemptCount: row.attempt_count,
    nextAttemptAt: toIsoOrUndefined(row.next_attempt_at),
    readAt: toIsoOrUndefined(row.read_at),
    dispatchedAt: toIsoOrUndefined(row.dispatched_at),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at)
  };
}

/**
 * Stable provider idempotency key for a delivery. Derived ONLY from the
 * (event, recipient, channel) identity — the same across the initial send and
 * every retry — so a compliant gateway dedups a re-send after a crash window.
 */
export function deriveProviderIdempotencyKey(input: {
  eventRef: string;
  recipientActorRef: string;
  channel: NotificationChannel;
}): string {
  return createHash("sha256")
    .update(`notification-delivery|${input.eventRef}|${input.recipientActorRef}|${input.channel}`)
    .digest("hex");
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
            next_attempt_at = NULL, dispatched_at = $3, updated_at = $4
      WHERE notification_id = $1`,
    [input.notificationId, input.providerMessageRef, input.dispatchedAt, input.updatedAt]
  );
}

/**
 * Record a failed delivery attempt: increment the attempt count and either
 * schedule the next retry with exponential backoff, or (at maxAttempts) move the
 * record to the terminal 'dead-lettered' state. Returns the resulting status +
 * attempt count so the caller emits the matching audit event.
 */
export async function recordNotificationDeliveryFailure(
  client: ClientBase,
  input: {
    notificationId: string;
    failureReasonCode: string;
    retryPolicy: NotificationRetryPolicy;
    now: string;
  }
): Promise<{ status: "failed" | "dead-lettered"; attemptCount: number }> {
  const result = await client.query<{ status: "failed" | "dead-lettered"; attempt_count: number }>(
    `UPDATE nelyo_notification.notification
        SET attempt_count = attempt_count + 1,
            failure_reason_code = $2,
            status = CASE WHEN attempt_count + 1 >= $3 THEN 'dead-lettered' ELSE 'failed' END,
            next_attempt_at = CASE
              WHEN attempt_count + 1 >= $3 THEN NULL
              ELSE $5::timestamptz
                   + make_interval(secs => ($4::double precision) * power(2, attempt_count))
            END,
            dead_lettered_at = CASE WHEN attempt_count + 1 >= $3 THEN $5::timestamptz ELSE NULL END,
            updated_at = $5
      WHERE notification_id = $1
      RETURNING status, attempt_count`,
    [
      input.notificationId,
      input.failureReasonCode,
      input.retryPolicy.maxAttempts,
      input.retryPolicy.backoffBaseSeconds,
      input.now
    ]
  );
  const row = result.rows[0];
  return { status: row?.status ?? "failed", attemptCount: row?.attempt_count ?? 0 };
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

/**
 * Retention purge: delete TERMINAL records (sent / dead-lettered) older than the
 * retention window. In-flight records (queued / failed) are never purged — they
 * are the recovery target. The store carries no PHI, so this is operational
 * hygiene + a bound on inbox history, not PHI minimization.
 */
export async function purgeNotificationsOlderThan(
  client: ClientBase,
  input: { olderThanDays: number; now?: string }
): Promise<{ purged: number }> {
  const now = input.now ?? new Date().toISOString();
  const result = await client.query(
    `DELETE FROM nelyo_notification.notification
      WHERE status IN ('sent', 'dead-lettered')
        AND created_at < ($2::timestamptz - make_interval(days => $1))`,
    [input.olderThanDays, now]
  );
  return { purged: result.rowCount ?? 0 };
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

/**
 * The sweep's work set: records still awaiting a first delivery ('queued') or
 * failed records whose backoff has elapsed. Dead-lettered records are excluded
 * (terminal). Ordered oldest-first, bounded by `limit` (batch size).
 */
export async function listDueNotificationDeliveries(
  client: ClientBase,
  input: { limit?: number; now?: string }
): Promise<PersistedNotification[]> {
  const now = input.now ?? new Date().toISOString();
  const result = await client.query<NotificationRow>(
    `SELECT ${NOTIFICATION_COLUMNS} FROM nelyo_notification.notification
      WHERE status = 'queued'
         OR (status = 'failed' AND (next_attempt_at IS NULL OR next_attempt_at <= $2::timestamptz))
      ORDER BY created_at ASC
      LIMIT $1`,
    [input.limit ?? 200, now]
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
 * Build the reference-only external message for a notification. Pure + exported so
 * the "no PHI beyond the trust boundary" invariant (Principle 12) is unit-testable
 * in isolation: the recipient is a reference, and the only template variables are
 * the notification type + soft refs — never a clinical body or free text. The
 * `safeContext.idempotencyKey` is OVERRIDDEN with the stable per-delivery provider
 * key so a re-send is deduped by the gateway (traceability fields are preserved).
 */
export function buildReferenceOnlyDeliveryMessage(
  notification: Pick<
    PersistedNotification,
    | "channel"
    | "eventRef"
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
    safeContext: {
      ...safeContext,
      idempotencyKey: deriveProviderIdempotencyKey({
        eventRef: notification.eventRef,
        recipientActorRef: notification.recipientActorRef,
        channel: notification.channel
      })
    }
  };
}

/**
 * Atomically record the delivery outcome and emit the audit event
 * (NotificationSent / NotificationFailed / NotificationDeadLettered,
 * reference-only) back through the outbox.
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
    retryPolicy: NotificationRetryPolicy;
    outcome:
      | { status: "sent"; providerMessageRef: string }
      | { status: "failed"; failureReasonCode: string };
  }
): Promise<void> {
  const nowIso = new Date().toISOString();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    let eventType: "NotificationSent" | "NotificationFailed" | "NotificationDeadLettered";
    let failureReasonCode: string | undefined;
    if (input.outcome.status === "sent") {
      await markNotificationSent(client, {
        notificationId: input.notificationId,
        providerMessageRef: input.outcome.providerMessageRef,
        dispatchedAt: nowIso,
        updatedAt: nowIso
      });
      eventType = "NotificationSent";
    } else {
      const result = await recordNotificationDeliveryFailure(client, {
        notificationId: input.notificationId,
        failureReasonCode: input.outcome.failureReasonCode,
        retryPolicy: input.retryPolicy,
        now: nowIso
      });
      failureReasonCode = input.outcome.failureReasonCode;
      eventType =
        result.status === "dead-lettered" ? "NotificationDeadLettered" : "NotificationFailed";
    }
    await outbox.insertPending(
      client,
      createDomainEventEnvelope({
        eventType,
        aggregateId: input.notificationId,
        safeContext: input.safeContext,
        payload: {
          notificationRef: input.notificationId,
          recipientActorRef: input.recipientActorRef,
          patientRef: input.patientRef ?? null,
          organizationRef: input.organizationRef ?? null,
          notificationType: input.notificationType,
          channel: input.channel,
          ...(failureReasonCode ? { failureReasonCode } : {})
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

/** Attempt delivery for one queued/failed notification and record the outcome. */
async function deliverNotification(
  pool: Pool,
  outbox: PgOutboxStore<Record<string, unknown>>,
  delivery: NotificationDeliveryPort,
  notification: PersistedNotification,
  safeContext: DomainEventSafeContext,
  retryPolicy: NotificationRetryPolicy
): Promise<void> {
  const outcome = await attemptDelivery(delivery, notification, safeContext);
  await recordDeliveryOutcome(pool, outbox, {
    notificationId: notification.notificationId,
    safeContext,
    recipientActorRef: notification.recipientActorRef,
    patientRef: notification.patientRef,
    organizationRef: notification.organizationRef,
    notificationType: notification.notificationType,
    channel: notification.channel,
    retryPolicy,
    outcome
  });
}

async function attemptDelivery(
  delivery: NotificationDeliveryPort,
  notification: PersistedNotification,
  safeContext: DomainEventSafeContext
): Promise<
  { status: "sent"; providerMessageRef: string } | { status: "failed"; failureReasonCode: string }
> {
  try {
    const receipt = await delivery.deliver(
      buildReferenceOnlyDeliveryMessage(notification, safeContext)
    );
    if (!receipt.accepted) {
      // Soft rejection (gateway returned without throwing) is still a failure.
      return { status: "failed", failureReasonCode: "delivery-rejected" };
    }
    return { status: "sent", providerMessageRef: receipt.messageRef };
  } catch {
    // Delivery threw (gateway error / transport failure). The reason is a code,
    // never the raw error text.
    return { status: "failed", failureReasonCode: "delivery-error" };
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
  delivery: NotificationDeliveryPort,
  retryPolicy: NotificationRetryPolicy = DEFAULT_NOTIFICATION_RETRY_POLICY
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
      const nowIso = new Date().toISOString();

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
          createdAt: nowIso
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
          attemptCount: 0,
          createdAt: nowIso,
          updatedAt: nowIso
        },
        event.safeContext,
        retryPolicy
      );
    }
  };
}

/**
 * Recovery sweep (rebuild analog per ADR-0010): re-attempt delivery for records
 * still 'queued' or 'failed' whose backoff has elapsed. Records that exhaust
 * `maxAttempts` are dead-lettered (never retried again). Bounds delivery staleness
 * to "never hours" — invoked by the worker's scheduled job, never on the read path.
 */
export async function retryPendingNotifications(
  pool: Pool,
  delivery: NotificationDeliveryPort,
  input: {
    limit?: number;
    safeContext: DomainEventSafeContext;
    retryPolicy?: NotificationRetryPolicy;
    now?: string;
  }
): Promise<{ attempted: number }> {
  const retryPolicy = input.retryPolicy ?? DEFAULT_NOTIFICATION_RETRY_POLICY;
  const outbox = new PgOutboxStore<Record<string, unknown>>(pool);
  const due = await withClient(pool, (client) =>
    listDueNotificationDeliveries(client, { limit: input.limit, now: input.now })
  );
  for (const notification of due) {
    await deliverNotification(pool, outbox, delivery, notification, input.safeContext, retryPolicy);
  }
  return { attempted: due.length };
}
