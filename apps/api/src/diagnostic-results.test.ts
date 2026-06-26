import { describe, expect, it } from "vitest";
import { createDiagnosticResultDraft } from "./diagnostic-results.js";

describe("diagnostic result draft contract", () => {
  it("creates a diagnostic result draft with the expected shape", () => {
    const result = createDiagnosticResultDraft({
      diagnosticResultId: "result-1",
      orderId: "order-1",
      status: "pending",
      summary: "CBC pending review"
    });

    expect(result).toMatchObject({
      diagnosticResultId: "result-1",
      orderId: "order-1",
      status: "pending",
      summary: "CBC pending review"
    });
  });
});
