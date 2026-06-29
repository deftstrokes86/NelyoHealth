export interface FollowUpState {
  selectedFollowUpId: string | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export function createInitialFollowUpState(): FollowUpState {
  return {
    selectedFollowUpId: null,
    isLoading: false,
    errorMessage: null
  };
}

export function createFollowUpStateWithSelection(followUpId: string): FollowUpState {
  return {
    selectedFollowUpId: followUpId,
    isLoading: false,
    errorMessage: null
  };
}
