import { describe, expect, it } from "vitest";
import { createDiagnosticResultViewModel } from "./diagnostic-result.js";

describe("patient web diagnostic result view model", () => {
  it("maps the dto into a patient-facing view model", () => {
    const viewModel = createDiagnosticResultViewModel({
      diagnosticResultId: "result-4",
      orderId: "order-4",
      status: "pending",
      summary: "Lab follow-up"
    });

    expect(viewModel).toMatchObject({
      diagnosticResultId: "result-4",
      orderId: "order-4",
      status: "pending",
      summary: "Lab follow-up"
    });
  });
});
