import { describe, expect, it } from "vitest";
import { createInitialAccountState, createAccountStateWithSelection } from "./account-state.js";

describe("patient account state", () => {
  it("creates an initial account state", () => {
    const state = createInitialAccountState();

    expect(state).toMatchObject({
      selectedAccountId: null,
      isLoading: false,
      errorMessage: null
    });
  });

  it("creates an account state with a selected account", () => {
    const state = createAccountStateWithSelection("account-3");

    expect(state.selectedAccountId).toBe("account-3");
  });
});
