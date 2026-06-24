# P00-14 Privacy Boundary Tests

## Document Control

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Status | DRAFT-PENDING-SECURITY-ARCHITECTURE-QA-ACCESSIBILITY-PRIVACY-AND-OPERATIONS-APPROVAL |
| Phase | P00-14 |
| Issue | P00-NFR-001 |
| Effective status | Not effective until approved by security, architecture, QA, accessibility, privacy, and operations owners |
| Scope | Privacy-boundary test design only |
| Exclusions | No test code, fixtures, browser execution, browser tooling, dependency installation, or application implementation |
| Review authority | Privacy owner, security owner, architecture owner, QA owner, operations owner, and clinical safety owner for clinical boundaries |
| Related documents | `docs/contracts/provider-disclosure-contract.md`, `docs/security/provider-disclosure-threat-model.md`, `docs/testing/provider-disclosure-test-matrix.md`, `docs/testing/browser-validation-strategy.md` |

## Non-Assertion Notice

This document defines tests that must later be implemented. It does not prove current software behavior because Phase 0 has no production application implementation. Passing these tests in the future does not by itself create legal, clinical, accessibility, or security approval.

## Protected Provider Detail Sentinel Set

Future synthetic test fixtures must include sentinel values for prohibited pre-payment pharmacy and laboratory detail categories so scanners can prove absence across surfaces.

| Category | Examples of prohibited pre-payment client exposure |
| --- | --- |
| Location | Address, address components, coordinates, map position, map pin, exact or approximate distance, directions |
| Identity | Branch identifier, internal provider identifier that reveals provider identity or location, external profile links |
| Contact | Phone, email, chat handle, staff contact, collection or pickup contact |
| Operations | Pickup instructions, collection instructions, delivery handoff instructions, service counter instructions |
| Media | Photographs, logos where not explicitly approved, image metadata, alt text revealing location |
| Derived metadata | Cache keys, analytics dimensions, route names, slugs, error messages, accessibility labels, telemetry tags that reveal identity or location |

## Privacy Boundary Requirement Matrix

| ID | Test requirement | Required negative proof | Status |
| --- | --- | --- | --- |
| PBT-REQ-001 | Pre-payment provider API response exposes only providerDisplayName and explicitly approved non-identifying commercial information | Prohibited fields absent from response body, headers, links, error bodies, pagination tokens, and cache keys | BLOCKING-REQUIREMENT |
| PBT-REQ-002 | Pre-payment GraphQL response, if GraphQL is used, exposes only approved fields | Prohibited fields absent from result, fragments, client payloads, errors, extensions, and cached objects | BLOCKING-REQUIREMENT |
| PBT-REQ-003 | Pre-payment HTML contains no prohibited provider details | Prohibited sentinels absent from rendered HTML | BLOCKING-REQUIREMENT |
| PBT-REQ-004 | Pre-payment source output contains no prohibited provider details | Prohibited sentinels absent from page source and static payloads | BLOCKING-REQUIREMENT |
| PBT-REQ-005 | Pre-payment DOM contains no hidden prohibited provider details | Prohibited sentinels absent from visible nodes, hidden nodes, data attributes, ARIA labels, comments, templates, and inert markup | BLOCKING-REQUIREMENT |
| PBT-REQ-006 | Pre-payment hydration payloads contain no prohibited provider details | Prohibited sentinels absent from framework data scripts and serialized state | BLOCKING-REQUIREMENT |
| PBT-REQ-007 | Pre-payment JavaScript state contains no prohibited provider details | Prohibited sentinels absent from stores, query caches, service worker caches, local state, and global objects | BLOCKING-REQUIREMENT |
| PBT-REQ-008 | Pre-payment browser storage contains no prohibited provider details | Prohibited sentinels absent from localStorage, sessionStorage, IndexedDB, Cache API, cookies, and service worker storage | BLOCKING-REQUIREMENT |
| PBT-REQ-009 | Pre-payment network requests do not leak prohibited provider details | Prohibited sentinels absent from URLs, query strings, paths, bodies, headers, referrers, prefetches, and websocket messages | BLOCKING-REQUIREMENT |
| PBT-REQ-010 | Pre-payment network responses do not leak prohibited provider details | Prohibited sentinels absent from bodies, headers, redirects, errors, and streamed chunks | BLOCKING-REQUIREMENT |
| PBT-REQ-011 | Pre-payment accessibility tree does not reveal prohibited provider details | Prohibited sentinels absent from role/name/description snapshots and hidden accessible labels | BLOCKING-REQUIREMENT |
| PBT-REQ-012 | Pre-payment screenshots do not reveal prohibited provider details | Prohibited sentinels absent from image pixels and visual review | BLOCKING-REQUIREMENT |
| PBT-REQ-013 | Pre-payment map-provider requests are not made with protected provider location or identifier data | No map pins, coordinates, address geocoding, directions, or provider location requests before authorized paid order | BLOCKING-REQUIREMENT |
| PBT-REQ-014 | Analytics events omit prohibited provider details before payment | Prohibited sentinels absent from event names, properties, user traits, URL paths, referrers, and campaign fields | BLOCKING-REQUIREMENT |
| PBT-REQ-015 | Error-reporting events omit prohibited provider details before payment | Prohibited sentinels absent from exceptions, breadcrumbs, tags, context, stack metadata, screenshots, and replay payloads | BLOCKING-REQUIREMENT |
| PBT-REQ-016 | Logs omit prohibited provider details before payment | Prohibited sentinels absent from application logs, access logs, debug logs, worker logs, and non-approved audit entries | BLOCKING-REQUIREMENT |
| PBT-REQ-017 | Payment failure does not unlock provider details | Post-failure browser/API/artifact surfaces remain pre-payment minimal | BLOCKING-REQUIREMENT |
| PBT-REQ-018 | Payment cancellation does not unlock provider details | Post-cancellation browser/API/artifact surfaces remain pre-payment minimal | BLOCKING-REQUIREMENT |
| PBT-REQ-019 | Payment authorization without approved success event does not unlock provider details | Authorization-only state remains non-disclosing | BLOCKING-REQUIREMENT |
| PBT-REQ-020 | Refund behavior follows approved disclosure policy | Refund scenarios match approved finance/privacy policy without broad unlock | BLOCKING-REQUIREMENT |
| PBT-REQ-021 | Successful payment unlocks approved details only for the selected authorized order | Other orders, quotes, providers, patients, and carts remain non-disclosing | BLOCKING-REQUIREMENT |
| PBT-REQ-022 | Provider replacement after payment follows approved disclosure and refund policy | Replacement does not leak unselected provider details | BLOCKING-REQUIREMENT |
| PBT-REQ-023 | One patient cannot access another patient's provider details | Cross-patient URL/API/browser attempts denied and non-disclosing | BLOCKING-REQUIREMENT |
| PBT-REQ-024 | One order cannot unlock another order's provider details | Order ID swapping, replay, and stale-token attempts denied and non-disclosing | BLOCKING-REQUIREMENT |
| PBT-REQ-025 | Direct URL access to protected provider details is denied without authorized paid order context | URL guessing returns non-disclosing denial | BLOCKING-REQUIREMENT |
| PBT-REQ-026 | Browser back navigation does not reveal stale protected provider details after logout, role change, refund state, or order change | Back/forward cache and browser cache remain safe | BLOCKING-REQUIREMENT |
| PBT-REQ-027 | Cached responses do not reveal protected provider details to unauthorized sessions | Cache partition and authorization checks prevent stale disclosure | BLOCKING-REQUIREMENT |
| PBT-REQ-028 | Guessing internal provider, branch, or order identifiers is denied and non-disclosing | Error messages and timing do not reveal provider identity or location | BLOCKING-REQUIREMENT |
| PBT-REQ-029 | Payer status does not grant clinical-record access | Sponsor, employer, HMO, family payer, and diaspora payer attempts are denied unless separately authorized | BLOCKING-REQUIREMENT |
| PBT-REQ-030 | Tenant and role isolation prevents cross-organization leakage | Employer, HMO, provider, support, pharmacy, and laboratory boundaries enforced | BLOCKING-REQUIREMENT |
| PBT-REQ-031 | Guardian and delegated access follows explicit scope only | Minor, dependent, delegated, revoked, expired, and disputed scopes enforced | BLOCKING-REQUIREMENT |
| PBT-REQ-032 | Break-glass access is audited and does not bypass provider-detail disclosure controls outside approved emergency scope | Break-glass event, reason, reviewer, and after-review evidence captured | BLOCKING-REQUIREMENT |
| PBT-REQ-033 | Emergency escalation remains available without payment, registration completion, marketplace comparison, or plan authorization | Emergency path works in blocked ordinary workflow states | BLOCKING-REQUIREMENT |
| PBT-REQ-034 | Notifications and deep links do not reveal prohibited provider details before payment | SMS, email, push, in-app notifications, previews, and URLs omit sentinels | BLOCKING-REQUIREMENT |
| PBT-REQ-035 | Test fixtures do not normalize prohibited leakage as expected data | Fixtures segregate pre-payment minimal data from post-payment protected data | BLOCKING-REQUIREMENT |
| PBT-REQ-036 | Browser traces do not contain prohibited provider details before payment | Trace network, DOM snapshots, source snapshots, console, and metadata scanned | BLOCKING-REQUIREMENT |
| PBT-REQ-037 | Browser videos do not contain prohibited provider details before payment | Videos captured on retry/failure are scanned or access-restricted | BLOCKING-REQUIREMENT |
| PBT-REQ-038 | Image metadata does not reveal prohibited provider details | Uploaded, generated, downloaded, screenshot, and provider media metadata scanned | BLOCKING-REQUIREMENT |
| PBT-REQ-039 | Contract regression prevents accidental API expansion of pre-payment provider fields | Contract schema fails on newly added prohibited or derived fields | BLOCKING-REQUIREMENT |
| PBT-REQ-040 | Monitoring tools do not receive prohibited provider details before payment | APM, analytics, error-reporting, session replay, and log pipelines remain non-disclosing | BLOCKING-REQUIREMENT |

## Sentinel Scanner Design

Future tests must use sentinel values that are unique, unmistakable, and safe for synthetic environments. The scanner must search raw payloads and decoded representations before any artifact is shared. Any sentinel match in a pre-payment surface is a blocking privacy defect.

## Review and Change Control

Weakening any privacy boundary test requires external approval from privacy, security, product, pharmacy operations, laboratory operations, and legal/compliance owners. A UI-only hiding approach is explicitly insufficient and must fail this strategy.
