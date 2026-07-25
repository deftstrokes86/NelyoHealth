import http from "node:http";
import { randomUUID } from "node:crypto";
import {
  createAuditTrailConsumer,
  createCareCircleProjectionConsumer,
  createDatabasePool,
  createNotificationOrchestrationConsumer,
  dispatchPendingOutboxEvents,
  ExternalCallPolicy,
  PgOutboxStore,
  purgeNotificationsOlderThan,
  retryPendingNotifications,
  type NotificationDeliveryPort
} from "@nelyohealth/database";
import { FakeCommunicationsAdapter } from "@nelyohealth/platform-adapters";
import { InMemoryWorkerQueue } from "./in-memory-queue.js";
import { createOutboxDispatchRunner } from "./outbox-dispatch.js";
import { WorkerQueueRuntime } from "./worker-runtime.js";

/**
 * Long-lived worker process entrypoint (roadmap M0.1 Runtime Baseline).
 *
 * Hosts the worker queue runtime as a persistent process with a health
 * surface and graceful shutdown. Dispatcher subscribers and the durable
 * queue binding attach here in later milestones (M3.x) without changing
 * the process model.
 */

const SERVICE_NAME = "@nelyohealth/worker";
const startedAt = new Date().toISOString();

const healthHost = process.env.WORKER_HEALTH_HOST ?? "127.0.0.1";
const healthPort = Number(process.env.WORKER_HEALTH_PORT ?? 4100);
const heartbeatMs = Number(process.env.WORKER_HEARTBEAT_MS ?? 30_000);
const dispatchIntervalMs = Number(process.env.WORKER_OUTBOX_DISPATCH_MS ?? 2_000);
const dispatchMaxAttempts = Number(process.env.WORKER_OUTBOX_MAX_ATTEMPTS ?? 5);
// Notification delivery recovery sweep (M6.2 review item 2): re-attempt failed
// sends whose backoff has elapsed, and dead-letter records past max attempts.
const notificationRetryMs = Number(process.env.WORKER_NOTIFICATION_RETRY_MS ?? 60_000);
const notificationRetryLimit = Number(process.env.WORKER_NOTIFICATION_RETRY_LIMIT ?? 100);
// Notification retention purge (M6.2 review item 3): drop terminal records past
// the retention window; in-flight records are never purged.
const notificationPurgeMs = Number(process.env.WORKER_NOTIFICATION_PURGE_MS ?? 86_400_000);
const notificationRetentionDays = Number(process.env.WORKER_NOTIFICATION_RETENTION_DAYS ?? 90);

const runtime = new WorkerQueueRuntime<Record<string, unknown>>(new InMemoryWorkerQueue());

function log(message: string, extra: Record<string, unknown> = {}): void {
  console.log(
    JSON.stringify({
      at: new Date().toISOString(),
      service: SERVICE_NAME,
      message,
      ...extra
    })
  );
}

// Outbox dispatch loop (M3.3): drain pending domain events to the fan-out
// consumers — the unified-audit subscriber (M3.2), the Care Circle read-model
// projection (M6.1), and notification orchestration (M6.2). The pool connects
// lazily, so this is inert until there are events to dispatch and a database to
// reach.
const dispatchPool = createDatabasePool();
const outboxStore = new PgOutboxStore<Record<string, unknown>>(dispatchPool);
const externalCallPolicy = new ExternalCallPolicy();

// Notification delivery (M6.2): bridge the platform communications port to the
// dependency-inverted NotificationDeliveryPort the consumer expects. The fake
// adapter is the local/dev default; a real gateway adapter is injected here at
// deployment. Sends happen outside any transaction (ExternalCallPolicy).
const communications = new FakeCommunicationsAdapter();
const notificationDelivery: NotificationDeliveryPort = {
  deliver: async (message) => {
    const receipt = await communications.dispatch(message);
    return { messageRef: receipt.messageId, accepted: receipt.accepted };
  }
};
const outboxDispatchRunner = createOutboxDispatchRunner({
  runDispatch: () =>
    dispatchPendingOutboxEvents({
      outbox: outboxStore,
      externalCallPolicy,
      maxAttempts: dispatchMaxAttempts,
      consumers: [
        createAuditTrailConsumer(dispatchPool),
        createCareCircleProjectionConsumer(dispatchPool),
        createNotificationOrchestrationConsumer(dispatchPool, notificationDelivery)
      ]
    }),
  log
});

// Notification recovery sweep + retention purge (M6.2 review items 2-3). Both are
// best-effort background maintenance: a throw is logged, never fatal. They run on
// their own intervals, independent of the outbox dispatch loop.
let notificationSweepRunning = false;
async function runNotificationSweep(): Promise<void> {
  if (notificationSweepRunning) return; // no overlap if a sweep runs long
  notificationSweepRunning = true;
  try {
    const result = await retryPendingNotifications(dispatchPool, notificationDelivery, {
      limit: notificationRetryLimit,
      safeContext: {
        requestId: randomUUID(),
        correlationId: randomUUID(),
        idempotencyKey: `notification-sweep:${randomUUID()}`,
        operationTag: "notification.delivery.sweep"
      }
    });
    if (result.attempted > 0) {
      log("notification-sweep", { attempted: result.attempted });
    }
  } catch (error) {
    log("notification-sweep-error", {
      reason: error instanceof Error ? error.message : String(error)
    });
  } finally {
    notificationSweepRunning = false;
  }
}

async function runNotificationPurge(): Promise<void> {
  const client = await dispatchPool.connect();
  try {
    const { purged } = await purgeNotificationsOlderThan(client, {
      olderThanDays: notificationRetentionDays
    });
    if (purged > 0) {
      log("notification-purge", { purged, retentionDays: notificationRetentionDays });
    }
  } catch (error) {
    log("notification-purge-error", {
      reason: error instanceof Error ? error.message : String(error)
    });
  } finally {
    client.release();
  }
}

const server = http.createServer((req, res) => {
  if (req.method === "GET" && (req.url === "/health" || req.url === "/")) {
    void runtime
      .getHealthSnapshot()
      .then((queue) => {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            status: "ok",
            service: SERVICE_NAME,
            startedAt,
            checkedAt: new Date().toISOString(),
            queue
          })
        );
      })
      .catch((error: unknown) => {
        res.writeHead(500, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            status: "error",
            service: SERVICE_NAME,
            reason: error instanceof Error ? error.message : String(error)
          })
        );
      });
    return;
  }
  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ status: "not-found" }));
});

const heartbeat = setInterval(() => {
  void runtime.getHealthSnapshot().then((queue) => {
    log("heartbeat", { queue });
  });
}, heartbeatMs);

const dispatchTimer = setInterval(() => {
  void outboxDispatchRunner.tick();
}, dispatchIntervalMs);

const notificationSweepTimer = setInterval(() => {
  void runNotificationSweep();
}, notificationRetryMs);

const notificationPurgeTimer = setInterval(() => {
  void runNotificationPurge();
}, notificationPurgeMs);

let shuttingDown = false;
function shutdown(signal: string): void {
  if (shuttingDown) return;
  shuttingDown = true;
  log("shutdown-initiated", { signal });
  clearInterval(heartbeat);
  clearInterval(dispatchTimer);
  clearInterval(notificationSweepTimer);
  clearInterval(notificationPurgeTimer);
  void dispatchPool.end().catch(() => {
    /* best-effort: pool may never have connected */
  });
  server.close(() => {
    log("shutdown-complete", { signal });
    process.exit(0);
  });
  // Hard stop if close hangs (e.g. stuck keep-alive sockets). Cast because the
  // ambient lib resolves setTimeout to the DOM signature (returns number); the
  // Node timer has .unref() to avoid holding the loop open.
  (setTimeout(() => process.exit(0), 5_000) as unknown as { unref(): void }).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

server.listen(healthPort, healthHost, () => {
  log("worker-started", { healthHost, healthPort, heartbeatMs, dispatchIntervalMs });
});
