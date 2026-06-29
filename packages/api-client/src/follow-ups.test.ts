import { describe, expect, it } from "vitest";
import { createFollowUpDraftDto } from "./follow-ups.js";

describe("api client follow-up dto", () => {
  it("maps a follow-up draft request into a public dto", () => {
    const dto = createFollowUpDraftDto({
      followUpId: "followup-2",
      diagnosticResultId: "result-2",
      scheduledFor: "2026-07-01T10:00:00.000Z",
      status: "scheduled"
    });

    expect(dto).toMatchObject({
      followUpId: "followup-2",
      diagnosticResultId: "result-2",
      scheduledFor: "2026-07-01T10:00:00.000Z",
      status: "scheduled"
    });
  });
});
