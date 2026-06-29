import { describe, expect, it } from "vitest";
import { app } from "./server.js";

describe("api http server", () => {
  it("responds to health check", async () => {
    const req = new Request("http://localhost/api/health");
    const res = await app.fetch(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ status: "ok" });
  });

  it("handles disclosure eligibility request and returns envelope", async () => {
    const req = new Request("http://localhost/api/provider-disclosure-eligibility", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "req-server-1",
        "x-correlation-id": "corr-server-1"
      },
      body: JSON.stringify({
        orderId: "order-server-1",
        providerDisplayName: "Test Provider",
        paymentStatus: "settled",
        hasAuthorization: true,
        sameTenant: true,
        evaluatedAt: "2026-07-21T10:00:00.000Z"
      })
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(200);

    const envelope = await res.json();
    expect(envelope).toMatchObject({
      data: {
        orderId: "order-server-1",
        status: "eligible",
        reasonCode: "eligible"
      },
      meta: {
        requestId: "req-server-1",
        correlationId: "corr-server-1",
        operationTag: "provider-disclosure.eligibility.evaluate",
        decisionReasonTag: "eligible"
      },
      errors: []
    });

    // Verify protected fields are not exposed
    expect(envelope.data).not.toHaveProperty("providerId");
    expect(envelope.data).not.toHaveProperty("providerAddress");
  });

  it("returns denied eligibility when authorization is missing", async () => {
    const req = new Request("http://localhost/api/provider-disclosure-eligibility", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "req-server-2",
        "x-correlation-id": "corr-server-2"
      },
      body: JSON.stringify({
        orderId: "order-server-2",
        providerDisplayName: "Unauthorized Provider",
        paymentStatus: "settled",
        hasAuthorization: false,
        sameTenant: true,
        evaluatedAt: "2026-07-21T10:05:00.000Z"
      })
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(200);

    const envelope = await res.json();
    expect(envelope.data).toMatchObject({
      orderId: "order-server-2",
      status: "denied",
      reasonCode: "authorization-missing"
    });

    expect(envelope.meta).toMatchObject({
      operationTag: "provider-disclosure.eligibility.evaluate",
      decisionReasonTag: "authorization-missing"
    });
  });

  it("generates requestId and correlationId when not provided", async () => {
    const req = new Request("http://localhost/api/provider-disclosure-eligibility", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        orderId: "order-server-3",
        providerDisplayName: "Auto ID Provider",
        paymentStatus: "authorized",
        hasAuthorization: true,
        sameTenant: true,
        evaluatedAt: "2026-07-21T10:10:00.000Z"
      })
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(200);

    const envelope = await res.json();
    expect(envelope.meta.requestId).toBeTruthy();
    expect(envelope.meta.correlationId).toBeTruthy();
    expect(envelope.meta.requestId).toMatch(/^[\da-f-]+$/);
    expect(envelope.meta.correlationId).toMatch(/^[\da-f-]+$/);
  });
});
