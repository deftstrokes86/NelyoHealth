# Traceability Conventions for Phase 0

## Purpose

Provide a deterministic linking format from requirement -> issue -> implementation prompt -> review artifact.

## Core traceability rules

- The Complete Breakdown governs scope and content.
- The Codex Prompt Pack governs executable prompt order.
- A Codex prompt may cover one or more Complete Breakdown work packages.
- Future execution instructions must always cite both IDs.
- P00-00 through P00-17 and Complete Breakdown P00-01 through P00-20 must all be covered before Phase 0 completion.
- Similar-looking IDs are not equivalent unless explicitly crosswalked.

## Canonical crosswalk

| Codex Prompt Pack | Complete Breakdown coverage |
|---|---|
| P00-00 | P00-01 Document control and decision system |
| P00-01 | P00-02 Product charter and business model |
| P00-02 | P00-03 MVP and pilot boundary |
| P00-03 | P00-04 Actors, personas, relationships, and tenancy |
| P00-04 | P00-05 Plans, sponsorship, coverage, and funding |
| P00-05 | P00-06 User journeys and service blueprints |
| P00-06 | P00-07 Domain glossary and data classification, plus P00-08 Conceptual domain model and boundaries |
| P00-07 | P00-09 Workflow state machines |
| P00-08 | P00-10 Pharmacy and laboratory disclosure contract |
| P00-09 | P00-11 Clinical scope and safety model, plus P00-12 Emergency, urgent, referral, and critical-result protocols |
| P00-10 | P00-13 Prescription, laboratory, pharmacy, and delivery policies |
| P00-11 | P00-14 Privacy, consent, guardianship, and data governance |
| P00-12 | P00-15 Regulatory obligations and source register |
| P00-13 | P00-16 Payments, ledger, claims, and commercial rules |
| P00-14 | P00-17 Non-functional requirements and browser-test strategy |
| P00-15 | P00-18 Metrics, service levels, and operational readiness |
| P00-16 | P00-19 Risks, assumptions, dependencies, and ADRs |
| P00-17 | P00-20 Traceability, review, and phase gate |

## ID formats

- **Requirements:** `REQ-<CATEGORY>-<NNN>`
  - Example: `REQ-PHARMACY-003`
- **Work items:** `P00-<NN>` (as defined by prompt pack and execution plan)
- **Reviews:** `REV-<AREA>-<NNN>`
- **Open questions:** `OQ-00-<NN>`
- **Risks:** `RISK-<NNN>`
- **Decisions:** `REQ-LOCK-<NNN>` and `REQ-PAY-<NNN>`

## Category map

- `REQ-PHARMACY-*` -- discovery, location redaction, release authorization.
- `REQ-CLINICAL-*` -- clinical scope, safety, referrals, critical results, emergency.
- `REQ-PAYER-*` -- payer access, sponsorship, funding, HMO rules.
- `REQ-PAYMENT-*` -- payment intent/capture/settlement/reversal linkage.
- `REQ-GOV-*` -- governance, roles, approval, traceability.
- `REQ-TECH-*` -- state machines, workflows, NFR, testing strategy.
- `REQ-RISK-*` -- risks, dependencies, ADRs, assumptions.

## Linkage obligations

For each significant requirement, include:
1. Origin prompt (`P00-xx`).
2. Primary document path.
3. Affected workflow/state-machine IDs.
4. Access rule and failure behavior.
5. Planned acceptance test (manual and browser deterministic).
6. Owner and review state (`APPROVED` / `PROPOSED` / `REQUIRES_*`).

## Review-state rules

- A non-empty `[ ] TODO` / `[ ] TBD` in active output requires:
  - an owner
  - target phase
  - risk assessment
  - explicit follow-up issue
- No requirement can advance to implementation without mapping from requirement ID to:
  - source prompt (`P00-xx`)
  - target test artifact and review gate.

## Artifact mapping expectation by phase

- **P00-00:** lock core docs and decision register.
- **P00-01 to P00-07:** map product/domain decisions and constraints.
- **P00-08 to P00-13:** map disclosure/clinical/finance decisions to workflow states.
- **P00-14 to P00-15:** map NFR and browser-test expectations.
- **P00-16 to P00-17:** map risks, owners, traceability matrix, and completion approval status.
