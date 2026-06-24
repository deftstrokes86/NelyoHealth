# Provider Settlement Policy

## Document Control

| Field | Value |
|---|---|
| Document title | Provider Settlement Policy |
| Codex prompt ID | P00-13 |
| Complete Breakdown work package | P00-16 |
| Issue ID | P00-FIN-001 |
| Owner role | Finance/Payments Owner + Provider Operations Lead |
| Finance status | DRAFT-PENDING-FINANCE-LEGAL-REGULATORY-ACCOUNTING-AND-TAX-APPROVAL |
| Status | DRAFT-PENDING-FINANCE-LEGAL-REGULATORY-ACCOUNTING-AND-TAX-APPROVAL |
| Review state | PROPOSED; NOT EFFECTIVE UNTIL APPROVED |
| Required reviewers | Founder/Product Owner; Finance/Payments Owner; Nigerian legal counsel; Accounting/tax reviewer; Privacy/DPO; Security Lead; Pharmacy Operations; Laboratory Operations; Engineering/Architecture |
| Last updated | 2026-06-24 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1 |
| Related decisions | REQ-FIN-002 through REQ-FIN-046 |
| Related open questions | OQ-00-387 through OQ-00-491 |
| Related workflows | WFL-020 Payout; WFL-010 Pharmacy order; WFL-013 Laboratory appointment; WFL-022 Claim |
| Related regulatory obligations | REG-OBL-029; REG-OBL-032; REG-OBL-039 |

This document is not legal, tax, accounting, banking, payment-service, insurance, or HMO advice. It does not authorize NelyoHealth to hold customer funds, issue stored value, operate as a payment service provider, bank, payment service bank, mobile-money operator, international money transfer operator, HMO, or insurer. Final payment-provider behavior depends on provider contracts, certification, and verified server-side evidence. Final account classification depends on accounting and legal review. Final tax treatment depends on professional review.

## Scope

This policy covers settlement for doctors, pharmacies, laboratories, hospitals or referral partners where payable, delivery partners, home-care agencies as future scope, and other approved service providers.

## Provider Payable Principles

| Policy ID | Rule | Approval |
|---|---|---|
| STL-POL-001 | Provider payable is a liability or operational obligation subject to accounting review. | REQUIRES_APPROVAL |
| STL-POL-002 | Provider payable is separate from customer funding. | PROPOSED |
| STL-POL-003 | Provider payable is separate from payment-provider settlement. | PROPOSED |
| STL-POL-004 | Provider payable is separate from provider payout. | PROPOSED |
| STL-POL-005 | A quote alone does not create payable. | PROPOSED |
| STL-POL-006 | Payable must link to an eligible service milestone. | REQUIRES_APPROVAL |
| STL-POL-007 | Payable may be held, adjusted, reversed, disputed, or settled through approved entries only. | PROPOSED |
| STL-POL-008 | Provider payable must not be edited directly. | PROPOSED |

## Service Milestone Candidates

| Provider type | Candidate milestone | Approval |
|---|---|---|
| Doctor | Encounter completed; clinical documentation finalized; no cancellation or exception preventing payment. | REQUIRES-CONTRACT-FINANCE-AND-OPERATIONS-APPROVAL |
| Pharmacy | Medication dispensed, collection handover completed, or delivery completed according to contract. | REQUIRES-CONTRACT-FINANCE-AND-OPERATIONS-APPROVAL |
| Laboratory | Specimen collection, test completion, result verification, or result release according to contract. | REQUIRES-CONTRACT-FINANCE-AND-OPERATIONS-APPROVAL |
| Delivery | Delivery completed with approved proof. | REQUIRES-CONTRACT-FINANCE-AND-OPERATIONS-APPROVAL |
| Hospital/referral partner | Accepted referral, attended service, or completed referral outcome where contractually payable. | REQUIRES-CONTRACT-FINANCE-AND-OPERATIONS-APPROVAL |

## Fee Components

Gross service amount, provider base amount, platform fee, payment-provider fee, delivery fee, tax or levy, discount, refund allocation, chargeback allocation, quality or service adjustment only if contractually approved, provider payable, and net payout are conceptual components. No rates, percentages, payout interval, settlement interval, or tax rate is approved.

## Payout Eligibility

A payout requires verified provider identity, verified organization, current required credential, approved payout destination, payout-destination change controls, payable balance, no blocking suspension, no unresolved fraud hold, no unresolved reconciliation exception, required tax or contract evidence, approval, and audit.

## Payout Holds

| Hold reason | Owner | Review and release criteria |
|---|---|---|
| Credential expiry | Credential/Provider Operations | Confirm credential status and contract permission. |
| Provider suspension | Provider Operations + Legal | Resolve suspension or approve restricted payout. |
| Fraud review | Fraud/Finance | Resolve evidence and approvals. |
| Complaint or clinical incident | Operations + Clinical | Confirm safety, legal, and contract effect. |
| Privacy incident | Privacy + Security | Confirm containment and payout effect. |
| Chargeback/refund/negative payable | Finance | Resolve recovery and ledger impact. |
| Reconciliation mismatch | Finance | Close exception with evidence. |
| Payout destination change | Finance + Security | Complete enhanced verification and notification. |
| Regulatory direction or contract dispute | Legal + Finance | Follow approved legal instruction. |

A hold must not silently confiscate funds; every hold requires owner, reason, review, notification where appropriate, release criteria, audit, and appeal/dispute route.

## Payout Workflow

The payout workflow references WFL-020 and covers created, held, approval pending, approved, processing, completed, failed, reversed, cancelled, and reconciliation exception. Duplicate callbacks cannot create duplicate payouts. Payout completion is not payment settlement, not provider payable creation, and not clinical or provider-detail authorization.

## Bank or Payout Destination Change

Payout destination changes require strong authentication, provider authority, independent verification, cooling-off or review question, existing payout hold question, notification, audit, and fraud review. P00-13 invents no time period.

## Settlement Statement

A statement may include statement period, services, order references, gross amounts, fees, taxes or levy questions, adjustments, refunds, chargebacks, payout references, holds, opening/closing balances, evidence links, and dispute instructions. It must exclude full clinical records, raw payment credentials, unrelated patients, and protected pre-payment provider details.

## Provider Exit and Negative Payable

Provider exit, negative payable, overpayment recovery, provider suspension, bank-detail change, and contract dispute require legal/finance review. Recovery must use approved ledger entries and contract routes, not direct editing or silent confiscation.

## Future Financial Test Requirements

| Test ID | Requirement |
|---|---|
| FIN-TST-042 | Provider payable creation requires eligible milestone. |
| FIN-TST-043 | Ineligible milestone does not create payable. |
| FIN-TST-044 | Credential suspension and payout hold block payout. |
| FIN-TST-045 | Payout destination change requires enhanced verification. |
| FIN-TST-046 | Payout approval, completion, failure, duplicate callback, and reversed payout are distinct. |
| FIN-TST-047 | Negative payable and manual adjustment require owner approval and audit. |
| FIN-TST-048 | Settlement statement excludes clinical content and protected pre-payment details. |
