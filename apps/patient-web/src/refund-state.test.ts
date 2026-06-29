import { describe, expect, it } from "vitest";
import { createInitialRefundState, createRefundStateWithSelection } from "./refund-state.js";

describe("patient refund state", () => {
  it("creates an initial refund state", () => {
    const state = createInitialRefundState();

    expect(state).toMatchObject({
      selectedRefundId: null,
      isLoading: false,
      errorMessage: null
    });
  });

  it("creates a refund state with a selected refund", () => {
    const state = createRefundStateWithSelection("refund-3");

    expect(state.selectedRefundId).toBe("refund-3");
  });
});
