import { describe, expect, it } from "vitest";
import { createFollowUpViewModel } from "./follow-up.js";

describe("patient web follow-up view model", () => {
  it("maps the dto into a patient-facing view model", () => {
    const viewModel = createFollowUpViewModel({
      followUpId: "followup-4",
      diagnosticResultId: "result-4",
      scheduledFor: "2026-07-02T11:00:00.000Z",
      status: "scheduled"
    });

    expect(viewModel).toMatchObject({
      followUpId: "followup-4",
      diagnosticResultId: "result-4",
      scheduledFor: "2026-07-02T11:00:00.000Z",
      status: "scheduled"
    });
  });
});
