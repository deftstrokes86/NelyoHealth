import { describe, expect, it } from "vitest";
import { createInitialFollowUpState, createFollowUpStateWithSelection } from "./follow-up-state.js";

describe("patient follow-up state", () => {
  it("creates an initial follow-up state", () => {
    const state = createInitialFollowUpState();

    expect(state).toMatchObject({
      selectedFollowUpId: null,
      isLoading: false,
      errorMessage: null
    });
  });

  it("creates a follow-up state with a selected follow-up", () => {
    const state = createFollowUpStateWithSelection("followup-3");

    expect(state.selectedFollowUpId).toBe("followup-3");
  });
});
