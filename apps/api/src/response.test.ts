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
      message: "Validation failed"
    });

    expect(envelope).toMatchObject({
      data: null,
      meta: {
        requestId: "req-2",
        correlationId: "corr-2"
      },
      errors: [{ message: "Validation failed" }]
    });
  });
});
