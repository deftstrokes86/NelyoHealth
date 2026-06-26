import { describe, expect, it } from "vitest";
import { createIntakeDraftDto } from "./intake.js";

describe("api client intake dto", () => {
  it("maps an intake draft request into a public dto", () => {
    const dto = createIntakeDraftDto({
      intakeId: "intake-2",
      bookingId: "booking-2",
      summary: "Needs follow-up",
      urgency: "medium",
      status: "draft"
    });

    expect(dto).toMatchObject({
      intakeId: "intake-2",
      bookingId: "booking-2",
      summary: "Needs follow-up",
      urgency: "medium",
      status: "draft"
    });
  });
});
