import { describe, expect, it } from "vitest";
import {
  createInitialDiagnosticResultState,
  createDiagnosticResultStateWithSelection
} from "./diagnostic-result-state.js";

describe("patient diagnostic result state", () => {
  it("creates an initial diagnostic result state", () => {
    const state = createInitialDiagnosticResultState();

    expect(state).toMatchObject({
      selectedDiagnosticResultId: null,
      isLoading: false,
      errorMessage: null
    });
  });

  it("creates a diagnostic result state with a selected result", () => {
    const state = createDiagnosticResultStateWithSelection("result-3");

    expect(state.selectedDiagnosticResultId).toBe("result-3");
  });
});
