import { describe, expect, it } from "vitest";
import { createInitialPaymentState, createPaymentStateWithSelection } from "./payment-state.js";

describe("patient payment state", () => {
  it("creates an initial payment state", () => {
    const state = createInitialPaymentState();

    expect(state).toMatchObject({
      selectedPaymentId: null,
      isLoading: false,
      errorMessage: null
    });
  });

  it("creates a payment state with a selected payment", () => {
    const state = createPaymentStateWithSelection("payment-3");

    expect(state.selectedPaymentId).toBe("payment-3");
  });
});
