import { afterEach, describe, expect, it } from "vitest";
import type { INestApplication } from "@nestjs/common";
import type { AddressInfo } from "node:net";
import { createNestApiApp } from "../../apps/api/src/nest/bootstrap.js";

async function startApp(app: INestApplication): Promise<number> {
  await app.init();
  const server = app.getHttpServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
  const address = server.address() as AddressInfo;
  return address.port;
}

describe("Nest API skeleton runtime", () => {
  let app: INestApplication | undefined;

  afterEach(async () => {
    if (app) {
      await app.close();
      app = undefined;
    }
  });

  it("returns health and propagates request/correlation IDs", async () => {
    app = await createNestApiApp();
    const port = await startApp(app);

    const res = await fetch(`http://127.0.0.1:${port}/api/health`, {
      headers: {
        "x-request-id": "req-iss005-health",
        "x-correlation-id": "corr-iss005-health"
      }
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("x-request-id")).toBe("req-iss005-health");
    expect(res.headers.get("x-correlation-id")).toBe("corr-iss005-health");

    const body = await res.json();
    expect(body).toMatchObject({
      data: {
        status: "ok",
        service: "@nelyohealth/api"
      },
      meta: {
        requestId: "req-iss005-health",
        correlationId: "corr-iss005-health",
        operationTag: "api.health"
      },
      errors: []
    });
  });

  it("enforces idempotency-key for repeated unsafe request fingerprints", async () => {
    app = await createNestApiApp();
    const port = await startApp(app);

    const request = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "idempotency-key": "same-key",
        "x-request-id": "req-iss005-idem",
        "x-correlation-id": "corr-iss005-idem"
      },
      body: JSON.stringify({
        synthetic: true
      })
    } as const;

    const first = await fetch(`http://127.0.0.1:${port}/api/idempotency/probe`, request);
    expect(first.status).toBe(201);

    const second = await fetch(`http://127.0.0.1:${port}/api/idempotency/probe`, request);
    expect(second.status).toBe(409);

    const secondBody = await second.json();
    expect(secondBody).toMatchObject({
      data: null,
      meta: {
        operationTag: "api.idempotency.check",
        decisionReasonTag: "duplicate-request"
      }
    });
  });

  it("returns readiness envelope with dependency checks", async () => {
    app = await createNestApiApp();
    const port = await startApp(app);

    const res = await fetch(`http://127.0.0.1:${port}/api/ready`);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toMatchObject({
      data: {
        ready: expect.any(Boolean),
        checks: {
          postgresTcp: expect.stringMatching(/ok|unavailable/)
        }
      },
      meta: {
        operationTag: "api.readiness"
      }
    });
  });
});
