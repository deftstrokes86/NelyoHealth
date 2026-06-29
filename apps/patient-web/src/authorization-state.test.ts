import { describe, expect, it } from "vitest";
import {
  createInitialAuthorizationState,
  createAuthorizationStateWithSelection
} from "./authorization-state.js";

describe("patient authorization state", () => {
  it("creates an initial authorization state", () => {
    const state = createInitialAuthorizationState();

    expect(state).toMatchObject({
      selectedPermissionId: null,
      isLoading: false,
      errorMessage: null
    });
  });

  it("creates an authorization state with a selected permission", () => {
    const state = createAuthorizationStateWithSelection("perm-3");

    expect(state.selectedPermissionId).toBe("perm-3");
  });
});
