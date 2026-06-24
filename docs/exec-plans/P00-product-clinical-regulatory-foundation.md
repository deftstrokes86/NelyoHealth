# Phase 0 Exec Plan: Product, Clinical, Regulatory, and Governance Foundation

## Objective

Create a complete, reviewable, and externally approvable foundation for all Phase 1+ implementation work by:

- resolving governance and terminology,
- fixing access and disclosure boundaries,
- sequencing all required domain decisions under explicit ownership.

## Scope

- Phase 0 only. No production application behavior changes.
- Documentation-only outputs listed in `P00-01` through `P00-17`.
- No dependency installs, no schema or runtime changes, no feature implementation.

## Non-goals

- No application scaffolding or stack installation.
- No browser tool installation or CI wiring in this issue.
- No clinical, legal, or financial decisions are marked approved unless explicitly approved by named owners.

## Canonical source precedence and crosswalk model

- `NelyoHealth_Phase_0_Complete_Breakdown.md` defines scope and work-package outcomes.
- `NelyoHealth_Phase_0_Codex_Prompt_Pack.md` defines executable order.
- Prompt mapping to work packages:

| Codex Prompt Pack | Complete Breakdown coverage |
|---|---|
| P00-00 | P00-01 Document control and decision system |
| P00-01 | P00-02 Product charter and business model |
| P00-02 | P00-03 MVP and pilot boundary |
| P00-03 | P00-04 Actors, personas, relationships, and tenancy |
| P00-04 | P00-05 Plans, sponsorship, coverage, and funding |
| P00-05 | P00-06 User journeys and service blueprints |
| P00-06 | P00-07 Domain glossary and data classification, plus P00-08 Conceptual domain model and boundaries |
| P00-07 | Workflow state machines | PASS | State-machine index, cross-workflow invariants, and per-workflow state docs completed. | Completed before P00-08. |
| P00-08 | Provider-detail disclosure contract and threat model | PASS | Created provider discovery privacy policy, disclosure contract, threat model, test matrix, and ADR-0001. | Completed before P00-09. |
| P00-09 | P00-11 Clinical scope and safety model, plus P00-12 Emergency, urgent, referral, and critical-result protocols |
| P00-10 | P00-13 Prescription, pharmacy, laboratory, and delivery policies |
| P00-11 | P00-14 Privacy, consent, guardianship, and data governance |
| P00-12 | P00-15 Regulatory source and obligations register |
| P00-13 | P00-16 Payments, ledger, claims, and commercial rules |
| P00-14 | P00-17 Non-functional requirements and browser-test strategy |
| P00-15 | P00-18 Metrics, service levels, and operational readiness |
| P00-16 | P00-19 Risks, assumptions, dependencies, and ADRs |
| P00-17 | P00-20 Traceability, review, and phase gate |

## Canonical execution order

1. `P00-00` Preflight and governance foundation
2. `P00-01` Product charter and principles
3. `P00-02` MVP and pilot boundaries
4. `P00-03` Actors, roles, relationships, tenancy
5. `P00-04` Coverage and funding models
6. `P00-05` Journeys and service blueprints
7. `P00-06` Glossary and domain data boundaries
8. `P00-07` Workflow state machines
9. `P00-08` Provider-disclosure contract and threat model
10. `P00-09` Clinical safety and emergency policy
11. `P00-10` Prescription/pharmacy/lab/delivery policies
12. `P00-11` Privacy, consent, and governance
13. `P00-12` Regulatory source and obligations register
14. `P00-13` Payments, ledger, claims, unlock event
15. `P00-14` NFRs and browser-test strategy
16. `P00-15` Metrics, SLOs, operations readiness
17. `P00-16` Risks, assumptions, dependencies, ADRs
18. `P00-17` Independent review and completion gate

## Hard constraints

- Keep all pre-payment provider details to backend-enforced projections and release policies.
- Never allow payer/subscriber relationships to imply clinical record visibility by default.
- Emergency escalation is never blocked by payment, registry comparison, routine registration, or non-emergency care flow.
- Signed clinical records are amended/Versioned, never silently overwritten.
- Browser testing strategy is defined here; implementation in Phase 1.

## Review and checkpoint policy

- Each prompt is a separate changelog chunk.
- Diff is reviewed before the next prompt is started.
- Mandatory re-read at new execution context: the three source documents and latest `docs/STATUS.md`.
- No automatic continuation between prompts without orchestration handoff.

## Gates

- **Gate A (after `P00-00`)**: Governance artifacts and conflict map present.
- **Gate B (after `P00-08`)**: Disclosure contract and protected field list proven model-level, not UI-only.
- **Gate C (after `P00-13`)**: Payment unlock and disclosure events are non-divergent.
- **Gate D (after `P00-15`)**: High-risk gaps have owners and mitigation drafts.
- **Gate E (after `P00-17`)**: Completion report includes PASS/CONDITIONAL/FAIL with named approvals.

## Milestones

- **Milestone 0:** `P00-00` baseline produced and reviewed.
- **Milestone 1:** Clinical and product scope synchronized across documents.
- **Milestone 2:** Disclosure invariants locked before operational policy work.
- **Milestone 3:** Completion artifacts produced with explicit approvals.

## Exit criteria for Phase 0

- All required docs in scope and traceable to requirement IDs.
- Pre-payment provider-disclosure policy consistent in legal, clinical, operational, and technical docs.
- Emergency escalation, signed-record amendment, and one-longitudinal-identity rules are explicit in all related outputs.
- No unresolved high-risk open item without owner, target phase, and approval path in required outputs.
- External approval status recorded for each mandatory external domain.

## Work breakdown and status

| Artifact set | Prompt owner | Current status |
|---|---|---|
| Governance and status | P00-00 | completed (current) |
| Product charter / principles | P00-01 | PASS |
| P00-01 + P00-02 scope boundary | P00-01, P00-02 | COMPLETED, pending orchestration acceptance |
| P00-03 actor-tenancy model | P00-03 | COMPLETED, pending orchestration acceptance |
| P00-04 funding models | P00-04 | PASS |
| P00-05 journeys and service blueprints | P00-05 | PASS |
| P00-06 glossary, classification, and conceptual boundaries | P00-06 | PASS; covers Complete Breakdown P00-07 and P00-08 |
| P00-07 workflow state machines | P00-07 | PASS; covers Complete Breakdown P00-09 |
| P00-08 provider-disclosure contract | P00-08 | PASS; covers Complete Breakdown P00-10 |
| P00-09 clinical scope, safety, emergency, referral, and critical-result protocols | P00-09 | COMPLETED, pending orchestration acceptance; covers Complete Breakdown P00-11 and P00-12 |
| P00-10 prescription/pharmacy/lab/delivery policies | P00-10 | COMPLETED, pending orchestration acceptance; covers Complete Breakdown P00-13 |
| P00-11 privacy, consent, guardianship, delegation, and data governance | P00-11 | COMPLETED, pending orchestration acceptance; covers Complete Breakdown P00-14. |
| P00-12 regulatory source and obligations register | P00-12 | COMPLETED, pending orchestration acceptance; covers Complete Breakdown P00-15. |
| Finance / operations / NFRs / risk | P00-13..P00-16 | not started; P00-13 remains NOT STARTED. |
| Phase 0 gate and completion | P00-17 | not started |

## Validation checklist

- Terminology conflicts checked across all source documents.
- Pre-payment protected fields blocked by design in `P00-00` and all linked outputs.
- All open questions have owner, target phase, and approval path.
- Decisions are tagged and versioned in `docs/governance/decision-register.md`.
- Required links, matrix entries, and scope boundaries are reviewed before each phase transition.

## P00-10 completion note

- P00-10 completed the Complete Breakdown P00-13 prescription, pharmacy, laboratory, result-release, and delivery policy work package.
- P00-10 created five draft policy artifacts and updated governance registers.
- Final payment, capture, refund, reversal, chargeback, and provider-detail disclosure eligibility remain deferred to P00-13.
- P00-11 completed privacy, consent, guardianship, delegation, cross-border, subprocessor, break-glass, notification, retention, data-subject-rights, workflow, event, decision, open-question, and assumption updates; orchestration acceptance remains pending.
## P00-11 completion note

- P00-11 completed the Complete Breakdown P00-14 privacy, consent, guardianship, delegation, and data-governance package in draft form.
- P00-11 created ten privacy/security governance artifacts and aligned status, execution planning, document registration, decisions, open questions, assumptions, traceability conventions, event catalogue entries, and workflow privacy sections.
- P00-11 did not finalize lawful bases, statutory retention periods, breach deadlines, cross-border transfer mechanisms, subprocessor approvals, vendor selections, age thresholds, or final guardianship rules.
- P00-12 completed regulatory source register, obligations register, legal-question log, licence/registration matrix, contract inventory, monitoring plan, and governance alignment; orchestration acceptance remains pending.
- P00-13 remains NOT STARTED.

## P00-12 completion note

- P00-12 completed the Complete Breakdown P00-15 regulatory obligations and source register package in draft form.
- P00-12 created six compliance artifacts and aligned status, execution planning, document registration, decisions, open questions, assumptions, traceability conventions, and change log.
- P00-12 did not finalize legal interpretations, compliance status, licence status, registration status, payment-provider selection, pilot geography, vendor selection, contractual language, or production implementation controls.
- P00-13 remains NOT STARTED.
