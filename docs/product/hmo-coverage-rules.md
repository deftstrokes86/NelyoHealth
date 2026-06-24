# HMO Coverage Rules (P00-04)

## Document Control

- Document: `docs/product/hmo-coverage-rules.md`
- Codex prompt ID: `P00-04`
- Complete Breakdown work package: `P00-05`
- Issue ID: `P00-COV-001`
- Owner role: Product + Clinical + Legal + Finance + Security
- Review state: `PROPOSED`
- Required reviewers: Product owner, Clinical lead, Legal counsel, Privacy counsel
- Last updated: `2026-06-24`
- Related decisions: `REQ-COV-006`, `REQ-COV-007`, `REQ-COV-008`, `REQ-COV-009`, `REQ-COV-010`, `REQ-COV-011`, `REQ-COV-012`, `REQ-COV-013`, `REQ-COV-014`, `REQ-COV-015`, `REQ-COV-016`, `REQ-COV-017`, `REQ-COV-018`, `REQ-SCOPE-011`, `REQ-LOCK-002`
- Related open questions: `OQ-00-61`, `OQ-00-62`, `OQ-00-63`, `OQ-00-64`, `OQ-00-65`, `OQ-00-66`, `OQ-00-67`, `OQ-00-68`, `OQ-00-69`

## Purpose

This document defines HMO-funded care as a time-bound source of financing with strict authorization, authorization-state, and visibility boundaries.

## HMO Concepts

- `HMO`: benefits organization coordinating policy, authorization, and claim flow.
- `HMO administrator`: policy and support actor.
- `HMO claims operator`: operator for claim preparation and status review.
- `HMO member`: person with active membership and member identity.
- `Member number`: enrollment identifier for validation.
- `Coverage`: active contract state and benefit envelope.
- `Benefit package`: eligible service set and limits.
- `Eligibility`: policy-level validation result for a transaction.
- `Service limit`: per-period or per-service cap.
- `Copayment`: beneficiary-responsible remainder.
- `Provider network`: approved provider set for the coverage.
- `Exclusion`: disallowed service category.
- `Patient shortfall`: amount not covered by HMO.
- `Claim`: accounting and adjudication artifact.
- `Claim line`: line-level claim component with code and amount.
- `Prior authorization`: required pre-funding policy for certain services.
- `Denial`: policy rejection requiring appeal or alternative funding.
- `Appeal`: challenge process for denial.
- `Remittance`: settlement or reimbursement summary.

## Eligibility

Eligibility checks occur before source selection:

1. Member identity and continuity match.
2. Coverage period validity.
3. Plan/service category eligibility.
4. Provider network and location constraints.
5. Benefit limit availability.
6. Prior authorization requirement resolution.

HMO coverage cannot apply where service category, limit, or network rules fail.

## Prior Authorization

States:

- `not_required`
- `requested`
- `pending`
- `approved`
- `partially_approved`
- `denied`
- `expired`
- `cancelled`

HMO-covered fulfillment requires approved authorization state where required by plan.

## Coverage Calculation

- Covered amount = allowed amount minus copay under active limits.
- Full coverage applies only when policy and limits permit.
- Partial coverage is explicit and requires visible shortfall.
- Exclusion and out-of-network checks are hard-fail by default.
- Patient shortfall remains payable through allowed fallback source.

## Coverage Stacking and Priority

- Concurrent family, diaspora, employer, and HMO availability requires explicit selection policy.
- No silent cross-source stacking.
- Explicit actor consent and policy alignment required for any split allocation.

## HMO Visibility and Data Boundary

HMO actors may receive only purpose-specific information:

- eligibility state
- authorization state
- claim and claim-line payloads
- denial and appeal records
- remittance artifacts

HMO actors may not receive routine full clinical records.

Any required clinical information for claims must be:

- minimal and purpose-specific;
- authorized by legal and policy owner;
- auditable.

## Coverage Termination and Continuity

- Coverage end stops new allocations.
- Clinical continuity remains with patient regardless of coverage status.
- Active orders with completed care require exception handling on expired coverage.
- No automatic transfer to another coverage source.

## HMO Exception and Failure Cases

- Member does not match active enrollment.
- Service category excluded for current benefit package.
- Network mismatch.
- Duplicate member records.
- Authorization timeout.
- Coverage period expired during active care.
- Claim denied after service with no reversion policy.
- Duplicate authorization and out-of-sync states.

## Examples

1. HMO member uses eligible consultation benefit.
2. HMO plan applies copay with explicit patient shortfall.
3. Consultation requiring prior authorization.
4. Out-of-network provider request blocked pending policy.
5. Claim denied with escalation to appeal.

## Future Integration Boundary

- HMO eligibility APIs, claims submission, claim status, and remittance export remain design artifacts.
- No live claim adjudication in this phase.

