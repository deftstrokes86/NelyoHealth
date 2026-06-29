import { describe, expect, it } from "vitest";
import { createInitialConsentState, createConsentStateWithSelection } from "./consent-state.js";

describe("patient consent state", () => {
  it("creates an initial consent state", () => {
    const state = createInitialConsentState();

    expect(state).toMatchObject({
      selectedConsentId: null,
      isLoading: false,
      errorMessage: null
    });
  });

  it("creates a consent state with a selected consent", () => {
    const state = createConsentStateWithSelection("consent-3");

    expect(state.selectedConsentId).toBe("consent-3");
  });
});
