import { describe, expect, it } from "vitest";
import { createInitialAppointmentState, createAppointmentStateWithSelection } from "./appointment-state.js";

describe("patient appointment state", () => {
  it("creates an initial appointment state", () => {
    const state = createInitialAppointmentState();

    expect(state).toMatchObject({
      selectedAppointmentId: null,
      isLoading: false,
      errorMessage: null
    });
  });

  it("creates an appointment state with a selected appointment", () => {
    const state = createAppointmentStateWithSelection("appointment-3");

    expect(state.selectedAppointmentId).toBe("appointment-3");
  });
});
