import { describe, expect, it } from "vitest";
import { createFollowUpDraft } from "./follow-ups.js";

describe("follow-up draft contract", () => {
  it("creates a follow-up draft with the expected shape", () => {
    const followUp = createFollowUpDraft({
      followUpId: "followup-1",
      diagnosticResultId: "result-1",
      scheduledFor: "2026-06-30T09:00:00.000Z",
      status: "scheduled"
    });

    expect(followUp).toMatchObject({
      followUpId: "followup-1",
      diagnosticResultId: "result-1",
      scheduledFor: "2026-06-30T09:00:00.000Z",
      status: "scheduled"
    });
  });
});
