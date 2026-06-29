export interface ProviderDisclosureDecisionDraft {
  orderId: string;
  status: "not-eligible" | "eligible" | "denied";
  reasonCode:
    | "payment-not-settled"
    | "authorization-missing"
    | "tenant-mismatch"
    | "policy-gated"
    | "eligible";
  providerDisplayName: string;
  authorizedAt: string | null;
}

export interface ProviderDisclosureDecisionDraftInput {
  orderId: string;
  status: "not-eligible" | "eligible" | "denied";
  reasonCode:
    | "payment-not-settled"
    | "authorization-missing"
    | "tenant-mismatch"
    | "policy-gated"
    | "eligible";
  providerDisplayName: string;
  authorizedAt: string | null;
  providerId?: string;
  providerAddress?: string;
  providerPhone?: string;
}

export function createProviderDisclosureDecisionDraft(
  input: ProviderDisclosureDecisionDraftInput
): ProviderDisclosureDecisionDraft {
  return {
    orderId: input.orderId,
    status: input.status,
    reasonCode: input.reasonCode,
    providerDisplayName: input.providerDisplayName,
    authorizedAt: input.authorizedAt
  };
}
