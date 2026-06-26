import { describe, expect, it } from "vitest";
import { createBookingStateWithSelection, createInitialBookingState } from "./booking-state.js";

describe("patient web booking state", () => {
  it("creates an initial booking state", () => {
    const state = createInitialBookingState();

    expect(state).toEqual({
      selectedBookingId: null,
      isLoading: false,
      errorMessage: null
    });
  });

  it("creates a selected-booking state", () => {
    const state = createBookingStateWithSelection("booking-3");

    expect(state.selectedBookingId).toBe("booking-3");
    expect(state.isLoading).toBe(false);
    expect(state.errorMessage).toBeNull();
  });
});
