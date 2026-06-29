import { describe, expect, it } from "vitest";
import { createApiEnvelope, createErrorEnvelope } from "./response.js";

describe("api response envelopes", () => {
  it("builds a success envelope with request metadata", () => {
    const envelope = createApiEnvelope({
      data: { id: "abc" },
      requestId: "req-1",
      correlationId: "corr-1"
    });

    expect(envelope).toMatchObject({
      data: { id: "abc" },
      meta: {
        requestId: "req-1",
        correlationId: "corr-1"
      },
      errors: []
    });
  });

  it("builds an error envelope with a message", () => {
    const envelope = createErrorEnvelope({
      requestId: "req-2",
      correlationId: "corr-2",
      message: "Validation failed",
      operationTag: "payment.transition",
      decisionReasonTag: "transition-denied"
    });

    expect(envelope).toMatchObject({
      data: null,
      meta: {
        requestId: "req-2",
        correlationId: "corr-2",
        operationTag: "payment.transition",
        decisionReasonTag: "transition-denied"
      },
      errors: [{ message: "Validation failed" }]
    });
  });

  it("preserves tracing fields (traceId, spanId) through serialization", () => {
    const envelope = createApiEnvelope({
      data: { orderId: "order-trace-1", status: "settled" },
      requestId: "req-trace-1",
      correlationId: "corr-trace-1",
      operationTag: "payment.transition",
      decisionReasonTag: "to:settled",
      traceId: "trace-abc123",
      spanId: "span-def456"
    });

    // Simulate HTTP round-trip: serialize to JSON and deserialize
    const serialized = JSON.stringify(envelope);
    const deserialized = JSON.parse(serialized);

    expect(deserialized).toMatchObject({
      data: {
        orderId: "order-trace-1",
        status: "settled"
      },
      meta: {
        requestId: "req-trace-1",
        correlationId: "corr-trace-1",
        operationTag: "payment.transition",
        decisionReasonTag: "to:settled",
        traceId: "trace-abc123",
        spanId: "span-def456"
      },
      errors: []
    });
  });

  it("preserves error envelope with tracing through HTTP round-trip", () => {
    const envelope = createErrorEnvelope({
      requestId: "req-error-trace-1",
      correlationId: "corr-error-trace-1",
      message: "Unauthorized disclosure",
      code: "DISCLOSURE_DENIED",
      operationTag: "provider-disclosure.eligibility.evaluate",
      decisionReasonTag: "authorization-missing",
      traceId: "trace-err789",
      spanId: "span-err012"
    });

    const serialized = JSON.stringify(envelope);
    const deserialized = JSON.parse(serialized);

    expect(deserialized.meta).toMatchObject({
      requestId: "req-error-trace-1",
      correlationId: "corr-error-trace-1",
      traceId: "trace-err789",
      spanId: "span-err012"
    });

    expect(deserialized.errors[0]).toMatchObject({
      message: "Unauthorized disclosure",
      code: "DISCLOSURE_DENIED"
    });
  });

  it("omits undefined tracing fields from serialized envelope", () => {
    const envelope = createApiEnvelope({
      data: { id: "minimal" },
      requestId: "req-minimal",
      correlationId: "corr-minimal"
      // No traceId or spanId provided
    });

    const serialized = JSON.stringify(envelope);
    const deserialized = JSON.parse(serialized);

    // Undefined fields are omitted in JSON serialization
    expect(deserialized.meta).toHaveProperty("requestId");
    expect(deserialized.meta).toHaveProperty("correlationId");
    // traceId and spanId will be undefined if not set
    expect(deserialized.meta.traceId).toBeUndefined();
    expect(deserialized.meta.spanId).toBeUndefined();
  });
});
