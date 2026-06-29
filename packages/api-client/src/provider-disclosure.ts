export interface ProviderDisclosureDecisionDraftDto {
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

export interface ProviderDisclosureDecisionDraftRequestDto {
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

export function createProviderDisclosureDecisionDraftDto(
  input: ProviderDisclosureDecisionDraftRequestDto
): ProviderDisclosureDecisionDraftDto {
  return {
    orderId: input.orderId,
    status: input.status,
    reasonCode: input.reasonCode,
    providerDisplayName: input.providerDisplayName,
    authorizedAt: input.authorizedAt
  };
}
