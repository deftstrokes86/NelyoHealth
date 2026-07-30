export function createAccountDraftDto(input) {
    return {
        accountId: input.accountId,
        personId: input.personId,
        tenantId: input.tenantId,
        roles: input.roles,
        consentState: input.consentState,
        createdAt: input.createdAt
    };
}
//# sourceMappingURL=accounts.js.map