import { describe, expect, it } from "vitest";
import {
  createAppointmentScheduleDto,
  createBookingDto
} from "./appointment-booking.js";

describe("appointment and booking DTOs", () => {
  it("creates an appointment schedule DTO", () => {
    const dto = createAppointmentScheduleDto({
      appointmentId: "apt-dto-1",
      patientId: "patient-1",
      status: "scheduled",
      scheduledAt: "2026-07-20T10:00:00.000Z"
    });

    expect(dto).toMatchObject({
      appointmentId: "apt-dto-1",
      patientId: "patient-1",
      status: "scheduled",
      scheduledAt: "2026-07-20T10:00:00.000Z"
    });
  });

  it("creates a booking DTO with appointment reference", () => {
    const dto = createBookingDto({
      bookingId: "booking-dto-1",
      patientId: "patient-1",
      providerId: "provider-1",
      appointmentId: "apt-dto-1",
      status: "requested"
    });

    expect(dto).toMatchObject({
      bookingId: "booking-dto-1",
      patientId: "patient-1",
      appointmentId: "apt-dto-1",
      status: "requested"
    });
  });
});
