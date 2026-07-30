export function createAuthorizationPermissionDraftDto(input) {
    return {
        permissionId: input.permissionId,
        subjectId: input.subjectId,
        scope: input.scope,
        granted: input.granted,
        reason: input.reason
    };
}
//# sourceMappingURL=authorization.js.map