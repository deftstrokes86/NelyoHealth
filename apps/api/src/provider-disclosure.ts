import { project, type ClassificationMap, type ProjectionContext } from "./projection.js";

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

/**
 * The data classification of every field the disclosure decision may carry. The
 * protected provider identity/location fields are PROVIDER-IDENTITY-LOCATION-DATA;
 * `providerDisplayName` carries the explicit field-level pre-payment allowance
 * (docs/data/data-classification.md). This is the single declaration the central
 * projection layer (M8.1) enforces.
 */
const PROVIDER_DISCLOSURE_CLASSIFICATION: ClassificationMap<ProviderDisclosureDecisionDraftInput> =
  {
    orderId: "INTERNAL",
    status: "INTERNAL",
    reasonCode: "INTERNAL",
    authorizedAt: "INTERNAL",
    providerDisplayName: {
      classification: "PROVIDER-IDENTITY-LOCATION-DATA",
      allowance: "provider-display-name-pre-payment"
    },
    providerId: "PROVIDER-IDENTITY-LOCATION-DATA",
    providerAddress: "PROVIDER-IDENTITY-LOCATION-DATA",
    providerPhone: "PROVIDER-IDENTITY-LOCATION-DATA"
  };

/**
 * The pre-payment-safe eligibility view: only the display-name allowance crosses; the
 * decision draft never exposes provider id/address/phone (they stay server-side until
 * an authorized post-payment disclosure). Redaction now runs through the central
 * projection layer keyed by the classification map above, rather than an inline
 * allowlist — behavior-preserving.
 */
const DECISION_DRAFT_CONTEXT: ProjectionContext = {
  purpose: "provider-disclosure-decision",
  identityAuthorized: false,
  clinicalAuthorized: false,
  providerDisclosureAuthorized: false,
  financeAuthorized: false
};

export function createProviderDisclosureDecisionDraft(
  input: ProviderDisclosureDecisionDraftInput
): ProviderDisclosureDecisionDraft {
  const projected = project(input, PROVIDER_DISCLOSURE_CLASSIFICATION, DECISION_DRAFT_CONTEXT);
  // Protected provider identity/location fields have been dropped by the projection;
  // the surviving fields are the pre-payment-safe decision draft.
  return {
    orderId: projected.orderId ?? input.orderId,
    status: projected.status ?? input.status,
    reasonCode: projected.reasonCode ?? input.reasonCode,
    providerDisplayName: projected.providerDisplayName ?? input.providerDisplayName,
    authorizedAt: projected.authorizedAt ?? null
  };
}
