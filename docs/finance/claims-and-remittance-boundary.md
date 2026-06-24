# Claims and Remittance Boundary

## Document Control

| Field | Value |
|---|---|
| Document title | Claims and Remittance Boundary |
| Codex prompt ID | P00-13 |
| Complete Breakdown work package | P00-16 |
| Issue ID | P00-FIN-001 |
| Owner role | Finance/Payments Owner + HMO/Employer Operations Owner + Privacy Counsel |
| Finance status | DRAFT-PENDING-FINANCE-LEGAL-REGULATORY-ACCOUNTING-AND-TAX-APPROVAL |
| Status | DRAFT-PENDING-FINANCE-LEGAL-REGULATORY-ACCOUNTING-AND-TAX-APPROVAL |
| Review state | PROPOSED; NOT EFFECTIVE UNTIL APPROVED |
| Required reviewers | Founder/Product Owner; Finance/Payments Owner; Nigerian legal counsel; Accounting/tax reviewer; Privacy/DPO; Security Lead; Pharmacy Operations; Laboratory Operations; Engineering/Architecture |
| Last updated | 2026-06-24 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1 |
| Related decisions | REQ-FIN-002 through REQ-FIN-046 |
| Related open questions | OQ-00-387 through OQ-00-491 |
| Related workflows | WFL-021 Prior authorization; WFL-022 Claim; WFL-020 Payout; WFL-018 Payment intent |
| Related regulatory obligations | REG-OBL-029; REG-OBL-030; REG-OBL-032; REG-OBL-039 |

This document is not legal, tax, accounting, banking, payment-service, insurance, or HMO advice. It does not authorize NelyoHealth to hold customer funds, issue stored value, operate as a payment service provider, bank, payment service bank, mobile-money operator, international money transfer operator, HMO, or insurer. Final payment-provider behavior depends on provider contracts, certification, and verified server-side evidence. Final account classification depends on accounting and legal review. Final tax treatment depends on professional review.

## Boundary Principles

| Policy ID | Rule | Approval |
|---|---|---|
| CLM-POL-001 | Eligibility is not payment. | APPROVED as boundary rule |
| CLM-POL-002 | Prior authorization is not payment unless an approved guarantee evidence profile exists. | APPROVED as boundary rule |
| CLM-POL-003 | Claim submission is not claim approval. | PROPOSED |
| CLM-POL-004 | Claim approval is not remittance. | PROPOSED |
| CLM-POL-005 | Remittance is not provider payout. | PROPOSED |
| CLM-POL-006 | Provider payable is distinct from remittance and payout. | PROPOSED |
| CLM-POL-007 | NelyoHealth does not assume insurance risk without external legal and commercial approval. | APPROVED as representation boundary |
| CLM-POL-008 | Employer/HMO live operation remains deferred until approvals, contracts, and evidence profiles are accepted. | REQUIRES_APPROVAL |
| CLM-POL-009 | Claim and remittance data use minimum-necessary clinical and financial data. | PROPOSED |
| CLM-POL-010 | HMO/employer funding does not grant clinical-record access by default. | APPROVED |

## Conceptual Flow

1. Eligibility check confirms plan/member relationship only.
2. Prior authorization may confirm proposed coverage rules but does not by itself secure funding for pilot.
3. A service order is created and funded by approved evidence profile or remains coverage-pending.
4. Claim submission packages minimum-necessary data under approved contract/privacy basis.
5. Claim approval may create a receivable only after contract and accounting review.
6. Remittance received is allocated to claim/order/provider/accounting references.
7. Provider payable and payout follow separate settlement policy and may not wait for HMO remittance unless contract requires it.
8. Denial, partial approval, or shortfall routes to approved patient/sponsor/employer/HMO responsibility rules without silent fallback.

## Claim Data Boundary

Claim packets may include minimum necessary identifiers, order/service code, invoice reference, coverage reference, payable amount, approval/denial reason code, and audit/correlation references where approved. They must not include full clinical records, unnecessary diagnostic detail, raw payment credentials, hidden provider location metadata, or unrelated family/employer/HMO data. Any clinical evidence for claim support requires legal, privacy, clinical, and contract approval.

## Employer and HMO Arrangement Boundary

Employer direct budget and HMO/insurance arrangements are not interchangeable. Employer budget remaining is not cash. HMO eligibility is not payment. Employer guarantee and HMO guarantee models are DESIGN-NOW-IMPLEMENT-LATER and require legal, finance, accounting, tax, privacy, security, product, operations, and counterparty approval.

## Claims, Remittance, and Disclosure

Claim approval, remittance, employer eligibility, HMO eligibility, prior authorization, or sponsor approval does not directly expose provider details. Only a separate ProviderDetailDisclosureDecision may establish ProviderDetailDisclosureEligibilityEstablished for an exact selected authorized order, and only after the approved financial evidence profile is satisfied.

## Denial, Shortfall, Appeal, and Recovery

Denied or partially approved claims must identify owner, patient/sponsor/employer/HMO responsibility question, communication route, dispute/appeal route, finance impact, provider payable impact, privacy constraints, and audit. No silent fallback to another payer is allowed. Recovery from HMO, employer, provider, sponsor, or patient requires approved contracts and legal review.

## Future Financial Test Requirements

| Test ID | Requirement |
|---|---|
| FIN-TST-049 | Eligibility is not payment. |
| FIN-TST-050 | Prior authorization is not remittance or payment. |
| FIN-TST-051 | Claim submission, duplicate claim, partial approval, denial, and appeal are distinct. |
| FIN-TST-052 | Remittance allocation is not provider payout. |
| FIN-TST-053 | Patient shortfall does not silently fall back to another source. |
| FIN-TST-054 | Claims use minimum-necessary clinical data. |
| FIN-TST-055 | HMO tenant/member isolation is enforced. |
| FIN-TST-056 | Employer/HMO guarantee remains approval-gated and not pilot-valid unless approved. |
