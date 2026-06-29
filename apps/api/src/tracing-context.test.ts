import { describe, expect, it } from "vitest";
import {
  createTracingContext,
  extractTracingContext,
  tracingContextToHeaders
} from "./tracing-context.js";

describe("tracing context", () => {
  it("generates a new tracing context with unique IDs", () => {
    const context = createTracingContext();

    expect(context.traceId).toBeTruthy();
    expect(context.spanId).toBeTruthy();
    expect(context.traceId).toMatch(/^[\da-f-]+$/);
    expect(context.spanId).toMatch(/^[\da-f-]+$/);

    // Each call should generate unique IDs
    const context2 = createTracingContext();
    expect(context2.traceId).not.toBe(context.traceId);
    expect(context2.spanId).not.toBe(context.spanId);
  });

  it("extracts tracing context from headers when present", () => {
    const headers = {
      "x-trace-id": "trace-abc123",
      "x-span-id": "span-def456"
    };

    const context = extractTracingContext(headers);

    expect(context).toMatchObject({
      traceId: "trace-abc123",
      spanId: "span-def456"
    });
  });

  it("generates IDs when headers are missing", () => {
    const headers = {};

    const context = extractTracingContext(headers);

    expect(context.traceId).toBeTruthy();
    expect(context.spanId).toBeTruthy();
    expect(context.traceId).toMatch(/^[\da-f-]+$/);
  });

  it("converts tracing context to headers for propagation", () => {
    const context = {
      traceId: "trace-xyz789",
      spanId: "span-uvw012"
    };

    const headers = tracingContextToHeaders(context);

    expect(headers).toMatchObject({
      "x-trace-id": "trace-xyz789",
      "x-span-id": "span-uvw012"
    });
  });
});
