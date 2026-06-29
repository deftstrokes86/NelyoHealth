import { describe, expect, it } from "vitest";
import { app } from "./server.js";
import { createPaymentDraft } from "./payments.js";
import { createRefundDraft } from "./refunds.js";

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

  it("handles payment transition endpoint with tracing headers", async () => {
    const payment = createPaymentDraft({
      paymentId: "payment-http-1",
      orderId: "order-http-1",
      status: "quoted",
      amount: "50000",
      currency: "NGN",
      authorizedAt: null,
      settledAt: null
    });

    const req = new Request("http://localhost/api/payment-transition", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "req-payment-1",
        "x-correlation-id": "corr-payment-1",
        "x-trace-id": "trace-payment-123",
        "x-span-id": "span-payment-456"
      },
      body: JSON.stringify({
        payment,
        toStatus: "initiated",
        transitionedAt: "2026-07-21T11:00:00.000Z"
      })
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(200);

    const envelope = await res.json();
    expect(envelope).toMatchObject({
      data: {
        paymentId: "payment-http-1",
        status: "initiated"
      },
      meta: {
        requestId: "req-payment-1",
        correlationId: "corr-payment-1",
        traceId: "trace-payment-123",
        spanId: "span-payment-456",
        operationTag: "payment.transition",
        decisionReasonTag: "to:initiated"
      },
      errors: []
    });
  });

  it("handles refund transition endpoint with tracing headers", async () => {
    const refund = createRefundDraft({
      refundId: "refund-http-1",
      paymentId: "payment-http-1",
      orderId: "order-http-1",
      status: "requested",
      amount: "50000",
      currency: "NGN",
      completedAt: null
    });

    const req = new Request("http://localhost/api/refund-transition", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "req-refund-1",
        "x-correlation-id": "corr-refund-1",
        "x-trace-id": "trace-refund-789",
        "x-span-id": "span-refund-012"
      },
      body: JSON.stringify({
        refund,
        toStatus: "eligibility-review",
        transitionedAt: "2026-07-21T11:05:00.000Z"
      })
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(200);

    const envelope = await res.json();
    expect(envelope).toMatchObject({
      data: {
        refundId: "refund-http-1",
        status: "eligibility-review"
      },
      meta: {
        requestId: "req-refund-1",
        correlationId: "corr-refund-1",
        traceId: "trace-refund-789",
        spanId: "span-refund-012",
        operationTag: "refund.transition",
        decisionReasonTag: "to:eligibility-review"
      },
      errors: []
    });
  });

  it("returns error envelope for invalid payment transition", async () => {
    const payment = createPaymentDraft({
      paymentId: "payment-http-err",
      orderId: "order-http-err",
      status: "quoted",
      amount: "50000",
      currency: "NGN",
      authorizedAt: null,
      settledAt: null
    });

    const req = new Request("http://localhost/api/payment-transition", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "req-payment-err",
        "x-correlation-id": "corr-payment-err",
        "x-trace-id": "trace-payment-err"
      },
      body: JSON.stringify({
        payment,
        toStatus: "settled",
        transitionedAt: "2026-07-21T11:10:00.000Z"
      })
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(200);

    const envelope = await res.json();
    expect(envelope.data).toBeNull();
    expect(envelope.errors).toHaveLength(1);
    expect(envelope.meta).toMatchObject({
      requestId: "req-payment-err",
      correlationId: "corr-payment-err",
      traceId: "trace-payment-err",
      operationTag: "payment.transition"
    });
  });
});
