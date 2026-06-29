import { describe, expect, it } from "vitest";
import { createAppointmentDraft } from "./appointments.js";

describe("appointment draft contract", () => {
  it("creates an appointment draft with the expected shape", () => {
    const appointment = createAppointmentDraft({
      appointmentId: "appointment-1",
      bookingId: "booking-1",
      scheduledFor: "2026-07-04T09:00:00.000Z",
      status: "scheduled"
    });

    expect(appointment).toMatchObject({
      appointmentId: "appointment-1",
      bookingId: "booking-1",
      scheduledFor: "2026-07-04T09:00:00.000Z",
      status: "scheduled"
    });
  });
});
