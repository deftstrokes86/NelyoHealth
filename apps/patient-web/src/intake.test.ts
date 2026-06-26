import { describe, expect, it } from "vitest";
import { createIntakeViewModel } from "./intake.js";

describe("patient web intake view model", () => {
  it("maps the intake dto into a patient-facing view model", () => {
    const viewModel = createIntakeViewModel({
      intakeId: "intake-4",
      bookingId: "booking-4",
      summary: "Medication follow-up",
      urgency: "medium",
      status: "draft"
    });

    expect(viewModel).toMatchObject({
      intakeId: "intake-4",
      bookingId: "booking-4",
      summary: "Medication follow-up",
      urgency: "medium",
      status: "draft"
    });
  });
});
