# ADR-0001: Server-side separation of pre-payment provider offers and authorized post-payment fulfilment locations

## Status

ACCEPTED for the core architectural decision because it implements approved locked requirements.

The exact financial evidence that unlocks provider details remains `REQUIRES_APPROVAL` and is deferred to P00-13.

## Context

NelyoHealth must let patients compare pharmacy and laboratory offers while preventing provider identity/location details from reaching the patient-facing client before the approved successful-payment event. The user experience permits `providerDisplayName` and approved non-identifying commercial fields before payment, then selected-order fulfilment details after server-side authorization.

The threats include network inspection, source inspection, hydration payload inspection, JavaScript state inspection, hidden DOM, accessibility tree leakage, browser storage, service-worker cache, browser back after logout, stale tabs, IDOR, forged client success, payment webhook replay, map-request inference, analytics/session-replay leakage, support misuse, provider replacement races, and accidental full-object serialization.

Existing P00-06 architecture already separates `InternalProviderMatchingCandidate`, `PrePaymentProviderOfferView`, and `AuthorizedPostPaymentFulfilmentView`.

Frontend hiding is insufficient because hidden fields still reach HTML, JavaScript state, hydration payloads, DOM, accessibility trees, storage, traces, screenshots, logs, and telemetry. A generic paid flag is insufficient because provider disclosure must be exact actor, patient, tenant, order, selected provider, policy, and auditable access event scoped.

## Decision

NelyoHealth will:

- Use separate server-generated projections for pre-payment provider offers and post-payment fulfilment locations.
- Use `MarketplaceQuoteView` for pre-payment and `AuthorizedFulfilmentLocationView` for post-payment.
- Use explicit allow-list serialization.
- Use an opaque selection token before payment.
- Use order-based authorized retrieval after payment.
- Recompute authorization on every protected retrieval.
- Bind authorization to exact actor, patient, tenant, order, and selected provider.
- Keep map behavior separate before and after authorization.
- Use private non-shared no-store handling for protected responses.
- Audit allowed and denied disclosure attempts with minimized payloads.
- Treat the exact financial evidence as a P00-13 dependency.

## Alternatives Considered

| Alternative | Decision | Reason |
|---|---|---|
| Return full provider object and hide fields in frontend | Rejected | Protected fields still reach browser, DOM, storage, traces, and telemetry. |
| Return full provider object and redact in shared client mapper | Rejected | Client mapper failure leaks data and violates server-side boundary. |
| Use one endpoint with conditional fields | Rejected | High accidental expansion risk and difficult contract testing. |
| Use a generic paid session flag | Rejected | Not order, patient, tenant, actor, or selected-provider scoped. |
| Reveal approximate distance before payment | Rejected | Distance can reveal provider location or ranking/proximity features. |
| Reveal map pins without labels | Rejected | Map position itself reveals location. |
| Separate pre-payment and post-payment server projections | Accepted | Enforces data minimization and contract clarity. |
| Order-specific disclosure grant or policy evaluation | Accepted | Supports recomputation, audit, and exact-scope authorization. |

## Consequences

Positive:

- Stronger privacy boundary
- Easier contract testing
- Reduced accidental leakage
- Clear authorization
- Better auditability

Negative:

- More projection code
- More contract maintenance
- More negative tests
- More policy decisions
- More handling for provider replacement and financial disputes

## Security and Privacy Consequences

- Reduced IDOR surface through exact order/provider/patient/tenant binding.
- Reduced browser exposure by filtering before serialization.
- Cache controls prevent shared or stale protected views.
- Telemetry controls reduce accidental leakage into analytics, logs, errors, traces, screenshots, videos, and session replay.
- Residual name-search risk remains because `providerDisplayName` is intentionally visible.
- Authorized screenshot risk remains after legitimate disclosure.

## Open Dependencies

- Exact financial evidence
- Coverage-based eligibility
- Refund behavior
- Reversal behavior
- Chargeback behavior
- Historical order visibility
- Provider replacement
- Support access
- Legal minimum provider disclosure

## Supersession Rule

Any future change that expands pre-payment provider fields requires:

- New ADR or ADR amendment
- Product-owner approval
- Privacy review
- Security review
- Legal or regulatory review where applicable
- Updated threat model
- Updated tests
- Updated traceability


## P00-08 validation phrases

- ADR-0001 establishes an order-scoped provider-detail release model.
- Generic paid flags do not unlock provider details.

- generic paid flags do not unlock provider details.
