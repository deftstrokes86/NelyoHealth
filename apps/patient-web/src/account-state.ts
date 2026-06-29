export interface AccountState {
  selectedAccountId: string | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export function createInitialAccountState(): AccountState {
  return {
    selectedAccountId: null,
    isLoading: false,
    errorMessage: null
  };
}

export function createAccountStateWithSelection(accountId: string): AccountState {
  return {
    selectedAccountId: accountId,
    isLoading: false,
    errorMessage: null
  };
}
