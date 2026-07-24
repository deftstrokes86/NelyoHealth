import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  createDatabaseClient,
  createDatabasePool,
  createNotificationOrchestrationConsumer,
  deriveProviderIdempotencyKey,
  listNotificationsForRecipient,
  loadNotification,
  purgeNotificationsOlderThan,
  retryPendingNotifications,
  type NotificationDeliveryPort,
  type OutboxEventRecord
} from "../../packages/database/src/index.js";
import {
  createPgNotificationServiceDeps,
  listMyNotifications,
  markMyNotificationRead
} from "../../apps/api/src/notification-service.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";
const FORBIDDEN = ["phi", "clinical", "secret", "reason", "diagnosis", "body"];

/**
 * M6.2 notification orchestration against live Postgres. Proves: a policy-matched
 * domain event produces a reference-only external message (NO PHI) recorded 'sent',
 * carrying a STABLE provider idempotency key (review item 1); a delivery failure
 * backs off then retries via the sweep, and dead-letters at max attempts (item 2);
 * NotificationSent / NotificationFailed / NotificationDeadLettered flow through the
 * outbox; delivery is at-most-once ROWS (idempotent); terminal records are purged
 * past retention (item 3); and the inbox is self-scoped.
 */
describe.skipIf(!shouldRun)("notification orchestration + delivery + inbox", () => {
  const client = createDatabaseClient();
  const pool = createDatabasePool();
  const notificationDeps = createPgNotificationServiceDeps(pool);

  const run = `ntf-${Date.now()}`;
  const recipientRefs: string[] = [];
  const correlationIds: string[] = [];

  interface Captured {
    channel: string;
    recipient: string;
    templateId: string;
    templateVariables: Record<string, string>;
    idempotencyKey: string;
  }
  function capturingDelivery(mode: "ok" | "fail"): {
    port: NotificationDeliveryPort;
    sent: Captured[];
  } {
    const sent: Captured[] = [];
    return {
      sent,
      port: {
        deliver: async (message) => {
          sent.push({
            channel: message.channel,
            recipient: message.recipient,
            templateId: message.templateId,
            templateVariables: message.templateVariables,
            idempotencyKey: message.safeContext.idempotencyKey
          });
          if (mode === "fail") {
            throw new Error("gateway unavailable");
          }
          return { messageRef: `provider-${randomUUID()}`, accepted: true };
        }
      }
    };
  }

  function bookedEvent(
    patientRef: string,
    organizationRef: string,
    appointmentRef: string,
    tag: string
  ): OutboxEventRecord<Record<string, unknown>> {
    const correlationId = `corr-${run}-${tag}`;
    correlationIds.push(correlationId);
    return {
      eventId: randomUUID(),
      eventType: "AppointmentBooked",
      aggregateId: appointmentRef,
      safeContext: {
        requestId: `req-${run}-${tag}`,
        correlationId,
        idempotencyKey: `idem-${run}-${tag}`,
        operationTag: "appointment.booking.book"
      },
      payload: {
        appointmentRef,
        patientRef,
        clinicianRef: randomUUID(),
        organizationRef,
        appointmentType: "consultation"
      },
      createdAt: new Date().toISOString(),
      dispatchStatus: "pending",
      dispatchAttempts: 0,
      lastError: null,
      dispatchedAt: null
    };
  }

  function newSubjects() {
    const patientRef = randomUUID();
    const organizationRef = randomUUID();
    recipientRefs.push(patientRef);
    return { patientRef, organizationRef, appointmentRef: randomUUID() };
  }

  const futureNow = (secs: number) => new Date(Date.now() + secs * 1000).toISOString();
  const sweepContext = (tag: string) => ({
    requestId: `req-${run}-${tag}`,
    correlationId: `corr-${run}-${tag}`,
    idempotencyKey: `idem-${run}-${tag}`,
    operationTag: "notification.delivery.sweep"
  });

  beforeAll(async () => {
    await client.connect();
  });

  afterAll(async () => {
    for (const recipientRef of recipientRefs) {
      await client.query(
        `DELETE FROM nelyo_notification.notification WHERE recipient_actor_ref = $1`,
        [recipientRef]
      );
    }
    for (const correlationId of correlationIds) {
      await client.query(`DELETE FROM nelyo_foundation.audit_event WHERE correlation_id = $1`, [
        correlationId
      ]);
      await client.query(
        `DELETE FROM nelyo_foundation.transactional_outbox WHERE correlation_id = $1`,
        [correlationId]
      );
    }
    await client.end();
    await pool.end();
  });

  it("orchestrates a reference-only notification, records it sent, emits NotificationSent, and carries a stable provider key", async () => {
    const { patientRef, organizationRef, appointmentRef } = newSubjects();
    const { port, sent } = capturingDelivery("ok");
    const consumer = createNotificationOrchestrationConsumer(pool, port);
    const event = bookedEvent(patientRef, organizationRef, appointmentRef, "sent");

    await consumer.consume(event);

    const inbox = await listNotificationsForRecipient(client, { recipientActorRef: patientRef });
    expect(inbox).toHaveLength(1);
    expect(inbox[0]).toMatchObject({
      notificationType: "appointment-booked",
      recipientActorRef: patientRef,
      targetRef: appointmentRef,
      channel: "email",
      status: "sent"
    });
    expect(inbox[0]?.providerMessageRef).toBeTruthy();

    // The external message is reference-only: no body, no clinical variables.
    expect(sent).toHaveLength(1);
    expect(sent[0]?.recipient).toBe(patientRef);
    expect(sent[0]?.templateId).toBe("notify.appointment.booked");
    expect(Object.keys(sent[0]?.templateVariables ?? {}).sort()).toEqual([
      "notificationType",
      "organizationRef",
      "targetRef"
    ]);
    const serialized = JSON.stringify(sent[0]?.templateVariables).toLowerCase();
    for (const fragment of FORBIDDEN) {
      expect(serialized).not.toContain(fragment);
    }

    // Item 1: the gateway receives the stable tuple-derived idempotency key.
    expect(sent[0]?.idempotencyKey).toBe(
      deriveProviderIdempotencyKey({
        eventRef: event.eventId,
        recipientActorRef: patientRef,
        channel: "email"
      })
    );

    const emitted = await client.query(
      `SELECT event_type FROM nelyo_foundation.transactional_outbox
        WHERE aggregate_id = $1 AND event_type LIKE 'Notification%'`,
      [inbox[0]?.notificationId]
    );
    expect(emitted.rows[0]).toMatchObject({ event_type: "NotificationSent" });
  });

  it("records a failure with backoff + emits NotificationFailed when delivery throws", async () => {
    const { patientRef, organizationRef, appointmentRef } = newSubjects();
    const { port } = capturingDelivery("fail");
    const consumer = createNotificationOrchestrationConsumer(pool, port);

    await consumer.consume(bookedEvent(patientRef, organizationRef, appointmentRef, "fail"));

    const inbox = await listNotificationsForRecipient(client, { recipientActorRef: patientRef });
    expect(inbox[0]).toMatchObject({ status: "failed", failureReasonCode: "delivery-error" });
    expect(inbox[0]?.attemptCount).toBe(1);
    expect(inbox[0]?.nextAttemptAt).toBeTruthy(); // backoff scheduled

    const emitted = await client.query(
      `SELECT event_type FROM nelyo_foundation.transactional_outbox
        WHERE aggregate_id = $1 AND event_type LIKE 'Notification%'`,
      [inbox[0]?.notificationId]
    );
    expect(emitted.rows[0]).toMatchObject({ event_type: "NotificationFailed" });
  });

  it("does not retry a failed send before its backoff has elapsed", async () => {
    const { patientRef, organizationRef, appointmentRef } = newSubjects();
    await createNotificationOrchestrationConsumer(pool, capturingDelivery("fail").port).consume(
      bookedEvent(patientRef, organizationRef, appointmentRef, "backoff")
    );
    const failed = await listNotificationsForRecipient(client, { recipientActorRef: patientRef });
    const notificationId = failed[0]?.notificationId ?? "";

    // Sweep NOW (backoff ~30s in the future) → the record is not due → untouched.
    const ok = capturingDelivery("ok");
    await retryPendingNotifications(pool, ok.port, {
      limit: 500,
      safeContext: sweepContext("backoff"),
      now: new Date().toISOString()
    });

    expect(ok.sent).toHaveLength(0);
    const after = await loadNotification(client, notificationId);
    expect(after?.status).toBe("failed");
    expect(after?.attemptCount).toBe(1);
  });

  it("retries a failed notification once its backoff has elapsed", async () => {
    const { patientRef, organizationRef, appointmentRef } = newSubjects();
    await createNotificationOrchestrationConsumer(pool, capturingDelivery("fail").port).consume(
      bookedEvent(patientRef, organizationRef, appointmentRef, "retry")
    );
    const failed = await listNotificationsForRecipient(client, { recipientActorRef: patientRef });
    expect(failed[0]?.status).toBe("failed");
    const notificationId = failed[0]?.notificationId ?? "";

    // Sweep with a clock past the backoff window → the record is due → re-sent.
    const ok = capturingDelivery("ok");
    await retryPendingNotifications(pool, ok.port, {
      limit: 500,
      safeContext: sweepContext("retry"),
      now: futureNow(120)
    });

    expect((await loadNotification(client, notificationId))?.status).toBe("sent");
  });

  it("dead-letters a send after max attempts and emits NotificationDeadLettered", async () => {
    const { patientRef, organizationRef, appointmentRef } = newSubjects();
    // maxAttempts: 1 → the very first failure is terminal.
    const consumer = createNotificationOrchestrationConsumer(pool, capturingDelivery("fail").port, {
      maxAttempts: 1,
      backoffBaseSeconds: 1
    });
    await consumer.consume(bookedEvent(patientRef, organizationRef, appointmentRef, "deadletter"));

    const inbox = await listNotificationsForRecipient(client, { recipientActorRef: patientRef });
    expect(inbox[0]).toMatchObject({ status: "dead-lettered", attemptCount: 1 });
    expect(inbox[0]?.nextAttemptAt).toBeUndefined(); // terminal: never retried again

    const emitted = await client.query(
      `SELECT event_type FROM nelyo_foundation.transactional_outbox
        WHERE aggregate_id = $1 AND event_type LIKE 'Notification%'`,
      [inbox[0]?.notificationId]
    );
    expect(emitted.rows[0]).toMatchObject({ event_type: "NotificationDeadLettered" });
  });

  it("is idempotent — redelivery of the same event does not double-notify", async () => {
    const { patientRef, organizationRef, appointmentRef } = newSubjects();
    const { port, sent } = capturingDelivery("ok");
    const consumer = createNotificationOrchestrationConsumer(pool, port);

    const event = bookedEvent(patientRef, organizationRef, appointmentRef, "idem");
    await consumer.consume(event);
    await consumer.consume(event); // redelivery

    const inbox = await listNotificationsForRecipient(client, { recipientActorRef: patientRef });
    expect(inbox).toHaveLength(1);
    expect(sent).toHaveLength(1); // delivered exactly once
  });

  it("purges terminal records past retention but keeps in-flight ones", async () => {
    const { patientRef, organizationRef, appointmentRef } = newSubjects();
    // One sent (terminal) + one failed (in-flight), both aged past retention.
    await createNotificationOrchestrationConsumer(pool, capturingDelivery("ok").port).consume(
      bookedEvent(patientRef, organizationRef, appointmentRef, "purge-sent")
    );
    await createNotificationOrchestrationConsumer(pool, capturingDelivery("fail").port).consume(
      bookedEvent(patientRef, organizationRef, randomUUID(), "purge-failed")
    );

    const before = await listNotificationsForRecipient(client, { recipientActorRef: patientRef });
    expect(before).toHaveLength(2);
    // Backdate both well past the retention window.
    await client.query(
      `UPDATE nelyo_notification.notification
          SET created_at = NOW() - INTERVAL '200 days' WHERE recipient_actor_ref = $1`,
      [patientRef]
    );

    const { purged } = await purgeNotificationsOlderThan(client, { olderThanDays: 90 });
    expect(purged).toBeGreaterThanOrEqual(1);

    const remaining = await listNotificationsForRecipient(client, {
      recipientActorRef: patientRef
    });
    expect(remaining).toHaveLength(1);
    expect(remaining[0]?.status).toBe("failed"); // in-flight record survives purge
  });

  it("exposes a self-scoped inbox: list + mark-read, refused for others", async () => {
    const { patientRef, organizationRef, appointmentRef } = newSubjects();
    await createNotificationOrchestrationConsumer(pool, capturingDelivery("ok").port).consume(
      bookedEvent(patientRef, organizationRef, appointmentRef, "inbox")
    );

    const mine = await listMyNotifications(notificationDeps, { recipientActorRef: patientRef });
    expect(mine).toHaveLength(1);
    const notificationId = mine[0]?.notificationId ?? "";

    // Another actor cannot mark it read.
    const forbidden = await markMyNotificationRead(notificationDeps, {
      notificationId,
      actorRef: randomUUID()
    });
    expect(forbidden.status).toBe("forbidden");

    const read = await markMyNotificationRead(notificationDeps, {
      notificationId,
      actorRef: patientRef
    });
    expect(read.status).toBe("read");
    expect((await loadNotification(client, notificationId))?.readAt).toBeTruthy();
  });
});
