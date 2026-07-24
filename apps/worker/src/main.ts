import http from "node:http";
import {
  createAuditTrailConsumer,
  createCareCircleProjectionConsumer,
  createDatabasePool,
  dispatchPendingOutboxEvents,
  ExternalCallPolicy,
  PgOutboxStore
} from "@nelyohealth/database";
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
// consumers — the unified-audit subscriber (M3.2) and the Care Circle read-model
// projection (M6.1). The pool connects lazily, so this is inert until there are
// events to dispatch and a database to reach.
const dispatchPool = createDatabasePool();
const outboxStore = new PgOutboxStore<Record<string, unknown>>(dispatchPool);
const externalCallPolicy = new ExternalCallPolicy();
const outboxDispatchRunner = createOutboxDispatchRunner({
  runDispatch: () =>
    dispatchPendingOutboxEvents({
      outbox: outboxStore,
      externalCallPolicy,
      maxAttempts: dispatchMaxAttempts,
      consumers: [
        createAuditTrailConsumer(dispatchPool),
        createCareCircleProjectionConsumer(dispatchPool)
      ]
    }),
  log
});

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

let shuttingDown = false;
function shutdown(signal: string): void {
  if (shuttingDown) return;
  shuttingDown = true;
  log("shutdown-initiated", { signal });
  clearInterval(heartbeat);
  clearInterval(dispatchTimer);
  void dispatchPool.end().catch(() => {
    /* best-effort: pool may never have connected */
  });
  server.close(() => {
    log("shutdown-complete", { signal });
    process.exit(0);
  });
  // Hard stop if close hangs (e.g. stuck keep-alive sockets).
  setTimeout(() => process.exit(0), 5_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

server.listen(healthPort, healthHost, () => {
  log("worker-started", { healthHost, healthPort, heartbeatMs, dispatchIntervalMs });
});
