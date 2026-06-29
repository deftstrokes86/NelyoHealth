import { describe, expect, it } from "vitest";
import { createAppointmentDraft } from "./appointments.js";
import { createBookingDraft } from "./bookings.js";
import { scheduleAppointmentStatus } from "./appointment-handlers.js";
import {
  createBookingWithAppointment,
  transitionBookingStatus
} from "./booking-handlers.js";

describe("appointment and booking handlers with cross-dependencies", () => {
  it("schedules an appointment through valid transitions", () => {
    const pending = createAppointmentDraft({
      appointmentId: "apt-1",
      patientId: "patient-1",
      providerId: "provider-1",
      status: "pending",
      scheduledAt: null,
      confirmedAt: null,
      completedAt: null,
      cancelledAt: null
    });

    const scheduled = scheduleAppointmentStatus({
      appointment: pending,
      toStatus: "scheduled",
      scheduledAt: "2026-07-20T10:00:00.000Z"
    });

    expect(scheduled.status).toBe("scheduled");
    expect(scheduled.scheduledAt).toBe("2026-07-20T10:00:00.000Z");

    const confirmed = scheduleAppointmentStatus({
      appointment: scheduled,
      toStatus: "confirmed",
      scheduledAt: "2026-07-20T09:30:00.000Z"
    });

    expect(confirmed.status).toBe("confirmed");
    expect(confirmed.confirmedAt).toBe("2026-07-20T09:30:00.000Z");
  });

  it("rejects invalid appointment transitions", () => {
    const pending = createAppointmentDraft({
      appointmentId: "apt-2",
      patientId: "patient-2",
      providerId: "provider-2",
      status: "pending",
      scheduledAt: null,
      confirmedAt: null,
      completedAt: null,
      cancelledAt: null
    });

    expect(() =>
      scheduleAppointmentStatus({
        appointment: pending,
        toStatus: "completed",
        scheduledAt: "2026-07-20T10:00:00.000Z"
      })
    ).toThrow(/Invalid appointment transition/);
  });

  it("creates a booking from a scheduled appointment", () => {
    const appointment = createAppointmentDraft({
      appointmentId: "apt-3",
      patientId: "patient-3",
      providerId: "provider-3",
      status: "scheduled",
      scheduledAt: "2026-07-20T10:00:00.000Z",
      confirmedAt: null,
      completedAt: null,
      cancelledAt: null
    });

    const booking = createBookingDraft({
      bookingId: "booking-1",
      patientId: "patient-3",
      providerId: "provider-3",
      status: "draft",
      appointmentId: null,
      createdAt: null,
      requestedAt: null,
      approvedAt: null,
      deniedAt: null,
      scheduledAt: null,
      completedAt: null,
      cancelledAt: null
    });

    const requestedBooking = createBookingWithAppointment({
      booking,
      appointment,
      createdAt: "2026-07-19T09:00:00.000Z"
    });

    expect(requestedBooking.status).toBe("requested");
    expect(requestedBooking.appointmentId).toBe("apt-3");
    expect(requestedBooking.createdAt).toBe("2026-07-19T09:00:00.000Z");
    expect(requestedBooking.requestedAt).toBe("2026-07-19T09:00:00.000Z");
  });

  it("rejects booking creation when appointment is in invalid state", () => {
    const appointment = createAppointmentDraft({
      appointmentId: "apt-4",
      patientId: "patient-4",
      providerId: "provider-4",
      status: "completed",
      scheduledAt: "2026-07-20T10:00:00.000Z",
      confirmedAt: "2026-07-20T09:30:00.000Z",
      completedAt: "2026-07-20T10:30:00.000Z",
      cancelledAt: null
    });

    const booking = createBookingDraft({
      bookingId: "booking-2",
      patientId: "patient-4",
      providerId: "provider-4",
      status: "draft",
      appointmentId: null,
      createdAt: null,
      requestedAt: null,
      approvedAt: null,
      deniedAt: null,
      scheduledAt: null,
      completedAt: null,
      cancelledAt: null
    });

    expect(() =>
      createBookingWithAppointment({
        booking,
        appointment,
        createdAt: "2026-07-19T09:00:00.000Z"
      })
    ).toThrow(/Cannot create booking for appointment in completed state/);
  });

  it("transitions booking through valid states tied to appointment", () => {
    const appointment = createAppointmentDraft({
      appointmentId: "apt-5",
      patientId: "patient-5",
      providerId: "provider-5",
      status: "scheduled",
      scheduledAt: "2026-07-20T10:00:00.000Z",
      confirmedAt: null,
      completedAt: null,
      cancelledAt: null
    });

    const booking = createBookingDraft({
      bookingId: "booking-3",
      patientId: "patient-5",
      providerId: "provider-5",
      status: "draft",
      appointmentId: "apt-5",
      createdAt: "2026-07-19T09:00:00.000Z",
      requestedAt: null,
      approvedAt: null,
      deniedAt: null,
      scheduledAt: null,
      completedAt: null,
      cancelledAt: null
    });

    const requested = transitionBookingStatus(
      booking,
      "requested",
      "2026-07-19T09:05:00.000Z"
    );
    expect(requested.status).toBe("requested");
    expect(requested.requestedAt).toBe("2026-07-19T09:05:00.000Z");

    const approved = transitionBookingStatus(
      requested,
      "approved",
      "2026-07-19T09:10:00.000Z"
    );
    expect(approved.status).toBe("approved");
    expect(approved.approvedAt).toBe("2026-07-19T09:10:00.000Z");

    const scheduled = transitionBookingStatus(
      approved,
      "scheduled",
      "2026-07-19T09:15:00.000Z"
    );
    expect(scheduled.status).toBe("scheduled");
    expect(scheduled.scheduledAt).toBe("2026-07-19T09:15:00.000Z");

    const completed = transitionBookingStatus(
      scheduled,
      "completed",
      "2026-07-20T11:00:00.000Z"
    );
    expect(completed.status).toBe("completed");
    expect(completed.completedAt).toBe("2026-07-20T11:00:00.000Z");
  });

  it("rejects invalid booking transitions", () => {
    const booking = createBookingDraft({
      bookingId: "booking-4",
      patientId: "patient-6",
      providerId: "provider-6",
      status: "draft",
      appointmentId: null,
      createdAt: "2026-07-19T09:00:00.000Z",
      requestedAt: null,
      approvedAt: null,
      deniedAt: null,
      scheduledAt: null,
      completedAt: null,
      cancelledAt: null
    });

    expect(() =>
      transitionBookingStatus(booking, "completed", "2026-07-19T09:05:00.000Z")
    ).toThrow(/Invalid booking transition/);
  });
});
