export interface AuthorizationState {
  selectedPermissionId: string | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export function createInitialAuthorizationState(): AuthorizationState {
  return {
    selectedPermissionId: null,
    isLoading: false,
    errorMessage: null
  };
}

export function createAuthorizationStateWithSelection(permissionId: string): AuthorizationState {
  return {
    selectedPermissionId: permissionId,
    isLoading: false,
    errorMessage: null
  };
}
