import { afterEach, describe, expect, it } from "vitest";
import type { AddressInfo } from "node:net";
import { createNestApiApp } from "../../apps/api/src/nest/bootstrap.js";

type NestApiApp = Awaited<ReturnType<typeof createNestApiApp>>;

async function startApp(app: NestApiApp): Promise<number> {
  await app.init();
  const server = app.getHttpServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
  return (server.address() as AddressInfo).port;
}

describe("api to worker observability correlation", () => {
  let app: NestApiApp | undefined;

  afterEach(async () => {
    if (app) {
      await app.close();
      app = undefined;
    }
  });

  it("records correlated logs/traces/metrics across API and worker processing", async () => {
    app = await createNestApiApp();
    const port = await startApp(app);

    const response = await fetch(`http://127.0.0.1:${port}/api/observability/probe`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "req-iss011",
        "x-correlation-id": "corr-iss011"
      },
      body: JSON.stringify({
        syntheticTaskId: "iss011-task",
        failUntilAttempt: 1,
        maxAttempts: 3
      })
    });

    expect(response.status).toBe(201);
    const body = await response.json();

    expect(body.meta).toMatchObject({
      requestId: "req-iss011",
      correlationId: "corr-iss011",
      operationTag: "api.observability.probe"
    });

    expect(body.data.traceId).toMatch(/[a-f0-9]{32}/);
    expect(body.data.statuses).toEqual(["retried", "completed", "empty"]);
    expect(body.data.metrics).toMatchObject({
      api_request_total: 1,
      worker_job_attempt_total: 2,
      worker_job_failure_total: 1,
      worker_job_success_total: 1
    });

    expect(body.data.logs.length).toBeGreaterThanOrEqual(3);
    expect(body.data.spans.length).toBeGreaterThanOrEqual(6);

    const serialized = JSON.stringify(body);
    expect(serialized).not.toContain("providerAddress");
    expect(serialized).not.toContain("paymentCard");
  });
});
