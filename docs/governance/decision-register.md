# Phase 0 Decision Register

## Decision status legend

- `APPROVED`: explicitly approved and usable for downstream decisions.
- `PROPOSED`: planning default pending owner approval.
- `REQUIRES_LEGAL_REVIEW`: legal interpretation required before approval.
- `REQUIRES_CLINICAL_REVIEW`: clinical review required before approval.
- `SUPERSEDED`: replaced by a later approved decision.

## Locked base decisions

| Decision ID | Decision text | Status | Owner | Review phase | Evidence |
|---|---|---|---|---|---|
| REQ-LOCK-001 | One person has one longitudinal patient identity across plans, families, sponsors, employers, HMOs, guardians, and organizational relationships. | APPROVED | Source docs + product governance | P00-00 | NelyoHealth_Phase_0_Complete_Breakdown.md |
| REQ-LOCK-002 | Paying for care does not grant automatic access to clinical records. | APPROVED | Source docs + governance baseline | P00-00 | NelyoHealth_Phase_0_Complete_Breakdown.md + P00-00 prompt |
| REQ-LOCK-003 | Before successful payment, patient-facing pharmacy/lab view is limited to approved non-identifying provider display fields. | APPROVED | Source docs + governance baseline | P00-00 | NelyoHealth_Phase_0_Complete_Breakdown.md + P00-08 |
| REQ-LOCK-004 | Emergency escalation cannot be blocked by payment, marketplace comparison, ordinary registration, or routine booking steps. | APPROVED | Source docs + governance baseline | P00-00 | NelyoHealth_Phase_0_Complete_Breakdown.md |
| REQ-LOCK-005 | Signed records are corrected through amendments/versioning; they are never silently overwritten. | APPROVED | Source docs + governance baseline | P00-00 | NelyoHealth_Phase_0_Complete_Breakdown.md |
| REQ-LOCK-006 | Pre-payment provider/lab data must be denied across API, DOM, HTML, state, storage, logs, analytics, maps, cache, and traces. | APPROVED | Source docs + governance baseline | P00-00 | P00-14 target controls + build restrictions |

## Proposed decisions (P00 scope)

| Decision ID | Decision text | Status | Owner | Review phase | Conditions |
|---|---|---|---|---|---|
| REQ-PROJ-001 | Pilot geography is Lagos-only at launch, with expansion only after gate review. | PROPOSED | Product owner | P00-02 | Approve against compliance and operations readiness |
| REQ-PROJ-002 | Initial pilot patient age band is adults (18+), with minor flow design in parallel. | PROPOSED | Clinical lead | P00-02 | Validate against legal age obligations |
| REQ-PROJ-003 | Initial supported consultation categories are scheduled and priority outpatient primary care with bounded exclusions. | PROPOSED | Clinical lead | P00-02 | Clinical scope and safety sign-off required |
| REQ-PROJ-004 | Wallet and patient-facing balance visibility uses licensed payment services + internal double-entry ledger model. | PROPOSED | Finance owner | P00-13 | Legal counsel clearance on payment custody |
| REQ-LOCK-007 | The successful-payment event for provider-detail release defaults to capture/confirmed settlement, not mere authorization. | PROPOSED | Finance + security owner | P00-13 | External payment approval and risk review required |
| REQ-PROJ-005 | Phase 0 browser strategy remains specification-only; browser-tool installation in Phase 1. | PROPOSED | Engineering owner | P00-00 | Explicitly deferred to P01 |

## Decisions blocked pending external review

| Decision ID | Decision text | Required approval | Priority | Target phase |
|---|---|---|---|---|
| REQ-LEGAL-001 | Legal minimum disclosures required before patient payment (if any) despite obscurity lock. | Legal counsel | High | P00-12 / P00-08 |
| REQ-LEGAL-002 | Telemedicine licensing scope and operator obligations for launch geography. | Legal/corporate counsel | High | P00-12 |
| REQ-LEGAL-003 | Whether the platform posture at launch requires specific aggregator / marketplace registrations. | Legal counsel | High | P00-12 |
| REQ-CLIN-001 | Clinical red-flag set and telemedicine exclusion list for pilot. | Clinical lead | High | P00-09 |
| REQ-FIN-001 | Refund ownership and payout/claim timing details under mixed/family/diaspora funding. | Finance owner + legal | High | P00-13 |
