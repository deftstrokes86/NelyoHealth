import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  createDatabaseClient,
  createDatabasePool,
  createNotificationOrchestrationConsumer,
  listNotificationsForRecipient,
  loadNotification,
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
 * domain event produces a reference-only external message (NO PHI) recorded 'sent';
 * a delivery failure is recorded 'failed'; both emit NotificationSent /
 * NotificationFailed audit events through the outbox; delivery is at-most-once
 * (idempotent); the retry sweep re-attempts failed records; and the inbox is
 * self-scoped.
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
            templateVariables: message.templateVariables
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

  it("orchestrates a reference-only notification and records it sent + emits NotificationSent", async () => {
    const { patientRef, organizationRef, appointmentRef } = newSubjects();
    const { port, sent } = capturingDelivery("ok");
    const consumer = createNotificationOrchestrationConsumer(pool, port);

    await consumer.consume(bookedEvent(patientRef, organizationRef, appointmentRef, "sent"));

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
    const serialized = JSON.stringify(sent[0]).toLowerCase();
    for (const fragment of FORBIDDEN) {
      expect(serialized).not.toContain(fragment);
    }

    // A NotificationSent audit event was emitted through the outbox.
    const emitted = await client.query(
      `SELECT event_type FROM nelyo_foundation.transactional_outbox
        WHERE aggregate_id = $1 AND event_type IN ('NotificationSent', 'NotificationFailed')`,
      [inbox[0]?.notificationId]
    );
    expect(emitted.rows[0]).toMatchObject({ event_type: "NotificationSent" });
  });

  it("records a failure and emits NotificationFailed when delivery throws", async () => {
    const { patientRef, organizationRef, appointmentRef } = newSubjects();
    const { port } = capturingDelivery("fail");
    const consumer = createNotificationOrchestrationConsumer(pool, port);

    await consumer.consume(bookedEvent(patientRef, organizationRef, appointmentRef, "fail"));

    const inbox = await listNotificationsForRecipient(client, { recipientActorRef: patientRef });
    expect(inbox[0]).toMatchObject({ status: "failed", failureReasonCode: "delivery-error" });

    const emitted = await client.query(
      `SELECT event_type FROM nelyo_foundation.transactional_outbox
        WHERE aggregate_id = $1 AND event_type IN ('NotificationSent', 'NotificationFailed')`,
      [inbox[0]?.notificationId]
    );
    expect(emitted.rows[0]).toMatchObject({ event_type: "NotificationFailed" });
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

  it("retries a failed notification via the recovery sweep", async () => {
    const { patientRef, organizationRef, appointmentRef } = newSubjects();
    const failing = capturingDelivery("fail");
    await createNotificationOrchestrationConsumer(pool, failing.port).consume(
      bookedEvent(patientRef, organizationRef, appointmentRef, "retry")
    );
    const failed = await listNotificationsForRecipient(client, { recipientActorRef: patientRef });
    expect(failed[0]?.status).toBe("failed");
    const notificationId = failed[0]?.notificationId ?? "";

    const ok = capturingDelivery("ok");
    await retryPendingNotifications(pool, ok.port, {
      limit: 500,
      safeContext: {
        requestId: `req-${run}-retry`,
        correlationId: `corr-${run}-retry`,
        idempotencyKey: `idem-${run}-retry`,
        operationTag: "notification.retry"
      }
    });

    expect((await loadNotification(client, notificationId))?.status).toBe("sent");
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
