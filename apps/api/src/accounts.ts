export interface AccountDraft {
  accountId: string;
  personId: string;
  tenantId: string;
  roles: string[];
  consentState: "active" | "revoked" | "pending";
  createdAt: string;
}

export interface AccountDraftInput {
  accountId: string;
  personId: string;
  tenantId: string;
  roles: string[];
  consentState: "active" | "revoked" | "pending";
  createdAt: string;
}

export function createAccountDraft(input: AccountDraftInput): AccountDraft {
  return {
    accountId: input.accountId,
    personId: input.personId,
    tenantId: input.tenantId,
    roles: input.roles,
    consentState: input.consentState,
    createdAt: input.createdAt
  };
}
