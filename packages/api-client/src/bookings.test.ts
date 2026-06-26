import { describe, expect, it } from "vitest";
import { createBookingDraftDto } from "./bookings.js";

describe("api client booking dto", () => {
  it("maps a booking draft request into a public dto", () => {
    const dto = createBookingDraftDto({
      bookingId: "booking-2",
      patientId: "patient-2",
      providerId: "provider-2",
      scheduledAt: "2026-07-02T10:00:00.000Z",
      status: "pending"
    });

    expect(dto).toMatchObject({
      bookingId: "booking-2",
      patientId: "patient-2",
      providerId: "provider-2",
      scheduledAt: "2026-07-02T10:00:00.000Z",
      status: "pending"
    });
  });
});
