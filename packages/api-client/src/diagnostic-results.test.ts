import { describe, expect, it } from "vitest";
import { createDiagnosticResultDraftDto } from "./diagnostic-results.js";

describe("api client diagnostic result dto", () => {
  it("maps a diagnostic result draft request into a public dto", () => {
    const dto = createDiagnosticResultDraftDto({
      diagnosticResultId: "result-2",
      orderId: "order-2",
      status: "pending",
      summary: "Hemoglobin pending"
    });

    expect(dto).toMatchObject({
      diagnosticResultId: "result-2",
      orderId: "order-2",
      status: "pending",
      summary: "Hemoglobin pending"
    });
  });
});
