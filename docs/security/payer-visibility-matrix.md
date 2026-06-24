# Payer Visibility Matrix (P00-04)

## Document Control

- Document: `docs/security/payer-visibility-matrix.md`
- Codex prompt ID: `P00-04`
- Complete Breakdown work package: `P00-05`
- Issue ID: `P00-COV-001`
- Owner role: Finance + Security + Clinical
- Review state: `PROPOSED`
- Required reviewers: Product owner, Finance owner, Privacy counsel, Clinical lead, Security lead
- Last updated: `2026-06-24`
- Related decisions: `REQ-COV-001` to `REQ-COV-028`, `REQ-LOCK-001` to `REQ-LOCK-010`
- Related open questions: `OQ-00-44` to `OQ-00-69`

## Purpose

This matrix is a **policy intent view** that separates financial authority from clinical records and ties payer access to explicit authorization context. It is not a permission implementation schema.

## Allowed values

- `EXPECTED`
- `CONDITIONAL`
- `NOT-PERMITTED`
- `NOT-APPLICABLE`
- `BREAK-GLASS-ONLY`

## Payer visibility policy matrix

| Actor | View funding-source availability | Select funding source | Approve spending | Configure spending limit | View budget balance | View benefit eligibility | View benefit limits | View copay | View uncovered amount | Pay | View payment status | View refund status | View receipt | View invoice | View aggregate spend | View beneficiary identity | View appointment status | View nonclinical fulfilment status | View providerDisplayName before payment | View provider details after payment | View diagnosis | View consultation note | View prescription | View laboratory order | View laboratory result | View limited clinical summary | View full clinical record | View claims documentation | View audit history | Manage membership | Revoke funding | View emergency escalation status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Patient self-payer | EXPECTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[1] | CONDITIONAL[1] | EXPECTED | EXPECTED | EXPECTED | EXPECTED | CONDITIONAL[3] | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | EXPECTED | EXPECTED | EXPECTED | EXPECTED | CONDITIONAL[8] | CONDITIONAL[4] | CONDITIONAL[4] | CONDITIONAL[4] | CONDITIONAL[4] | CONDITIONAL[4] | CONDITIONAL[4] | NOT-PERMITTED | CONDITIONAL[9] | NOT-PERMITTED | NOT-PERMITTED | EXPECTED |
| Adult family-plan member | EXPECTED | CONDITIONAL[2] | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[2] | CONDITIONAL[2] | EXPECTED | EXPECTED | EXPECTED | EXPECTED | CONDITIONAL[3] | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[2] | EXPECTED | EXPECTED | CONDITIONAL[8] | CONDITIONAL[8] | CONDITIONAL[4] | CONDITIONAL[4] | CONDITIONAL[4] | CONDITIONAL[4] | CONDITIONAL[4] | CONDITIONAL[4] | NOT-PERMITTED | CONDITIONAL[9] | NOT-PERMITTED | NOT-PERMITTED | EXPECTED |
| Family-plan administrator | CONDITIONAL[5] | EXPECTED | CONDITIONAL[6] | CONDITIONAL[6] | CONDITIONAL[6] | CONDITIONAL[6] | NOT-PERMITTED | CONDITIONAL[6] | CONDITIONAL[6] | CONDITIONAL[6] | CONDITIONAL[6] | CONDITIONAL[6] | NOT-PERMITTED | CONDITIONAL[6] | NOT-PERMITTED | CONDITIONAL[7] | CONDITIONAL[7] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[9] | EXPECTED | EXPECTED | CONDITIONAL[10] |
| Family payer | CONDITIONAL[5] | CONDITIONAL[2] | CONDITIONAL[6] | NOT-PERMITTED | CONDITIONAL[6] | CONDITIONAL[6] | NOT-PERMITTED | CONDITIONAL[6] | CONDITIONAL[6] | CONDITIONAL[6] | CONDITIONAL[6] | CONDITIONAL[6] | NOT-PERMITTED | CONDITIONAL[6] | NOT-PERMITTED | CONDITIONAL[7] | CONDITIONAL[7] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[9] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[10] |
| Diaspora sponsor | CONDITIONAL[5] | CONDITIONAL[2] | CONDITIONAL[11] | NOT-PERMITTED | CONDITIONAL[5] | CONDITIONAL[5] | NOT-PERMITTED | CONDITIONAL[11] | CONDITIONAL[2] | CONDITIONAL[11] | CONDITIONAL[6] | CONDITIONAL[11] | NOT-PERMITTED | CONDITIONAL[11] | NOT-PERMITTED | CONDITIONAL[12] | CONDITIONAL[12] | NOT-PERMITTED | CONDITIONAL[8] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[13] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[10] |
| Employer benefits administrator | CONDITIONAL[14] | CONDITIONAL[14] | NOT-PERMITTED | CONDITIONAL[14] | CONDITIONAL[14] | CONDITIONAL[14] | NOT-PERMITTED | CONDITIONAL[14] | CONDITIONAL[14] | CONDITIONAL[14] | CONDITIONAL[14] | CONDITIONAL[14] | CONDITIONAL[14] | CONDITIONAL[14] | NOT-PERMITTED | CONDITIONAL[14] | CONDITIONAL[14] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[13] | CONDITIONAL[14] | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[10] |
| Employer finance operator | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[14] | CONDITIONAL[14] | CONDITIONAL[14] | CONDITIONAL[14] | CONDITIONAL[14] | CONDITIONAL[14] | EXPECTED | CONDITIONAL[14] | CONDITIONAL[14] | EXPECTED | CONDITIONAL[14] | CONDITIONAL[14] | CONDITIONAL[14] | NOT-PERMITTED | CONDITIONAL[14] | CONDITIONAL[14] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[13] | CONDITIONAL[14] | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[10] |
| HMO administrator | CONDITIONAL[15] | CONDITIONAL[15] | CONDITIONAL[15] | CONDITIONAL[15] | CONDITIONAL[15] | CONDITIONAL[15] | CONDITIONAL[15] | CONDITIONAL[15] | CONDITIONAL[15] | CONDITIONAL[15] | CONDITIONAL[15] | CONDITIONAL[15] | CONDITIONAL[15] | CONDITIONAL[15] | NOT-PERMITTED | CONDITIONAL[15] | CONDITIONAL[15] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[13] | CONDITIONAL[13] | CONDITIONAL[13] | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[10] |
| HMO claims operator | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[15] | CONDITIONAL[15] | CONDITIONAL[15] | CONDITIONAL[15] | NOT-PERMITTED | CONDITIONAL[15] | CONDITIONAL[15] | CONDITIONAL[15] | CONDITIONAL[15] | CONDITIONAL[15] | NOT-PERMITTED | CONDITIONAL[15] | CONDITIONAL[15] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[13] | CONDITIONAL[13] | CONDITIONAL[13] | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[10] |
| Guardian, future scope | NOT-PERMITTED | CONDITIONAL[16] | CONDITIONAL[16] | NOT-PERMITTED | CONDITIONAL[16] | CONDITIONAL[16] | CONDITIONAL[16] | CONDITIONAL[16] | CONDITIONAL[16] | CONDITIONAL[16] | CONDITIONAL[16] | CONDITIONAL[16] | NOT-PERMITTED | CONDITIONAL[16] | CONDITIONAL[16] | CONDITIONAL[16] | CONDITIONAL[16] | CONDITIONAL[17] | CONDITIONAL[17] | CONDITIONAL[16] | CONDITIONAL[16] | CONDITIONAL[16] | CONDITIONAL[16] | CONDITIONAL[16] | CONDITIONAL[16] | NOT-PERMITTED | CONDITIONAL[18] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[10] |
| Clinical proxy | NOT-PERMITTED | CONDITIONAL[19] | CONDITIONAL[19] | NOT-PERMITTED | CONDITIONAL[19] | CONDITIONAL[19] | CONDITIONAL[19] | CONDITIONAL[19] | CONDITIONAL[19] | CONDITIONAL[19] | CONDITIONAL[19] | CONDITIONAL[19] | NOT-PERMITTED | CONDITIONAL[19] | CONDITIONAL[19] | CONDITIONAL[19] | CONDITIONAL[19] | CONDITIONAL[19] | CONDITIONAL[19] | CONDITIONAL[19] | CONDITIONAL[19] | CONDITIONAL[19] | CONDITIONAL[19] | CONDITIONAL[19] | CONDITIONAL[19] | NOT-PERMITTED | CONDITIONAL[18] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[10] |
| Platform support operator | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[20] | CONDITIONAL[20] | CONDITIONAL[20] | NOT-PERMITTED | CONDITIONAL[20] | NOT-PERMITTED | CONDITIONAL[20] | CONDITIONAL[20] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[18] | CONDITIONAL[18] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[20] |
| Platform finance operator | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[21] | CONDITIONAL[21] | CONDITIONAL[21] | CONDITIONAL[21] | CONDITIONAL[21] | CONDITIONAL[21] | CONDITIONAL[21] | CONDITIONAL[21] | CONDITIONAL[21] | CONDITIONAL[21] | CONDITIONAL[21] | CONDITIONAL[21] | NOT-PERMITTED | CONDITIONAL[21] | CONDITIONAL[21] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[13] | CONDITIONAL[13] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[10] |
| Compliance officer | CONDITIONAL[22] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[22] | CONDITIONAL[22] | CONDITIONAL[22] | CONDITIONAL[22] | NOT-PERMITTED | CONDITIONAL[22] | CONDITIONAL[22] | CONDITIONAL[22] | CONDITIONAL[22] | CONDITIONAL[22] | NOT-PERMITTED | CONDITIONAL[22] | CONDITIONAL[22] | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[22] | CONDITIONAL[22] | CONDITIONAL[22] | CONDITIONAL[22] | CONDITIONAL[22] | CONDITIONAL[22] | NOT-PERMITTED | CONDITIONAL[22] | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[10] |
| Auditor | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[23] | CONDITIONAL[23] | CONDITIONAL[23] | CONDITIONAL[23] | NOT-PERMITTED | CONDITIONAL[23] | CONDITIONAL[23] | CONDITIONAL[23] | CONDITIONAL[23] | CONDITIONAL[23] | NOT-PERMITTED | CONDITIONAL[23] | CONDITIONAL[23] | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[23] | CONDITIONAL[23] | CONDITIONAL[23] | CONDITIONAL[23] | CONDITIONAL[23] | CONDITIONAL[23] | NOT-PERMITTED | CONDITIONAL[23] | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[10] |

## Conditions

- `[1]` Requires active patient relationship and explicit encounter context.
- `[2]` Requires active funded beneficiary context and non-blocking transaction state.
- `[3]` Payment/refund status may be shown only for own transaction and actor-authorized scope.
- `[4]` Requires order-level clinical authorization and policy allows visibility.
- `[5]` Requires active plan coverage membership and continuity verification.
- `[6]` Requires explicit authorization and role permission for the same funding relationship.
- `[7]` Allowed only for non-clinical workflow and compliance fields in supported memberships.
- `[8]` Requires selected paid order intent and explicit authorization to provider view.
- `[9]` Available only as redacted, security-audited trace for user-facing actions.
- `[10]` Requires security override and emergency exception controls where applicable.
- `[11]` Sponsorship state can be seen where explicit sponsor-beneficiary acceptance and mandate exist.
- `[12]` Requires beneficiary-specific relationship and active treatment context.
- `[13]` Requires privacy-approved claims or audit payload mapping under minimum necessary principles.
- `[14]` Allowed only in employer/benefits administration context with explicit employee identity and policy context.
- `[15]` Requires coverage authorization and claims/authorisation workflow state.
- `[16]` Depends on explicit guardian delegation and clinical consent/legal basis.
- `[17]` Allowed for delegated tasks only after beneficiary identity confirmation.
- `[18]` Allowed where audit-only review of access events is required and redacted.
- `[19]` Requires explicit clinical proxy grant in law-compliant delegation workflow.
- `[20]` Requires active support case context and signed support authorization.
- `[21]` Financial visibility only; clinical content is excluded by policy.
- `[22]` Compliance view is scope-limited to policy controls and access logs.
- `[23]` Auditor rights are read-only and redaction-safe with legal approval logs.

## Outcome checks against lock requirements

- Patient self-payer does not get automatic clinical access.
- Family and sponsor actors do not get routine provider-location details.
- Employer and HMO roles are finance/coverage-only by default.
- All non-EXPECTED rows are conditionalized and traceable to order-context conditions.
- Provider details after payment are allowed only under selected order authorization (`[8]`).
- Emergency escalation visibility is available where explicitly required, never as full clinical override without break-glass controls.

## Break-glass note

- This matrix uses `BREAK-GLASS-ONLY` only for dedicated emergency workflow paths defined in clinical and operations prompts. No routine actor row uses `BREAK-GLASS-ONLY` by default.
- Any emergency clinical override must be modeled in dedicated break-glass policy and cannot become routine payer visibility.
