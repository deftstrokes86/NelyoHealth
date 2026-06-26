import { describe, expect, it } from "vitest";
import { createInitialIntakeState, createIntakeStateWithSelection } from "./intake-state.js";

describe("patient intake state", () => {
  it("creates an initial intake state", () => {
    const state = createInitialIntakeState();

    expect(state).toMatchObject({
      selectedIntakeId: null,
      isLoading: false,
      errorMessage: null
    });
  });

  it("creates an intake state with a selected intake", () => {
    const state = createIntakeStateWithSelection("intake-3");

    expect(state.selectedIntakeId).toBe("intake-3");
  });
});
