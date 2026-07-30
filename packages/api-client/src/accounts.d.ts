export interface AccountDraftDto {
    accountId: string;
    personId: string;
    tenantId: string;
    roles: string[];
    consentState: "active" | "revoked" | "pending";
    createdAt: string;
}
export interface AccountDraftRequestDto {
    accountId: string;
    personId: string;
    tenantId: string;
    roles: string[];
    consentState: "active" | "revoked" | "pending";
    createdAt: string;
}
export declare function createAccountDraftDto(input: AccountDraftRequestDto): AccountDraftDto;
//# sourceMappingURL=accounts.d.ts.map