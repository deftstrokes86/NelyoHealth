import { describe, expect, it } from "vitest";
import { createBookingDraft } from "./bookings.js";

describe("booking draft contract", () => {
  it("creates a booking draft with the expected shape", () => {
    const booking = createBookingDraft({
      bookingId: "booking-1",
      patientId: "patient-1",
      providerId: "provider-1",
      scheduledAt: "2026-07-01T10:00:00.000Z",
      status: "pending"
    });

    expect(booking).toMatchObject({
      bookingId: "booking-1",
      patientId: "patient-1",
      providerId: "provider-1",
      scheduledAt: "2026-07-01T10:00:00.000Z",
      status: "pending"
    });
  });
});
