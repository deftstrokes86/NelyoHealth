export interface IntakeState {
  selectedIntakeId: string | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export function createInitialIntakeState(): IntakeState {
  return {
    selectedIntakeId: null,
    isLoading: false,
    errorMessage: null
  };
}

export function createIntakeStateWithSelection(intakeId: string): IntakeState {
  return {
    selectedIntakeId: intakeId,
    isLoading: false,
    errorMessage: null
  };
}
