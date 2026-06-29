import { describe, expect, it } from "vitest";
import {
  createInitialPrescriptionAdvancedState,
  createPrescriptionAdvancedStateWithSelection
} from "./prescription-advanced-state.js";

describe("patient prescription advanced state", () => {
  it("creates an initial prescription advanced state", () => {
    const state = createInitialPrescriptionAdvancedState();

    expect(state).toMatchObject({
      selectedPrescriptionId: null,
      selectedStatus: null,
      isLoading: false,
      errorMessage: null
    });
  });

  it("creates a prescription advanced state with selection", () => {
    const state = createPrescriptionAdvancedStateWithSelection(
      "prescription-advanced-2",
      "verified"
    );

    expect(state).toMatchObject({
      selectedPrescriptionId: "prescription-advanced-2",
      selectedStatus: "verified"
    });
  });
});
