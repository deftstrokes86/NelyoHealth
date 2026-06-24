# Diaspora Plan Rules (P00-04)

## Document Control

- Document: `docs/product/diaspora-plan-rules.md`
- Codex prompt ID: `P00-04`
- Complete Breakdown work package: `P00-05`
- Issue ID: `P00-COV-001`
- Owner role: Product + Legal + Finance + Clinical + Security
- Review state: `PROPOSED`
- Required reviewers: Product owner, Finance owner, Legal counsel, Clinical lead, Privacy counsel
- Last updated: `2026-06-24`
- Related decisions: `REQ-COV-001`, `REQ-COV-003`, `REQ-COV-006`, `REQ-COV-007`, `REQ-COV-011`, `REQ-COV-012`, `REQ-COV-013`, `REQ-COV-018`, `REQ-COV-019`, `REQ-COV-020`, `REQ-COV-022`, `REQ-COV-023`, `REQ-COV-024`, `REQ-LOCK-001`, `REQ-LOCK-002`, `REQ-LOCK-004`
- Related open questions: `OQ-00-44`, `OQ-00-45`, `OQ-00-55`, `OQ-00-56`, `OQ-00-57`, `OQ-00-52`, `OQ-00-53`, `OQ-00-54`, `OQ-00-58`, `OQ-00-63`, `OQ-00-64`, `OQ-00-66`, `OQ-00-67`, `OQ-00-68`, `OQ-00-69`

## Purpose

Define sponsorship across borders as payment support for Nigerian care delivery without becoming clinical ownership or insurer behavior.

## Diaspora Concepts

- `Diaspora sponsor`: sponsor outside immediate care geography with authority to fund per mandate.
- `Beneficiary`: adult patient receiving funded care.
- `Sponsorship invitation`: proposal event between sponsor and beneficiary.
- `Beneficiary acceptance`: explicit confirmation of support.
- `Sponsorship mandate`: formalized funding authority statement.
- `Sponsor budget`: sponsor-specific allocation pool.
- `Approval rule`: policy gate for a sponsorship funding action.
- `Spending category`: service classes eligible under mandate.
- `Sponsorship revocation`: explicit withdrawal of authority.
- `International payment`: payment source outside domestic payer rails.
- `Settlement currency`: settlement currency after FX normalization.
- `Local care fulfilment`: local Nigeria care execution under local clinical and provider constraints.

## Invitation and Acceptance

1. Sponsor invites a specific beneficiary.
2. Beneficiary identity is matched without creating a new patient identity.
3. Beneficiary confirms acceptance where policy requires.
4. Sponsorship mandate becomes active per policy scope.
5. Funded care may proceed only after activation.
6. Rejection or non-response preserves patient continuity but no sponsor-funded allocation.

## Sponsor Approval Modes

- No approval below configured limit.
- Approval per transaction above configured limit.
- Allowed service categories for each sponsor.
- Monthly and/or annual budget checks.
- All approval modes must be logged and explicit.

## Sponsor Visibility

Sponsor visibility includes:

- sponsorship status;
- acceptance status;
- budget and quota state;
- approval requests;
- funding outcomes;
- non-clinical order states;
- aggregate exception states where allowed.

Sponsor visibility excludes:

- clinical notes;
- diagnosis;
- prescription details;
- laboratory details;
- protected records;
- unrestricted appointment stream data.

## Funding and Source Selection

- Sponsor may fund only accepted beneficiaries.
- Beneficiary may decline or leave sponsorship.
- No implicit funding source switch to non-sponsor funding without explicit policy and actor re-authorization.

## Coverage and Expiry

- Sponsorship active period constrains start of allocations.
- Expired or suspended sponsorship blocks future allocations.
- New transactions require active mandate.
- Existing order continuity preserved with blocked continuation policy.

## Diaspora Currency and Cross-Border Controls

- Currency display and exchange behavior is unresolved and remains `REQUIRES_APPROVAL`.
- Cross-border processing constraints and legal checks are defined in later prompts.
- No automatic selected payment provider assumptions are made in this phase.
- Settlement currency, remittance rails, and FX settlement timing remain unresolved and are not finalized in this phase.

## Cross-Border Payment Boundary (Conceptual)

- Foreign payer identity must be validated before payment orchestration begins.
- Settlement currency policy is unresolved and remains `REQUIRES_APPROVAL`.
- Exchange source and rate-refresh constraints are unresolved.
- Failed international payments must map to explicit failure states and avoid partial allocation without authorization.

## Sponsorship Revocation and Continuity

- Revocation blocks future allocations.
- Revocation during active orders does not erase patient continuity.
- Pending allocations require explicit closure policy.
- Existing successful paid actions follow `P00-13` reversal and refund flow.

## Sponsor Provider-Visibility and Privacy

- Sponsor may see `providerDisplayName` only where pre-payment rules permit.
- Post-payment provider-detail visibility is possible only if order-level and actor-level authorization is explicitly approved.
- No hidden or uncatalogued provider detail leakage is permitted before payment.

## Examples

1. Diaspora sponsor funds consultation after beneficiary acceptance.
2. Sponsored medicine order with beneficiary confirmation.
3. Sponsored laboratory order requiring sponsor approval mode.
4. Sponsor rejection and self-pay fallback only after explicit reauthorization.
5. Sponsor revocation after payment while refund policy is pending.

## Failure Cases

- Verification failure.
- Expired or unsupported invitation.
- Beneficiary declines sponsorship.
- Sponsor mandate expiry.
- FX and international payment mismatch.
- Budget exhausted.
- Approval timeout.
- Sponsor revocation before or during order processing.
- Out-of-scope geographic mismatch.
- Active order queried after revocation.
- Sponsor tries to access another beneficiary's order.

## Emergency Access

- Emergency escalation cannot be blocked by sponsor approval or funding status.

## Deferred Items

- Detailed currency settlement controls.
- Advanced international reconciliation.
- Tax and compliance automation.
- Cross-jurisdiction provider or payment integrations.
