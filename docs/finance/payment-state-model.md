# Payment State Model

## Document Control

| Field | Value |
|---|---|
| Document title | Payment State Model |
| Codex prompt ID | P00-13 |
| Complete Breakdown work package | P00-16 |
| Issue ID | P00-FIN-001 |
| Owner role | Finance/Payments Owner + Security Lead + Architecture Lead |
| Finance status | DRAFT-PENDING-FINANCE-LEGAL-REGULATORY-ACCOUNTING-AND-TAX-APPROVAL |
| Status | DRAFT-PENDING-FINANCE-LEGAL-REGULATORY-ACCOUNTING-AND-TAX-APPROVAL |
| Review state | PROPOSED; NOT EFFECTIVE UNTIL APPROVED |
| Required reviewers | Founder/Product Owner; Finance/Payments Owner; Nigerian legal counsel; Accounting/tax reviewer; Privacy/DPO; Security Lead; Pharmacy Operations; Laboratory Operations; Engineering/Architecture |
| Last updated | 2026-06-24 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1 |
| Related decisions | REQ-FIN-002 through REQ-FIN-046 |
| Related open questions | OQ-00-387 through OQ-00-491 |
| Related workflows | WFL-018 Payment intent; WFL-019 Refund; WFL-009; WFL-010; WFL-013 |
| Related regulatory obligations | REG-OBL-029; REG-OBL-030; REG-OBL-032; REG-OBL-039 |

This document is not legal, tax, accounting, banking, payment-service, insurance, or HMO advice. It does not authorize NelyoHealth to hold customer funds, issue stored value, operate as a payment service provider, bank, payment service bank, mobile-money operator, international money transfer operator, HMO, or insurer. Final payment-provider behavior depends on provider contracts, certification, and verified server-side evidence. Final account classification depends on accounting and legal review. Final tax treatment depends on professional review.

## Canonical Concepts

| Concept | Definition | Policy ID |
|---|---|---|
| PaymentIntent | Internal intent to collect or verify funding for an exact order and funding allocation. | PAY-POL-001 |
| PaymentAttempt | One attempt under a PaymentIntent; multiple attempts may exist and must be idempotent. | PAY-POL-002 |
| PaymentAuthorization | Evidence that a payment rail has authorized access to funds; it is insufficient for pilot OrderFundingSecured. | PAY-POL-003 |
| PaymentCapture | Verified server-side evidence that the payment rail has captured payment under approved contract terms. | PAY-POL-004 |
| Payment | Internal financial record of verified capture, confirmed receipt, reversal, or other approved payment fact. | PAY-POL-005 |
| Settlement | Separate movement or finalization between financial participants; not ordinary patient-facing unlock point in the proposed pilot rule. | PAY-POL-006 |
| FundingAllocation | A source-specific portion of an order's required financial obligation. | PAY-POL-007 |
| OrderFundingSecured | PROPOSED financial fact for an exact selected order after all approved funding evidence and balanced ledger posting are present. | PAY-POL-008 |
| Refund | Original-source return process; distinct from reversal and chargeback. | PAY-POL-009 |
| Reversal | Payment-provider or rail correction that reverses or adjusts a prior financial fact. | PAY-POL-010 |
| Chargeback | Dispute/chargeback path under payment rail rules; distinct from refund and reversal. | PAY-POL-011 |
| Dispute | Operations/legal/finance review case for contested financial or fulfilment fact. | PAY-POL-012 |
| ReconciliationException | Unresolved mismatch between provider evidence, internal state, ledger, order, actor, patient, tenant, refund, payout, claim, or remittance. | PAY-POL-013 |
| ProviderDetailDisclosureEligibilityEstablished | Separate marketplace/access-control fact created only after ProviderDetailDisclosureDecision allows access; it is not generic payment success. | PAY-POL-014 |

## Canonical Payment Lifecycle

These are conceptual states. They are not implementation enums and do not reproduce vendor states. Refund, dispute, chargeback, and payout are separate workflows. Payment state is not provider-detail disclosure state.

| State | Meaning | Entry evidence | Terminal | Permitted transitions | Financial implication | Ledger implication | Order implication | Provider-detail implication | Retry/reconciliation/user status | Approval |
|---|---|---|---|---|---|---|---|---|---|---|
| CREATED | Intent exists. | Order and funding allocation created. | No | REQUIRES_ACTION, PROCESSING, CANCELLED, EXPIRED | No secured funds. | No secured funding entry. | Order may await action. | Must deny initial eligibility. | Retry allowed by policy; show payment not started. | PROPOSED |
| REQUIRES_ACTION | Payer action required. | Provider/rail requires payer step. | No | PROCESSING, CANCELLED, EXPIRED, FAILED | No secured funds. | No secured funding entry. | Order awaits payer. | Must deny. | Browser refresh/back cannot unlock. | PROPOSED |
| PROCESSING | Payment under provider processing or verification. | Server-side receipt of processing state. | No | AUTHORIZED, CAPTURE_PENDING, CAPTURED, FAILED, RECONCILIATION_EXCEPTION | Not secured. | No secured funding entry. | Hold may continue if valid. | Must deny. | Pending; reconcile delayed callback. | PROPOSED |
| AUTHORIZED | Rail authorization exists. | Server-side verified authorization. | No | CAPTURE_PENDING, CAPTURED, CANCELLED, EXPIRED, FAILED | Authorization only; pilot insufficient. | Authorization record only. | May proceed only if reservation valid. | Must deny initial eligibility. | Retry/capture policy approval required. | PROPOSED |
| CAPTURE_PENDING | Capture requested or waiting. | Capture request or queued provider action. | No | CAPTURED, FAILED, RECONCILIATION_EXCEPTION | Not yet secured. | No secured funding until verified. | Order awaits result. | Must deny. | Reconcile provider outage/delay. | PROPOSED |
| CAPTURED | Capture verified server-side. | Provider API or approved evidence confirms capture. | No | SETTLEMENT_PENDING, SETTLED, RECONCILIATION_EXCEPTION | Candidate evidence. | Requires balanced ledger posting. | May support OrderFundingSecured if all guards pass. | Does not directly expose details. | User may see paid/pending fulfilment wording after policy approval. | PROPOSED |
| SETTLEMENT_PENDING | Settlement not completed. | Capture verified; settlement outstanding. | No | SETTLED, RECONCILIATION_EXCEPTION | Settlement lag exists. | Ledger may show clearing/receivable. | Not ordinary unlock point. | Does not directly expose details. | Reconcile later settlement. | PROPOSED |
| SETTLED | Settlement verified. | Settlement evidence. | Yes for payment lifecycle | RECONCILIATION_EXCEPTION if mismatch discovered | Financial finalization under rail. | Clearing entries reconcile. | Order already funded if prior event valid. | Does not directly expose details. | User-facing wording depends on policy. | PROPOSED |
| FAILED | Attempt failed. | Verified failure or timeout outcome. | Yes for attempt | New attempt under policy. | No secured funds. | Failure record only. | Order retry/cancel/reselect. | Must deny. | Show failed; audit. | APPROVED as denial rule |
| CANCELLED | Intent/attempt cancelled. | User/system/provider cancellation. | Yes | New intent under policy. | No secured funds. | Cancellation record only. | Order may cancel/reselect. | Must deny. | Show cancelled; audit. | APPROVED as denial rule |
| EXPIRED | Intent, authorization, quote, reservation, or hold expired. | Expiry rule or owner review. | Yes | New intent/reselect. | No secured funds. | Expiry record only. | Expired reservation cannot support capture. | Must deny. | Show expired; audit. | APPROVED as denial rule |
| RECONCILIATION_EXCEPTION | Evidence mismatch. | Amount, currency, actor, order, patient, tenant, provider, provider state, ledger, or callback mismatch. | No | Resolved state by approved correction. | Sensitive conclusion blocked. | Suspense/reversal/adjustment review. | Order routed to owner queue. | Must deny or review-gate; no auto-unlock. | Show under review. | PROPOSED |

## Provider Status Mapping

No actual vendor status values are approved. External states map through adapters and never become canonical state without verification.

| External status class | Canonical candidate | Verification required | May be ignored | Retry | Out-of-order handling | Reconciliation | Unknown status |
|---|---|---|---|---|---|---|---|
| Created-like | CREATED | Merchant/order binding | Yes if stale duplicate | Yes | Cannot regress later verified state | Audit only | Treat as processing/review |
| Action-required-like | REQUIRES_ACTION | Actor/order binding | No if active | Yes | Cannot override failure/capture | Audit | Review |
| Processing-like | PROCESSING | Provider API or signed callback plus recheck | No | Yes | Cannot regress captured/failed terminal | Reconcile delay | Review |
| Authorized-like | AUTHORIZED | Server-side provider verification | No | Capture policy required | Cannot create eligibility | Reconcile expiry | Review |
| Captured/success-like | CAPTURED | Server-side API confirmation and exact binding | No | Idempotent duplicate only | Cannot override mismatch | Ledger and amount/currency check | Review |
| Settled-like | SETTLED | Settlement evidence | No | Idempotent duplicate only | Cannot create retroactive disclosure alone | Clearing reconciliation | Review |
| Failed-like | FAILED | Verified failure | No | New attempt by policy | Cannot regress captured without reversal | Reconcile if conflict | Review |
| Cancelled/expired-like | CANCELLED or EXPIRED | Verified cancellation/expiry | No | New intent by policy | Cannot regress captured without reversal | Reconcile if conflict | Review |
| Reversal/dispute-like | Separate refund/reversal/chargeback workflow | Verified rail notice | No | Review only | Cannot create eligibility | Mandatory | Review required |

## OrderFundingSecured Specification

| Field | Proposed rule |
|---|---|
| Event or fact name | OrderFundingSecured |
| Status | PROPOSED; not approved for implementation until founder/product, finance/payments owner, Nigerian counsel, privacy, security, pharmacy ops, lab ops, and engineering approve. |
| Owner | Payments and Ledger bounded context; consumed by Marketplace/Disclosure. |
| Correlation identifier | Required across order, payment, ledger transaction, provider selection, and audit. |
| Exact order | Required; one order only. |
| Selected provider | Required; selected pharmacy or laboratory/provider version only. |
| Patient | Required; one longitudinal patient identity. |
| Tenant | Required; tenant isolation mandatory. |
| Funding allocations | All required allocations must be secured and sum to the payable under approved evidence profile. |
| Total required amount | Must match quote/invoice/payable evidence in the relevant currency. |
| Verified financial evidence | VERIFIED-PAYMENT-CAPTURE, VERIFIED-FUNDS-RECEIVED, LICENSED-PROVIDER-BALANCE-DEBIT-COMMITTED, or later approved guarantee profile. |
| Ledger transaction | Balanced internal double-entry posting committed atomically with audit/outbox intent. |
| Reservation/acceptance dependency | Stock reservation, lab booking hold, or approved operational acceptance must be valid. |
| Event version | Required to prevent stale replay and provider replacement errors. |
| Idempotency key | Required; duplicate event returns prior result, not duplicate eligibility. |
| Audit | Required; payload contains minimum identifiers only. |
| Failure reasons | Pending, failed, cancelled, expired, unverified, authorization-only, wrong amount/currency/order/actor/patient/tenant, expired reservation, provider replaced, ledger failure, unbalanced ledger, reconciliation exception, duplicate or incomplete split funding. |
| Revocation or recomputation triggers | Refund, partial refund, reversal, chargeback, provider replacement, cancellation, safety/legal/support case, reconciliation exception, claim/remittance correction. |
| Approval status | PROPOSED and externally approval-gated. |

## Evidence Profiles

| Profile | Pilot validity | Meaning |
|---|---|---|
| VERIFIED-PAYMENT-CAPTURE | Candidate pilot evidence | Server-side verified capture plus exact binding and balanced ledger. |
| VERIFIED-FUNDS-RECEIVED | Candidate pilot evidence | Confirmed received funds under approved route plus exact binding and balanced ledger. |
| LICENSED-PROVIDER-BALANCE-DEBIT-COMMITTED | Candidate only if legal/provider model approved | Debit committed against licensed-provider-backed balance plus balanced ledger. |
| CONTRACTUAL-COVERAGE-GUARANTEE-ACCEPTED | DESIGN-NOW-IMPLEMENT-LATER; not valid for pilot | Employer/HMO or contractual guarantee approved by legal/finance. |
| ZERO-PAYABLE-ORDER | Not automatic | Does not auto-qualify without an approved funding-evidence profile or guarantee rule. |

## Non-Emission Rules

OrderFundingSecured must not emit when authorization only exists, verification is incomplete, transfer is pending, webhook is invalid, browser success route is present, amount/currency/order/actor/patient/tenant is wrong, reservation expired, provider was replaced, order was cancelled, duplicate payment is unresolved, ledger failed or is unbalanced, reconciliation exception exists, funding is incomplete, sponsor approval lacks payment, HMO/employer eligibility lacks approved guarantee, or the client asserts success.

## Payment and Disclosure Matrix

| Financial condition | May create initial OrderFundingSecured | Continued eligibility support | Required response |
|---|---|---|---|
| Created, requires action, processing, pending | No | No | Deny; show pending/action state. |
| Authorized | No | No | Deny; authorization alone insufficient. |
| Capture verified plus balanced ledger plus all guards | Candidate | Candidate | Emit proposed OrderFundingSecured; disclosure still separate. |
| Settlement pending | Not by itself | Candidate only if capture/receipt path valid | Do not wait for ordinary settlement as unlock point. |
| Settled | Not by itself | Candidate if prior exact funding valid | Reconcile clearing. |
| Failed, cancelled, expired | No | No | Deny. |
| Reconciliation exception | No | Review only | Deny or review-gate. |
| Refunded, partially refunded, reversed, chargeback, disputed | Never creates initial eligibility | Recompute; review-gated where ambiguous | Do not approve final post-refund behavior in P00-13. |
| Wrong order, actor, patient, tenant, provider, amount, or currency | No | No | Deny and open reconciliation/security review. |

## Authorization Versus Capture Versus Settlement

Authorization reserves or approves access to funds but may not complete transfer. Capture commits the payment under the payment rail. Settlement transfers or finalizes funds between financial participants. Exact legal effects depend on provider contracts and payment rails. The proposed pilot release rule uses verified capture or confirmed receipt plus balanced ledger posting. Settlement is not proposed as the ordinary patient-facing unlock point because it may lag. This recommendation remains approval-gated.

## Callback and Webhook Policy

Future callbacks require authentication, signature verification, event identifier, merchant-account binding, timestamp/replay validation, payload hash, idempotency scope, inbox or receipt record, duplicate handling, out-of-order handling, unknown-event quarantine, provider API re-verification, retry policy, audit, and reconciliation. P00-13 selects no implementation technology.

## Failure Cases

The model covers user closing payment window, redirect failure, delayed callback after success, success callback failing verification, capture succeeding but ledger posting failing, ledger posting to wrong binding, duplicate attempt, multiple successful attempts, wrong amount, wrong currency, wrong order, payment after cancellation, payment after reservation expiry, incomplete split payment, provider outage, reconciliation mismatch, and chargeback after fulfilment. None of these may directly expose protected provider details.

## Future Financial Test Requirements

| Test ID | Requirement |
|---|---|
| FIN-TST-011 | Payment intent creation stays order/actor/patient/tenant scoped. |
| FIN-TST-012 | Requires-action, browser refresh, browser back, and spoofed success route do not unlock provider details. |
| FIN-TST-013 | Authorization-only denial. |
| FIN-TST-014 | Verified capture plus balanced ledger candidate success. |
| FIN-TST-015 | Verified receipt plus balanced ledger candidate success. |
| FIN-TST-016 | Settlement pending is not ordinary unlock point by itself. |
| FIN-TST-017 | Failure, cancellation, expiry, pending, and unverified callback denial. |
| FIN-TST-018 | Wrong amount, currency, order, actor, patient, and tenant denial. |
| FIN-TST-019 | Delayed, duplicate, out-of-order, forged, and unverified callback handling. |
| FIN-TST-020 | Provider outage and reconciliation exception denial/review. |
| FIN-TST-021 | Duplicate event idempotency prevents duplicate OrderFundingSecured. |
| FIN-TST-022 | Provider replacement requires fresh funding/disclosure review. |
| FIN-TST-023 | Split-payment incomplete denial and fully secured candidate success. |
| FIN-TST-024 | Zero-payable order without approved guarantee denied. |

## Browser and Interactive Testing Requirements

P00-14 must later define, without installing tools in P00-13, both interactive IDE browser testing and deterministic Playwright tests using synthetic data only. Required future coverage includes payment redirect, delayed callback, duplicate submit, refresh during payment, browser back navigation, spoofed success page, pending state, failed state, cancelled state, expired state, reconciliation exception, refund, provider replacement, network payload inspection, browser storage inspection, cache inspection, and provider-detail absence until authorized.

These browser tests must prove that client-side success, route state, cached state, storage state, network payloads, screenshots, traces, and browser-visible artifacts do not establish `OrderFundingSecured` and do not expose protected pharmacy or laboratory details before a separate authorized provider-disclosure decision.

| Test ID | Requirement |
|---|---|
| FIN-TST-057 | Interactive IDE browser test verifies spoofed success route, browser refresh, browser back, and duplicate submit do not create OrderFundingSecured. |
| FIN-TST-058 | Deterministic Playwright test verifies delayed callback, failed payment, cancelled payment, expired payment, and reconciliation exception do not expose provider details. |
| FIN-TST-059 | Browser network, storage, cache, screenshot, and trace inspection verifies protected provider details remain absent until authorized disclosure. |
| FIN-TST-060 | All finance/browser tests use synthetic users, orders, providers, payments, refunds, and ledger records only. |
