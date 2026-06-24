# Provider Disclosure Contract

## Document Control

| Field | Value |
|---|---|
| Document title | Provider disclosure contract |
| Codex prompt ID | P00-08 |
| Complete Breakdown work package | P00-10 Pharmacy and laboratory disclosure contract |
| Issue ID | P00-PRV-001 |
| Owner role | Security lead + Architecture lead |
| Review state | PROPOSED; locked disclosure constraints APPROVED |
| Required reviewers | Product owner, Privacy counsel, Legal counsel, Finance owner, Pharmacy operations lead, Laboratory operations lead, QA lead |
| Last updated | 2026-06-24 |

## Contract Scope

This contract governs patient-facing and support-facing disclosure of pharmacy and laboratory provider identity/location details across SSR, application frontend, API/BFF, future GraphQL if used, hydration payloads, DOM, browser state, cache, map/geocoding requests, analytics, error reporting, logs, support tools, test fixtures, screenshots, traces, videos, and reports.

It maps P00-06 conceptual projections as follows:

| Conceptual projection | External contract resource | Rule |
|---|---|---|
| InternalProviderMatchingCandidate | No patient-facing resource | Server-side only; may contain protected provider and matching data |
| PrePaymentProviderOfferView | MarketplaceQuoteView | Patient-facing pre-payment resource; contains `providerDisplayName` and approved non-identifying fields only |
| AuthorizedPostPaymentFulfilmentView | AuthorizedFulfilmentLocationView | Post-payment selected-order resource generated only after server-side authorization |

## Contract Versioning

- Contract version is conceptual in Phase 0 and implementation-neutral.
- Backward compatibility must never silently expand `MarketplaceQuoteView`.
- Field additions require privacy, security, contract, data-classification, negative-test, and traceability review.
- Field removals require consumer contract review and safe migration planning.
- Consumer contract tests fail when protected fields are added to pre-payment payloads.
- No final URL path, database schema, HTTP status code set, GraphQL schema, token format, vendor, or framework cache API is selected in P00-08.

## PRV Requirement Definitions

| Requirement ID | Requirement | Policy | Test | Approval |
|---|---|---|---|---|
| PRV-REQ-001 | Pre-payment pharmacy/lab provider identity exposed to the patient-facing client is limited to `providerDisplayName`. | PRV-POL-001 | PRV-TST-001 | APPROVED |
| PRV-REQ-002 | Pre-payment commercial/workflow fields must be approved, necessary, non-identifying, non-locating, non-derivable, and unrelated to internal provider identity. | PRV-POL-001 | PRV-TST-001 | APPROVED |
| PRV-REQ-003 | Protected provider, facility, branch, address, coordinate, distance, contact, map, instruction, internal identifier, and derivable metadata must not reach any patient-facing channel before authorization. | PRV-POL-002 | PRV-TST-002 | APPROVED |
| PRV-REQ-004 | Filtering occurs before server-to-client serialization; frontend hiding is prohibited. | PRV-POL-003 | PRV-TST-032 | APPROVED |
| PRV-REQ-005 | CSS, hidden DOM, client mappers, route state, and stale paid flags are not disclosure controls. | PRV-POL-003 | PRV-TST-032 | APPROVED |
| PRV-REQ-006 | The rule covers pharmacy and laboratory matching, quotes, selection, fulfilment, appointments, visits, and collection instructions. | PRV-POL-004 | PRV-TST-001 | APPROVED |
| PRV-REQ-007 | Hospital referral, urgent, emergency, and transfer guidance follow separate clinical safety rules. | PRV-POL-005 | PRV-TST-035 | APPROVED |
| PRV-REQ-008 | InternalProviderMatchingCandidate, PrePaymentProviderOfferView, and AuthorizedPostPaymentFulfilmentView remain separate projections. | PRV-POL-006 | PRV-TST-032 | APPROVED |
| PRV-REQ-009 | `providerDisplayName` is plain display-safe text without address, contact, URL, coordinates, markup, tracking, or unapproved branch identifiers. | PRV-POL-007 | PRV-TST-001 | APPROVED |
| PRV-REQ-010 | Residual external name-search risk is documented and NelyoHealth must not add location metadata that makes lookup easier. | PRV-POL-007 | PRV-TST-034 | APPROVED |
| PRV-REQ-011 | MarketplaceQuoteView is an explicit pre-payment allow-list and has no full-provider inheritance, spread, mapper, or serializer fallback. | PRV-POL-008 | PRV-TST-032 | APPROVED |
| PRV-REQ-012 | MarketplaceQuoteView must not contain identifiers, slugs, address, locality, city, postal code, coordinates, geohash, distance, bearing, rank features, map data, contact data, website, directions, instructions, origin details, raw provider object, matching features, or stock-location data. | PRV-POL-009 | PRV-TST-001 | APPROVED |
| PRV-REQ-013 | Opaque selection token is scoped, non-derivable, configured-expiry, single-purpose, server-validated, and not authorization or payment evidence. | PRV-POL-010 | PRV-TST-010 | APPROVED |
| PRV-REQ-014 | AuthorizedFulfilmentLocationView is post-payment, order-specific, selected-provider-specific, minimum-necessary, and separate from unrelated provider records. | PRV-POL-011 | PRV-TST-003 | APPROVED |
| PRV-REQ-015 | Pre-payment and post-payment resources do not share a serializer that defaults to provider fields. | PRV-POL-012 | PRV-TST-032 | APPROVED |
| PRV-REQ-016 | Adding a MarketplaceQuoteView field requires privacy, security, contract, classification, negative-test, and traceability updates. | PRV-POL-013 | PRV-TST-032 | APPROVED |
| PRV-REQ-017 | ProviderDetailDisclosureDecision is evaluated server-side for every protected retrieval. | PRV-POL-014 | PRV-TST-005 | APPROVED |
| PRV-REQ-018 | Protected retrieval checks actor, session, order, patient, tenant, selected provider, provider version/replacement, quote/selection, finance/coverage evidence, reconciliation, cancellation, fulfilment, consent/delegation, and policy version. | PRV-POL-014 | PRV-TST-005 | APPROVED |
| PRV-REQ-019 | One payment/coverage obligation cannot unlock another order, quote, provider, pharmacy, laboratory, patient, beneficiary, tenant, unselected match, or replacement provider. | PRV-POL-015 | PRV-TST-005 | APPROVED |
| PRV-REQ-020 | Sponsors, family payers, employers, HMOs, support, administrators, provider staff, and delivery participants do not gain general access merely by paying or holding a role. | PRV-POL-016 | PRV-TST-006 | APPROVED |
| PRV-REQ-021 | ProviderDetailDisclosureEligibilityEstablished is approval-gated and not a client success page, browser route, generic payment success, unverified webhook, authorization-only payment, pending transfer, created payment intent, sponsor request, coverage lookup, or HMO eligibility result. | PRV-POL-017 | PRV-TST-011 | APPROVED |
| PRV-REQ-022 | Exact financial evidence remains REQUIRES_APPROVAL for P00-13 and disclosure is deny-by-default until approved. | PRV-POL-017 | PRV-TST-011 | REQUIRES_APPROVAL |
| PRV-REQ-023 | Created, initiated, requires-action, awaiting-action, processing, pending, authorization-only unless later approved, abandoned, failed, cancelled, expired, unverified, incorrectly bound, wrong-order, wrong-actor, wrong-patient, wrong-tenant, reconciliation-exception, refund, reversal, chargeback, and client success states do not create initial eligibility. | PRV-POL-018 | PRV-TST-011 | APPROVED |
| PRV-REQ-024 | Refund/reversal/chargeback never create initial eligibility; after prior valid disclosure, future retrieval recomputes and ambiguous access returns REVIEW-REQUIRED or deny-by-default until P00-13 approves. | PRV-POL-019 | PRV-TST-012 | REQUIRES_APPROVAL |
| PRV-REQ-025 | Provider-detail access is not permanent; logout, new session, cancellation, replacement, revocation, patient/tenant context change, or authorization loss requires recomputation. | PRV-POL-020 | PRV-TST-014 | APPROVED |
| PRV-REQ-026 | Provider replacement requires a fresh disclosure decision; old and alternative provider details remain protected unless separately authorized. | PRV-POL-021 | PRV-TST-013 | APPROVED |
| PRV-REQ-027 | Before authorization, no pharmacy/lab map pin, map center, coordinates, route, distance, bearing, bounds, radius ring, browser-side distance calculation, or hidden coordinates may reach browser or map provider. | PRV-POL-022 | PRV-TST-019 | APPROVED |
| PRV-REQ-028 | After authorization, map access is selected-order specific and sends only minimum approved route data for the selected provider. | PRV-POL-022 | PRV-TST-019 | APPROVED |
| PRV-REQ-029 | Protected responses require private non-shared no-store handling and prohibit public, shared CDN, and service-worker caching. | PRV-POL-023 | PRV-TST-017 | APPROVED |
| PRV-REQ-030 | Protected details must not be stored in local storage, URLs, query strings, fragments, route params, page source, stale client state, or stale tabs after context changes. | PRV-POL-024 | PRV-TST-016 | APPROVED |
| PRV-REQ-031 | Analytics, session replay, error reporting, logs, console logs, traces, screenshots, videos, and reports must not receive protected provider details except under approved post-payment controls. | PRV-POL-025 | PRV-TST-020 | APPROVED |
| PRV-REQ-032 | Error responses must not enumerate providers, reveal location, expose internal identifiers, or return raw authorization reasons to unauthorized clients. | PRV-POL-026 | PRV-TST-030 | APPROVED |
| PRV-REQ-033 | Authenticated disclosure pages and payloads must not be indexed or placed in sitemaps, metadata, previews, canonical URLs, titles, or search caches. | PRV-POL-027 | PRV-TST-034 | APPROVED |
| PRV-REQ-034 | Support/finance/compliance/admin access is purpose-specific, order-specific, audited, and cannot bypass patient, tenant, order, or provider checks. | PRV-POL-028 | PRV-TST-024 | APPROVED |
| PRV-REQ-035 | Audit events record allowed/denied attempts, wrong-context attempts, replacement, recomputation, support access, map retrieval, suspected leak, and policy version with minimized payloads. | PRV-POL-029 | PRV-TST-005 | APPROVED |
| PRV-REQ-036 | Threat coverage spans browser, API, cache, map, telemetry, support, partner, future GraphQL, object serialization, field expansion, search, and providerDisplayName external lookup. | PRV-POL-030 | PRV-TST-035 | APPROVED |
| PRV-REQ-037 | Future tests include INTERACTIVE-IDE-BROWSER and PLAYWRIGHT-E2E coverage. | PRV-POL-031 | PRV-TST-001 | APPROVED |
| PRV-REQ-038 | Provider-disclosure tests use synthetic patients, providers, orders, locations, payments, browser artifacts, logs, traces, screenshots, videos, and reports only. | PRV-POL-032 | PRV-TST-001 | APPROVED |
| PRV-REQ-039 | Client-visible fixtures, mocks, snapshots, screenshots, traces, videos, and reports must not contain protected pre-payment provider details. | PRV-POL-032 | PRV-TST-032 | APPROVED |
| PRV-REQ-040 | P00-08 selects no payment, map, analytics, logging, or session-replay vendor and creates no implementation API, schema, migration, dependency, or browser tooling. | PRV-POL-033 | PRV-TST-035 | APPROVED |

## MarketplaceQuoteView

`MarketplaceQuoteView` is the patient-facing pre-payment resource. It contains or uses `PrePaymentProviderOfferView`. It is an explicit allow-list and not a provider object.

| Field ID | Field name | Type | Required | Purpose | Classification | Source context | Identifies provider | Reveals location | Browser | Validation | Synthetic example | Requirement |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PRV-FLD-001 | quoteId | Opaque string | Required | Quote reference | PAYMENT-DATA | Marketplace | No | No | Yes | Non-derivable and not provider-derived | quote_test_01 | PRV-REQ-011 |
| PRV-FLD-002 | quoteVersion | Version token | Required | Quote refresh/concurrency | SECURITY-OPERATIONAL-DATA | Marketplace | No | No | Yes | Changes only when regenerated | 3 | PRV-REQ-011 |
| PRV-FLD-003 | quoteType | Controlled text | Required | Pharmacy/lab category | SERVICE-DATA | Marketplace | No | No | Yes | Service category only | pharmacy_quote | PRV-REQ-006 |
| PRV-FLD-004 | providerDisplayName | Plain text | Required | Only pre-payment provider identity | PROVIDER-IDENTITY-LOCATION-DATA with allowance | Marketplace | Yes | Residual external lookup risk | Yes | No address/contact/URL/coordinate/markup/tracking/unapproved branch text | CareWell Pharmacy | PRV-REQ-009 |
| PRV-FLD-005 | selectionToken | Opaque string | Required | Select offer without provider ID | SECURITY-OPERATIONAL-DATA | Marketplace | No | No | Yes | Non-derivable and scoped; not authorization | sel_test_opaque_01 | PRV-REQ-013 |
| PRV-FLD-006 | availabilityStatus | Controlled text | Required | Selection availability | SERVICE-DATA | Marketplace | No | No | Yes | No stock-location or proximity encoding | available | PRV-REQ-002 |
| PRV-FLD-007 | fulfilmentModes | Controlled array | Optional | Non-identifying fulfilment choices | SERVICE-DATA | Marketplace | No | No | Yes | No pickup address, delivery origin, or collection instruction | delivery_available | PRV-REQ-002 |
| PRV-FLD-008 | estimatedFulfilmentWindow | Text/token | Optional | Payment decision support | SERVICE-DATA | Marketplace | No | Must not reveal proximity/branch hours | Yes | Generalized wording only | standard_window | PRV-REQ-002 |
| PRV-FLD-009 | quoteExpiresAt | Expiry token | Required | Prevent stale selection | SECURITY-OPERATIONAL-DATA | Marketplace | No | No | Yes | Configured policy; no numeric timeout approved | configured_expiry | PRV-REQ-013 |
| PRV-FLD-010 | currency | Currency code | Required | Explain amounts | PAYMENT-DATA | Marketplace | No | No | Yes | No provider identity encoded | NGN | PRV-REQ-002 |
| PRV-FLD-011 | itemSubtotal | Money | Required | Price decision | PAYMENT-DATA | Marketplace | No | No | Yes | Amount only | 12500 | PRV-REQ-002 |
| PRV-FLD-012 | platformOrDeliveryFee | Money | Optional | Fee decision | PAYMENT-DATA | Marketplace | No | No | Yes | Fee label must not reveal origin/branch | 1500 | PRV-REQ-002 |
| PRV-FLD-013 | coverageContribution | Money | Optional | Coverage contribution | PAYMENT-DATA | Plans/Marketplace | No | No | Yes | Does not grant sponsor/HMO/employer access | 5000 | PRV-REQ-020 |
| PRV-FLD-014 | patientPayableAmount | Money | Required | Patient amount due | PAYMENT-DATA | Marketplace | No | No | Yes | Derived from approved finance fields | 9000 | PRV-REQ-002 |
| PRV-FLD-015 | totalAmount | Money | Required | Total obligation | PAYMENT-DATA | Marketplace | No | No | Yes | No location metadata in labels | 14000 | PRV-REQ-002 |
| PRV-FLD-016 | nonIdentifyingPaymentTerms | Text array | Optional | Payment decision terms | PAYMENT-DATA | Marketplace | No | No | Yes | Reviewed terms only; no provider location | payment_required_before_details | PRV-REQ-002 |
| PRV-FLD-017 | permittedActions | Controlled array | Required | Safe user actions | SECURITY-OPERATIONAL-DATA | Marketplace | No | No | Yes | Does not imply authorization | select_quote,pay | PRV-REQ-011 |

### Explicit Pre-Payment Deny-List

`MarketplaceQuoteView` must not contain providerId, organizationId, facilityId, branchId, serviceLocationId, provider slug, branch slug, address, address components, locality, city, postal code, coordinates, geohash, approximate distance, precise distance, bearing, rank score that reveals proximity, map data, map pin, provider-specific bounds, contact data, telephone number, email address, website, external links, photographs, directions, route data, collection instructions, pickup instructions, delivery-origin information, raw provider object, internal matching features, internal inventory-location data, or derivable metadata.

```json
{
  "quoteId": "quote_test_01",
  "quoteVersion": 3,
  "quoteType": "pharmacy_quote",
  "providerDisplayName": "CareWell Pharmacy",
  "selectionToken": "sel_test_opaque_01",
  "availabilityStatus": "available",
  "fulfilmentModes": ["delivery_available"],
  "estimatedFulfilmentWindow": "standard_window",
  "quoteExpiresAt": "configured_expiry",
  "currency": "NGN",
  "itemSubtotal": 12500,
  "platformOrDeliveryFee": 1500,
  "coverageContribution": 5000,
  "patientPayableAmount": 9000,
  "totalAmount": 14000,
  "nonIdentifyingPaymentTerms": ["payment_required_before_details"],
  "permittedActions": ["select_quote", "pay"]
}
```

## AuthorizedFulfilmentLocationView

`AuthorizedFulfilmentLocationView` is the post-payment, order-specific resource corresponding to the authorized portion of `AuthorizedPostPaymentFulfilmentView`. It is retrieved by order context, not by raw provider ID.

| Field ID | Field name | Required | Purpose | Minimum necessary justification | Actor visibility | Order relationship | Cache/log/audit/recompute rule | Classification |
|---|---|---|---|---|---|---|---|---|
| PRV-FLD-018 | orderId | Required | Bind retrieval to exact selected order | Prevents provider-ID lookup | Authorized actor/support by policy | Exact selected order | no-store; audit allowed/denied; recompute every retrieval | PAYMENT-DATA |
| PRV-FLD-019 | providerDisplayName | Required | Continuity from selected offer | Identifies selected provider | Authorized actor only | Exact selected provider/order | no-store; audit if retrieved; recompute on replacement/refund/context change | PROVIDER-IDENTITY-LOCATION-DATA |
| PRV-FLD-020 | approvedLegalOrFacilityName | Optional | Confirm fulfilment entity | Legal/operational need | Authorized actor only | Exact selected provider/order | no-store; minimized logs; audit if retrieved | PROVIDER-IDENTITY-LOCATION-DATA |
| PRV-FLD-021 | approvedBranchName | Optional | Identify selected branch | Required only if branch-specific fulfilment | Authorized actor only | Exact selected provider/order | no-store; no unrelated branch data | PROVIDER-IDENTITY-LOCATION-DATA |
| PRV-FLD-022 | structuredAddress | Optional | Pickup/visit/delivery handoff | Needed to complete selected order | Authorized actor only | Exact selected provider/order | no-store; avoid duplicate logs; recompute on replacement/cancel | PROVIDER-IDENTITY-LOCATION-DATA |
| PRV-FLD-023 | coordinates | Optional | Selected-order map/route | Needed only for authorized map | Authorized actor only | Exact selected provider/order | no-store; map audit; no alternatives | PROVIDER-IDENTITY-LOCATION-DATA |
| PRV-FLD-024 | mapPosition | Optional | Display selected location | Needed for authorized map UI | Authorized actor only | Exact selected provider/order | no-store; map audit; no alternative pins | PROVIDER-IDENTITY-LOCATION-DATA |
| PRV-FLD-025 | directionsOrRouteDeepLink | Optional | Route guidance | Minimum selected-order route | Authorized actor only | Exact selected provider/order | no-store; map audit; recompute on request | PROVIDER-IDENTITY-LOCATION-DATA |
| PRV-FLD-026 | orderSpecificContactChannel | Optional | Fulfilment communication | Prefer scoped channel over general contact | Authorized actor only | Exact selected provider/order | no-store; audit if shown | PROVIDER-IDENTITY-LOCATION-DATA |
| PRV-FLD-027 | collectionOrVisitInstructions | Optional | Complete selected order | Minimum operational instruction | Authorized actor only | Exact selected provider/order | no-store; audit if shown; recompute on replacement | PROVIDER-IDENTITY-LOCATION-DATA; SERVICE-DATA |
| PRV-FLD-028 | openingOrAppointmentInformation | Optional | Attendance timing | Needed for selected appointment/order | Authorized actor only | Exact selected provider/order | no-store; no unrelated schedule | SERVICE-DATA |
| PRV-FLD-029 | deliveryOriginInformation | Optional | Delivery handoff | Needed only for authorized delivery | Authorized delivery participant/patient by policy | Exact selected order | no-store; audit if shown | PROVIDER-IDENTITY-LOCATION-DATA |
| PRV-FLD-030 | accessibilityInformation | Optional | Access needs | Needed for selected location | Authorized actor only | Exact selected provider/order | no-store; audit if shown | SERVICE-DATA |
| PRV-FLD-031 | fulfilmentMode | Required | Authorized mode | Needed to complete order | Authorized actor only | Exact selected provider/order | no-store; no hidden provider details | SERVICE-DATA |
| PRV-FLD-032 | orderSpecificOperationalInstructions | Optional | Safe order completion | Minimum operational instruction | Authorized actor only | Exact selected provider/order | no-store; no internal notes | SERVICE-DATA |
| PRV-FLD-033 | disclosurePolicyVersion | Required | Record policy | Audit and traceability | Authorized actor/support audit | Exact decision | no-store; audit required | SECURITY-OPERATIONAL-DATA |
| PRV-FLD-034 | disclosureTimestamp | Required | Record disclosure time | Audit and traceability | Authorized actor/support audit | Exact decision | no-store; future retrieval still recomputes | SECURITY-OPERATIONAL-DATA |

## Selection Contract

- `selectionToken` is opaque, non-derivable, quote-scoped, actor-scoped, patient-scoped, tenant-scoped, intended-service-scoped, configured-expiry, single-purpose, and server-validated.
- It is not authorization, payment evidence, provider-detail unlock evidence, or a reusable provider lookup key.
- Duplicate selection is idempotent only within the same actor/patient/tenant/quote/order context.
- Expired, wrong-actor, wrong-patient, wrong-tenant, tampered, reused, or stale tokens are denied and audited.
- Provider withdrawal or replacement requires safe rematch/replacement and a new policy decision.

## Retrieval Contract

- Retrieval is order-based, not provider-based.
- No patient-facing endpoint accepts a raw provider ID, organization ID, facility ID, branch ID, or service-location ID to retrieve location.
- Authorization is recomputed server-side on every request.
- A token, order ID, browser route, success page, or local paid flag alone is insufficient.
- Protected responses are private and no-store.
- Denial responses are non-enumerable and do not reveal provider existence, location, or internal identifiers.

## ProviderDetailDisclosureDecision

Inputs: authenticated actor, actor session validity, actor-to-order authorization, actor-to-patient relationship, active tenant context, order tenant, exact order identifier, order version, selected provider, selected provider version/replacement status, patient identifier, quote/selection relationship, financial or approved-coverage evidence, financial evidence verification source, reconciliation status, order cancellation status, provider replacement status, fulfilment status, consent/delegation where required, and policy version.

Outcomes are conceptual policy results, not database or API enums: `ALLOW`, `DENY-NOT-ELIGIBLE`, `DENY-UNAUTHORIZED`, `DENY-CONTEXT-MISMATCH`, `DENY-ORDER-MISMATCH`, `DENY-PROVIDER-MISMATCH`, `REVIEW-REQUIRED`.

## Actor Matrix

| Actor | Pre-payment name visibility | Quote selection | Payment | Post-payment detail retrieval | Support access | Map access |
|---|---|---|---|---|---|---|
| Patient | Yes | Own eligible quote | Own order | Own eligible selected order after ALLOW | Own case | Selected order after ALLOW |
| Clinical proxy | Delegation-dependent | Delegation-dependent | Delegation-dependent | Delegation-dependent | Purpose-specific | Selected order after ALLOW |
| Delegated caregiver | Delegation-dependent | Delegation-dependent | Delegation-dependent | Delegation-dependent | Purpose-specific | Selected order after ALLOW |
| Family payer | Funding-flow only | If approved | If approved | No access merely by paying | Purpose-specific | Denied unless separately authorized |
| Diaspora sponsor | Funding-flow only | If approved | If approved | No access merely by funding | Purpose-specific | Denied unless separately authorized |
| Employer administrator | Minimum funding data only | Deferred | Deferred | Denied by default | Purpose-specific if approved | Denied |
| HMO administrator | Minimum coverage data only | Deferred | Coverage workflow | Denied by default | Purpose-specific if approved | Denied |
| Platform support operator | No browsing access | Assist only | No default payment authority | Purpose-specific order access only | Required reason/audit | Only if policy allows |
| Platform finance operator | Payment data only | No | Finance operations | No general location access | Finance purpose only | Denied unless separately authorized |
| Compliance officer | No general browsing | No | No | Purpose-specific compliance access only | Required reason/audit | Denied unless separately authorized |
| Platform administrator | No universal access | No | No | Denied without purpose-specific order access | Exceptional audited operation only | Denied unless separately authorized |
| Provider staff | Own operational view | Provider workflows | Settlement workflows | Own operational order data, not patient endpoint | Provider support case | Own facility tools |
| Delivery participant | No | No | No | Minimum pickup/origin data after authorization | Delivery purpose only | Route data if authorized |

## State and Failure Matrix

| Condition | Initial eligibility | Future retrieval | User-visible outcome | Operations action | Audit action | Approval |
|---|---|---|---|---|---|---|
| Created/initiated/requires action/awaiting action/processing/pending | No | Deny | Details unavailable | Payment follow-up | DisclosureDenied | APPROVED |
| Authorization-only | No unless P00-13 later approves | Deny by default | Details unavailable | Finance review | DisclosureDenied | REQUIRES_APPROVAL |
| Captured/settled/confirmed transfer/approved guarantee/approved HMO obligation | Candidate only | Requires policy decision | Depends on ALLOW | None if coherent | EligibilityEvaluated | REQUIRES_APPROVAL until P00-13 |
| Failed/cancelled/expired/abandoned/unverified | No | Deny | Payment failed or expired | Retry/cancel/support | DisclosureDenied | APPROVED |
| Wrong order/actor/patient/tenant | No | Deny non-enumerably | Not found or unavailable | Security review if suspicious | WrongContextAttempt | APPROVED |
| Reconciliation exception | No | REVIEW-REQUIRED or deny | Under review | Finance/security queue | ReconciliationReview | APPROVED |
| Refunded/reversed/chargeback | Never creates initial eligibility | Recompute; ambiguous future access REVIEW-REQUIRED or deny | Under review | Finance/legal/security review | RefundDisclosureReview | REQUIRES_APPROVAL |
| Provider replaced | Old provider not automatically visible | Fresh decision required | Replacement notice | Operations review | ProviderReplacement | APPROVED |
| Order cancelled | No new access | Recompute | Order cancelled | Operations/finance review | DisclosureRecomputed | APPROVED |
| Logout/session expired | No session access | Fresh authentication and policy decision | Sign in again | None unless suspicious | SessionEnded where observable | APPROVED |

## Error Contract

Errors cover own order not eligible, wrong actor, wrong patient, wrong tenant, unknown order, guessed order ID, replaced provider, cancelled order, reconciliation exception, revoked delegation, expired session, rate limit, and unsupported state. Unauthorized or cross-context clients receive non-enumerating responses. A patient accessing their own unpaid order may receive a safe message that details remain unavailable until the approved payment condition. Raw authorization reasons are not returned to unauthorized clients.

## Cache Contract

Protected post-payment responses are private, non-shared, and no-store. Shared CDN, public cache, service-worker cache, protected local storage, protected URL state, and protected route parameters are prohibited. Logout, account switch, patient-context switch, tenant switch, authorization loss, and multiple-tab refresh require fresh authorization.

## Telemetry Contract

Pre-payment logs, analytics, error reports, session replay, console output, traces, screenshots, videos, source maps, and test reports must not contain protected provider details. Post-payment observability records access decisions and references, not repeated full address/coordinate payloads unless an approved audit need exists.

## Map Contract

Before authorization, no provider coordinates, map pins, provider-centered bounds, routes, distance, direction, radius rings, hidden coordinates, browser-side distance calculation, or map-provider requests for provider locations are allowed. After authorization, only the selected provider for the exact order may be mapped.

## Audit Contract

Conceptual audit events include PrePaymentOfferGenerated, PrePaymentContractSerialized, OfferSelected, DisclosureEligibilityEvaluated, DisclosureDenied, DisclosureAllowed, PostPaymentDetailsRetrieved, WrongOrderAttempt, WrongPatientAttempt, WrongTenantAttempt, WrongActorAttempt, ProviderReplacement, DisclosureAccessRecomputed, RefundOrReversalReviewTriggered, SupportAccessGranted, SupportAccessDenied, MapDetailsRetrieved, ProtectedResponseClearedOnLogout where observable, SuspectedPrePaymentLeak, and DisclosurePolicyVersionChanged. Audit payloads are minimized.

## Contract Invariants

| Policy ID | Name | Rule | Status |
|---|---|---|---|
| PRV-POL-001 | Pre-payment allow-list | MarketplaceQuoteView returns only explicitly approved allow-list fields; providerDisplayName is the only provider identity field. | APPROVED |
| PRV-POL-002 | Pre-payment deny-list | Protected identifiers, addresses, coordinates, distance, maps, contacts, instructions, internal data, and derivable metadata are blocked before serialization. | APPROVED |
| PRV-POL-003 | Server serialization boundary | Filtering occurs before HTML, API, GraphQL, hydration, JavaScript state, DOM, storage, logs, telemetry, map calls, screenshots, traces, or reports can receive data. | APPROVED |
| PRV-POL-004 | Pharmacy and lab coverage | The rule applies to pharmacy and laboratory matching, quotes, selection, fulfilment, appointments, visit, and collection instructions. | APPROVED |
| PRV-POL-005 | Clinical safety exception | Hospital referral, urgent, emergency, and transfer guidance are never blocked by marketplace privacy controls. | APPROVED |
| PRV-POL-006 | Projection mapping | MarketplaceQuoteView maps to PrePaymentProviderOfferView; AuthorizedFulfilmentLocationView maps to AuthorizedPostPaymentFulfilmentView. | APPROVED |
| PRV-POL-007 | providerDisplayName validation | Display names are plain text and must not contain address, contact, URL, coordinate, hidden metadata, markup, tracking, or unapproved branch identifiers. | APPROVED |
| PRV-POL-008 | MarketplaceQuoteView contract | The pre-payment resource is an explicit allow-list and rejects inherited provider objects. | APPROVED |
| PRV-POL-009 | Forbidden pre-payment fields | Forbidden fields include provider/facility/branch IDs, slugs, address, locality, city, coordinates, distance, map, contact, directions, instructions, origin, raw provider object, matching features, and stock-location data. | APPROVED |
| PRV-POL-010 | Opaque selection token | Selection token is scoped, non-derivable, server-validated, single-purpose, configured-expiry, and never authorization or payment evidence. | APPROVED |
| PRV-POL-011 | Authorized fulfilment view | Post-payment detail retrieval is selected-order and minimum-necessary only. | APPROVED |
| PRV-POL-012 | Separate resources | Pre-payment and post-payment resources do not share full provider serializers or generic provider DTOs. | APPROVED |
| PRV-POL-013 | Field expansion gate | Any pre-payment field addition requires privacy, security, contract, classification, negative-test, and traceability review. | APPROVED |
| PRV-POL-014 | Disclosure decision | Every protected retrieval evaluates ProviderDetailDisclosureDecision server-side with current context. | APPROVED |
| PRV-POL-015 | Exact-order scope | One payment or coverage obligation cannot unlock other orders, providers, quotations, patients, beneficiaries, or tenants. | APPROVED |
| PRV-POL-016 | Actor purpose limits | Payers, sponsors, employers, HMOs, support, administrators, provider staff, and delivery participants receive only purpose-specific access. | APPROVED |
| PRV-POL-017 | Financial evidence unresolved | Final financial evidence is deferred to P00-13 and deny-by-default until approved. | REQUIRES_APPROVAL |
| PRV-POL-018 | Never-initial states | Failed, pending, cancelled, expired, abandoned, unverified, wrong-bound, refund, reversal, chargeback, and client success states never create initial eligibility. | APPROVED |
| PRV-POL-019 | Refund recomputation | Refund/reversal/chargeback after valid disclosure triggers recomputation; future access remains approval-gated. | REQUIRES_APPROVAL |
| PRV-POL-020 | Retrieval duration | Provider-detail access is not permanent; each retrieval recomputes authorization. | APPROVED |
| PRV-POL-021 | Provider replacement | Replacement provider access requires a fresh exact-order decision. | APPROVED |
| PRV-POL-022 | Map boundary | Before authorization no provider-specific map data leaves backend; after authorization map access is selected-order specific. | APPROVED |
| PRV-POL-023 | No-store protected response | Protected responses are private and non-shared with no-store handling. | APPROVED |
| PRV-POL-024 | Client-state clearing | Protected details are not stored in local storage, URLs, route params, or stale client state. | APPROVED |
| PRV-POL-025 | Telemetry minimization | Analytics, logs, errors, traces, screenshots, videos, session replay, and reports must not receive protected pre-payment details. | APPROVED |
| PRV-POL-026 | Safe error behavior | Errors are non-enumerable and do not reveal provider existence, location, identifiers, or raw authorization reasons. | APPROVED |
| PRV-POL-027 | Search restrictions | Authenticated disclosure pages and payloads are not indexable and protected details are absent from metadata/preview surfaces. | APPROVED |
| PRV-POL-028 | Support purpose access | Support and administrators require purpose-specific, order-specific, audited access and cannot bypass checks. | APPROVED |
| PRV-POL-029 | Disclosure audit | Allowed and denied disclosure attempts are audited with minimized payloads and policy version. | APPROVED |
| PRV-POL-030 | Threat coverage | Threat model covers browser, API, cache, map, telemetry, support, partner, serialization, field expansion, search, and display-name lookup. | APPROVED |
| PRV-POL-031 | Browser testing | Future implementation requires INTERACTIVE-IDE-BROWSER and PLAYWRIGHT-E2E coverage. | APPROVED |
| PRV-POL-032 | Synthetic testing | All provider-disclosure testing and artifacts use synthetic data only. | APPROVED |
| PRV-POL-033 | No vendor or implementation selection | P00-08 creates documentation only and no vendor/API/schema/dependency/tooling implementation. | APPROVED |


## P00-13 Finance Alignment

- `OrderFundingSecured` is the PROPOSED finance input to provider-disclosure evaluation, not an approved implementation event and not a provider-detail response.
- `ProviderDetailDisclosureDecision` remains the separate access authority and must evaluate exact order, selected provider, actor, patient, tenant, current authorization, no-store handling, deny-by-default behavior, and policy version server-side.
- `ProviderDetailDisclosureEligibilityEstablished` remains separate from payment, ledger, browser success, redirect, webhook, authorization, settlement, claim, remittance, and payout state.
- Refund, reversal, chargeback, cancellation, provider replacement, reconciliation exception, and legal/safety/support purpose changes trigger recomputation; final post-refund retrieval outcomes remain approval-gated.
- No finance event, ledger entry, analytics event, log, trace, screenshot, browser payload, map request, cache entry, hidden DOM, or accessibility tree may contain protected pre-payment provider details.
- P00-12 legal conflict around provider display and minimum disclosure remains unresolved and launch-gated; P00-13 does not alter the locked providerDisplayName-only pre-payment rule.

## P00-14 verification alignment

The disclosure contract must be verified at server and browser boundaries. Pre-payment contract compliance cannot be established by masking or omitting visible UI elements only; prohibited fields must be absent from responses, serialized state, browser storage, network traffic, telemetry, accessibility trees, caches, screenshots, traces, and other artifacts. Post-payment disclosure remains exact-authorized-order scoped.
