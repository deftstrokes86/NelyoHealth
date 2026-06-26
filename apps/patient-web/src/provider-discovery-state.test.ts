import { describe, expect, it } from "vitest";
import {
  createInitialProviderDiscoveryState,
  createProviderDiscoveryStateWithSelection
} from "./provider-discovery-state.js";

describe("patient web provider discovery state", () => {
  it("creates an initial empty state", () => {
    const state = createInitialProviderDiscoveryState();

    expect(state).toEqual({
      selectedProviderId: null,
      isLoading: false,
      errorMessage: null
    });
  });

  it("creates a selected-provider state", () => {
    const state = createProviderDiscoveryStateWithSelection("provider-5");

    expect(state.selectedProviderId).toBe("provider-5");
    expect(state.isLoading).toBe(false);
    expect(state.errorMessage).toBeNull();
  });
});
