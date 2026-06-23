# Phase 0 Document Register

## Purpose

Track every planned and produced Phase 0 document, with status, owner, and review state.

## Conventions

- **Document status**: `DONE`, `IN_PROGRESS`, `NOT_STARTED`, `BLOCKED`, `SUPPRESSED`.
- **Review state**: `APPROVED`, `PROPOSED`, `REQUIRES_APPROVAL`.
- **Scope**: includes only Phase 0 delivery artifacts.

## Current register

| Scope | Document path | Prompt | Owner | Status | Review state | Notes |
|---|---|---|---|---|---|---|
| Governance | [docs/STATUS.md](docs/STATUS.md) | P00-00 | Execution lead | DONE | PROPOSED | Current phase status and next action |
| Governance | [docs/exec-plans/P00-product-clinical-regulatory-foundation.md](docs/exec-plans/P00-product-clinical-regulatory-foundation.md) | P00-00 | Execution lead | DONE | PROPOSED | Execution plan + gates |
| Governance | [docs/governance/document-register.md](docs/governance/document-register.md) | P00-00 | Execution lead | DONE | PROPOSED | This register |
| Governance | [docs/governance/decision-register.md](docs/governance/decision-register.md) | P00-00 | Product + clinical + security | IN_PROGRESS | APPROVED/PROPOSED | Locked requirements captured; others proposed |
| Governance | [docs/governance/open-questions.md](docs/governance/open-questions.md) | P00-00 | Execution lead | IN_PROGRESS | BLOCKED | External approvals pending |
| Governance | [docs/governance/assumptions-register.md](docs/governance/assumptions-register.md) | P00-00 | Execution lead | IN_PROGRESS | PROPOSED | Defaults pending owner confirmation |
| Governance | [docs/governance/change-log.md](docs/governance/change-log.md) | P00-00 | Execution lead | DONE | PROPOSED | Baseline lock entries |
| Governance | [docs/governance/traceability-conventions.md](docs/governance/traceability-conventions.md) | P00-00 | Architecture | DONE | PROPOSED | ID conventions and mapping rules |
| Product | [docs/product/product-charter.md](docs/product/product-charter.md) | P00-01 | Product + clinical + legal review | NOT_STARTED | NOT_STARTED | To be authored in P00-01 |
| Product | [docs/product/value-propositions.md](docs/product/value-propositions.md) | P00-01 | Product + clinical + legal review | NOT_STARTED | NOT_STARTED | To be authored in P00-01 |
| Product | [docs/product/business-model-hypotheses.md](docs/product/business-model-hypotheses.md) | P00-01 | Product + finance + legal review | NOT_STARTED | NOT_STARTED | To be authored in P00-01 |
| Product | [docs/product/product-principles.md](docs/product/product-principles.md) | P00-01 | Product + clinical + security | NOT_STARTED | NOT_STARTED | To be authored in P00-01 |
| Product | [docs/product/mvp-scope.md](docs/product/mvp-scope.md) | P00-02 | Product + clinical + engineering | NOT_STARTED | NOT_STARTED | To be authored in P00-02 |
| Product | [docs/product/pilot-operating-boundary.md](docs/product/pilot-operating-boundary.md) | P00-02 | Product + operations | NOT_STARTED | NOT_STARTED | To be authored in P00-02 |
| Product | [docs/product/service-catalogue-boundary.md](docs/product/service-catalogue-boundary.md) | P00-02 | Product + clinical + engineering | NOT_STARTED | NOT_STARTED | To be authored in P00-02 |
| Product | [docs/product/non-goals.md](docs/product/non-goals.md) | P00-02 | Product + clinical | NOT_STARTED | NOT_STARTED | To be authored in P00-02 |
| Product | [docs/product/expansion-gates.md](docs/product/expansion-gates.md) | P00-02 | Product + operations | NOT_STARTED | NOT_STARTED | To be authored in P00-02 |
| Product | [docs/product/personas.md](docs/product/personas.md) | P00-03 | Product + clinical | NOT_STARTED | NOT_STARTED | To be authored in P00-03 |
| Product | [docs/product/actor-catalogue.md](docs/product/actor-catalogue.md) | P00-03 | Security + clinical | NOT_STARTED | NOT_STARTED | To be authored in P00-03 |
| Product | [docs/product/relationship-model.md](docs/product/relationship-model.md) | P00-03 | Product + privacy | NOT_STARTED | NOT_STARTED | To be authored in P00-03 |
| Product | [docs/product/funding-and-coverage-model.md](docs/product/funding-and-coverage-model.md) | P00-04 | Finance + legal | NOT_STARTED | NOT_STARTED | To be authored in P00-04 |
| Product | [docs/product/family-plan-rules.md](docs/product/family-plan-rules.md) | P00-04 | Product + legal | NOT_STARTED | NOT_STARTED | To be authored in P00-04 |
| Product | [docs/product/diaspora-plan-rules.md](docs/product/diaspora-plan-rules.md) | P00-04 | Product + legal + finance | NOT_STARTED | NOT_STARTED | To be authored in P00-04 |
| Product | [docs/product/employer-benefit-rules.md](docs/product/employer-benefit-rules.md) | P00-04 | Product + legal | NOT_STARTED | NOT_STARTED | To be authored in P00-04 |
| Product | [docs/product/hmo-coverage-rules.md](docs/product/hmo-coverage-rules.md) | P00-04 | Product + legal + finance | NOT_STARTED | NOT_STARTED | To be authored in P00-04 |
| Security | [docs/security/access-intent-matrix.md](docs/security/access-intent-matrix.md) | P00-03 | Security + privacy | NOT_STARTED | NOT_STARTED | To be authored in P00-03 |
| Security | [docs/security/payer-visibility-matrix.md](docs/security/payer-visibility-matrix.md) | P00-04 | Finance + security | NOT_STARTED | NOT_STARTED | To be authored in P00-04 |
| Architecture | [docs/glossary.md](docs/glossary.md) | P00-06 | Product + clinical + engineering | NOT_STARTED | NOT_STARTED | To be authored in P00-06 |
| Architecture | [docs/architecture/domain-boundaries.md](docs/architecture/domain-boundaries.md) | P00-08 | Architecture + engineering | NOT_STARTED | NOT_STARTED | Not created yet |
| Architecture | [docs/architecture/context-map.md](docs/architecture/context-map.md) | P00-06 | Architecture + engineering | NOT_STARTED | NOT_STARTED | To be authored in P00-06 |
| Architecture | [docs/architecture/conceptual-domain-model.md](docs/architecture/conceptual-domain-model.md) | P00-08 | Architecture + clinical | NOT_STARTED | NOT_STARTED | Not created yet |
| Architecture | [docs/architecture/source-of-truth-matrix.md](docs/architecture/source-of-truth-matrix.md) | P00-08 | Architecture + engineering | NOT_STARTED | NOT_STARTED | Not created yet |
| Architecture | [docs/architecture/event-catalogue-draft.md](docs/architecture/event-catalogue-draft.md) | P00-08 | Architecture + engineering | NOT_STARTED | NOT_STARTED | Not created yet |
| Architecture | [docs/architecture/context-map.md](docs/architecture/context-map.md) | P00-06 | Architecture + engineering | NOT_STARTED | NOT_STARTED | To be authored in P00-06 |
| Data | [docs/data/data-classification.md](docs/data/data-classification.md) | P00-06 | Security + privacy | NOT_STARTED | NOT_STARTED | To be authored in P00-06 |
| Data | [docs/data/data-handling-matrix.md](docs/data/data-handling-matrix.md) | P00-06 | Security + engineering | NOT_STARTED | NOT_STARTED | To be authored in P00-06 |
| Workflow | [docs/workflows/state-machine-index.md](docs/workflows/state-machine-index.md) | P00-07 | Engineering + clinical | NOT_STARTED | NOT_STARTED | To be authored in P00-07 |
| Workflow | [docs/workflows/cross-workflow-invariants.md](docs/workflows/cross-workflow-invariants.md) | P00-07 | Engineering + clinical + security | NOT_STARTED | NOT_STARTED | To be authored in P00-07 |
| Compliance | [docs/compliance/official-source-register.md](docs/compliance/official-source-register.md) | P00-12 | Legal counsel | NOT_STARTED | NOT_STARTED | To be authored in P00-12 |
| Finance | [docs/finance/payment-state-model.md](docs/finance/payment-state-model.md) | P00-13 | Finance + legal + engineering | NOT_STARTED | NOT_STARTED | To be authored in P00-13 |
| Testing | [docs/testing/test-strategy.md](docs/testing/test-strategy.md) | P00-14 | QA + accessibility + security | NOT_STARTED | NOT_STARTED | To be authored in P00-14 |
| Testing | [docs/testing/browser-validation-strategy.md](docs/testing/browser-validation-strategy.md) | P00-14 | QA + engineering | NOT_STARTED | NOT_STARTED | To be authored in P00-14 |
| Governance | [docs/governance/risk-register.md](docs/governance/risk-register.md) | P00-16 | Security + clinical + operations | NOT_STARTED | NOT_STARTED | To be authored in P00-16 |
| Governance | [docs/governance/dependency-register.md](docs/governance/dependency-register.md) | P00-16 | Execution lead | NOT_STARTED | NOT_STARTED | To be authored in P00-16 |
| Governance | [docs/governance/requirements-traceability-matrix.md](docs/governance/requirements-traceability-matrix.md) | P00-17 | Product + architecture + QA | NOT_STARTED | NOT_STARTED | To be authored in P00-17 |

## Update rule

- Update this register at each prompt completion.
- Add newly created files immediately and set status transitions from `NOT_STARTED` to `IN_PROGRESS` and `DONE`.
- Mark blockers and owners for all newly added open questions.
