# Provider Disclosure Test Matrix

## Document Control

| Field | Value |
|---|---|
| Document title | Provider disclosure test matrix |
| Codex prompt ID | P00-08 |
| Complete Breakdown work package | P00-10 Pharmacy and laboratory disclosure contract |
| Issue ID | P00-PRV-001 |
| Owner role | QA lead + Security lead |
| Review state | PROPOSED |
| Required reviewers | Security lead, Privacy counsel, Architecture lead, Product owner, Finance owner, Pharmacy operations lead, Laboratory operations lead, Accessibility reviewer |
| Last updated | 2026-06-24 |

## Test Types

- INTERACTIVE-IDE-BROWSER
- PLAYWRIGHT-E2E
- API-CONTRACT
- INTEGRATION
- SECURITY-PRIVACY
- ACCESSIBILITY
- MANUAL-OPERATIONS
- OBSERVABILITY-INSPECTION
- CACHE-VALIDATION
- THREAT-REHEARSAL

## Test Schema

Every `PRV-TST-*` scenario must include: test ID, requirement ID, threat ID, title, test type, scope, preconditions, synthetic actors, synthetic provider, synthetic order, synthetic financial condition, steps, expected response fields, prohibited response fields, expected DOM state, expected accessibility-tree state, expected browser-storage state, expected network behavior, expected map behavior, expected cache behavior, expected analytics behavior, expected logging behavior, expected audit behavior, expected authorization result, expected user-visible result, cleanup, automation candidate, owning implementation phase, and approval dependency.

## Test Catalogue

Each row below inherits the full test schema above. Implementation must expand each row into executable assertions when the relevant surface exists.

| Test ID | Requirement ID | Threat ID | Title | Test type | Required assertions |
|---|---|---|---|---|---|
| PRV-TST-001 | PRV-REQ-001 | PRV-THR-001 | Pharmacy pre-payment contract | PLAYWRIGHT-E2E | `providerDisplayName` present; approved fields only; all prohibited fields absent from response, DOM, a11y tree, storage, network, map, telemetry, logs, screenshots, traces, reports |
| PRV-TST-002 | PRV-REQ-003 | PRV-THR-002 | Laboratory pre-payment contract | API-CONTRACT | Lab quote mirrors pharmacy protections across HTML/API/GraphQL if used/hydration/source/state/cache |
| PRV-TST-003 | PRV-REQ-014 | PRV-THR-015 | Pharmacy post-payment contract | INTEGRATION | Exact selected paid order may receive approved details; unrelated provider/order/patient/tenant denied |
| PRV-TST-004 | PRV-REQ-014 | PRV-THR-016 | Laboratory post-payment contract | INTEGRATION | Exact selected lab order may receive approved visit/collection details after policy ALLOW |
| PRV-TST-005 | PRV-REQ-019 | PRV-THR-015 | Exact-order authorization | SECURITY-PRIVACY | One order cannot unlock another order, quote, provider, patient, tenant, or replacement provider |
| PRV-TST-006 | PRV-REQ-020 | PRV-THR-019 | Actor authorization | SECURITY-PRIVACY | Patient allowed where eligible; sponsor, family payer, employer, HMO, support, admin denied unless purpose-specific authorization exists |
| PRV-TST-007 | PRV-REQ-018 | PRV-THR-016 | Patient isolation | SECURITY-PRIVACY | Modified patient context and another patient account are denied non-enumerably |
| PRV-TST-008 | PRV-REQ-018 | PRV-THR-017 | Tenant isolation | SECURITY-PRIVACY | Modified tenant context and cross-tenant access are denied non-enumerably |
| PRV-TST-009 | PRV-REQ-019 | PRV-THR-011 | Provider isolation | SECURITY-PRIVACY | Direct provider/facility/branch ID retrieval unavailable; unselected providers remain protected |
| PRV-TST-010 | PRV-REQ-013 | PRV-THR-028 | Quote and selection-token isolation | API-CONTRACT | Expired, tampered, stale, reused, wrong-actor, wrong-patient, wrong-tenant tokens denied |
| PRV-TST-011 | PRV-REQ-023 | PRV-THR-025 | Payment-state handling | INTEGRATION | Created, initiated, requires action, awaiting action, processing, pending, authorization-only, abandoned, failed, cancelled, expired, unverified, wrong-bound, reconciliation exception, and client success do not create eligibility |
| PRV-TST-012 | PRV-REQ-024 | PRV-THR-032 | Refund, reversal, and chargeback review | INTEGRATION | Refund/reversal/chargeback never create initial eligibility; prior disclosure recomputes; future result remains approval-gated |
| PRV-TST-013 | PRV-REQ-026 | PRV-THR-030 | Provider replacement | INTEGRATION | Replacement requires fresh decision; old and alternative provider details remain protected |
| PRV-TST-014 | PRV-REQ-025 | PRV-THR-009 | Logout and session expiry | PLAYWRIGHT-E2E | Logout/session expiry require fresh authentication and policy decision |
| PRV-TST-015 | PRV-REQ-030 | PRV-THR-010 | Browser back and stale tabs | INTERACTIVE-IDE-BROWSER | Browser back/stale tabs do not reveal another session or stale protected data |
| PRV-TST-016 | PRV-REQ-030 | PRV-THR-007 | Browser storage | INTERACTIVE-IDE-BROWSER | localStorage, sessionStorage, IndexedDB, URL, query string, fragment, and referrer contain no protected fields |
| PRV-TST-017 | PRV-REQ-029 | PRV-THR-036 | Cache and CDN | CACHE-VALIDATION | Private no-store behavior; no shared CDN/SSR/browser cache disclosure |
| PRV-TST-018 | PRV-REQ-029 | PRV-THR-039 | Service worker | CACHE-VALIDATION | Service worker does not cache protected payloads |
| PRV-TST-019 | PRV-REQ-027 | PRV-THR-040 | Map and geocoding | PLAYWRIGHT-E2E | No pre-payment provider coordinates, map pin, route, viewport, bounds, or map-provider request; selected-order map only after ALLOW |
| PRV-TST-020 | PRV-REQ-031 | PRV-THR-048 | Analytics | OBSERVABILITY-INSPECTION | Analytics payloads omit protected fields and provider location |
| PRV-TST-021 | PRV-REQ-031 | PRV-THR-050 | Error reporting | OBSERVABILITY-INSPECTION | Error payloads omit raw contract payloads and provider/location data |
| PRV-TST-022 | PRV-REQ-031 | PRV-THR-049 | Session replay | OBSERVABILITY-INSPECTION | Replay disabled/masked on disclosure surfaces; no protected data captured |
| PRV-TST-023 | PRV-REQ-031 | PRV-THR-052 | Logs and traces | OBSERVABILITY-INSPECTION | Console, app logs, access logs, traces, screenshots, videos, and reports omit protected fields unless controlled post-payment artifact |
| PRV-TST-024 | PRV-REQ-034 | PRV-THR-023 | Support and administrator access | MANUAL-OPERATIONS | Support/admin require purpose-specific order access and audit; unrelated browsing denied |
| PRV-TST-025 | PRV-REQ-003 | PRV-THR-006 | Accessibility | ACCESSIBILITY | A11y tree contains no protected pre-payment fields; post-payment details keyboard accessible after ALLOW |
| PRV-TST-026 | PRV-REQ-037 | PRV-THR-054 | Mobile viewport | PLAYWRIGHT-E2E | Mobile layout preserves privacy boundary and no hidden map/detail leak |
| PRV-TST-027 | PRV-REQ-037 | PRV-THR-054 | Tablet viewport | PLAYWRIGHT-E2E | Tablet layout preserves privacy boundary |
| PRV-TST-028 | PRV-REQ-037 | PRV-THR-054 | Desktop viewport | PLAYWRIGHT-E2E | Desktop layout preserves privacy boundary |
| PRV-TST-029 | PRV-REQ-021 | PRV-THR-027 | Low bandwidth and delayed callback | INTERACTIVE-IDE-BROWSER | Delayed callback, refresh, pending payment, and direct success route do not unlock |
| PRV-TST-030 | PRV-REQ-032 | PRV-THR-014 | Direct endpoint access | API-CONTRACT | Guessed IDs, wrong contexts, and direct endpoints deny without enumerating provider existence |
| PRV-TST-031 | PRV-REQ-032 | PRV-THR-014 | Enumeration and rate abuse | SECURITY-PRIVACY | Repeated guesses audited/rate-limited by later implementation; no location or identifiers returned |
| PRV-TST-032 | PRV-REQ-016 | PRV-THR-058 | Contract-field regression | API-CONTRACT | Test fails if provider object is spread, unknown provider fields serialize, GraphQL overfetch exposes fields, mapper default includes protected fields, or client receives hidden protected data |
| PRV-TST-033 | PRV-REQ-004 | PRV-THR-062 | Partner payload filtering | INTEGRATION | Partner full payload filtered before patient client boundary |
| PRV-TST-034 | PRV-REQ-033 | PRV-THR-064 | Search and indexing | SECURITY-PRIVACY | No protected payloads in sitemap, metadata, preview, canonical URL, title, or search cache |
| PRV-TST-035 | PRV-REQ-036 | PRV-THR-065 | Privacy-incident rehearsal | THREAT-REHEARSAL | Leak, telemetry capture, cache leak, or display-name external lookup escalates through incident review |

## Mandatory Pre-Payment Assertions

Before payment, tests must prove:

- `providerDisplayName` is present.
- Approved non-identifying commercial fields may be present.
- `providerId`, `organizationId`, `facilityId`, `branchId`, `serviceLocationId`, address, address components, locality, postal code, coordinates, geohash, distance, bearing, rank features revealing proximity, map pin, provider-specific map bounds, directions, route data, contact details, telephone number, email address, website, photographs, external links, pickup instructions, collection instructions, delivery-origin information, internal stock location, internal provider metadata, and derivable location metadata are absent.

Assert absence from rendered text, DOM, DOM attributes, hidden DOM, accessibility tree, page source, API payload, GraphQL response if later used, hydration payload, JavaScript state, browser local storage, browser session storage, IndexedDB, browser cache, service-worker cache, URL, query string, fragment, referrer, map requests, geocoding requests, analytics events, error-reporting events, session replay, console logs, server logs, browser traces, screenshots, videos, client fixtures, and test reports.

## Mandatory Post-Payment Assertions

- Exact selected order allows approved details only after policy `ALLOW`.
- Exact selected provider is returned.
- Another order, quotation, provider, patient, tenant, actor, sponsor, family payer, employer administrator, HMO administrator, support operator without purpose, platform administrator without purpose, direct provider ID retrieval, guessed order ID, modified patient context, modified tenant context, stale token, and reused token are denied.
- Logout requires fresh authorization.
- Browser back, stale tabs, shared cache, and alternative provider coordinates do not reveal protected data.
- Audit records successful and denied retrievals.

## Mandatory Financial-State Assertions

Created, initiated, requires action, awaiting action, processing, pending, authorization-only, abandoned, failed, cancelled, expired, unverified, wrong order, wrong actor, wrong patient, wrong tenant, reconciliation exception, refunded, reversed, and chargeback states do not create initial eligibility.

After prior valid disclosure and later refund, reversal, or chargeback, tests confirm policy recomputes, access is not silently left enabled, the expected result remains approval-gated, and an operations/review path exists. P00-08 does not assert a final allow or deny rule for the post-refund future-access case.

## Mandatory Map Assertions

Before payment:

- No provider coordinates sent to browser.
- No provider coordinates sent to map provider.
- No provider-specific map pin.
- No route request.
- No viewport centered on provider.
- No provider-specific bounds.
- No browser distance calculation.
- No hidden location attributes.

After payment:

- Only selected provider may be mapped.
- Map call occurs after authorization.
- Another provider is absent.
- Route deep link contains only approved selected-order data.
- Logout and context change prevent stale reuse.

## Mandatory Cache Assertions

- Cache-Control behavior prevents shared caching.
- Shared CDN does not cache.
- Browser cache does not serve protected data to another session.
- Service worker does not cache protected payload.
- Account switch clears protected state.
- Patient-context switch clears protected state.
- Tenant switch clears protected state.
- Logout clears client state.
- Back navigation does not reveal stale protected content.
- Multiple tabs revalidate authorization.

## Mandatory Telemetry Assertions

Inspect analytics payload, error-reporting payload, console output, application logs, access logs, browser traces, screenshots, videos, session replay, and test reports. Protected fields must be absent before payment and controlled after authorization.

## Mandatory Contract Regression Tests

Tests must fail when:

- A provider object is spread into MarketplaceQuoteView.
- A protected field is added to the pre-payment schema.
- A serializer returns unknown provider fields.
- A GraphQL selection exposes protected fields if GraphQL is later used.
- An ORM or mapper default includes protected fields.
- A frontend receives but does not display a protected field.
- A map component initializes with provider coordinates before authorization.
- An analytics event includes provider location.
- An error includes raw provider payload.
- A test fixture includes protected provider details in client-visible data.

## Browser Access Requirements

Future implementation uses both interactive browser access from Codex in the IDE and deterministic Playwright Test coverage. Interactive inspection includes browser network panel, DOM, accessibility tree, storage, cache, console, failed requests, map calls, analytics calls, and error-reporting calls. Playwright tests assert the same privacy boundaries. P00-08 does not install browser tooling.

## Synthetic Data Rules

All tests use synthetic patients, providers, orders, locations, and payments. Controlled server-side synthetic fixtures may contain synthetic address and coordinates to prove filtering, but protected fixture fields must never be exported into browser fixtures, snapshots, traces, screenshots, videos, or reports. Browser artifacts are treated as sensitive and require controlled retention.

## PRV Traceability Matrix

| Requirement range | Test coverage | Threat coverage | Approval dependency | Implementation phase |
|---|---|---|---|---|
| PRV-REQ-001 to PRV-REQ-006 | PRV-TST-001, PRV-TST-002, PRV-TST-032 | PRV-THR-001 to PRV-THR-008, PRV-THR-055 to PRV-THR-058 | Security/privacy review | P01/P00-14 |
| PRV-REQ-007 | PRV-TST-035 | PRV-THR-064 | Clinical safety review | P00-09 |
| PRV-REQ-008 to PRV-REQ-016 | PRV-TST-010, PRV-TST-032 | PRV-THR-028, PRV-THR-055 to PRV-THR-058 | Architecture/security review | P01 |
| PRV-REQ-017 to PRV-REQ-020 | PRV-TST-005 to PRV-TST-009, PRV-TST-024 | PRV-THR-011 to PRV-THR-024 | Privacy/security/access review | P01/P00-11 |
| PRV-REQ-021 to PRV-REQ-024 | PRV-TST-011, PRV-TST-012, PRV-TST-029 | PRV-THR-025 to PRV-THR-035 | Finance/legal approval | P00-13 |
| PRV-REQ-025 to PRV-REQ-030 | PRV-TST-013 to PRV-TST-019 | PRV-THR-009, PRV-THR-010, PRV-THR-030 to PRV-THR-042 | Security/architecture review | P01/P00-14 |
| PRV-REQ-031 to PRV-REQ-035 | PRV-TST-020 to PRV-TST-024, PRV-TST-034 | PRV-THR-048 to PRV-THR-064 | Privacy/security/operations approval | P00-14/P00-15 |
| PRV-REQ-036 to PRV-REQ-040 | PRV-TST-001 to PRV-TST-035 | PRV-THR-001 to PRV-THR-065 | Phase gate and QA approval | P00-14/P00-17 |


## P00-13 Finance Alignment

- `OrderFundingSecured` is the PROPOSED finance input to provider-disclosure evaluation, not an approved implementation event and not a provider-detail response.
- `ProviderDetailDisclosureDecision` remains the separate access authority and must evaluate exact order, selected provider, actor, patient, tenant, current authorization, no-store handling, deny-by-default behavior, and policy version server-side.
- `ProviderDetailDisclosureEligibilityEstablished` remains separate from payment, ledger, browser success, redirect, webhook, authorization, settlement, claim, remittance, and payout state.
- Refund, reversal, chargeback, cancellation, provider replacement, reconciliation exception, and legal/safety/support purpose changes trigger recomputation; final post-refund retrieval outcomes remain approval-gated.
- No finance event, ledger entry, analytics event, log, trace, screenshot, browser payload, map request, cache entry, hidden DOM, or accessibility tree may contain protected pre-payment provider details.
- P00-12 legal conflict around provider display and minimum disclosure remains unresolved and launch-gated; P00-13 does not alter the locked providerDisplayName-only pre-payment rule.

## P00-14 browser and artifact-boundary alignment

P00-14 extends the provider-disclosure tests into `docs/testing/privacy-boundary-tests.md` and `docs/testing/browser-validation-strategy.md`. The existing P00-08 disclosure tests remain authoritative for the disclosure contract; P00-14 adds future verification surfaces for HTML, API responses, GraphQL responses if used, JavaScript state, hydration payloads, browser storage, source output, network requests, map-provider requests, analytics events, error-reporting events, logs, cache entries, accessibility trees, hidden DOM elements, image metadata, test fixtures, screenshots, browser traces, and configured videos.

The P00-14 strategy does not permit UI-only hiding. A pre-payment provider privacy test passes only if prohibited provider details are absent from the client-facing surface and from captured artifacts.
