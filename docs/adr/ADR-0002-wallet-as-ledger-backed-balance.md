# ADR-0002: Wallet as Ledger-Backed Balance

## Status

PROPOSED - Pending finance, legal, regulatory, accounting, tax, security, privacy, product, and architecture approval. NOT EFFECTIVE UNTIL APPROVED.

This ADR is not legal, tax, accounting, banking, payment-service, insurance, or HMO advice. It does not authorize NelyoHealth to hold customer funds, issue stored value, operate as a payment service provider, bank, payment service bank, mobile-money operator, international money transfer operator, HMO, or insurer. Final payment-provider behavior depends on provider contracts, certification, and verified server-side evidence. Final account classification depends on accounting and legal review. Final tax treatment depends on professional review.

## Document Control

| Field | Value |
|---|---|
| Codex prompt ID | P00-13 |
| Complete Breakdown work package | P00-16 |
| Issue ID | P00-FIN-001 |
| Owner role | Finance/Payments Owner + Architecture Lead + Legal Counsel |
| Finance status | DRAFT-PENDING-FINANCE-LEGAL-REGULATORY-ACCOUNTING-AND-TAX-APPROVAL |
| Review state | PROPOSED; NOT EFFECTIVE UNTIL APPROVED |
| Last updated | 2026-06-24 |
| Version | 0.1 |
| Related decisions | REQ-FIN-008 through REQ-FIN-016 |
| Related open questions | OQ-00-404 through OQ-00-418 |
| Related documents | docs/finance/ledger-principles.md; docs/finance/funds-flow.md; docs/finance/payment-state-model.md |

## Context

Family and diaspora funding, sponsor budgets, refunds, patient payments, provider payables, transparent balances, regulatory risk of stored value, weakness of summing payment rows, reconciliation needs, exact ownership, and audit requirements create a need for a consistent financial balance model. Existing Phase 0 rules require that every displayed balance be ledger-derived, that budget is not money, and that NelyoHealth does not assume unlicensed custody.

## Decision

Use a double-entry operational subledger with immutable posted entries, derived FundingBalanceView, separate budget and monetary balance concepts, licensed payment-provider backing where funds are involved, no independent NelyoHealth custody without approval, no P2P transfer, no cash-out, no interest, no general-purpose spending, no unapproved credit, original-source refunds, exact currency treatment, reconciliation, audit, and clear labels for pending, available, reserved, spent, and refundable amounts.

## Terminology Decision

The term wallet is a user-interface term only if product, legal, and regulatory review approves it. Funding balance or another reviewed term may be safer. Internal canonical terms remain FundingBalanceView and LedgerAccount. A spending limit is not called a cash balance. A benefit limit is not called a wallet balance.

## Alternatives Considered

| Alternative | Reason rejected or limited |
|---|---|
| Sum successful payment rows | Fails refunds, chargebacks, split funding, reversals, and reconciliation. |
| Store one mutable balance column | Creates audit and correction risk. |
| Let payment provider be the only financial source | Does not model order allocation, payables, refunds, claims, or internal controls. |
| NelyoHealth-operated stored-value wallet | Not approved and may create regulated custody/stored-value risk. |
| Budget-only model | Useful for employer/sponsor limits but not a money balance. |
| Ledger-backed balance using licensed payment services | Preferred proposed architecture pending approvals. |
| Separate provider payables without customer balance presentation | Insufficient for family/diaspora funding transparency. |

## Consequences

Positive consequences: reconciliation, auditability, split payment, original-source refunds, provider settlement, balance derivation, correction through entries, and future HMO remittance support. Negative consequences: implementation complexity, accounting review, reconciliation operations, more testing, role separation, legal dependency, and provider integration dependency.

## Open Dependencies

Legal custody model, licensed payment provider, customer-fund location, wallet terminology, refund model, diaspora payment, FX, tax, unclaimed funds, provider settlement, HMO receivable, accounting integration, data retention, insolvency protection, and provider exit remain unresolved and must not be treated as approved.

## Review Triggers

New payment provider, pre-funded balance, cash-out, P2P transfer, credit, new currency, new country, HMO live rollout, employer live rollout, regulatory change, material chargeback losses, accounting-system integration, or change in fund custody requires ADR review or replacement.
