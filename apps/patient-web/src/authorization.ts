export interface AuthorizationPermissionDraftDtoLike {
  permissionId: string;
  subjectId: string;
  scope: string;
  granted: boolean;
  reason: string | null;
}

export interface AuthorizationPermissionViewModel {
  permissionId: string;
  subjectId: string;
  scope: string;
  granted: boolean;
  reason: string | null;
}

export function createAuthorizationPermissionViewModel(
  dto: AuthorizationPermissionDraftDtoLike
): AuthorizationPermissionViewModel {
  return {
    permissionId: dto.permissionId,
    subjectId: dto.subjectId,
    scope: dto.scope,
    granted: dto.granted,
    reason: dto.reason
  };
}
