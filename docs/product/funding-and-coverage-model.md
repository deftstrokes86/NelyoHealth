# NelyoHealth Funding and Coverage Model (P00-04)

## Document Control

- Document: `docs/product/funding-and-coverage-model.md`
- Codex prompt ID: `P00-04`
- Complete Breakdown work package: `P00-05`
- Issue ID: `P00-COV-001`
- Owner role: Product + Finance + Clinical + Legal governance
- Review state: `PROPOSED`
- Required reviewers: Product owner, Finance owner, Clinical lead, Privacy counsel, Legal counsel, Security lead
- Last updated: `2026-06-24`
- Related decisions: `REQ-COV-001`, `REQ-COV-002`, `REQ-COV-003`, `REQ-COV-004`, `REQ-COV-005`, `REQ-COV-006`, `REQ-COV-007`, `REQ-COV-008`, `REQ-COV-009`, `REQ-COV-010`, `REQ-COV-011`, `REQ-COV-012`, `REQ-COV-013`, `REQ-COV-014`, `REQ-COV-015`, `REQ-COV-016`, `REQ-COV-017`, `REQ-COV-018`, `REQ-COV-019`, `REQ-COV-020`, `REQ-COV-021`, `REQ-COV-022`, `REQ-COV-023`, `REQ-COV-024`, `REQ-COV-025`, `REQ-COV-026`, `REQ-COV-027`, `REQ-COV-028`, `REQ-LOCK-001`, `REQ-LOCK-002`, `REQ-LOCK-003`, `REQ-LOCK-004`, `REQ-LOCK-005`, `REQ-LOCK-006`, `REQ-LOCK-007`, `REQ-LOCK-008`, `REQ-LOCK-009`, `REQ-LOCK-010`
- Related open questions: `OQ-00-44`, `OQ-00-45`, `OQ-00-46`, `OQ-00-47`, `OQ-00-48`, `OQ-00-49`, `OQ-00-50`, `OQ-00-51`, `OQ-00-52`, `OQ-00-53`, `OQ-00-54`, `OQ-00-55`, `OQ-00-56`, `OQ-00-57`, `OQ-00-58`, `OQ-00-59`, `OQ-00-60`, `OQ-00-61`, `OQ-00-62`, `OQ-00-63`, `OQ-00-64`, `OQ-00-65`, `OQ-00-66`, `OQ-00-67`, `OQ-00-68`, `OQ-00-69`

## Purpose

This document defines conceptual funding behavior for all care transactions without defining final payment-provider, ledger, claim, or commercial implementation details.

## Canonical Concepts

- `Funding source`: entity or mechanism that can authorize, allocate, or guarantee part or all of a transaction.
- `Payer`: actor that initiates and authorizes funding for a transaction.
- `Sponsor`: non-insurance funding actor such as family or diaspora supporter.
- `Beneficiary`: patient receiving care in a transaction.
- `Family-plan member`: adult or dependent person included in a family funding arrangement.
- `Coverage member`: person with one or more active coverage relationships.
- `Benefit package`: scope and entitlement definition for a coverage arrangement.
- `Benefit`: unit of entitlement under a package.
- `Coverage`: policy envelope defining who, what, where, limits, and effective period.
- `Eligibility`: decision that a source is valid for a specific patient/transaction context.
- `Spending limit`: approved budget threshold by period, actor, category, or source.
- `Budget`: remaining amount under a funding context for the applicable period.
- `Copayment`: amount that remains payable by the beneficiary after funding coverage.
- `Patient shortfall`: residual amount still unpaid after all allowed funding contributions.
- `Approval rule`: explicit precondition before a source can be used.
- `Funding authorization`: binding authorization of a source for a transaction and actor/context.
- `Funding allocation`: distribution of required payment across one or more sources.
- `Original funding source`: source(s) that actually funded each transaction line.
- `Refund recipient`: source entitled to recovered funds based on allocation.
- `Coverage period`: active service window for a source.
- `Waiting period`: deferred effective window before coverage can be used.
- `Suspension`: temporary disablement of a source or sponsor relationship.
- `Effective date`: date when coverage or mandate becomes usable.
- `Grace period`: optional continuation period after expiry with explicit approval.
- `Expiry date`: date after which coverage is not usable for new allocations.
- `Revocation`: explicit termination of funding authority.
- `Exhausted benefit`: zero remaining budget under current terms.
- `Service restriction`: disallowed clinical or transaction service class for a source.
- `Provider network restriction`: provider, facility, or branch constraints on source usage.

## Supported Arrangement Types

Each arrangement below includes principal and required fields.

### 1) Individual self-pay

- Primary actor: beneficiary (or lawful delegate).
- Beneficiary: same beneficiary and patient identity.
- Funding authority: beneficiary-driven funding authorization.
- Eligibility source: payer identity, active patient context, transaction category.
- Spending authority: beneficiary approval at transaction level.
- Effective dates: bound at transaction intent creation.
- Expiry behavior: no silent extension; each transaction decides with current authorization context.
- Refund destination: capturing source for paid amount.
- Pilot scope: active.
- Failure cases: authorization denied, incomplete beneficiary data, partial capture failure.

### 2) Family-funded care

- Primary actor: family-plan administrator or family payer.
- Beneficiary: family-plan member.
- Funding authority: family budget and configured approval rules.
- Eligibility source: active family membership and coverage rules.
- Spending authority: family-configured policy with optional approvals.
- Visibility boundary: non-clinical financial and fulfilment-trace status only.
- Effective dates: plan start and plan end.
- Expiry behavior: new allocations blocked after period expiry or revocation.
- Refund destination: family share by original funding allocation.
- Pilot scope: active.
- Failure cases: membership mismatch, benefit exhaustion, revoked membership, unsupported service category.

### 3) Diaspora-sponsored care

- Primary actor: diaspora sponsor.
- Beneficiary: accepted sponsored beneficiary.
- Funding authority: sponsor approval plus beneficiary linkage policy.
- Eligibility source: verified sponsor-beneficiary relationship.
- Spending authority: sponsor budget or configured transaction authority.
- Visibility boundary: finance and non-clinical status fields only.
- Effective dates: sponsorship effective/expiry window.
- Expiry behavior: no allocation starts after sponsorship suspension/expiry.
- Refund destination: sponsor share by allocation.
- Pilot scope: active for adults only (deferrable beneficiary policy, not automatic clinical role).
- Failure cases: cross-border verification mismatch, sponsor approval failure, no active mandate.

### 4) Employer-funded care

- Primary actor: employer benefits administrator (conceptual only in this phase).
- Beneficiary: eligible employee.
- Funding authority: employer-defined policy and plan controls.
- Eligibility source: roster and employment state.
- Spending authority: employer finance controls and eligibility rules.
- Visibility boundary: aggregate finance status and approvals, no routine clinical record fields.
- Effective dates: employer plan period and membership validity.
- Expiry behavior: no future employer allocations after term or offboarding.
- Refund destination: employer settlement path according to later payment policy.
- Pilot scope: DESIGN-NOW-IMPLEMENT-LATER.
- Failure cases: roster conflict, employee termination, coverage insufficiency, duplicate employee identity mapping.

### 5) HMO-covered care

- Primary actor: HMO operations actor (conceptual only in this phase).
- Beneficiary: eligible HMO member.
- Funding authority: HMO eligibility and benefit rules.
- Eligibility source: HMO member and coverage status.
- Spending authority: HMO limits and patient copay logic.
- Visibility boundary: authorization, claims, and settlement context, no routine clinical full record.
- Effective dates: HMO member coverage period.
- Expiry behavior: new allocations blocked after expiry unless policy override exists.
- Refund destination: HMO settlement path according to later payment policy.
- Pilot scope: DESIGN-NOW-IMPLEMENT-LATER.
- Failure cases: member number mismatch, coverage lapse, prior-auth failure, out-of-network spend.

## Conceptual Transaction Funding Flow

1. Identify patient and active care transaction intent.
2. Discover funding arrangements associated with patient and transaction context.
3. Filter by eligibility, effective period, service class, tenant, and policy constraints.
4. Filter by budget, limit, and network restrictions.
5. Present eligible funding sources to the authorized actor.
6. Require explicit funding-source selection per actor policy.
7. Collect mandatory approvals for source, amount band, and category rules.
8. Calculate covered amount, copay, and patient shortfall.
9. Create proposed funding allocation for the exact transaction.
10. Validate allocation against authorization and actor context.
11. Bind selected source(s) to the transaction.
12. Execute the care fulfillment path only after successful funding decision.
13. Reconcile and issue receipt metadata.
14. Handle exceptions and reversals and return unspent or refunded allocation records.

## Funding Source Selection

- A patient or authorized funding actor may choose a source when policy permits.
- Patient selection may be mandatory for explicit source control scenarios.
- Employer and HMO selection can enforce higher policy precedence.
- Payer approval does not automatically authorize all transaction categories.
- If selection fails, no fallback occurs unless an explicit re-authorization flow is completed.

## Overlapping Funding Sources

When multiple sources are eligible:

- Apply explicit priority policy (`PROPOSED`) and actor selection.
- Require policy-compliant approvals before split use.
- Do not apply implicit precedence beyond documented policy.
- Explicitly disallow cross-source fallback without new authorization.
- Suggested priority policy options for overlap resolution (`PROPOSED`):
  - explicit actor priority,
  - service-first priority,
  - coverage-first priority,
  - policy-first priority.
- Overlap examples:
  - HMO-covered consultation plus patient copay.
  - Employer-funded consultation plus self-pay shortfall.
  - Family-funded consultation plus diaspora sponsor supplement.
  - Diaspora sponsor plus patient self-pay.
  - Two authorized sponsors on one eligible transaction.
  - Coverage expiry during an active care journey.

## Partial Coverage and Split Payment

- Covered amount = sum of all authorized funding contributions.
- Copayment = remaining amount after coverage.
- Uncovered amount = patient or alternate actor residual amount.
- Split authorization requires explicit approval records for each contributing source.
- Multiple sources may fund different transaction lines only under explicit policy.
- No source may capture funds without authorization.
- If one source becomes unavailable, recalculate with explicit re-authorization.
- Cancellation before fulfilment requires explicit cancellation of provisional allocations.

## Effective Dates and Expiry

- Each source has start date, end date, effective date, expiry date, waiting period, grace period, suspension, and revocation logic.
- Waiting period and grace period are explicit policy controls and must be approved.
- Expiry, waiting-period end, or grace-period expiry prevents new allocations and triggers blocked-state transitions without data loss.
- Retroactive corrections remain `REQUIRES_APPROVAL` for later legal and policy analysis.
- Transactions created before expiry preserve continuity while preventing post-expiry re-use unless an approved continuation policy exists.
- New source selection is required when coverage is waiting, in grace-limit mode, or inactive.

## Coverage and Patient Continuity

- A patient has one longitudinal identity; funding changes do not create duplicate patient identity.
- Coverage suspension, revocation, or expiry never deletes patient or clinical continuity.
- Changing funder does not re-point ownership of clinical history.
- Family/diaspora/employer/HMO transitions preserve established person and access continuity for allowed patient scope.

## Refund and Reversal Principles

- Refunds return to original source(s) proportionally to allocation.
- Split-funded refunds are apportioned by actual funded component share.
- Refund destination may be blocked when the source is revoked; unresolved state must be escalated.
- Reversal and chargeback state transitions are defined in `P00-13` and remain `REQUIRES_APPROVAL`.
- Failed refunds must preserve patient continuity and audit events.

## Audit and Notifications

- `source.discovered`
- `source.selected`
- `funding.source.approved`
- `funding.source.rejected`
- `funding.allocation.created`
- `funding.allocation.cancelled`
- `approval.requested`
- `approval.granted`
- `approval.expired`
- `limits.changed`
- `coverage.activated`
- `coverage.suspended`
- `coverage.exhausted`
- `coverage.expired`
- `funding.requested`
- `funding.paid`
- `funding.failed`
- `funding.recaptured`
- `split.authorization.granted`
- `refund.requested`
- `refund.authorized`
- `refund.completed`
- `refund.failed`
- `revocation.requested`
- `revocation.completed`

Notifications should include only non-clinical finance and funding state for payer actors.

## Examples

1. Self-pay consultation with patient shortfall.
2. Family-funded consultation with pre-visit approval.
3. Family budget funding for repeated consultation sessions.
4. Diaspora-sponsored pharmacy order.
5. Employer-covered consultation with copay.
6. HMO coverage request requiring prior authorization.
7. Split-funded order with explicit family sponsor + diaspora contribution.
8. Expired coverage with active care continuity.
9. Sponsor revocation during pending order.
10. Emergency escalation without prior funding confirmation.

## Failure Cases

- Ineligible patient or wrong beneficiary context.
- Expired coverage relationship.
- Exhausted benefit limits.
- Unsupported service category.
- Out-of-network provider usage.
- Approval timeout or non-response.
- Conflicting funding sources.
- Partial authorization failure.
- Wrong tenant.
- Sponsor revocation before allocation capture.
- Employer offboarding before fulfilment.
- HMO response timeout.
- Out-of-band payer identity mismatch.
- Duplicate funding attempts or duplicate order linkage.
- Refund destination unavailable.
- No provider-disclosure state due to funding failure.
