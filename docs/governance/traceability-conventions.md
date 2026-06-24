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

## P00-08 PRV identifier families

- Disclosure requirements: `PRV-REQ-<NNN>`
- Disclosure contract fields: `PRV-FLD-<NNN>`
- Disclosure policy rules: `PRV-POL-<NNN>`
- Disclosure threat cases: `PRV-THR-<NNN>`
- Disclosure test scenarios: `PRV-TST-<NNN>`
- Governance decisions: `REQ-PRV-<NNN>`

These are documentation traceability identifiers only. They are not database identifiers, URL identifiers, API route names, provider identifiers, order identifiers, or implementation-generated IDs.

## Linkage obligations

For each significant requirement, include:
1. Origin prompt (`P00-xx`).
2. Primary document path.
3. Affected workflow/state-machine IDs.
4. Access rule and failure behavior.
5. Planned acceptance test (manual and browser deterministic).
6. Owner and review state (`APPROVED` / `PROPOSED` / `REQUIRES_*`).

## Review-state rules

- A non-empty unresolved open item in active output requires:
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



## P00-11 identifier families

| Prefix | Meaning | Owning prompt | Notes |
|---|---|---|---|
| DAT-REQ | Cross-cutting data-governance requirement | P00-11 | Requirement traceability inside privacy artifacts |
| DFM-FLW | Data-flow map flow | P00-11 | Conceptual data movement, not topology |
| ROPA-ACT | Draft processing activity | P00-11 | Not a final legally complete ROPA |
| CNS-POL | Consent policy rule or consent type | P00-11 | Consent is purpose-specific and not blanket lawful basis |
| GDN-POL | Guardian and delegation policy rule | P00-11 | Minor functionality remains design-only until approved |
| RET-CAT | Retention category | P00-11 | No statutory period approved in P00-11 |
| DSR-WFL | Data-subject-rights workflow | P00-11 | No statutory response period approved in P00-11 |
| XBR-FLW | Cross-border data flow | P00-11 | Transfer mechanism remains legal-review controlled |
| SUB-REQ | Subprocessor category or due-diligence requirement | P00-11 | No vendor approved without review |
| BGA-POL | Break-glass policy rule | P00-11 | Exceptional, audited, review-bound access |
| NTF-POL | Notification data policy rule/type | P00-11 | Minimum-necessary notification content |
| REQ-DAT | Governance decision for data/privacy | P00-11 | Decision register entries for privacy controls |
