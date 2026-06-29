import { describe, expect, it } from "vitest";
import { createAppointmentViewModel } from "./appointment.js";

describe("patient web appointment view model", () => {
  it("maps the dto into a patient-facing view model", () => {
    const viewModel = createAppointmentViewModel({
      appointmentId: "appointment-4",
      bookingId: "booking-4",
      scheduledFor: "2026-07-06T10:30:00.000Z",
      status: "scheduled"
    });

    expect(viewModel).toMatchObject({
      appointmentId: "appointment-4",
      bookingId: "booking-4",
      scheduledFor: "2026-07-06T10:30:00.000Z",
      status: "scheduled"
    });
  });
});
