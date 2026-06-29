export interface ConsentState {
  selectedConsentId: string | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export function createInitialConsentState(): ConsentState {
  return {
    selectedConsentId: null,
    isLoading: false,
    errorMessage: null
  };
}

export function createConsentStateWithSelection(consentId: string): ConsentState {
  return {
    selectedConsentId: consentId,
    isLoading: false,
    errorMessage: null
  };
}
