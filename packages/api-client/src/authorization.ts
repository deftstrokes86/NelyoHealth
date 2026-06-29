export interface AuthorizationPermissionDraftDto {
  permissionId: string;
  subjectId: string;
  scope: string;
  granted: boolean;
  reason: string | null;
}

export interface AuthorizationPermissionDraftRequestDto {
  permissionId: string;
  subjectId: string;
  scope: string;
  granted: boolean;
  reason: string | null;
}

export function createAuthorizationPermissionDraftDto(
  input: AuthorizationPermissionDraftRequestDto
): AuthorizationPermissionDraftDto {
  return {
    permissionId: input.permissionId,
    subjectId: input.subjectId,
    scope: input.scope,
    granted: input.granted,
    reason: input.reason
  };
}
