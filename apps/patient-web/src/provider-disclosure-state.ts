export interface ProviderDisclosureState {
  selectedOrderId: string | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export function createInitialProviderDisclosureState(): ProviderDisclosureState {
  return {
    selectedOrderId: null,
    isLoading: false,
    errorMessage: null
  };
}

export function createProviderDisclosureStateWithSelection(
  orderId: string
): ProviderDisclosureState {
  return {
    selectedOrderId: orderId,
    isLoading: false,
    errorMessage: null
  };
}
