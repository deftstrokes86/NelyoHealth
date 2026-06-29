import { describe, expect, it } from "vitest";
import { createBookingViewModel, selectBooking } from "./booking.js";

describe("patient web booking view model", () => {
  it("maps booking state into a patient-facing view model", () => {
    const viewModel = createBookingViewModel({
      bookingId: "booking-vm-1",
      patientId: "patient-1",
      providerId: "provider-1",
      appointmentId: "apt-1",
      status: "requested"
    });

    expect(viewModel).toMatchObject({
      bookingId: "booking-vm-1",
      patientId: "patient-1",
      providerId: "provider-1",
      appointmentId: "apt-1",
      status: "requested"
    });
  });

  it("initializes a booking selection state", () => {
    const state = selectBooking("booking-vm-1");

    expect(state).toMatchObject({
      selectedBookingId: "booking-vm-1",
      isLoading: false,
      error: null
    });
  });
});
