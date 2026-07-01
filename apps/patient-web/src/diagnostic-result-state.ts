export interface DiagnosticResultState {
  selectedDiagnosticResultId: string | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export function createInitialDiagnosticResultState(): DiagnosticResultState {
  return {
    selectedDiagnosticResultId: null,
    isLoading: false,
    errorMessage: null
  };
}

export function createDiagnosticResultStateWithSelection(
  diagnosticResultId: string
): DiagnosticResultState {
  return {
    selectedDiagnosticResultId: diagnosticResultId,
    isLoading: false,
    errorMessage: null
  };
}
