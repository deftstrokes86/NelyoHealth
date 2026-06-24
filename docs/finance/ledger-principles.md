# Ledger Principles

## Document Control

| Field | Value |
|---|---|
| Document title | Ledger Principles |
| Codex prompt ID | P00-13 |
| Complete Breakdown work package | P00-16 |
| Issue ID | P00-FIN-001 |
| Owner role | Finance/Payments Owner + Accounting Reviewer + Architecture Lead |
| Finance status | DRAFT-PENDING-FINANCE-LEGAL-REGULATORY-ACCOUNTING-AND-TAX-APPROVAL |
| Status | DRAFT-PENDING-FINANCE-LEGAL-REGULATORY-ACCOUNTING-AND-TAX-APPROVAL |
| Review state | PROPOSED; NOT EFFECTIVE UNTIL APPROVED |
| Required reviewers | Founder/Product Owner; Finance/Payments Owner; Nigerian legal counsel; Accounting/tax reviewer; Privacy/DPO; Security Lead; Pharmacy Operations; Laboratory Operations; Engineering/Architecture |
| Last updated | 2026-06-24 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1 |
| Related decisions | REQ-FIN-002 through REQ-FIN-046 |
| Related open questions | OQ-00-387 through OQ-00-491 |
| Related workflows | WFL-018; WFL-019; WFL-020; WFL-021; WFL-022 |
| Related regulatory obligations | REG-OBL-029; REG-OBL-030; REG-OBL-032; REG-OBL-039 |

This document is not legal, tax, accounting, banking, payment-service, insurance, or HMO advice. It does not authorize NelyoHealth to hold customer funds, issue stored value, operate as a payment service provider, bank, payment service bank, mobile-money operator, international money transfer operator, HMO, or insurer. Final payment-provider behavior depends on provider contracts, certification, and verified server-side evidence. Final account classification depends on accounting and legal review. Final tax treatment depends on professional review.

## Ledger Purpose

The ledger is a proposed append-only double-entry operational subledger for order funding, sponsor and family funding, provider payables, platform fees, refund liabilities, payouts, reconciliation, and claims/remittance interfaces. It is not automatically the statutory accounting general ledger. Accounting integration, revenue recognition, account classification, tax treatment, and reporting remain accounting and legal review items.

## Ledger Invariants

| Policy ID | Invariant | Status |
|---|---|---|
| LED-POL-001 | Every posted transaction balances per currency. | PROPOSED |
| LED-POL-002 | Posted entries are immutable. | PROPOSED |
| LED-POL-003 | Corrections use reversal or adjusting entries. | PROPOSED |
| LED-POL-004 | Every line belongs to one ledger transaction. | PROPOSED |
| LED-POL-005 | Every transaction has a business source. | PROPOSED |
| LED-POL-006 | Every amount has one currency. | PROPOSED |
| LED-POL-007 | Cross-currency transactions use separate balanced currency legs and approved FX entries. | REQUIRES_APPROVAL |
| LED-POL-008 | Every displayed balance is derived from ledger entries and licensed-provider facts. | APPROVED as locked financial rule |
| LED-POL-009 | Pending and available balances are distinct. | PROPOSED |
| LED-POL-010 | Reserved and spent balances are distinct. | PROPOSED |
| LED-POL-011 | A budget is not a cash balance. | APPROVED as locked financial rule |
| LED-POL-012 | A benefit limit is not a cash balance. | APPROVED as locked financial rule |
| LED-POL-013 | A provider payable is not customer money. | REQUIRES_APPROVAL for classification |
| LED-POL-014 | Refund liability is not platform revenue. | REQUIRES_APPROVAL for accounting classification |
| LED-POL-015 | Payment-provider clearing is reconciled. | PROPOSED |
| LED-POL-016 | Duplicate callbacks cannot create duplicate entries. | APPROVED as idempotency rule |
| LED-POL-017 | Manual adjustments require approval and audit. | PROPOSED |
| LED-POL-018 | No posted entry is deleted. | PROPOSED |
| LED-POL-019 | No ledger entry grants clinical access. | APPROVED |
| LED-POL-020 | No ledger entry alone exposes provider details. | APPROVED |

## Ledger Entry Model

Conceptual fields only: ledger transaction ID, ledger entry ID, account, account owner, tenant, patient or beneficiary reference where needed, order, invoice, payment, refund, payout, claim, currency, debit or credit, amount, effective date, posting date, source event, correlation ID, idempotency key, created by, approval reference, reversal reference, adjustment reference, description, classification, and audit reference. This is not a database schema.

## Proposed Account Categories

| Category | Purpose | Debit meaning | Credit meaning | Legal/accounting question | Permitted owner | Balance visibility | Approval |
|---|---|---|---|---|---|---|---|
| Payment-provider clearing | Processor movement tracking. | Increase clearing receivable or reduce liability. | Increase payable/liability or reduce receivable. | Processor contract classification. | Finance | Internal only | REQUIRES_APPROVAL |
| Bank or processor settlement receivable | Expected settlement from licensed route. | Settlement due. | Settlement received/cleared. | Account ownership. | Finance | Internal only | REQUIRES_APPROVAL |
| Customer-funding liability | Only where legally applicable. | Liability reduced. | Liability increased. | Custody and stored-value legality. | Licensed model only | Reviewed display only | REQUIRES_APPROVAL |
| Sponsor/family-funding liability | Only where legally applicable. | Liability reduced/refunded. | Liability increased. | Sponsor/family ownership. | Licensed model only | Reviewed display only | REQUIRES_APPROVAL |
| Order-funding reserve | Funds committed to exact order. | Reserve released/spent. | Reserve created. | Classification. | Finance | Internal/limited | REQUIRES_APPROVAL |
| Provider payable | Provider amount due after milestone. | Payable reduced. | Payable created. | Milestone and contract. | Finance/provider ops | Provider statement | REQUIRES_APPROVAL |
| Pharmacy/Laboratory/Doctor/Delivery payable | Provider-class payable details. | Payable reduced. | Payable created. | Provider contract and tax. | Finance | Provider statement | REQUIRES_APPROVAL |
| Platform fee revenue | Platform commercial component. | Reversal/adjustment. | Recognition candidate. | Revenue recognition point. | Accounting | Internal only | REQUIRES_APPROVAL |
| Payment fee expense/payable | Payment-provider costs. | Fee paid/recognized. | Fee accrued/payable. | Fee treatment. | Accounting | Internal only | REQUIRES_APPROVAL |
| Tax or levy payable | Tax/levy component if applicable. | Paid/reduced. | Accrued. | Tax applicability. | Accounting/tax | Internal only | REQUIRES_APPROVAL |
| Refund payable and refund clearing | Refund obligation and processing. | Refund processed/reduced. | Refund approved/accrued. | Recipient/source allocation. | Finance | Limited status | REQUIRES_APPROVAL |
| Payout clearing | Provider payout movement. | Payout sent/cleared. | Payout obligation staged. | Payout route. | Finance | Provider statement | REQUIRES_APPROVAL |
| Chargeback receivable/loss/reserve | Chargeback/dispute handling. | Recovery/loss movement. | Reserve/liability. | Accounting classification. | Finance/legal | Internal only | REQUIRES_APPROVAL |
| HMO, employer, claims, remittance receivable/clearing | Future coverage collections. | Receivable/remittance due. | Collection/offset. | Contract and insurance risk. | Finance | Internal/partner | FUTURE SCOPE |
| FX difference | Approved cross-currency difference. | Loss/adjustment. | Gain/adjustment. | FX source/tax. | Accounting | Internal only | REQUIRES_APPROVAL |
| Promotional credit liability | Only if ever approved. | Credit used/expired by policy. | Credit issued. | Consumer/tax/custody. | Finance/legal | Reviewed display | REQUIRES_APPROVAL |
| Financial adjustment suspense and reconciliation suspense | Temporary owner-reviewed mismatch. | Resolution/clearance. | Exception opened. | Owner and closure authority. | Finance | Internal only | REQUIRES_APPROVAL |

## Wallet and Balance Semantics

FundingBalanceView, available balance, reserved balance, pending balance, spent amount, refund pending, refund completed, budget remaining, benefit remaining, provider payable, and payout pending are distinct. The term wallet may be a user-interface term only after legal, regulatory, and product approval. A wallet display does not make NelyoHealth the custodian. The authoritative balance is derived from ledger entries and licensed-provider facts. Budget remaining and benefit remaining are not withdrawable money balances. No cash-out, P2P transfer, interest, credit, or general-purpose spending is approved.

## Sponsor and Family Balance

A budget-only model records spending rules, authorized limit, and usage; it creates no money custody and no ledger liability until a payment is committed. A pre-funded model requires a licensed-provider structure, legal/regulatory approval, backing-funds evidence, liability accounting, refund/exit policy, and reconciliation. These models must not be conflated.

## Posting Examples

All examples are conceptual and not accounting advice. `D` means debit and `C` means credit; entries balance within each currency.

| Example | Balanced conceptual entries | Approval |
|---|---|---|
| Direct capture | D payment-provider clearing; C order-funding reserve. | REQUIRES_APPROVAL |
| Split-funded payment | D clearing by source; C order-funding reserve by source; all legs sum to order obligation. | REQUIRES_APPROVAL |
| Sponsor-funded order | D sponsor funding source clearing; C order reserve; no sponsor clinical access. | REQUIRES_APPROVAL |
| Provider payable creation | D order cost/fulfilment clearing; C provider payable. | REQUIRES_APPROVAL |
| Platform fee recognition | D order reserve/clearing; C platform fee revenue candidate. | REQUIRES_APPROVAL |
| Payment-provider fee | D payment fee expense/payable; C clearing or payable. | REQUIRES_APPROVAL |
| Refund | D refund payable/clearing source; C payment-provider clearing or source liability reduction according to approved allocation. | REQUIRES_APPROVAL |
| Partial refund | D refund payable by allocation; C clearing by original source allocation. | REQUIRES_APPROVAL |
| Payout | D provider payable; C payout clearing. | REQUIRES_APPROVAL |
| Payout failure | D payout clearing reversal; C provider payable/restored payable or suspense. | REQUIRES_APPROVAL |
| Chargeback | D chargeback receivable/loss/reserve; C payment-provider clearing. | REQUIRES_APPROVAL |
| Provider payable correction | D/C reversal or adjustment entries linked to original payable; no direct edit. | REQUIRES_APPROVAL |
| HMO remittance | D remittance clearing; C HMO receivable. | FUTURE SCOPE |
| Reconciliation adjustment | D/C approved suspense resolution entries with owner and audit. | REQUIRES_APPROVAL |

## Manual Adjustments and Role Separation

Manual adjustments require case, reason, evidence, initiator, separate approver where required, account scope, amount, currency, reversal or adjustment method, audit, reconciliation, and no direct entry editing. Candidate roles include payment operations, refund initiator, refund approver, reconciliation operator, payout operator, payout approver, finance administrator, accounting reviewer, fraud reviewer, and auditor. No single role may silently initiate and approve its own high-risk adjustment, change payout destination and release payout, create and approve a refund, alter posted ledger entries, override order binding, grant clinical access, or grant provider-detail access.

## Future Financial Test Requirements

| Test ID | Requirement |
|---|---|
| FIN-TST-025 | Balanced posting accepted and unbalanced posting rejected. |
| FIN-TST-026 | Duplicate posting prevented by idempotency. |
| FIN-TST-027 | Reversal and adjustment preserve original entries. |
| FIN-TST-028 | Per-currency balancing enforced. |
| FIN-TST-029 | Split funding and refund allocation derive from ledger. |
| FIN-TST-030 | Provider payable and payout remain distinct. |
| FIN-TST-031 | Chargeback and reconciliation entries route to owner queue. |
| FIN-TST-032 | Displayed balance is ledger-derived. |
| FIN-TST-033 | Budget and benefit limits are not cash balances. |
| FIN-TST-034 | Tenant and patient isolation enforced on ledger views. |
