import { describe, expect, it } from "vitest";
import {
  createInitialPrescriptionState,
  createPrescriptionStateWithSelection
} from "./prescription-state.js";

describe("patient prescription state", () => {
  it("creates an initial prescription state", () => {
    const state = createInitialPrescriptionState();

    expect(state).toMatchObject({
      selectedPrescriptionId: null,
      isLoading: false,
      errorMessage: null
    });
  });

  it("creates a prescription state with a selected prescription", () => {
    const state = createPrescriptionStateWithSelection("prescription-3");

    expect(state.selectedPrescriptionId).toBe("prescription-3");
  });
});
