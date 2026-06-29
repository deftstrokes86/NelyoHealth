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

export function createAccountDraftDto(input: AccountDraftRequestDto): AccountDraftDto {
  return {
    accountId: input.accountId,
    personId: input.personId,
    tenantId: input.tenantId,
    roles: input.roles,
    consentState: input.consentState,
    createdAt: input.createdAt
  };
}
