# Family Plan Rules (P00-04)

## Document Control

- Document: `docs/product/family-plan-rules.md`
- Codex prompt ID: `P00-04`
- Complete Breakdown work package: `P00-05`
- Issue ID: `P00-COV-001`
- Owner role: Product + Legal + Clinical + Security
- Review state: `PROPOSED`
- Required reviewers: Product owner, Privacy counsel, Clinical lead, Legal counsel, Security lead
- Last updated: `2026-06-24`
- Related decisions: `REQ-COV-001`, `REQ-COV-002`, `REQ-COV-003`, `REQ-COV-004`, `REQ-COV-005`, `REQ-COV-006`, `REQ-COV-008`, `REQ-COV-018`, `REQ-COV-020`, `REQ-COV-024`, `REQ-COV-025`, `REQ-COV-028`, `REQ-LOCK-001`
- Related open questions: `OQ-00-47`, `OQ-00-48`, `OQ-00-49`, `OQ-00-50`, `OQ-00-67`

## Purpose

This document defines family plans as a financial and administrative umbrella without creating or implying clinical authority.

## Family Concepts

- `Family plan`: funding and administration construct.
- `Household`: continuity grouping of members for funding/administration only.
- `Family-plan administrator`: actor who configures controls and approvals.
- `Family payer`: role that provides funding within policy controls.
- `Adult family-plan member`: self-authorizing adult with explicit consent and continuity protections.
- `Dependent`: member with deferred legal, consent, and activation posture.
- `Beneficiary`: care recipient tied to the same longitudinal patient identity.
- `Invited member`: identity candidate proposed for membership.
- `Accepted member`: invited member with explicit acceptance.
- `Removed member`: member whose funding role has ended.
- `Suspended member`: temporary non-active funding membership.

## Family Plan as Administrative Umbrella

- Family plans support coordination and financing only.
- Family plan does not replace the patient clinical identity.
- Family plan does not create caregiver-level clinical authority by itself.

## Membership Lifecycle

1. Invitation is initiated by an authorized family-plan administrator.
2. Identity matching confirms or declines candidate against continuity records.
3. Existing patient linking reuses existing patient identity.
4. Acceptance records explicit non-clinical and funding consent.
5. Rejection leaves patient continuity unchanged.
6. Activation enables funding participation only.
7. Suspension blocks new funding allocations.
8. Removal stops future family-funded allocations.
9. Transfer updates administrator or payer by explicit action.
10. Re-entry requires renewed invitation and acceptance.
11. Payer change requires explicit reauthorization.

No invitation may create a duplicate patient identity.

## Adult Member Autonomy

An adult member:

- retains their own patient continuity;
- retains independent legal and patient-facing continuity;
- may accept or reject membership;
- may leave the plan and continue platform access under allowed contexts;
- keeps prior clinical record continuity after removal;
- can revoke non-essential sharing where legal controls permit.

## Family Administrator Authority

Allowed:

- invite and remove members;
- configure plan-level spending boundaries and service scope;
- require or waive transaction-level approvals according to policy;
- configure limit alerts and budget notifications;
- review plan-level funding events and exceptions.

Prohibited by default:

- automatic clinical access or diagnosis visibility;
- direct consultation note access;
- prescription or result access;
- emergency flow overrides.

## Family Payer Authority

Family payer actions are financial-first:

- pay/authorize eligible transactions;
- view finance snapshots for supported payer context;
- request funding audit artifacts where legally permissible;
- not receive protected provider-location details before authorized order-level unlock;
- not receive routine full clinical data without explicit legal basis.

## Family Funding Rules

- Family plan may include monthly/annual period budgets.
- No-approval-below-threshold mode is configurable.
- Transaction-level approval mode is configurable.
- Service-category-specific approval mode is configurable.
- Per-member or shared budget models can coexist only with explicit policy.
- No silent fallback from one family source to another.

## Family Spending and Priority Handling

- If family and non-family sources are both available, actor selection drives source selection.
- If policies conflict, funding flow stops and explicit clarification is required.
- Family-funded and non-family pathways do not auto-switch.

## Family Coverage and Continuity

- Family plan activation/deactivation updates only funding authority.
- Clinical continuity remains patient-owned and patient-centered.
- Member termination does not erase treatment history.
- New payer changes do not auto-transfer clinical permissions.

## Failure Cases

- Duplicate invitation and duplicate identity detection.
- Unsupported dependent onboarding.
- Suspended membership attempts to fund active care.
- Wrong tenant or tenant mismatch.
- Administrator removed mid-careflow.
- Revocation during approval or pending funding.
- Adult member rejected membership after invite.
- Funding source transfer in progress.
- Wrong beneficiary relation.
- Sponsor/family policy conflict.

## Examples

1. Adult member accepts sponsor invitation and funds a consultation.
2. Family member requests family funding with explicit consent.
3. Family-admin approves service-category-limited spend.
4. Family budget exhaustion blocks further non-approved allocations.
5. Family member leaves after completed care with continuity preserved.

## Failure and Escalation Examples

1. Member removal during active care pauses new funding and escalates state review.
2. Duplicate member identity mismatch blocks allocation until resolved.
3. Administrator transfer mid-flow requires explicit reauthorization.

## Minor Boundary

- Adult family-member behavior is implemented in scope for now.
- Minor, guardian, and dependent-specific flows are deferred to later phases and do not grant sponsor clinical access by default.

