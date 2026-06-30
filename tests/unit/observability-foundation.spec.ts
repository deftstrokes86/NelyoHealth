import { describe, expect, it } from "vitest";
import { InMemoryObservabilityRecorder } from "../../packages/observability/src/index.js";

describe("observability foundation recorder", () => {
  it("records logs, spans, and metrics with stable trace context", () => {
    const recorder = new InMemoryObservabilityRecorder();
    const context = recorder.createContext({
      requestId: "req-iss011",
      correlationId: "corr-iss011",
      operationTag: "api.observability.probe"
    });

    const spanId = recorder.startSpan("api.span", context);
    recorder.log("info", "api started", context, {
      stage: "start"
    });
    recorder.metric("api_request_total", 1, context);
    recorder.endSpan("api.span", context, spanId);

    const snapshot = recorder.snapshot();
    expect(snapshot.logs).toHaveLength(1);
    expect(snapshot.metrics).toHaveLength(1);
    expect(snapshot.spans).toHaveLength(2);
    expect(snapshot.logs[0].context.traceId).toBe(context.traceId);
    expect(snapshot.metrics[0].name).toBe("api_request_total");
  });

  it("redacts secret-like telemetry attributes", () => {
    const recorder = new InMemoryObservabilityRecorder();
    const context = recorder.createContext({
      requestId: "req-iss011-redact",
      correlationId: "corr-iss011-redact",
      operationTag: "api.observability.probe"
    });

    recorder.log("warn", "unsafe attr test", context, {
      providerAddress: "hidden",
      paymentCard: "4111111111111111",
      safeTag: "ok"
    });

    const event = recorder.snapshot().logs[0];
    expect(event.attributes.providerAddress).toBe("[REDACTED]");
    expect(event.attributes.paymentCard).toBe("[REDACTED]");
    expect(event.attributes.safeTag).toBe("ok");
  });
});
