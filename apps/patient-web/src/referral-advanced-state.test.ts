import { describe, expect, it } from "vitest";
import {
  createInitialReferralAdvancedState,
  createReferralAdvancedStateWithSelection
} from "./referral-advanced-state.js";

describe("patient referral advanced state", () => {
  it("creates an initial referral advanced state", () => {
    const state = createInitialReferralAdvancedState();

    expect(state).toMatchObject({
      selectedReferralId: null,
      selectedStatus: null,
      isLoading: false,
      errorMessage: null
    });
  });

  it("creates a referral advanced state with selection", () => {
    const state = createReferralAdvancedStateWithSelection("referral-advanced-2", "sent");

    expect(state).toMatchObject({
      selectedReferralId: "referral-advanced-2",
      selectedStatus: "sent"
    });
  });
});
