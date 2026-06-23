# Traceability Conventions for Phase 0

## Purpose

Provide a deterministic linking format from requirement → issue → implementation prompt → review artifact.

## ID formats

- **Requirements:** `REQ-<CATEGORY>-<NNN>`
  - Example: `REQ-PHARMACY-003`
- **Work items:** `P00-<NN>` (as defined by prompt pack and execution plan)
- **Reviews:** `REV-<AREA>-<NNN>`
- **Decisions:** `DEC-<NNN>` (for major directional choices)
- **Open questions:** `OQ-00-<NN>`
- **Risks:** `RISK-<NNN>`

## Category map

- `REQ-PHARMACY-*` — discovery, location redaction, release authorization.
- `REQ-CLINICAL-*` — clinical scope, safety, referrals, critical results, emergency.
- `REQ-PAYER-*` — payer access, sponsorship, funding, HMO rules.
- `REQ-PAYMENT-*` — payment intent/capture/settlement/reversal linkage.
- `REQ-GOV-*` — governance, roles, approval, traceability.
- `REQ-TECH-*` — state machines, workflows, NFR, testing strategy.
- `REQ-RISK-*` — risks, dependencies, ADRs, assumptions.

## Linkage obligations

For each significant requirement, include:
1. Origin prompt (P00-xx).
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
