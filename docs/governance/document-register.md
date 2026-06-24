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
| Governance | [docs/STATUS.md](../STATUS.md) | P00-00 | Execution lead | DONE | REQUIRES_APPROVAL | Current phase status and next action |
| Governance | [docs/exec-plans/P00-product-clinical-regulatory-foundation.md](../exec-plans/P00-product-clinical-regulatory-foundation.md) | P00-00 | Execution lead | DONE | APPROVED | Execution plan + gates |
| Governance | [docs/governance/document-register.md](../governance/document-register.md) | P00-00 | Product + clinical + security | DONE | APPROVED | This register |
| Governance | [docs/governance/decision-register.md](../governance/decision-register.md) | P00-00 | Product + clinical + security | DONE | REQUIRES_APPROVAL | Locked requirements and P00-02 pilot scope decisions updated |
| Governance | [docs/governance/open-questions.md](../governance/open-questions.md) | P00-00 | Execution lead | IN_PROGRESS | APPROVED | Normalized open questions and approval links |
| Governance | [docs/governance/assumptions-register.md](../governance/assumptions-register.md) | P00-00 | Execution lead | IN_PROGRESS | APPROVED | Defaults pending owner confirmation |
| Governance | [docs/governance/change-log.md](../governance/change-log.md) | P00-00 | Execution lead | DONE | APPROVED | Baseline lock entries |
| Governance | [docs/governance/traceability-conventions.md](../governance/traceability-conventions.md) | P00-00 | Architecture | DONE | APPROVED | ID conventions and mapping rules |
| Product | [docs/product/product-charter.md](../product/product-charter.md) | P00-01 | Product + clinical + legal review | DONE | PROPOSED | Authored in P00-01 |
| Product | [docs/product/value-propositions.md](../product/value-propositions.md) | P00-01 | Product + clinical + legal review | DONE | PROPOSED | Authored in P00-01 |
| Product | [docs/product/business-model-hypotheses.md](../product/business-model-hypotheses.md) | P00-01 | Product + finance + legal review | DONE | PROPOSED | Authored in P00-01 |
| Product | [docs/product/product-principles.md](../product/product-principles.md) | P00-01 | Product + clinical + security | DONE | PROPOSED | Authored in P00-01 |
| Product | [docs/product/mvp-scope.md](../product/mvp-scope.md) | P00-02 | Product + clinical + engineering | DONE | PROPOSED | Authored in P00-02 |
| Product | [docs/product/pilot-operating-boundary.md](../product/pilot-operating-boundary.md) | P00-02 | Product + operations + clinical | DONE | PROPOSED | Authored in P00-02 |
| Product | [docs/product/service-catalogue-boundary.md](../product/service-catalogue-boundary.md) | P00-02 | Product + clinical + engineering | DONE | PROPOSED | Authored in P00-02 |
| Product | [docs/product/non-goals.md](../product/non-goals.md) | P00-02 | Product + clinical | DONE | PROPOSED | Authored in P00-02 |
| Product | [docs/product/expansion-gates.md](../product/expansion-gates.md) | P00-02 | Product + operations | DONE | PROPOSED | Authored in P00-02 |
| Product | [docs/product/personas.md](../product/personas.md) | P00-03 | Product + clinical | DONE | PROPOSED | Actor and scope model completed in P00-03 |
| Product | [docs/product/actor-catalogue.md](../product/actor-catalogue.md) | P00-03 | Security + clinical | DONE | PROPOSED | Actor model completed in P00-03 |
| Product | [docs/product/relationship-model.md](../product/relationship-model.md) | P00-03 | Product + privacy | DONE | PROPOSED | Relationship model completed in P00-03 |
| Product | [docs/product/funding-and-coverage-model.md](../product/funding-and-coverage-model.md) | P00-04 | Finance + legal | DONE | PROPOSED | Authored in P00-04 |
| Product | [docs/product/family-plan-rules.md](../product/family-plan-rules.md) | P00-04 | Product + legal | DONE | PROPOSED | Authored in P00-04 |
| Product | [docs/product/diaspora-plan-rules.md](../product/diaspora-plan-rules.md) | P00-04 | Product + legal + finance | DONE | PROPOSED | Authored in P00-04 |
| Product | [docs/product/employer-benefit-rules.md](../product/employer-benefit-rules.md) | P00-04 | Product + legal | DONE | PROPOSED | Authored in P00-04 |
| Product | [docs/product/hmo-coverage-rules.md](../product/hmo-coverage-rules.md) | P00-04 | Product + legal + finance | DONE | PROPOSED | Authored in P00-04 |
| Architecture | [docs/architecture/tenancy-concept.md](../architecture/tenancy-concept.md) | P00-03 | Architecture + security | DONE | PROPOSED | Tenant boundaries completed in P00-03 |
| Security | [docs/security/access-intent-matrix.md](../security/access-intent-matrix.md) | P00-03 | Security + privacy | DONE | PROPOSED | Access intent matrix completed in P00-03 |
| Security | [docs/security/payer-visibility-matrix.md](../security/payer-visibility-matrix.md) | P00-04 | Finance + security | DONE | PROPOSED | Payer/funding intent model for P00-04 |
| Architecture | [docs/glossary.md](../glossary.md) | P00-06 | Product + clinical + engineering | NOT_STARTED | PROPOSED | To be authored in P00-06 |
| Architecture | [docs/architecture/domain-boundaries.md](../architecture/domain-boundaries.md) | P00-08 | Architecture + engineering | NOT_STARTED | PROPOSED | Not created yet |
| Architecture | [docs/architecture/context-map.md](../architecture/context-map.md) | P00-06 | Architecture + engineering | NOT_STARTED | PROPOSED | To be authored in P00-06 |
| Architecture | [docs/architecture/conceptual-domain-model.md](../architecture/conceptual-domain-model.md) | P00-08 | Architecture + clinical | NOT_STARTED | PROPOSED | Not created yet |
| Architecture | [docs/architecture/source-of-truth-matrix.md](../architecture/source-of-truth-matrix.md) | P00-08 | Architecture + engineering | NOT_STARTED | PROPOSED | Not created yet |
| Architecture | [docs/architecture/event-catalogue-draft.md](../architecture/event-catalogue-draft.md) | P00-08 | Architecture + engineering | NOT_STARTED | PROPOSED | Not created yet |
| Data | [docs/data/data-classification.md](../data/data-classification.md) | P00-06 | Security + privacy | NOT_STARTED | PROPOSED | To be authored in P00-06 |
| Data | [docs/data/data-handling-matrix.md](../data/data-handling-matrix.md) | P00-06 | Security + engineering | NOT_STARTED | PROPOSED | To be authored in P00-06 |
| Workflow | [docs/workflows/state-machine-index.md](../workflows/state-machine-index.md) | P00-07 | Engineering + clinical | NOT_STARTED | PROPOSED | To be authored in P00-07 |
| Workflow | [docs/workflows/cross-workflow-invariants.md](../workflows/cross-workflow-invariants.md) | P00-07 | Engineering + clinical + security | NOT_STARTED | PROPOSED | To be authored in P00-07 |
| Compliance | [docs/compliance/official-source-register.md](../compliance/official-source-register.md) | P00-12 | Legal counsel | NOT_STARTED | PROPOSED | To be authored in P00-12 |
| Finance | [docs/finance/payment-state-model.md](../finance/payment-state-model.md) | P00-13 | Finance + legal + engineering | NOT_STARTED | PROPOSED | To be authored in P00-13 |
| Testing | [docs/testing/test-strategy.md](../testing/test-strategy.md) | P00-14 | QA + accessibility + security | NOT_STARTED | PROPOSED | To be authored in P00-14 |
| Testing | [docs/testing/browser-validation-strategy.md](../testing/browser-validation-strategy.md) | P00-14 | QA + engineering | NOT_STARTED | PROPOSED | To be authored in P00-14 |
| Governance | [docs/governance/risk-register.md](../governance/risk-register.md) | P00-16 | Security + clinical + operations | NOT_STARTED | PROPOSED | To be authored in P00-16 |
| Governance | [docs/governance/dependency-register.md](../governance/dependency-register.md) | P00-16 | Execution lead | NOT_STARTED | PROPOSED | To be authored in P00-16 |
| Governance | [docs/governance/requirements-traceability-matrix.md](../governance/requirements-traceability-matrix.md) | P00-17 | Product + architecture + QA | NOT_STARTED | PROPOSED | To be authored in P00-17 |

## Update rule

- Update this register at each prompt completion.
- Add newly created files immediately and set status transitions from `NOT_STARTED` to `IN_PROGRESS` and `DONE`.
- Mark blockers and owners for all newly added open questions.