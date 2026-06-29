export interface AccountDraftDtoLike {
  accountId: string;
  personId: string;
  tenantId: string;
  roles: string[];
  consentState: "active" | "revoked" | "pending";
  createdAt: string;
}

export interface AccountViewModel {
  accountId: string;
  personId: string;
  tenantId: string;
  roles: string[];
  consentState: "active" | "revoked" | "pending";
  createdAt: string;
}

export function createAccountViewModel(dto: AccountDraftDtoLike): AccountViewModel {
  return {
    accountId: dto.accountId,
    personId: dto.personId,
    tenantId: dto.tenantId,
    roles: dto.roles,
    consentState: dto.consentState,
    createdAt: dto.createdAt
  };
}
