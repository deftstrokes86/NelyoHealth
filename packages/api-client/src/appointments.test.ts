import { describe, expect, it } from "vitest";
import { createAppointmentDraftDto } from "./appointments.js";

describe("api client appointment dto", () => {
  it("maps an appointment draft request into a public dto", () => {
    const dto = createAppointmentDraftDto({
      appointmentId: "appointment-2",
      bookingId: "booking-2",
      scheduledFor: "2026-07-05T10:00:00.000Z",
      status: "scheduled"
    });

    expect(dto).toMatchObject({
      appointmentId: "appointment-2",
      bookingId: "booking-2",
      scheduledFor: "2026-07-05T10:00:00.000Z",
      status: "scheduled"
    });
  });
});
