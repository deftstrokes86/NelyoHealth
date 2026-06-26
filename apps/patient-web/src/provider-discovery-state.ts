export interface ProviderDiscoveryState {
  selectedProviderId: string | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export function createInitialProviderDiscoveryState(): ProviderDiscoveryState {
  return {
    selectedProviderId: null,
    isLoading: false,
    errorMessage: null
  };
}

export function createProviderDiscoveryStateWithSelection(providerId: string): ProviderDiscoveryState {
  return {
    selectedProviderId: providerId,
    isLoading: false,
    errorMessage: null
  };
}
