export interface PrescriptionAdvancedState {
  selectedPrescriptionId: string | null;
  selectedStatus: "prescribed" | "verified" | "dispensed" | "completed" | "cancelled" | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export function createInitialPrescriptionAdvancedState(): PrescriptionAdvancedState {
  return {
    selectedPrescriptionId: null,
    selectedStatus: null,
    isLoading: false,
    errorMessage: null
  };
}

export function createPrescriptionAdvancedStateWithSelection(
  prescriptionId: string,
  status: "prescribed" | "verified" | "dispensed" | "completed" | "cancelled"
): PrescriptionAdvancedState {
  return {
    selectedPrescriptionId: prescriptionId,
    selectedStatus: status,
    isLoading: false,
    errorMessage: null
  };
}
