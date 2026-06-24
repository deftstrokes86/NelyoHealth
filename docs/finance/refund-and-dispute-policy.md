# Refund and Dispute Policy

## Document Control

| Field | Value |
|---|---|
| Document title | Refund and Dispute Policy |
| Codex prompt ID | P00-13 |
| Complete Breakdown work package | P00-16 |
| Issue ID | P00-FIN-001 |
| Owner role | Finance/Payments Owner + Legal Counsel + Operations Lead |
| Finance status | DRAFT-PENDING-FINANCE-LEGAL-REGULATORY-ACCOUNTING-AND-TAX-APPROVAL |
| Status | DRAFT-PENDING-FINANCE-LEGAL-REGULATORY-ACCOUNTING-AND-TAX-APPROVAL |
| Review state | PROPOSED; NOT EFFECTIVE UNTIL APPROVED |
| Required reviewers | Founder/Product Owner; Finance/Payments Owner; Nigerian legal counsel; Accounting/tax reviewer; Privacy/DPO; Security Lead; Pharmacy Operations; Laboratory Operations; Engineering/Architecture |
| Last updated | 2026-06-24 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1 |
| Related decisions | REQ-FIN-002 through REQ-FIN-046 |
| Related open questions | OQ-00-387 through OQ-00-491 |
| Related workflows | WFL-019 Refund; WFL-018 Payment intent; WFL-010; WFL-013 |
| Related regulatory obligations | REG-OBL-032; REG-OBL-039 |

This document is not legal, tax, accounting, banking, payment-service, insurance, or HMO advice. It does not authorize NelyoHealth to hold customer funds, issue stored value, operate as a payment service provider, bank, payment service bank, mobile-money operator, international money transfer operator, HMO, or insurer. Final payment-provider behavior depends on provider contracts, certification, and verified server-side evidence. Final account classification depends on accounting and legal review. Final tax treatment depends on professional review.

## Definitions

| Policy ID | Definition |
|---|---|
| RFD-POL-001 | Cancellation: order or service stopped before completion under approved rules. |
| RFD-POL-002 | Void: payment attempt cancelled or voided before capture where rail supports it. |
| RFD-POL-003 | Reversal: provider/rail correction reversing or adjusting a transaction. |
| RFD-POL-004 | Refund: approved return of value to the original funding source or approved exception route. |
| RFD-POL-005 | Partial refund: refund of part of the original allocation. |
| RFD-POL-006 | Chargeback: payment-rail dispute or payer-initiated reversal path. |
| RFD-POL-007 | Dispute: contested financial or fulfilment fact requiring evidence and owner review. |
| RFD-POL-008 | Retrieval request: future request for previously disclosed provider details after refund/reversal/chargeback. |
| RFD-POL-009 | Payment-provider correction: external provider adjustment subject to verification and reconciliation. |
| RFD-POL-010 | Merchant adjustment: approved finance adjustment through ledger reversal or adjustment entries. |
| RFD-POL-011 | Goodwill credit: not approved in P00-13; requires legal/finance/tax/product review. |
| RFD-POL-012 | Provider recovery: recovery from provider payable or contract route after refund/dispute. |
| RFD-POL-013 | Refund liability: accounting classification requiring professional review. |

## Refund Eligibility

Proposed eligibility categories include appointment cancellation, provider cancellation, technical consultation failure, duplicate payment, pharmacy out of stock, reservation failure, pharmacy rejection, delivery failure, laboratory booking failure, specimen rejection, laboratory cancellation, duplicate charge, incorrect amount, provider suspension, service not delivered, partial fulfilment, patient cancellation, sponsor revocation, employer or HMO coverage correction. No entitlement rule is approved until product, legal, finance, accounting/tax, and operations review.

## Original-Source Allocation

Every refund record must include original funding allocation, refundable amount by source, fee question, nonrefundable component question, provider recovery, platform-fee reversal question, tax adjustment question, payment-provider fee treatment, currency, FX question, recipient, ledger transaction, payment-provider transaction, notification, audit, and reconciliation. Split-funded refunds require exact original allocation, approved proportional or line-specific method, no arbitrary recipient change, no silent conversion into NelyoHealth credit, no refund to the patient of sponsor-owned funds without approval, no refund to a sponsor of patient-owned funds, clear statement, and reconciliation.

## Refund Workflow

The refund workflow references WFL-019 and covers request, eligibility review, approval, rejection, processing, partial completion, completion, failure, cancellation, reconciliation exception, appeal or complaint, and closure. Duplicate refunds are denied idempotently. Manual finance intervention uses case-based approval and audit, not direct database or ledger-entry editing.

## Reversal and Chargeback

Reversal and chargeback records must include source, evidence, order effect, provider-payable effect, platform-fee effect, ledger effect, provider recovery, patient communication, sponsor communication where minimum necessary, fraud review, operations review, provider-detail retrieval recomputation, clinical or safety effect, and audit.

## Provider-Detail Access Matrix

| Condition | Initial eligibility | Future retrieval | Provider name visibility | Address/contact/map/instruction visibility | Support access | Audit | Approval |
|---|---|---|---|---|---|---|---|
| Payment never reached eligible state | Denied | Denied | Pre-payment display name only if offer still valid | Denied | Financial support only | Required | APPROVED denial rule |
| Full refund before fulfilment | Never created by refund | Proposed deny/minimize routine retrieval | Display name and financial history only | Denied unless support/legal/safety purpose approved | Purpose-specific | Required | REQUIRES_APPROVAL |
| Partial refund during active fulfilment | Refund cannot create eligibility | Recompute | Minimum necessary | Only if current order purpose remains approved | Purpose-specific | Required | REQUIRES_APPROVAL |
| Full refund after completed fulfilment | Refund cannot create eligibility | Historical access rule required | Name and audit history retained | Future retrieval approval-gated | Purpose-specific | Required | REQUIRES_APPROVAL |
| Reversal before fulfilment | Denied | Review-required | Minimum financial/order status | Denied unless legal/safety purpose approved | Purpose-specific | Required | REQUIRES_APPROVAL |
| Reversal during fulfilment | No new eligibility | Review-required | Minimum necessary | Only if approved operational/legal/safety purpose | Purpose-specific | Required | REQUIRES_APPROVAL |
| Chargeback after fulfilment | No new eligibility | Review-required | Minimum necessary | Approval-gated | Purpose-specific | Required | REQUIRES_APPROVAL |
| Provider replacement | Prior provider not routine | Fresh decision required | New pre-payment display name only | Denied until new exact-order decision | Purpose-specific | Required | APPROVED as fresh-decision rule |
| Order cancellation | No new eligibility | Proposed deny/minimize unless purpose remains | Display name and financial history | Denied unless approved support/legal/safety need | Purpose-specific | Required | REQUIRES_APPROVAL |
| Return, complaint, or safety incident in progress | No new eligibility | Recompute by purpose | Minimum necessary | Only approved purpose and exact order | Purpose-specific | Required | REQUIRES_APPROVAL |

## Dispute Evidence

Possible evidence includes quote, invoice, payment verification, order history, delivery proof, collection proof, consultation completion, laboratory booking, result release, communications, refund records, and audit trail. Evidence packets expose only minimum-necessary data and do not include full clinical records, raw payment credentials, or protected pre-payment provider details unless an approved purpose-specific disclosure exists.

## Refund Failure

Refund failure covers payment instrument closed, sponsor account closed, international restriction, provider outage, wrong payout destination, partial processor success, timeout, duplicate refund, provider says completed but ledger disagrees, manual-review queue, escalation, communication, and closure. Failure does not create NelyoHealth credit or alternate recipient routing without approval.

## Future Financial Test Requirements

| Test ID | Requirement |
|---|---|
| FIN-TST-035 | Original-source refund and split refund allocation. |
| FIN-TST-036 | Partial refund, duplicate refund, closed instrument, and international refund review. |
| FIN-TST-037 | Refund failure routes to owner queue and audit. |
| FIN-TST-038 | Reversal and chargeback do not create initial disclosure eligibility. |
| FIN-TST-039 | Future provider-detail access after refund/reversal/chargeback is recomputed. |
| FIN-TST-040 | Provider replacement requires a new disclosure decision. |
| FIN-TST-041 | Refund notifications use synthetic/minimum data in tests. |
