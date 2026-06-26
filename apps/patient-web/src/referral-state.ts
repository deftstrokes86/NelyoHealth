export interface ReferralState {
  selectedReferralId: string | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export function createInitialReferralState(): ReferralState {
  return {
    selectedReferralId: null,
    isLoading: false,
    errorMessage: null
  };
}

export function createReferralStateWithSelection(referralId: string): ReferralState {
  return {
    selectedReferralId: referralId,
    isLoading: false,
    errorMessage: null
  };
}
