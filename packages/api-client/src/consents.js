export function createConsentDraftDto(input) {
    return {
        consentId: input.consentId,
        subjectId: input.subjectId,
        grantedTo: input.grantedTo,
        scope: input.scope,
        status: input.status,
        effectiveAt: input.effectiveAt,
        revokedAt: input.revokedAt
    };
}
//# sourceMappingURL=consents.js.map