export interface ProviderDisclosureDecisionDraftDtoLike {
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

export interface ProviderDisclosureDecisionViewModel {
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

export function createProviderDisclosureDecisionViewModel(
  dto: ProviderDisclosureDecisionDraftDtoLike
): ProviderDisclosureDecisionViewModel {
  return {
    orderId: dto.orderId,
    status: dto.status,
    reasonCode: dto.reasonCode,
    providerDisplayName: dto.providerDisplayName,
    authorizedAt: dto.authorizedAt
  };
}
