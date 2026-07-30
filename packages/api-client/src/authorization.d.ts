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
export declare function createAuthorizationPermissionDraftDto(input: AuthorizationPermissionDraftRequestDto): AuthorizationPermissionDraftDto;
//# sourceMappingURL=authorization.d.ts.map