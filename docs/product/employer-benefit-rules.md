# Employer Benefit Rules (P00-04)

## Document Control

- Document: `docs/product/employer-benefit-rules.md`
- Codex prompt ID: `P00-04`
- Complete Breakdown work package: `P00-05`
- Issue ID: `P00-COV-001`
- Owner role: Product + Legal + Finance + Clinical + Security
- Review state: `PROPOSED`
- Required reviewers: Product owner, Finance owner, Legal counsel, Privacy counsel
- Last updated: `2026-06-24`
- Related decisions: `REQ-COV-002`, `REQ-COV-004`, `REQ-COV-009`, `REQ-COV-010`, `REQ-COV-011`, `REQ-COV-014`, `REQ-COV-015`, `REQ-COV-018`, `REQ-COV-020`, `REQ-COV-022`, `REQ-COV-023`, `REQ-COV-024`, `REQ-COV-025`, `REQ-COV-028`, `REQ-SCOPE-011`, `REQ-LOCK-002`
- Related open questions: `OQ-00-58`, `OQ-00-59`, `OQ-00-60`, `OQ-00-61`, `OQ-00-62`, `OQ-00-63`, `OQ-00-64`, `OQ-00-65`

## Purpose

This document defines employer funding as a deferred-runtime, non-clinical finance mechanism that can support care transactions without creating clinical access.

## Employer Coverage Model

- `Employer`: sponsoring organization.
- `Employer benefit package`: contract-defined benefit scope.
- `Employee`: beneficiary under employer relationship.
- `Employer payer`: financial role in policy execution.
- `Coverage period`: start/end window for active participation.
- `Employer admin`: operator managing program setup and policy.
- `Employer finance operator`: operator managing invoices and reconciliation artifacts.
- `Employee roster`: active membership set with enrollment state.
- `Member number`: roster identifier for coverage matching.
- `Employer benefit`: financial or policy resource used for supported services.

## Coverage Scope

- Employer support is time-bound and employee-specific.
- Coverage supports selected service classes only.
- Employer actors do not automatically gain clinical rights.
- Employer relationship is separate from clinical record ownership.

## Employer Lifecycle Flow

1. Employee is associated with eligible coverage context.
2. Eligibility and roster status are validated.
3. Employee selects eligible funding option (subject to policy).
4. Funding authorization is requested and approved.
5. Allocation is created against the selected order.
6. Execution proceeds only with valid authorization.
7. Offboarding updates future allocation behavior.

## Employer Funding Governance

- Employer source selection requires explicit actor action where required.
- Automatic source selection is limited to pre-approved scopes and policy-approved modes.
- No silent fallback from employer funding to another funding source.
- Split funding with family/diaspora/HMO requires explicit authorization.

## Employer Finance and Administrative Authority

Employer operators may:

- configure aggregate budgets and policy controls;
- maintain roster and eligibility context;
- view finance summaries and supported invoice metadata;
- review approved exceptions and settlement artifacts.

Employer operators may not:

- access clinical notes;
- access prescriptions or laboratory findings;
- access protected provider-location details;
- perform automatic clinical override.

## Employer Offboarding Continuity

- Employee offboarding blocks future employer-funded allocations.
- Existing continuity, historical clinical records, and patient access remain.
- Active orders follow exception-handling policy for completion or safe closure.
- Refund mappings follow original-source and allocation rules in later payment docs.

## Employer Reporting

- Employer reporting is aggregate and de-identified where required.
- Allowed: spend by service class, funding exceptions, coverage anomalies.
- Prohibited by default: protected clinical records.

## Employer and HMO/Sponsor Combination

- Employer and HMO sponsorship may co-exist in a single transaction only with explicit policy and actor selection.
- No automatic precedence across source categories.
- All overlaps require logged approvals.

## Emergency and Continuity

- Emergency escalation is independent of employer authorization, plan coverage, or payment status.
- Patient continuity does not depend on continued employer funding.

## Examples

1. Employee selects employer funding for a consultation.
2. Employer funding denied; patient continues with self-pay or another source.
3. Employer-funded consultation with beneficiary shortfall.
4. Employee leaves during active workflow; future allocations stop.
5. Employer coverage expires while a pending order remains unresolved.

## Failure Cases

- Roster drift or offboarding.
- Coverage insufficiency.
- Duplicate employee identity conflict.
- Unsupported employee category.
- Administrative over-authorization attempt.
- Settlement destination unavailable.
- Reporting granularity or entitlement mismatch.

## Pilot and Deferred Scope

- Employer runtime is `DESIGN-NOW-IMPLEMENT-LATER` in this phase.
- Payroll and claims APIs are design artifacts only until later prompts.

