import { describe, expect, it } from "vitest";
import { createInitialReferralState, createReferralStateWithSelection } from "./referral-state.js";

describe("patient referral state", () => {
  it("creates an initial referral state", () => {
    const state = createInitialReferralState();

    expect(state).toMatchObject({
      selectedReferralId: null,
      isLoading: false,
      errorMessage: null
    });
  });

  it("creates a referral state with a selected referral", () => {
    const state = createReferralStateWithSelection("referral-3");

    expect(state.selectedReferralId).toBe("referral-3");
  });
});
