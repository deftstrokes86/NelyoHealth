# Provider Discovery Privacy Policy

## Document Control

| Field | Value |
|---|---|
| Document title | Provider discovery privacy policy |
| Codex prompt ID | P00-08 |
| Complete Breakdown work package | P00-10 Pharmacy and laboratory disclosure contract |
| Issue ID | P00-PRV-001 |
| Owner role | Product owner + Security lead |
| Review state | PROPOSED; locked pre-payment disclosure rule is APPROVED |
| Required reviewers | Product owner, Security lead, Privacy counsel, Legal counsel, Finance owner, Pharmacy operations lead, Laboratory operations lead, QA lead |
| Last updated | 2026-06-24 |
| Related locked decisions | REQ-LOCK-003, REQ-LOCK-004, REQ-LOCK-005, REQ-LOCK-006, REQ-LOCK-007, REQ-LOCK-008, REQ-LOCK-009 |
| Related open questions | OQ-00-129, OQ-00-130, OQ-00-137 through OQ-00-160 |
| Related journeys | JRN-008, JRN-009, JRN-015, JRN-016 |
| Related workflows | WFL-008, WFL-010, WFL-013, WFL-018, WFL-019 |
| Related contracts | docs/contracts/provider-disclosure-contract.md |
| Related threat model | docs/security/provider-disclosure-threat-model.md |
| Related test matrix | docs/testing/provider-disclosure-test-matrix.md |
| Related ADR | docs/adr/ADR-0001-provider-detail-release-after-payment.md |

## Product Policy

NelyoHealth protects pharmacy and laboratory provider identity and location details before the approved successful-payment event because internal matching may use provider, branch, inventory, capability, and location facts that are not necessary for a patient to select and pay.

Before payment, the patient sees only `providerDisplayName` as the provider identity field, plus approved non-identifying commercial/workflow information needed to select and pay. The patient does not see address, branch, coordinates, distance, map pin, directions, contact details, pickup or collection instructions, photographs, links, internal identifiers, ranking features, inventory-location facts, or derivable metadata.

After authorization, the patient or another authorized actor may retrieve approved details only for the selected paid order through `AuthorizedFulfilmentLocationView`. This is data minimization and server-side authorization, not visual concealment. CSS hiding, hidden DOM, client-side redaction, conditional rendering, or success-page navigation are explicitly insufficient.

Hospital referral, urgent facility guidance, emergency facility guidance, emergency location handling, and clinically required transfer information are separate clinical/safety workflows. Emergency escalation is never blocked by payment, marketplace comparison, plan authorization, registration, or provider-detail protection.

## Pre-Payment User Experience

- Display `providerDisplayName` with an accessible label.
- Display only approved commercial information: availability, non-identifying fulfilment mode, generalized fulfilment window, quote expiry, currency, fees, coverage contribution, payable amount, total amount, and permitted actions.
- Do not display provider-specific maps, map pins, routes, distance, bearing, address, contact information, branch details, photographs, links, pickup instructions, collection instructions, or derivable metadata.
- Use an opaque selection token for selection. The token is not authorization, payment evidence, provider identity, or a reusable provider lookup key.
- Explain accessibly that further fulfilment details become available only after the approved payment or coverage condition and server-side authorization.
- Empty, expired, no-match, and error states are non-enumerating.
- The UI must not imply that the closest provider is visible or ranked by distance.

## Post-Payment User Experience

- Reveal is exact-order and selected-provider specific.
- Approved address, route, contact channel, collection/visit instructions, delivery handoff details, and map data appear only after `ProviderDetailDisclosureDecision` returns `ALLOW`.
- Accessible map alternatives, copy-address behavior, contact actions, refresh behavior, and logout behavior must not expose alternative providers.
- Provider replacement requires a fresh disclosure decision and a privacy-safe replacement notice.
- Refund, reversal, chargeback, dispute, or ambiguous payment status triggers recomputation. Future-access behavior after prior valid disclosure remains `REQUIRES_APPROVAL` for P00-13.

## Actor-Specific Experience

| Actor | Pre-payment view | Payment/selection | Post-payment provider-detail retrieval |
|---|---|---|---|
| Patient | `providerDisplayName` and approved fields | Own eligible order | Own eligible selected order after server-side `ALLOW` |
| Clinical proxy | Delegation-dependent | Delegation-dependent | Only within approved clinical/delegation scope |
| Delegated caregiver | Delegation-dependent | Delegation-dependent | Only within delegation scope |
| Family payer | Funding view only | May pay where approved | No access merely by paying |
| Diaspora sponsor | Funding view only | May fund accepted transaction | No access merely by funding |
| Employer administrator | Deferred/minimum funding data | Deferred | No general access |
| HMO administrator | Minimum coverage data only | Coverage workflow | No general access |
| Support operator | No browsing access | Assist only by purpose | Purpose-specific, order-specific, audited access only |
| Finance operator | Financial facts only | Reconciliation | No general provider-location access |
| Provider staff | Provider workflow data | Provider workflow only | Own operational order data, not patient disclosure endpoint |
| Delivery participant | No pre-payment access | Not payer by default | Minimum necessary pickup/origin data after authorization |

## Accessibility

- `providerDisplayName` is correctly labeled.
- Hidden protected fields must not exist in DOM or accessibility tree before authorization.
- No protected information is conveyed only visually.
- Locked states are understandable to screen-reader users.
- Focus must not move to unavailable provider-specific map controls before authorization.
- Post-payment address, route, contact, and instructions must be keyboard accessible after authorization.
- Error messages must not leak provider existence, location, or internal identifiers.

## Low-Bandwidth and Recovery

- Pre-payment offer refresh re-fetches a sanitized contract.
- Expired selection token requires safe re-selection.
- Interrupted, pending, failed, cancelled, expired, delayed-callback, or refreshed payment does not self-unlock.
- Safe retry must not duplicate orders or reuse stale tokens.
- Browser back navigation and cached responses must not reveal another session's protected data.
- No client-side flag may convert pending or success-screen state into provider-detail access.

## Residual Risks

- A user may independently search the visible `providerDisplayName` outside NelyoHealth. This is inherent in the approved rule allowing the name to be shown. NelyoHealth must not supplement the name with location or identifying metadata that makes discovery easier. The platform is responsible for its own disclosures, not for independent external research performed by a user.
- An authorized user may take a screenshot or share details after legitimate disclosure. NelyoHealth minimizes disclosure before authorization and controls its own artifacts.
- External map providers receive minimum route/location data only after authorized disclosure. Vendor selection and retention policy remain future implementation concerns.
- Operational staff may require legitimate order-specific access. That access is purpose-bound, audited, and not universal.


## P00-08 validation phrase

- frontend hiding is not a disclosure control; protected provider details must not be serialized to the patient-facing client before authorization.

## P00-13 Finance Alignment

- `OrderFundingSecured` is the PROPOSED finance input to provider-disclosure evaluation, not an approved implementation event and not a provider-detail response.
- `ProviderDetailDisclosureDecision` remains the separate access authority and must evaluate exact order, selected provider, actor, patient, tenant, current authorization, no-store handling, deny-by-default behavior, and policy version server-side.
- `ProviderDetailDisclosureEligibilityEstablished` remains separate from payment, ledger, browser success, redirect, webhook, authorization, settlement, claim, remittance, and payout state.
- Refund, reversal, chargeback, cancellation, provider replacement, reconciliation exception, and legal/safety/support purpose changes trigger recomputation; final post-refund retrieval outcomes remain approval-gated.
- No finance event, ledger entry, analytics event, log, trace, screenshot, browser payload, map request, cache entry, hidden DOM, or accessibility tree may contain protected pre-payment provider details.
- P00-12 legal conflict around provider display and minimum disclosure remains unresolved and launch-gated; P00-13 does not alter the locked providerDisplayName-only pre-payment rule.
