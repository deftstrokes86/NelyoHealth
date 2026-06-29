export interface ReferralAdvancedState {
  selectedReferralId: string | null;
  selectedStatus: "pending" | "sent" | "accepted" | "declined" | "completed" | "cancelled" | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export function createInitialReferralAdvancedState(): ReferralAdvancedState {
  return {
    selectedReferralId: null,
    selectedStatus: null,
    isLoading: false,
    errorMessage: null
  };
}

export function createReferralAdvancedStateWithSelection(
  referralId: string,
  status: "pending" | "sent" | "accepted" | "declined" | "completed" | "cancelled"
): ReferralAdvancedState {
  return {
    selectedReferralId: referralId,
    selectedStatus: status,
    isLoading: false,
    errorMessage: null
  };
}
