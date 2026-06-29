import { describe, expect, it } from "vitest";
import {
  createInitialProviderDisclosureState,
  createProviderDisclosureStateWithSelection
} from "./provider-disclosure-state.js";

describe("patient provider disclosure state", () => {
  it("creates an initial provider disclosure state", () => {
    const state = createInitialProviderDisclosureState();

    expect(state).toMatchObject({
      selectedOrderId: null,
      isLoading: false,
      errorMessage: null
    });
  });

  it("creates provider disclosure state with a selected order", () => {
    const state = createProviderDisclosureStateWithSelection("order-3");

    expect(state.selectedOrderId).toBe("order-3");
  });
});
