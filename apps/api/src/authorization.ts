export interface AuthorizationPermissionDraft {
  permissionId: string;
  subjectId: string;
  scope: string;
  granted: boolean;
  reason: string | null;
}

export interface AuthorizationPermissionDraftInput {
  permissionId: string;
  subjectId: string;
  scope: string;
  granted: boolean;
  reason: string | null;
}

export function createAuthorizationPermissionDraft(
  input: AuthorizationPermissionDraftInput
): AuthorizationPermissionDraft {
  return {
    permissionId: input.permissionId,
    subjectId: input.subjectId,
    scope: input.scope,
    granted: input.granted,
    reason: input.reason
  };
}
