import { describe, expect, it } from "vitest";
import { createIntakeDraft } from "./intake.js";

describe("intake draft contract", () => {
  it("creates an intake draft with the expected shape", () => {
    const intake = createIntakeDraft({
      intakeId: "intake-1",
      bookingId: "booking-1",
      summary: "Needs medication follow-up",
      urgency: "high",
      status: "draft"
    });

    expect(intake).toMatchObject({
      intakeId: "intake-1",
      bookingId: "booking-1",
      summary: "Needs medication follow-up",
      urgency: "high",
      status: "draft"
    });
  });
});
