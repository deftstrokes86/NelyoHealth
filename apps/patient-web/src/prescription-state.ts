export interface PrescriptionState {
  selectedPrescriptionId: string | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export function createInitialPrescriptionState(): PrescriptionState {
  return {
    selectedPrescriptionId: null,
    isLoading: false,
    errorMessage: null
  };
}

export function createPrescriptionStateWithSelection(prescriptionId: string): PrescriptionState {
  return {
    selectedPrescriptionId: prescriptionId,
    isLoading: false,
    errorMessage: null
  };
}
