# NelyoHealth Non-goals (P00-02)

## Document control

- Document: Non-goals for phase 0 MVP boundary
- Codex prompt ID: P00-02
- Complete Breakdown work package: P00-03
- Issue ID: P00-PRD-002
- Owner role: Product + Clinical + Security
- Review state: PROPOSED
- Last updated: 2026-06-23
- Related decisions: REQ-SCOPE-001 to REQ-SCOPE-018, REQ-LOCK-001 to REQ-LOCK-013

## Scope exclusion rule

Non-goals are still explicit design constraints, not hidden limitations. A feature listed as non-goal must not be treated as available in pilot planning, user journey defaults, or implementation notes.

## Pilot non-goals

| Non-goal | Reason | Scope status | Earliest reconsideration gate | Approval required before reconsideration |
|---|---|---|---|---|
| Nationwide rollout | Launch is intentionally limited to one controlled Nigerian market area. | BLOCKED-PENDING-REVIEW | P00-21 Expansion criteria, geography gate, and approved operational capacity. | Legal counsel + Clinical lead + Product owner |
| Open multi-specialty provider model | Pilot is primary care only in first release. | POST-PILOT | Specialty expansion gate (GATE-02) and specialty safety review. | Clinical lead + Product owner |
| Paediatric telemedicine | Clinical and consent rules for minors are unresolved. | BLOCKED-PENDING-REVIEW | P00-03 clinical package with guardian model approved. | Clinical lead + Legal counsel + Privacy counsel |
| Unbounded minor clinical activation | Minor flow requires guardian validation and age-policy compliance. | DESIGN-NOW-IMPLEMENT-LATER | Clinical package completion and guardian governance approval. | Clinical lead + Privacy counsel |
| Live employer onboarding | Requires full tenant, payroll, and claims readiness. | DESIGN-NOW-IMPLEMENT-LATER | P00-04 and P00-13 outcomes with legal sign-off. | Product owner + Finance owner + Legal counsel |
| Live HMO underwriting and authorization | Claims and prior-authority systems are outside pilot trust boundary. | DESIGN-NOW-IMPLEMENT-LATER | P00-04 and P00-13 completion plus insurer/legal approvals. | Legal counsel + Product owner + Security lead |
| Native mobile applications | Deferred to avoid premature surface risk and unstable cross-platform behavior. | POST-PILOT | Mobile rollout gate and acceptance criteria completion. | Product owner + Engineering lead |
| Home-care fulfilment | Architectural support only; no live execution in pilot. | DESIGN-NOW-IMPLEMENT-LATER | Home-care expansion gate and operation readiness review. | Operations lead + Clinical lead |
| Open provider self-service for doctors/pharmacies/labs | Controlled onboarding only for pilot safety and quality. | BLOCKED-PENDING-REVIEW | Controlled onboarding gate and provider governance approval. | Operations lead + Clinical lead + Legal counsel |
| Unreviewed medication categories (including controlled/dangerous/cold-chain) | Not safe without category-specific governance and logistics. | BLOCKED-PENDING-REVIEW | Medication catalogue gate and safety/ops review. | Clinical lead + Pharmacy ops + Operations lead |
| Unreviewed laboratory test catalogue | Test categories and pathways not yet clinically agreed. | BLOCKED-PENDING-REVIEW | Laboratory test catalog gate and critical-result pathway approval. | Clinical lead + Operations lead + Legal counsel |
| Autonomous diagnosis or triage-only recommendations | Clinical judgment remains with licensed clinicians. | OUT-OF-SCOPE | After explicit clinician safety governance redesign. | Clinical lead + Legal counsel |
| Open medical logistics and pharmacy chain intelligence | Not in first release. | OUT-OF-SCOPE | After production logistics governance pass. | Operations lead + Security lead |
| Data warehouse or advanced BI in pilot | Avoids privacy and interpretation debt before control plane readiness. | OUT-OF-SCOPE | Post-launch expansion and approved analytics policy. | Product owner + Privacy counsel + QA lead |
| Payment method breadth beyond approved pilots | Provider and financial custody risk requires explicit approvals. | BLOCKED-PENDING-REVIEW | Payment gate and finance policy approval. | Finance owner + Legal counsel |
| Direct-to-consumer diagnostics | Requires clinician order path and critical-result obligations. | OUT-OF-SCOPE | Clinical scope gate and evidence of safe request validation. | Clinical lead + Privacy counsel |
| Ambulance dispatch service | Emergency transport operations are outside pilot product scope. | OUT-OF-SCOPE | Post-pilot referral escalation expansion package. | Operations lead + Clinical lead |
| Hospital bed management / inpatient coordination | Cross-system inpatient orchestration is high-risk and later-stage. | OUT-OF-SCOPE | Emergency/inpatient expansion gate. | Clinical lead + Operations lead |
| Inpatient care management workflows | Not aligned with first release scope and safety model. | OUT-OF-SCOPE | Post-pilot expansion in response to clinical review. | Clinical lead |
| Unsanctioned cross-border care delivery | Funding may cross borders, treatment delivery does not. | BLOCKED-PENDING-REVIEW | Clinical and operational legal review. | Legal counsel + Operations lead |
| Payer profile or insurer portal as full claim platform | Payment and access boundaries are deliberately narrower. | DESIGN-NOW-IMPLEMENT-LATER | Coverage architecture and claims workflow readiness. | Finance owner + Legal counsel |
| Map-based provider discovery | Map and location detail handling is blocked before payment and not central to pilot. | OUT-OF-SCOPE | After privacy-preserving map model approved. | Security lead + Privacy counsel |
| Hidden disclosure bypasses (API/source/storage) | Protected data must not exist in hidden channels before success payment. | OUT-OF-SCOPE | Immediately and permanently unless disclosure contract is redesigned and approved. | Security lead + Privacy counsel |
| Unvetted multi-language rollout | English-first launch preserves safety and legal messaging integrity. | POST-PILOT | Language expansion gate and translation governance approval. | Product owner + Legal counsel |
| Provider detail disclosure before success payment | Locked legal and safety invariant. | OUT-OF-SCOPE | Not reconsiderable without regulator and legal review. | Security lead + Privacy counsel |
| Any implementation that bypasses emergency override | Emergency must remain independent from ordinary payment/comparison/registration logic. | OUT-OF-SCOPE | Never except explicit policy change with equivalent safety review. | Clinical lead + Legal counsel |
| Production data in unapproved lower environments | Prevents PHI leakage during pilot preparation. | OUT-OF-SCOPE | Governance, retention, and environment policy update. | Security lead + Privacy counsel |
| Routine operations via direct database edits | Operational bypass risks irreversibility and audit gaps. | OUT-OF-SCOPE | Post-pilot process maturity with approved workflow tooling. | Operations lead + Security lead |

## Non-goal statement

Not in pilot does not mean permanently forbidden. All exclusions are reconsiderable only after criteria, owners, and approvals are explicit.

## Reconsideration protocol

- Every blocked non-goal has at least one owning prompt and one owner.
- Any reconsideration must reference: scope label, supporting evidence, and explicit safety/compliance approvals.
