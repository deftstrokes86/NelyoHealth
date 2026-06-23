# Phase 0 Exec Plan: Product, Clinical, Regulatory, and Governance Foundation

## Objective

Create a complete, reviewable, and externally approvable foundation for all Phase 1+ implementation work by:
- resolving governance and terminology,
- fixing access and disclosure boundaries,
- and sequencing all required domain decisions under explicit ownership.

## Scope

- Phase 0 only. No production application behavior changes.
- Documentation-only outputs listed in `P00-01` through `P00-17`.
- No dependency installs, no schema or runtime changes, no feature implementation.

## Non-goals

- No application scaffolding or stack installation.
- No browser tool installation or CI wiring.
- No clinical, legal, or financial decisions being enforced as approved unless explicitly approved by named roles.

## Canonical source precedence and crosswalk model

- Complete Breakdown defines scope, outcomes, and work-package content.
- Codex Prompt Pack defines executable prompt order.
- A prompt may cover more than one Complete Breakdown work package.
- Execution tools must identify both IDs when referencing scope in future prompts.

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
| P00-14 | P00-17 Non-functional requirements and browser-testing strategy |
| P00-15 | P00-18 Metrics, service levels, and operational readiness |
| P00-16 | P00-19 Risks, assumptions, dependencies, and ADRs |
| P00-17 | P00-20 Traceability, review, and phase gate |

## Canonical execution order

1. `P00-00` Preflight and execution governance skeleton.
2. `P00-01` Product charter and principles.
3. `P00-02` MVP and pilot boundaries.
4. `P00-03` Actors, roles, relationships, tenancy.
5. `P00-04` Coverage and funding models.
6. `P00-05` Journeys and service blueprints.
7. `P00-06` Glossary and domain data boundaries.
8. `P00-07` Workflow state machines.
9. `P00-08` Provider-detail disclosure contract and threat model.
10. `P00-09` Clinical safety scope and emergency policy.
11. `P00-10` Prescription/pharmacy/lab/delivery policies.
12. `P00-11` Privacy, consent, guardian, and governance.
13. `P00-12` Regulatory source and obligations register.
14. `P00-13` Payments, ledger, claims, unlock event.
15. `P00-14` Non-functional and browser-testing strategy.
16. `P00-15` Metrics, SLOs, operations readiness.
17. `P00-16` Risks, assumptions, dependencies, ADR set.
18. `P00-17` Independent review and completion gate.

## Hard constraints

- Keep all unlocked provider details to backend-enforced projections and release policies.
- Never allow payer/subscriber relationships to imply clinical record visibility by default.
- Emergency escalation never blocked by payment, marketplace comparison, ordinary registration, or provider-discovery logic.
- Signed clinical records are amended only.
- Browser testing strategy is defined in Phase 0; implementation deferred to Phase 1.

## Review and checkpoint policy

- Each prompt is a separate changelog chunk.
- Diff must be reviewed before moving to the next issue.
- Mandatory reread at the start of new execution context: the three source documents + latest `docs/STATUS.md`.
- Do not continue automatically between prompts.

## Gates

- **Gate A (after `P00-00`)**: Governance artifacts, traceability conventions, and conflict map present.
- **Gate B (after `P00-08`)**: Disclosure contract and protected field list proven model-level, not UI-only.
- **Gate C (after `P00-13`)**: Payment and provider-detail unlock events cannot diverge.
- **Gate D (after `P00-15`)**: High-risk gaps have owners and mitigation drafts.
- **Gate E (after `P00-17`)**: Completion report includes PASS/CONDITIONAL/FAIL and named approval conditions.

## Milestones

- **Milestone 0:** P00-00 baseline produced and reviewed.
- **Milestone 1:** Clinical and product scope synchronized across documents.
- **Milestone 2:** Disclosure invariants locked prior to operational policy work.
- **Milestone 3:** Completion artifacts produced with explicit approvals.

## Exit criteria for Phase 0

- All required docs in scope and traceable to requirement IDs.
- Pre-payment provider-disclosure policy consistent in legal, clinical, operational, and technical docs.
- Emergency escalation, signed-record amendment, and one-longitudinal-identity rules preserved in all docs.
- No unresolved ownerless high-risk TODO/TBD in required outputs.
- External approval status recorded for each mandatory external domain.

## Work breakdown summary

| Artifact set | Prompt owner | Current status |
|---|---|---|
| Governance and status | P00-00 | completed (current) |
| Product charter / scope | P00-01 | not started |
| Journeys / architecture | P00-05, P00-07 | not started |
| Privacy / legal / finance / metrics / risks | P00-11..P00-16 | not started |
| Phase 0 gate and completion report | P00-17 | not started |

## Validation checklist

- Terminology conflicts checked across all source documents.
- Pre-payment protected fields blocked by design in P00-00 and all linked outputs.
- All open questions have owner, evidence source target, and target phase.
- Decisions are tagged and versioned in `docs/governance/decision-register.md`.
