export interface ProviderDisclosureDecisionDraftDto {
    orderId: string;
    status: "not-eligible" | "eligible" | "denied";
    reasonCode: "payment-not-settled" | "authorization-missing" | "tenant-mismatch" | "policy-gated" | "eligible";
    providerDisplayName: string;
    authorizedAt: string | null;
}
export interface ProviderDisclosureDecisionDraftRequestDto {
    orderId: string;
    status: "not-eligible" | "eligible" | "denied";
    reasonCode: "payment-not-settled" | "authorization-missing" | "tenant-mismatch" | "policy-gated" | "eligible";
    providerDisplayName: string;
    authorizedAt: string | null;
}
export declare function createProviderDisclosureDecisionDraftDto(input: ProviderDisclosureDecisionDraftRequestDto): ProviderDisclosureDecisionDraftDto;
//# sourceMappingURL=provider-disclosure.d.ts.map