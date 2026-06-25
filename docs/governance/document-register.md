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
| Product | [docs/product/user-journeys.md](../product/user-journeys.md) | P00-05 | Product + operations + clinical | DONE | PROPOSED | Authored in P00-05 |
| Product | [docs/product/service-blueprints.md](../product/service-blueprints.md) | P00-05 | Product + operations | DONE | PROPOSED | Authored in P00-05 |
| Product | [docs/product/exception-journeys.md](../product/exception-journeys.md) | P00-05 | Operations + clinical + security | DONE | PROPOSED | Authored in P00-05 |
| Testing | [docs/testing/journey-test-catalogue.md](../testing/journey-test-catalogue.md) | P00-05 | QA + product + security | DONE | PROPOSED | Authored in P00-05 |
| Architecture | [docs/architecture/tenancy-concept.md](../architecture/tenancy-concept.md) | P00-03 | Architecture + security | DONE | PROPOSED | Tenant boundaries completed in P00-03 |
| Security | [docs/security/access-intent-matrix.md](../security/access-intent-matrix.md) | P00-03 | Security + privacy | DONE | PROPOSED | Access intent matrix completed in P00-03 |
| Security | [docs/security/payer-visibility-matrix.md](../security/payer-visibility-matrix.md) | P00-04 | Finance + security | DONE | PROPOSED | Payer/funding intent model for P00-04 |
| Architecture | [docs/glossary.md](../glossary.md) | P00-06 | Product + clinical + engineering | DONE | PROPOSED | P00-07/P00-08 coverage; canonical terminology and ambiguity register; requires product/clinical/security/privacy review |
| Architecture | [docs/architecture/domain-boundaries.md](../architecture/domain-boundaries.md) | P00-06 | Architecture + engineering | DONE | PROPOSED | P00-08 coverage; modular-monolith bounded contexts and dependency rules; requires architecture/security review |
| Architecture | [docs/architecture/context-map.md](../architecture/context-map.md) | P00-06 | Architecture + engineering | DONE | PROPOSED | P00-08 coverage; context map and provider-disclosure flow; requires architecture/security review |
| Architecture | [docs/architecture/conceptual-domain-model.md](../architecture/conceptual-domain-model.md) | P00-06 | Architecture + clinical | DONE | PROPOSED | P00-08 coverage; conceptual model only, not schema; requires architecture/clinical review |
| Architecture | [docs/architecture/source-of-truth-matrix.md](../architecture/source-of-truth-matrix.md) | P00-06 | Architecture + engineering | DONE | PROPOSED | P00-08 coverage; source ownership and redacted projections; requires architecture/security/privacy review |
| Architecture | [docs/architecture/event-catalogue-draft.md](../architecture/event-catalogue-draft.md) | P00-06 | Architecture + engineering | DONE | PROPOSED | P00-08 coverage; draft event catalogue only; requires architecture/security review |
| Data | [docs/data/data-classification.md](../data/data-classification.md) | P00-06 | Security + privacy | DONE | PROPOSED | P00-07 coverage; classification model and provider location subclassification; requires privacy/security review |
| Data | [docs/data/data-handling-matrix.md](../data/data-handling-matrix.md) | P00-06 | Security + engineering | DONE | PROPOSED | P00-07 coverage; channel handling and browser artifact rules; requires security/QA/privacy review |
| Workflow | [docs/workflows/state-machine-index.md](../workflows/state-machine-index.md) | P00-07 | Architecture + operations | DONE | PROPOSED | P00-09 workflow index, conventions, dependency map, projection rules; requires architecture/security/operations review |
| Workflow | [docs/workflows/cross-workflow-invariants.md](../workflows/cross-workflow-invariants.md) | P00-07 | Architecture + clinical + security | DONE | PROPOSED | P00-09 cross-workflow invariants, contradiction matrix, orchestration candidates; requires clinical/security/finance/privacy review |
| Workflow | [docs/workflows/identity-verification.md](../workflows/identity-verification.md) | P00-07 | Security + identity operations | DONE | PROPOSED | WFL-001 identity-verification lifecycle, illegal transitions, timeout policy, retry/idempotency, dependencies, and test requirements |
| Workflow | [docs/workflows/guardian-verification.md](../workflows/guardian-verification.md) | P00-07 | Privacy + clinical + identity operations | DONE | PROPOSED | WFL-002 guardian-verification lifecycle; DESIGN-NOW-IMPLEMENT-LATER pilot status; approval-gated age and evidence policy |
| Workflow | [docs/workflows/practitioner-credential-review.md](../workflows/practitioner-credential-review.md) | P00-07 | Credentialing + clinical governance | DONE | PROPOSED | WFL-003 practitioner credential-review lifecycle, suspension and exception paths |
| Workflow | [docs/workflows/facility-credential-review.md](../workflows/facility-credential-review.md) | P00-07 | Credentialing + operations governance | DONE | PROPOSED | WFL-004 facility credential-review lifecycle, restriction, suspension, and revocation paths |
| Workflow | [docs/workflows/appointment.md](../workflows/appointment.md) | P00-07 | Product + operations + clinical | DONE | PROPOSED | WFL-005 appointment lifecycle, booking, attendance, cancellation, and no-show paths |
| Workflow | [docs/workflows/encounter.md](../workflows/encounter.md) | P00-07 | Clinical governance | DONE | PROPOSED | WFL-006 encounter lifecycle, clinical safety, emergency diversion, and finalized-record protection |
| Workflow | [docs/workflows/prescription.md](../workflows/prescription.md) | P00-07 | Clinical governance + pharmacy operations | DONE | PROPOSED | WFL-007 prescription lifecycle, amendments/versioning, cancellation, and fulfilment linkage |
| Workflow | [docs/workflows/pharmacy-quote.md](../workflows/pharmacy-quote.md) | P00-07 | Pharmacy operations + security | DONE | PROPOSED | WFL-008 pharmacy quote lifecycle with pre-payment provider-detail obscuration and authorized-order disclosure guard |
| Workflow | [docs/workflows/stock-reservation.md](../workflows/stock-reservation.md) | P00-07 | Pharmacy operations + finance | DONE | PROPOSED | WFL-009 stock reservation lifecycle, release, expiry, and reconciliation paths |
| Workflow | [docs/workflows/pharmacy-order.md](../workflows/pharmacy-order.md) | P00-07 | Pharmacy operations + finance + security | DONE | PROPOSED | WFL-010 pharmacy order lifecycle with payment-scoped provider disclosure and fulfilment paths |
| Workflow | [docs/workflows/delivery.md](../workflows/delivery.md) | P00-07 | Logistics + pharmacy operations | DONE | PROPOSED | WFL-011 delivery lifecycle, failed delivery, return, and proof-of-delivery policy decision points |
| Workflow | [docs/workflows/diagnostic-order.md](../workflows/diagnostic-order.md) | P00-07 | Clinical governance + laboratory operations | DONE | PROPOSED | WFL-012 diagnostic order lifecycle and cancellation/result dependency paths |
| Workflow | [docs/workflows/laboratory-appointment.md](../workflows/laboratory-appointment.md) | P00-07 | Laboratory operations + security | DONE | PROPOSED | WFL-013 laboratory appointment lifecycle with pre-payment provider-detail obscuration and preparation-instruction guard |
| Workflow | [docs/workflows/specimen.md](../workflows/specimen.md) | P00-07 | Laboratory operations + clinical governance | DONE | PROPOSED | WFL-014 specimen lifecycle, chain-of-custody, rejection, recollection, and retention policy decision points |
| Workflow | [docs/workflows/diagnostic-result.md](../workflows/diagnostic-result.md) | P00-07 | Clinical governance + laboratory QA | DONE | PROPOSED | WFL-015 diagnostic result lifecycle, verification, amendment/versioning, critical-result escalation, and release guard |
| Workflow | [docs/workflows/referral.md](../workflows/referral.md) | P00-07 | Clinical governance + operations | DONE | PROPOSED | WFL-016 referral lifecycle, acceptance, completion, closure, and escalation paths |
| Workflow | [docs/workflows/home-care-visit.md](../workflows/home-care-visit.md) | P00-07 | Operations + clinical governance | DONE | PROPOSED | WFL-017 home-care visit lifecycle; DESIGN-NOW-IMPLEMENT-LATER pilot status; visit safety constraints |
| Workflow | [docs/workflows/payment-intent.md](../workflows/payment-intent.md) | P00-07 | Finance + security | DONE | PROPOSED | WFL-018 payment intent lifecycle; successful-payment unlock event remains approval-gated and order-scoped |
| Workflow | [docs/workflows/refund.md](../workflows/refund.md) | P00-07 | Finance + legal + security | DONE | PROPOSED | WFL-019 refund lifecycle, reversal, chargeback, and disclosure-policy dependency |
| Workflow | [docs/workflows/payout.md](../workflows/payout.md) | P00-07 | Finance + provider operations | DONE | PROPOSED | WFL-020 payout lifecycle, reconciliation, rejection, and settlement dependencies |
| Workflow | [docs/workflows/prior-authorization.md](../workflows/prior-authorization.md) | P00-07 | HMO operations + finance + clinical governance | DONE | PROPOSED | WFL-021 prior authorization lifecycle; DESIGN-NOW-IMPLEMENT-LATER pilot status; emergency bypass invariant |
| Workflow | [docs/workflows/claim.md](../workflows/claim.md) | P00-07 | Finance + HMO operations | DONE | PROPOSED | WFL-022 claim lifecycle; DESIGN-NOW-IMPLEMENT-LATER pilot status; remittance and denial paths |
| Workflow | [docs/workflows/consent.md](../workflows/consent.md) | P00-07 | Privacy + security + clinical governance | DONE | PROPOSED | WFL-023 consent lifecycle, withdrawal, supersession, audit preservation, and lawful-basis separation |
| Workflow | [docs/workflows/complaint.md](../workflows/complaint.md) | P00-07 | Operations + compliance | DONE | PROPOSED | WFL-024 complaint lifecycle, escalation, resolution, appeal, and closure paths |
| Workflow | [docs/workflows/clinical-incident.md](../workflows/clinical-incident.md) | P00-07 | Clinical safety + compliance | DONE | REQUIRES_CLINICAL_REVIEW | WFL-025 clinical incident lifecycle, severity/reporting decision points, investigation, CAPA, and closure paths |
| Compliance | [docs/compliance/official-source-register.md](../compliance/official-source-register.md) | P00-12 | Legal/regulatory counsel | DONE | REQUIRES_APPROVAL | P00-15; official-source baseline; DRAFT-PENDING-NIGERIAN-LEGAL-AND-REGULATORY-REVIEW; approvals: legal/regulatory, privacy, clinical, finance, operations, security |
| Compliance | [docs/compliance/obligations-register.md](../compliance/obligations-register.md) | P00-12 | Legal/regulatory counsel + domain owners | DONE | REQUIRES_APPROVAL | P00-15; source-backed obligations, impacts, evidence, tests, owners, launch gates; not legal advice |
| Compliance | [docs/compliance/legal-question-log.md](../compliance/legal-question-log.md) | P00-12 | Legal/regulatory counsel | DONE | REQUIRES_APPROVAL | P00-15; mandatory legal questions and PCN display conflict; regulator clarification likely |
| Compliance | [docs/compliance/licence-and-registration-matrix.md](../compliance/licence-and-registration-matrix.md) | P00-12 | Legal counsel + credential review lead | DONE | REQUIRES_APPROVAL | P00-15; separates platform approvals, facility approvals, professional credentials, partner-held licences, and contract evidence |
| Compliance | [docs/compliance/contract-register-draft.md](../compliance/contract-register-draft.md) | P00-12 | Legal counsel + domain contract owners | DONE | REQUIRES_APPROVAL | P00-15; contract inventory only, not legal drafting |
| Compliance | [docs/compliance/regulatory-change-monitoring.md](../compliance/regulatory-change-monitoring.md) | P00-12 | Compliance lead + legal counsel | DONE | REQUIRES_APPROVAL | P00-15; official-source monitoring, change workflow, launch-gate review |
| Finance | [docs/finance/payment-state-model.md](../finance/payment-state-model.md) | P00-13 | Finance + legal + engineering | NOT_STARTED | PROPOSED | To be authored in P00-13 |
| Testing | [docs/testing/test-strategy.md](../testing/test-strategy.md) | P00-14 | QA + accessibility + security | NOT_STARTED | PROPOSED | To be authored in P00-14 |
| Testing | [docs/testing/browser-validation-strategy.md](../testing/browser-validation-strategy.md) | P00-14 | QA + engineering | NOT_STARTED | PROPOSED | To be authored in P00-14 |
| Governance | [docs/governance/risk-register.md](../governance/risk-register.md) | P00-16 | Security + clinical + operations | NOT_STARTED | PROPOSED | To be authored in P00-16 |
| Governance | [docs/governance/dependency-register.md](../governance/dependency-register.md) | P00-16 | Execution lead | NOT_STARTED | PROPOSED | To be authored in P00-16 |
| Governance | [docs/governance/phase-0-requirements-traceability.md](../governance/phase-0-requirements-traceability.md) | P00-17 | Product + architecture + QA | COMPLETED | FINAL-PHASE-0-REVIEW-DRAFT | Created in P00-17 |

## Update rule

- Update this register at each prompt completion.
- Add newly created files immediately and set status transitions from `NOT_STARTED` to `IN_PROGRESS` and `DONE`.
- Mark blockers and owners for all newly added open questions.
| Product | [docs/product/provider-discovery-privacy.md](../product/provider-discovery-privacy.md) | P00-08 | Product owner + Security lead | DONE | PROPOSED | P00-10 provider discovery privacy policy; requires product/security/privacy/legal/pharmacy/lab review |
| Contract | [docs/contracts/provider-disclosure-contract.md](../contracts/provider-disclosure-contract.md) | P00-08 | Security lead + Architecture lead | DONE | PROPOSED | P00-10 pre-payment and post-payment provider disclosure contract; financial evidence remains P00-13 dependency |
| Security | [docs/security/provider-disclosure-threat-model.md](../security/provider-disclosure-threat-model.md) | P00-08 | Security lead | DONE | PROPOSED | P00-10 threat model for browser, API, cache, map, telemetry, support, and partner leakage |
| Testing | [docs/testing/provider-disclosure-test-matrix.md](../testing/provider-disclosure-test-matrix.md) | P00-08 | QA lead + Security lead | DONE | PROPOSED | P00-10 future test matrix with interactive IDE browser and Playwright coverage; no tooling installed |
| ADR | [docs/adr/ADR-0001-provider-detail-release-after-payment.md](../adr/ADR-0001-provider-detail-release-after-payment.md) | P00-08 | Architecture lead + Security lead | DONE | APPROVED | Core server-side separation decision accepted; exact financial evidence remains REQUIRES_APPROVAL for P00-13 |
| Clinical | [docs/clinical/clinical-scope.md](../clinical/clinical-scope.md) | P00-09 | Clinical Lead | DONE | REQUIRES_APPROVAL | Purpose: adult pilot scope; Complete Breakdown P00-11; clinical status DRAFT-PENDING-CLINICAL-APPROVAL; required approval Clinical Lead/Medical Director |
| Clinical | [docs/clinical/clinical-safety-model.md](../clinical/clinical-safety-model.md) | P00-09 | Clinical Governance Lead | DONE | REQUIRES_APPROVAL | Purpose: safety objectives, hazards, configuration governance; Complete Breakdown P00-11; clinical status DRAFT-PENDING-CLINICAL-APPROVAL; required approval Clinical Lead/Medical Director |
| Clinical | [docs/clinical/telemedicine-suitability.md](../clinical/telemedicine-suitability.md) | P00-09 | Clinical Lead | DONE | REQUIRES_APPROVAL | Purpose: telemedicine suitability and red-flag categories; Complete Breakdown P00-11; clinical status DRAFT-PENDING-CLINICAL-APPROVAL; required approval Clinical Lead/Medical Director |
| Clinical | [docs/clinical/consultation-standard.md](../clinical/consultation-standard.md) | P00-09 | Clinical Lead + Treating clinician | DONE | REQUIRES_APPROVAL | Purpose: consultation conduct and documentation standard; Complete Breakdown P00-11; clinical status DRAFT-PENDING-CLINICAL-APPROVAL; required approval Clinical Lead/Medical Director |
| Clinical | [docs/clinical/safety-netting-standard.md](../clinical/safety-netting-standard.md) | P00-09 | Clinical Lead | DONE | REQUIRES_APPROVAL | Purpose: safety-netting content and failure handling; Complete Breakdown P00-11; clinical status DRAFT-PENDING-CLINICAL-APPROVAL; required approval Clinical Lead/Medical Director |
| Clinical | [docs/clinical/clinical-incident-policy.md](../clinical/clinical-incident-policy.md) | P00-09 | Clinical Governance Lead | DONE | REQUIRES_APPROVAL | Purpose: clinical incident governance; Complete Breakdown P00-11; clinical status DRAFT-PENDING-CLINICAL-APPROVAL; required approval Clinical Lead/Medical Director |
| Clinical | [docs/clinical/emergency-protocol.md](../clinical/emergency-protocol.md) | P00-09 | Clinical Lead + Operations Lead | DONE | REQUIRES_APPROVAL | Purpose: emergency protocol; Complete Breakdown P00-12; clinical status DRAFT-PENDING-CLINICAL-APPROVAL; required approval Clinical Lead/Medical Director + Operations Lead |
| Clinical | [docs/clinical/urgent-care-protocol.md](../clinical/urgent-care-protocol.md) | P00-09 | Clinical Lead + Operations Lead | DONE | REQUIRES_APPROVAL | Purpose: urgent-care protocol; Complete Breakdown P00-12; clinical status DRAFT-PENDING-CLINICAL-APPROVAL; required approval Clinical Lead/Medical Director + Operations Lead |
| Clinical | [docs/clinical/referral-standard.md](../clinical/referral-standard.md) | P00-09 | Clinical Lead + Operations Lead | DONE | REQUIRES_APPROVAL | Purpose: closed-loop referral standard; Complete Breakdown P00-12; clinical status DRAFT-PENDING-CLINICAL-APPROVAL; required approval Clinical Lead/Medical Director + Operations Lead |
| Clinical | [docs/clinical/critical-result-protocol.md](../clinical/critical-result-protocol.md) | P00-09 | Laboratory Clinical Owner + Clinical Lead | DONE | REQUIRES_APPROVAL | Purpose: critical-result protocol; Complete Breakdown P00-12; clinical status DRAFT-PENDING-CLINICAL-APPROVAL; required approval Clinical Lead/Medical Director + Laboratory Clinical Owner |
| Runbook | [docs/runbooks/emergency-escalation-draft.md](../runbooks/emergency-escalation-draft.md) | P00-09 | Operations Lead + Clinical Lead | DONE | REQUIRES_APPROVAL | Purpose: emergency escalation runbook; Complete Breakdown P00-12; clinical status DRAFT-PENDING-CLINICAL-APPROVAL and runbook status DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL; required approval Clinical Lead + Operations Lead |
| Runbook | [docs/runbooks/critical-result-draft.md](../runbooks/critical-result-draft.md) | P00-09 | Laboratory Clinical Owner + Operations Lead | DONE | REQUIRES_APPROVAL | Purpose: critical-result runbook; Complete Breakdown P00-12; clinical status DRAFT-PENDING-CLINICAL-APPROVAL and runbook status DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL; required approval Clinical Lead + Laboratory Clinical Owner + Operations Lead |

| Clinical | [docs/clinical/prescription-policy.md](../clinical/prescription-policy.md) | P00-10 | Clinical Lead + Pharmacy Operations Lead | DONE | REQUIRES_APPROVAL | Purpose: electronic prescription policy; Complete Breakdown P00-13; status DRAFT-PENDING-APPROVAL; required approval Clinical Lead/Medical Director + Pharmacy Operations + Legal + Regulatory reviewers |
| Operations | [docs/operations/pharmacy-fulfilment-policy.md](../operations/pharmacy-fulfilment-policy.md) | P00-10 | Pharmacy Operations Lead + Clinical Lead | DONE | REQUIRES_APPROVAL | Purpose: pharmacy matching, quotation, stock reservation, pharmacist review, dispensing, collection, and refund handoff; Complete Breakdown P00-13; status DRAFT-PENDING-APPROVAL; required approval Pharmacy Operations + Clinical + Legal + Regulatory + Finance + Security reviewers |
| Operations | [docs/operations/medicine-delivery-policy.md](../operations/medicine-delivery-policy.md) | P00-10 | Operations Lead + Pharmacy Operations Lead | DONE | REQUIRES_APPROVAL | Purpose: medicine delivery, handover, proof, return, deep-link, and incident policy; Complete Breakdown P00-13; status DRAFT-PENDING-APPROVAL; required approval Operations + Pharmacy + Privacy + Security + Legal reviewers |
| Clinical | [docs/clinical/laboratory-ordering-policy.md](../clinical/laboratory-ordering-policy.md) | P00-10 | Clinical Lead + Laboratory Operations Lead | DONE | REQUIRES_APPROVAL | Purpose: clinician-directed laboratory ordering, matching, booking, preparation, specimen identity, rejection, and recollection policy; Complete Breakdown P00-13; status DRAFT-PENDING-APPROVAL; required approval Clinical + Laboratory Operations + Legal + Regulatory reviewers |
| Clinical | [docs/clinical/result-release-policy.md](../clinical/result-release-policy.md) | P00-10 | Laboratory Clinical Owner + Clinical Lead | DONE | REQUIRES_APPROVAL | Purpose: result verification, release, structured/signed result, correction, critical result, clinician review, and closure policy; Complete Breakdown P00-13; status DRAFT-PENDING-APPROVAL; required approval Clinical + Laboratory + Legal + Privacy reviewers |
| Privacy | [docs/privacy/data-flow-map.md](../privacy/data-flow-map.md) | P00-11 | Privacy Counsel + Architecture Lead | DONE | REQUIRES_APPROVAL | Purpose: conceptual data-flow map; Complete Breakdown P00-14; privacy status DRAFT-PENDING-PRIVACY-AND-LEGAL-APPROVAL; approvals required Privacy + Legal + Security + Clinical + Operations + Architecture |
| Privacy | [docs/privacy/processing-activities-draft.md](../privacy/processing-activities-draft.md) | P00-11 | Privacy Counsel + Data Protection Officer | DONE | REQUIRES_APPROVAL | Purpose: draft processing activities register, not a legally complete ROPA; Complete Breakdown P00-14; approvals required Privacy + Legal + Security + Clinical + Finance + Operations |
| Privacy | [docs/privacy/consent-matrix.md](../privacy/consent-matrix.md) | P00-11 | Privacy Counsel + Product Owner + Clinical Lead | DONE | REQUIRES_APPROVAL | Purpose: consent principles, records, consent types, withdrawal, UX, and future tests; Complete Breakdown P00-14; approvals required Privacy + Legal + Clinical + Security + Accessibility + Product |
| Privacy | [docs/privacy/guardian-and-delegation-policy.md](../privacy/guardian-and-delegation-policy.md) | P00-11 | Privacy Counsel + Clinical Lead + Product Owner | DONE | REQUIRES_APPROVAL | Purpose: guardian, minor assent, adult delegation, clinical proxy, caregiver, revocation, and age transition policy; Complete Breakdown P00-14; minor live functionality DESIGN-NOW-IMPLEMENT-LATER |
| Privacy | [docs/privacy/retention-schedule-draft.md](../privacy/retention-schedule-draft.md) | P00-11 | Privacy Counsel + Legal Counsel + Data Owners | DONE | REQUIRES_APPROVAL | Purpose: draft retention categories without statutory periods; Complete Breakdown P00-14; approvals required Legal + Privacy + Clinical + Finance + Security + Operations |
| Privacy | [docs/privacy/data-subject-rights-workflows.md](../privacy/data-subject-rights-workflows.md) | P00-11 | Privacy Operations + Legal Counsel | DONE | REQUIRES_APPROVAL | Purpose: conceptual DSR workflows without statutory response periods; Complete Breakdown P00-14; approvals required Privacy + Legal + Security + Clinical + Operations |
| Privacy | [docs/privacy/cross-border-data-register.md](../privacy/cross-border-data-register.md) | P00-11 | Privacy Counsel + Legal Counsel + Security Lead | DONE | REQUIRES_APPROVAL | Purpose: cross-border flow register without approved transfer mechanisms; Complete Breakdown P00-14; approvals required Privacy + Legal + Security + Finance + Clinical + Operations |
| Privacy | [docs/privacy/subprocessor-register-draft.md](../privacy/subprocessor-register-draft.md) | P00-11 | Privacy Counsel + Security Lead + Vendor Owner | DONE | REQUIRES_APPROVAL | Purpose: subprocessor category register and due-diligence gates; no vendor approved; Complete Breakdown P00-14; approvals required Privacy + Legal + Security + Architecture + relevant domain owners |
| Security | [docs/security/break-glass-policy.md](../security/break-glass-policy.md) | P00-11 | Security Lead + Privacy Counsel + Clinical Lead | DONE | REQUIRES_APPROVAL | Purpose: exceptional break-glass access policy; Complete Breakdown P00-14; privacy/security/clinical/legal status DRAFT-PENDING-APPROVAL |
| Privacy | [docs/privacy/notification-data-policy.md](../privacy/notification-data-policy.md) | P00-11 | Privacy Counsel + Notifications Owner + Clinical Lead | DONE | REQUIRES_APPROVAL | Purpose: minimum-necessary notification data policy; Complete Breakdown P00-14; approvals required Privacy + Legal + Security + Clinical + Accessibility + Product |

## P00-13 document register additions

| Scope | Document path | Prompt | Owner | Status | Review state | Notes |
|---|---|---|---|---|---|---|
| Finance | [docs/finance/funds-flow.md](../finance/funds-flow.md) | P00-13 | Finance/Payments Owner + Legal Counsel + Accounting Reviewer | DONE | REQUIRES_APPROVAL | Purpose: funds-flow model; Complete Breakdown P00-16; lifecycle DRAFT; finance status DRAFT-PENDING-FINANCE-LEGAL-REGULATORY-ACCOUNTING-AND-TAX-APPROVAL; approvals required finance, legal/regulatory, accounting, tax, privacy, security, pharmacy, lab, product, architecture. |
| Finance | [docs/finance/payment-state-model.md](../finance/payment-state-model.md) | P00-13 | Finance/Payments Owner + Security Lead + Architecture Lead | DONE | REQUIRES_APPROVAL | Purpose: payment states, evidence profiles, and OrderFundingSecured proposal; Complete Breakdown P00-16; lifecycle DRAFT; finance status DRAFT-PENDING-FINANCE-LEGAL-REGULATORY-ACCOUNTING-AND-TAX-APPROVAL. |
| Finance | [docs/finance/ledger-principles.md](../finance/ledger-principles.md) | P00-13 | Finance/Payments Owner + Accounting Reviewer + Architecture Lead | DONE | REQUIRES_APPROVAL | Purpose: double-entry operational subledger, balance, wallet, and adjustment principles; Complete Breakdown P00-16; lifecycle DRAFT; finance status DRAFT-PENDING-FINANCE-LEGAL-REGULATORY-ACCOUNTING-AND-TAX-APPROVAL. |
| Finance | [docs/finance/refund-and-dispute-policy.md](../finance/refund-and-dispute-policy.md) | P00-13 | Finance/Payments Owner + Legal Counsel + Operations Lead | DONE | REQUIRES_APPROVAL | Purpose: refund, reversal, chargeback, dispute, and provider-detail recomputation policy; Complete Breakdown P00-16; lifecycle DRAFT; finance status DRAFT-PENDING-FINANCE-LEGAL-REGULATORY-ACCOUNTING-AND-TAX-APPROVAL. |
| Finance | [docs/finance/provider-settlement-policy.md](../finance/provider-settlement-policy.md) | P00-13 | Finance/Payments Owner + Provider Operations Lead | DONE | REQUIRES_APPROVAL | Purpose: provider payable, payout, hold, and settlement statement policy; Complete Breakdown P00-16; lifecycle DRAFT; finance status DRAFT-PENDING-FINANCE-LEGAL-REGULATORY-ACCOUNTING-AND-TAX-APPROVAL. |
| Finance | [docs/finance/claims-and-remittance-boundary.md](../finance/claims-and-remittance-boundary.md) | P00-13 | Finance/Payments Owner + HMO/Employer Operations Owner + Privacy Counsel | DONE | REQUIRES_APPROVAL | Purpose: eligibility, prior authorization, claim, remittance, provider payable, and payout boundary; Complete Breakdown P00-16; lifecycle DRAFT; finance status DRAFT-PENDING-FINANCE-LEGAL-REGULATORY-ACCOUNTING-AND-TAX-APPROVAL. |
| ADR | [docs/adr/ADR-0002-wallet-as-ledger-backed-balance.md](../adr/ADR-0002-wallet-as-ledger-backed-balance.md) | P00-13 | Finance/Payments Owner + Architecture Lead + Legal Counsel | DONE | REQUIRES_APPROVAL | Purpose: proposed wallet/funding-balance terminology and ledger-backed balance decision; Complete Breakdown P00-16; lifecycle DRAFT; finance status DRAFT-PENDING-FINANCE-LEGAL-REGULATORY-ACCOUNTING-AND-TAX-APPROVAL. |

## P00-14 document registrations

| Scope | Document path | Prompt | Owner | Status | Review state | Notes |
|---|---|---|---|---|---|---|
| Non-functional | [docs/non-functional/security-requirements.md](../non-functional/security-requirements.md) | P00-14 | Security + Architecture | DONE | REQUIRES_APPROVAL | Security NFRs and future verification anchors; documentation-only. |
| Non-functional | [docs/non-functional/reliability-requirements.md](../non-functional/reliability-requirements.md) | P00-14 | Operations + Architecture | DONE | REQUIRES_APPROVAL | Reliability NFRs and recovery evidence design; no numeric commitments approved. |
| Non-functional | [docs/non-functional/accessibility-requirements.md](../non-functional/accessibility-requirements.md) | P00-14 | Accessibility + Product + QA | DONE | REQUIRES_APPROVAL | WCAG 2.2 AA target planning; no conformance claim. |
| Non-functional | [docs/non-functional/performance-requirements.md](../non-functional/performance-requirements.md) | P00-14 | Architecture + QA + Operations | DONE | REQUIRES_APPROVAL | Performance measurement and budget schema; numeric targets approval-controlled. |
| Testing | [docs/testing/test-strategy.md](../testing/test-strategy.md) | P00-14 | QA + Security + Architecture | DONE | REQUIRES_APPROVAL | Phase-wide testing strategy and quality objectives; no test code. |
| Testing | [docs/testing/browser-validation-strategy.md](../testing/browser-validation-strategy.md) | P00-14 | QA + Architecture + Security | DONE | REQUIRES_APPROVAL | Interactive Codex IDE browser and Playwright Test strategy; no tooling installed. |
| Testing | [docs/testing/privacy-boundary-tests.md](../testing/privacy-boundary-tests.md) | P00-14 | Privacy + Security + QA | DONE | REQUIRES_APPROVAL | Negative privacy-boundary test design for provider disclosure and access separation. |
| ADR | [docs/adr/ADR-0003-codex-browser-validation.md](../adr/ADR-0003-codex-browser-validation.md) | P00-14 | Architecture + Security + QA | DONE | REQUIRES_APPROVAL | Browser validation architecture accepted in principle, implementation pending Phase 1. |

## P00-14 revision document registrations

| Scope | Document path | Prompt | Owner | Status | Review state | Notes |
|---|---|---|---|---|---|---|
| Design | [docs/design/experience-quality-requirements.md](../design/experience-quality-requirements.md) | P00-14 revision | Design + Product | DONE | REQUIRES_APPROVAL | Experience-quality release requirements; final design deferred to P00-14A. |
| Design | [docs/design/motion-requirements.md](../design/motion-requirements.md) | P00-14 revision | Design + Architecture + Accessibility | DONE | REQUIRES_APPROVAL | Motion for React requirements; no dependency installed. |
| Design | [docs/design/ui-ux-pro-max-governance.md](../design/ui-ux-pro-max-governance.md) | P00-14 revision | Design + Security + Architecture | DONE | REQUIRES_APPROVAL | UI UX Pro Max advisory skill governance; no skill installed. |
| Content | [docs/content/content-alignment-requirements.md](../content/content-alignment-requirements.md) | P00-14 revision | Content + Product + Domain Owners | DONE | REQUIRES_APPROVAL | Page, section, CTA, state-copy, and approval contract requirements. |
| Testing | [docs/testing/design-content-validation-strategy.md](../testing/design-content-validation-strategy.md) | P00-14 revision | QA + Design + Content | DONE | REQUIRES_APPROVAL | Design/content browser, automation, visual, and review validation strategy. |
| ADR | [docs/adr/ADR-0004-design-motion-and-content-governance.md](../adr/ADR-0004-design-motion-and-content-governance.md) | P00-14 revision | Architecture + Design + Content | DONE | REQUIRES_APPROVAL | Accepted-in-principle design, motion, skill, and content governance decision. |

## P00-14A document registrations

| Path | Purpose | Owner | Prompt | Work package | Lifecycle status | Review state | Design or content status | Required approvals |
|---|---|---|---|---|---|---|---|---|
| [docs/design/experience-principles.md](../design/experience-principles.md) | Experience principles | Design Owner + Product Owner | P00-14A | Experience design, visual system, motion system, and content architecture | DONE | REQUIRES_APPROVAL | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance/operations owners |
| [docs/design/brand-and-visual-direction.md](../design/brand-and-visual-direction.md) | Brand character, candidate directions, and recommended direction | Design Owner + Product Owner | P00-14A | Experience design, visual system, motion system, and content architecture | DONE | REQUIRES_APPROVAL | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance/operations owners |
| [docs/design/design-system-specification.md](../design/design-system-specification.md) | Design-system layers, primitives, domain components, and state standard | Design Owner + Architecture Owner | P00-14A | Experience design, visual system, motion system, and content architecture | DONE | REQUIRES_APPROVAL | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance/operations owners |
| [docs/design/design-tokens.md](../design/design-tokens.md) | Proposed semantic tokens and token architecture | Design Owner + Architecture Owner | P00-14A | Experience design, visual system, motion system, and content architecture | DONE | REQUIRES_APPROVAL | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance/operations owners |
| [docs/design/information-architecture.md](../design/information-architecture.md) | Public and authenticated information architecture | Product Owner + Design Owner | P00-14A | Experience design, visual system, motion system, and content architecture | DONE | REQUIRES_APPROVAL | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance/operations owners |
| [docs/design/navigation-and-dashboard-models.md](../design/navigation-and-dashboard-models.md) | Navigation and dashboard priority models | Design Owner + Product Owner | P00-14A | Experience design, visual system, motion system, and content architecture | DONE | REQUIRES_APPROVAL | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance/operations owners |
| [docs/design/page-and-state-inventory.md](../design/page-and-state-inventory.md) | Stable page IDs and required state coverage | Product Owner + Design Owner + Content Owner | P00-14A | Experience design, visual system, motion system, and content architecture | DONE | REQUIRES_APPROVAL | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance/operations owners |
| [docs/design/responsive-layout-strategy.md](../design/responsive-layout-strategy.md) | Responsive layout and content priority strategy | Design Owner + Accessibility Reviewer | P00-14A | Experience design, visual system, motion system, and content architecture | DONE | REQUIRES_APPROVAL | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance/operations owners |
| [docs/design/interaction-patterns.md](../design/interaction-patterns.md) | Interaction pattern catalogue | Design Owner + Product Owner | P00-14A | Experience design, visual system, motion system, and content architecture | DONE | REQUIRES_APPROVAL | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance/operations owners |
| [docs/design/motion-system.md](../design/motion-system.md) | Motion tokens, profiles, reduced motion, and protected data rules | Design Owner + Architecture Owner | P00-14A | Experience design, visual system, motion system, and content architecture | DONE | REQUIRES_APPROVAL | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance/operations owners |
| [docs/design/design-qa-and-visual-review.md](../design/design-qa-and-visual-review.md) | Design QA, screenshot matrix, visual review gates | Design Owner + QA Owner | P00-14A | Experience design, visual system, motion system, and content architecture | DONE | REQUIRES_APPROVAL | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance/operations owners |
| [docs/design/ui-ux-pro-max-review-brief.md](../design/ui-ux-pro-max-review-brief.md) | Future UI UX Pro Max review brief and source controls | Design Owner + Security Owner | P00-14A | Experience design, visual system, motion system, and content architecture | DONE | REQUIRES_APPROVAL | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance/operations owners |
| [docs/content/content-strategy.md](../content/content-strategy.md) | Content strategy, audiences, lifecycle | Content Owner + Product Owner | P00-14A | Experience design, visual system, motion system, and content architecture | DONE | REQUIRES_APPROVAL | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance/operations owners |
| [docs/content/voice-and-tone.md](../content/voice-and-tone.md) | Voice, tone, and style rules | Content Owner | P00-14A | Experience design, visual system, motion system, and content architecture | DONE | REQUIRES_APPROVAL | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance/operations owners |
| [docs/content/content-model.md](../content/content-model.md) | Conceptual content model and registry recommendation | Content Owner + Architecture Owner | P00-14A | Experience design, visual system, motion system, and content architecture | DONE | REQUIRES_APPROVAL | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance/operations owners |
| [docs/content/public-website-content-blueprint.md](../content/public-website-content-blueprint.md) | Public website content blueprint | Content Owner + Product Owner | P00-14A | Experience design, visual system, motion system, and content architecture | DONE | REQUIRES_APPROVAL | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance/operations owners |
| [docs/content/page-section-content-matrix.md](../content/page-section-content-matrix.md) | Canonical page-section-content alignment registry | Content Owner + Design Owner | P00-14A | Experience design, visual system, motion system, and content architecture | DONE | REQUIRES_APPROVAL | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance/operations owners |
| [docs/content/content-component-contracts.md](../content/content-component-contracts.md) | Content-component contracts | Content Owner + Design Owner | P00-14A | Experience design, visual system, motion system, and content architecture | DONE | REQUIRES_APPROVAL | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance/operations owners |
| [docs/content/content-approval-workflow.md](../content/content-approval-workflow.md) | Content statuses and approval routing | Content Owner + Compliance Reviewer | P00-14A | Experience design, visual system, motion system, and content architecture | DONE | REQUIRES_APPROVAL | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance/operations owners |
| [docs/content/microcopy-system.md](../content/microcopy-system.md) | Microcopy and CTA verb rules | Content Owner | P00-14A | Experience design, visual system, motion system, and content architecture | DONE | REQUIRES_APPROVAL | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance/operations owners |
| [docs/content/clinical-content-governance.md](../content/clinical-content-governance.md) | Clinical content governance | Clinical Safety Owner + Content Owner | P00-14A | Experience design, visual system, motion system, and content architecture | DONE | REQUIRES_APPROVAL | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance/operations owners |
| [docs/content/error-empty-loading-and-success-copy.md](../content/error-empty-loading-and-success-copy.md) | Structured state-message templates | Content Owner + QA Owner | P00-14A | Experience design, visual system, motion system, and content architecture | DONE | REQUIRES_APPROVAL | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance/operations owners |
| [docs/testing/design-and-content-validation.md](../testing/design-and-content-validation.md) | Design and content validation strategy | QA Owner + Design Owner + Content Owner | P00-14A | Experience design, visual system, motion system, and content architecture | DONE | REQUIRES_APPROVAL | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance/operations owners |

## P00-15 document registrations

| Path | Purpose | Owner | Prompt | Complete Breakdown work package | Lifecycle status | Review state | Operational status | Required approvals |
|---|---|---|---|---|---|---|---|---|
| [docs/operations/metric-catalogue.md](../operations/metric-catalogue.md) | Metric definitions, formula governance, closed-loop funnels, prohibited metrics, and future metric tests | Operations owner | P00-15 | P00-18 | Phase 0 draft | Pending orchestration acceptance | Proposed only; not implemented; not an approved SLA | Product, operations, clinical, security, privacy, finance, accessibility, engineering, regulatory/legal, design, and content approval |
| [docs/operations/sli-slo-draft.md](../operations/sli-slo-draft.md) | SLIs, proposed SLOs, guardrails, and operational dashboard catalogue | Operations owner | P00-15 | P00-18 | Phase 0 draft | Pending orchestration acceptance | Proposed only; not implemented; not an approved SLA | Product, operations, clinical, security, privacy, finance, accessibility, engineering, regulatory/legal, design, and content approval |
| [docs/operations/exception-queue-catalogue.md](../operations/exception-queue-catalogue.md) | Exception queues, queue ownership, priority model, escalation duty groups, and queue tests | Operations owner | P00-15 | P00-18 | Phase 0 draft | Pending orchestration acceptance | Proposed only; not implemented; not an approved SLA | Product, operations, clinical, security, privacy, finance, accessibility, engineering, regulatory/legal, design, and content approval |
| [docs/operations/pilot-stop-conditions.md](../operations/pilot-stop-conditions.md) | Pilot start-readiness, continuation, expansion-freeze, pause, stop, rollback, containment, and resume model | Execution lead | P00-15 | P00-18 | Phase 0 draft | Pending orchestration acceptance | Proposed only; not implemented; not an approved SLA | Product, operations, clinical, security, privacy, finance, accessibility, engineering, regulatory/legal, design, and content approval |
| [docs/data/analytics-data-policy.md](../data/analytics-data-policy.md) | Analytics minimization, source-of-truth limits, provider-disclosure safeguards, browser analytics controls, and tests | Privacy and analytics governance owners | P00-15 | P00-18 | Phase 0 draft | Pending orchestration acceptance | Proposed only; not implemented; not an approved SLA | Product, operations, clinical, security, privacy, finance, accessibility, engineering, regulatory/legal, design, and content approval |

## P00-16 document registrations

| Path | Purpose | Owner | Prompt | Complete Breakdown work package | Lifecycle status | Review state | Required approvals |
|---|---|---|---|---|---|---|---|
| [docs/governance/risk-register.md](../governance/risk-register.md) | Risk register and top-ten residual risk ranking | Governance/risk owner | P00-16 | P00-19 | Phase 0 draft | Pending orchestration acceptance | Founder/product, clinical, legal/regulatory, privacy, security, finance, operations, engineering, accessibility/design/content approval as applicable |
| [docs/governance/dependency-register.md](../governance/dependency-register.md) | Dependency register and critical paths | Governance/risk owner | P00-16 | P00-19 | Phase 0 draft | Pending orchestration acceptance | Founder/product, clinical, legal/regulatory, privacy, security, finance, operations, engineering, accessibility/design/content approval as applicable |
| [docs/adr/ADR-index.md](../adr/ADR-index.md) | ADR index and existing ADR review | Architecture owner | P00-16 | P00-19 | Phase 0 draft | Pending orchestration acceptance | Founder/product, clinical, legal/regulatory, privacy, security, finance, operations, engineering, accessibility/design/content approval as applicable |
| [docs/adr/ADR-0005-modular-monolith-first.md](../adr/ADR-0005-modular-monolith-first.md) | ADR-0005: Modular monolith first | Architecture owner | P00-16 | P00-19 | Phase 0 draft | Pending orchestration acceptance | Founder/product, clinical, legal/regulatory, privacy, security, finance, operations, engineering, accessibility/design/content approval as applicable |
| [docs/adr/ADR-0006-person-and-longitudinal-patient-identity.md](../adr/ADR-0006-person-and-longitudinal-patient-identity.md) | ADR-0006: Person and longitudinal patient identity | Architecture owner | P00-16 | P00-19 | Phase 0 draft | Pending orchestration acceptance | Founder/product, clinical, legal/regulatory, privacy, security, finance, operations, engineering, accessibility/design/content approval as applicable |
| [docs/adr/ADR-0007-payer-and-clinical-access-separation.md](../adr/ADR-0007-payer-and-clinical-access-separation.md) | ADR-0007: Payer and clinical-access separation | Architecture owner | P00-16 | P00-19 | Phase 0 draft | Pending orchestration acceptance | Founder/product, clinical, legal/regulatory, privacy, security, finance, operations, engineering, accessibility/design/content approval as applicable |
| [docs/adr/ADR-0008-finalized-clinical-record-amendments.md](../adr/ADR-0008-finalized-clinical-record-amendments.md) | ADR-0008: Finalized clinical record amendments | Architecture owner | P00-16 | P00-19 | Phase 0 draft | Pending orchestration acceptance | Founder/product, clinical, legal/regulatory, privacy, security, finance, operations, engineering, accessibility/design/content approval as applicable |
| [docs/adr/ADR-0009-video-platform-decision-deferred.md](../adr/ADR-0009-video-platform-decision-deferred.md) | ADR-0009: Video platform decision deferred | Architecture owner | P00-16 | P00-19 | Phase 0 draft | Pending orchestration acceptance | Founder/product, clinical, legal/regulatory, privacy, security, finance, operations, engineering, accessibility/design/content approval as applicable |
| [docs/adr/ADR-0010-no-production-phi-in-product-analytics-or-session-replay.md](../adr/ADR-0010-no-production-phi-in-product-analytics-or-session-replay.md) | ADR-0010: No production PHI in product analytics or session replay | Architecture owner | P00-16 | P00-19 | Phase 0 draft | Pending orchestration acceptance | Founder/product, clinical, legal/regulatory, privacy, security, finance, operations, engineering, accessibility/design/content approval as applicable |
| [docs/adr/ADR-0011-order-funding-secured-and-disclosure-separation.md](../adr/ADR-0011-order-funding-secured-and-disclosure-separation.md) | ADR-0011: OrderFundingSecured and disclosure separation | Architecture owner | P00-16 | P00-19 | Phase 0 draft | Pending orchestration acceptance | Founder/product, clinical, legal/regulatory, privacy, security, finance, operations, engineering, accessibility/design/content approval as applicable |

## P00-17 document registrations

| Path | Purpose | Owner | Prompt | Complete Breakdown work package | Lifecycle status | Review state | Required approvals |
|---|---|---|---|---|---|---|---|
| [docs/governance/phase-0-consistency-audit.md](../governance/phase-0-consistency-audit.md) | Phase 0 consistency audit and deterministic corrections | Phase 0 governance owner | P00-17 | P00-20 | Phase 0 final review draft | Pending external orchestration acceptance | External orchestration and domain approvers |
| [docs/governance/approval-register.md](../governance/approval-register.md) | External approval evidence register | Phase 0 governance owner | P00-17 | P00-20 | Phase 0 final review draft | Pending external orchestration acceptance | External orchestration and domain approvers |
| [docs/governance/unresolved-blocker-register.md](../governance/unresolved-blocker-register.md) | Unresolved blocker classification and allowed/prohibited work | Phase 0 governance owner | P00-17 | P00-20 | Phase 0 final review draft | Pending external orchestration acceptance | External orchestration and domain approvers |
| [docs/governance/phase-0-gate-review.md](../governance/phase-0-gate-review.md) | Final Phase 0, Phase 1, and pilot gate review | Phase 0 governance owner | P00-17 | P00-20 | Phase 0 final review draft | Pending external orchestration acceptance | External orchestration and domain approvers |
| [docs/governance/phase-1-readiness-handoff.md](../governance/phase-1-readiness-handoff.md) | Phase 1 source set and bounded task handoff | Phase 0 governance owner | P00-17 | P00-20 | Phase 0 final review draft | Pending external orchestration acceptance | External orchestration and domain approvers |
| [docs/governance/phase-0-completion-report.md](../governance/phase-0-completion-report.md) | Phase 0 completion report and recommendations | Phase 0 governance owner | P00-17 | P00-20 | Phase 0 final review draft | Pending external orchestration acceptance | External orchestration and domain approvers |


## P01-FND-001 document registration

| Category | Document | Prompt | Owner | Status | Approval state | Notes |
|---|---|---|---|---|---|---|
| Engineering | [docs/engineering/toolchain.md](../engineering/toolchain.md) | P01-FND-001 | Engineering / Architecture | CREATED | IMPLEMENTED-PENDING-ORCHESTRATION-ACCEPTANCE | Exact toolchain pins and official-source verification. |
| Engineering | [docs/engineering/browser-tooling.md](../engineering/browser-tooling.md) | P01-FND-001 | Engineering / QA / Security | CREATED | IMPLEMENTED-PENDING-ORCHESTRATION-ACCEPTANCE | Browser tooling strategy and artifact controls; interactive IDE browser verification remains blocked in current session. |
| Execution plan | [docs/exec-plans/P01-repository-and-browser-foundation.md](../exec-plans/P01-repository-and-browser-foundation.md) | P01-FND-001 | Engineering / Architecture | CREATED | PARTIAL-PENDING-BROWSER-INTEGRATION-VERIFICATION | Repository and browser foundation execution evidence. |
| Repository | [README.md](../../README.md) | P01-FND-001 | Engineering / Architecture | CREATED | IMPLEMENTED-PENDING-ORCHESTRATION-ACCEPTANCE | Root setup and command guide; no product application claim. |


## P01-FND-002 documents - 2026-06-25T03:29:17.292Z
- docs/exec-plans/P01-design-motion-content-foundation.md
- docs/engineering/design-tokens.md
- docs/engineering/content-registry.md
- docs/engineering/motion-foundation.md
- docs/engineering/ui-ux-pro-max-installation.md
- docs/design/ui-ux-pro-max-phase-1-review.md
- THIRD_PARTY_NOTICES.md

## P01-FND-003 document register entries - 2026-06-25

| Document | Purpose | Owner | Status |
|---|---|---|---|
| CONTRIBUTING.md | Contributor rules and checks | Repository owner | ACTIVE |
| SECURITY.md | Security reporting and sensitive-data rules | Security owner | ACTIVE |
| SUPPORT.md | Repository support boundary | Repository owner | ACTIVE |
| GOVERNANCE.md | Domain authority and review routing | Product/execution owner | ACTIVE |
| CHANGELOG.md | Foundation change history | Repository owner | ACTIVE |
| docs/exec-plans/P01-repository-collaboration-release-dependency-governance.md | P01-FND-003 execution plan and outcome | Engineering/architecture owner | ACTIVE |
| docs/engineering/repository-collaboration.md | Collaboration controls | Engineering/architecture owner | ACTIVE |
| docs/engineering/github-repository-controls.md | GitHub controls and admin pending items | Repository administrator | ACTIVE |
| docs/engineering/dependency-governance.md | Dependency policy | Engineering/security owner | ACTIVE |
| docs/engineering/versioning-and-release.md | Changesets and read-only release readiness | Engineering/release owner | ACTIVE |
| docs/engineering/supply-chain-inventory.md | Supply-chain inventory source basis | Engineering/security owner | ACTIVE |
| docs/governance/phase-1-requirements-traceability.md | Phase 1 traceability | Execution owner | ACTIVE |
| docs/governance/phase-1-gate-review.md | Phase 1 gate result | Execution owner | ACTIVE |
| docs/governance/phase-1-completion-report.md | Phase 1 completion report | Execution owner | ACTIVE |
| docs/governance/phase-2-readiness-handoff.md | Phase 2 conditional handoff | Execution owner | ACTIVE |

## P01-FND-004 document register entries - 2026-06-25

| Document | Purpose | Owner | Status |
|---|---|---|---|
| AGENTS.md | Root repository instructions for Codex work | Repository owner | ACTIVE |
| docs/AGENTS.md | Documentation-area instructions | Repository owner | ACTIVE |
| packages/AGENTS.md | Package-boundary instructions | Engineering owner | ACTIVE |
| tests/AGENTS.md | Test and browser-validation instructions | QA/security owner | ACTIVE |
| tools/AGENTS.md | Tooling-script instructions | Engineering/security owner | ACTIVE |
| .github/AGENTS.md | GitHub workflow and repository-setting instructions | Repository administrator | ACTIVE |
| infra/AGENTS.md | Future infrastructure instructions and Phase 2 boundary | Architecture/security owner | ACTIVE |
| .agent/PLANS.md | Execution-plan convention, not agent orchestration | Execution owner | ACTIVE |
| .agents/skills/nelyo-browser-validation/SKILL.md | Repository browser-validation Codex Skill | QA/security owner | ACTIVE |
| .agents/skills/nelyo-browser-validation/references/browser-checklist.md | Browser-validation checklist | QA/security owner | ACTIVE |
| .agents/skills/nelyo-browser-validation/references/provider-disclosure-checklist.md | Provider-disclosure browser privacy checklist | Privacy/security owner | ACTIVE |
| .agents/skills/nelyo-browser-validation/references/artifact-safety.md | Browser artifact safety checklist | Privacy/security owner | ACTIVE |
| docs/engineering/manual-git-and-github-workflow.md | Human-only Git and GitHub operating model | Repository owner | ACTIVE |
| docs/engineering/github-manual-ruleset-checklist.md | Manual branch-protection and ruleset checklist | Repository administrator | ACTIVE-PENDING-MANUAL-EVIDENCE |
| docs/governance/phase-1-map-amendments.md | Explicit Phase 1 map amendments | Execution owner | ACTIVE |
| docs/exec-plans/P01-phase-1-map-gap-closure.md | P01-FND-004 execution plan and validation scope | Execution owner | ACTIVE |
| tests/visual/design-foundation.visual.spec.ts | Synthetic foundation visual-contract test | QA/design owner | ACTIVE |
| tools/checks/phase-gated-database-command.mjs | Phase-gated database command interface | Engineering owner | ACTIVE |
| tools/checks/visual-baseline-update-gate.mjs | Manual-review gate for visual baseline updates | QA/design owner | ACTIVE |

## P02-PLAN-001 document register entries - 2026-06-25

| Document | Purpose | Owner | Status |
|---|---|---|---|
| docs/exec-plans/P02-platform-and-infrastructure-foundation.md | Canonical Phase 2 execution plan, issue order, dependencies, exit-gate mapping, and blockers | Execution/platform owner | ACTIVE |
| docs/engineering/phase-2-technology-evaluation.md | Current primary-source technology evaluation and ADR requirements | Engineering/architecture owner | ACTIVE |
| docs/engineering/phase-2-application-topology.md | Future application and package topology | Engineering/architecture owner | ACTIVE |
| docs/engineering/phase-2-environment-strategy.md | Local, PR, development, staging, production, and partner sandbox strategy | Platform/release owner | ACTIVE |
| docs/engineering/phase-2-local-infrastructure-plan.md | Local dependency and infrastructure plan | Platform/data owner | ACTIVE |
| docs/engineering/phase-2-browser-harness-plan.md | Phase 2 browser harness plan | QA/security owner | ACTIVE |
| docs/engineering/phase-2-issue-backlog.md | Authoritative 18-issue Phase 2 backlog | Execution/platform owner | ACTIVE |
| docs/governance/phase-2-requirements-traceability.md | Phase 2 requirement and exit-gate traceability | Governance/execution owner | ACTIVE |

## P02-ISS-001 document register entries - 2026-06-25

| Document | Purpose | Owner | Status |
|---|---|---|---|
| docs/exec-plans/P02-ISS-001-phase-2-adr-and-dependency-decision-pack.md | P02-ISS-001 execution plan, scope, validation, rollback, and completion evidence | Execution/platform owner | ACTIVE |
| docs/engineering/phase-2-dependency-decision-pack.md | Exact future package pins, package metadata evidence, official-source links, and dependency decision notes | Engineering/architecture owner | ACTIVE |
| docs/governance/p02-iss-001-adr-review-checklist.md | ADR review checklist and review-required limitations for P02-ISS-001 | Governance/execution owner | ACTIVE |
| docs/adr/ADR-P02-001-application-framework-and-dependency-pins.md | Phase 2 application framework and exact dependency-pin ADR | Engineering/architecture owner | ACTIVE |
| docs/adr/ADR-P02-002-database-access-and-migration-tool.md | Phase 2 database access and migration tool ADR | Platform/data owner | ACTIVE |
| docs/adr/ADR-P02-003-redis-compatible-cache-queue-and-worker-backplane.md | Phase 2 Redis-compatible queue/cache ADR | Engineering/security owner | ACTIVE |
| docs/adr/ADR-P02-004-object-storage-signed-url-adapter.md | Phase 2 object storage and signed URL adapter ADR | Platform/data owner | ACTIVE |
| docs/adr/ADR-P02-005-iac-cloud-provider-and-deployment-path.md | Phase 2 IaC/cloud provider path ADR | Platform/release owner | ACTIVE |
| docs/adr/ADR-P02-006-observability-and-error-reporting-boundary.md | Phase 2 observability and error-reporting boundary ADR | Engineering/security owner | ACTIVE |

## P02-ISS-002 document register entries - 2026-06-25

| Document | Purpose | Owner | Status |
|---|---|---|---|
| docs/exec-plans/P02-ISS-002-workspace-topology-and-package-boundaries.md | P02-ISS-002 execution plan, scope, validation, rollback, and completion evidence | Execution/platform owner | ACTIVE-PENDING-ORCHESTRATION-ACCEPTANCE |
| docs/engineering/phase-2-application-topology.md | Phase 2 app/package topology and P02-ISS-002 boundary API table | Engineering/architecture owner | ACTIVE-PENDING-P02-ISS-002-ACCEPTANCE |
| apps/AGENTS.md | App-area instructions for Phase 2 boundaries | Engineering/architecture owner | ACTIVE-PENDING-ORCHESTRATION-ACCEPTANCE |
| apps/*/AGENTS.md | App-specific boundary instructions | Engineering/architecture owner | ACTIVE-PENDING-ORCHESTRATION-ACCEPTANCE |
| apps/*/README.md | App boundary public API notes | Engineering/architecture owner | ACTIVE-PENDING-ORCHESTRATION-ACCEPTANCE |
| packages/api-client/README.md | API client package boundary public API notes | Engineering/architecture owner | ACTIVE-PENDING-ORCHESTRATION-ACCEPTANCE |
| packages/config/README.md | Config package boundary public API notes | Platform/security owner | ACTIVE-PENDING-ORCHESTRATION-ACCEPTANCE |
| packages/domain/README.md | Domain package boundary public API notes | Engineering/architecture owner | ACTIVE-PENDING-ORCHESTRATION-ACCEPTANCE |
| packages/observability/README.md | Observability package boundary public API notes | Engineering/security owner | ACTIVE-PENDING-ORCHESTRATION-ACCEPTANCE |
| packages/platform-adapters/README.md | Platform adapter package boundary public API notes | Engineering/security owner | ACTIVE-PENDING-ORCHESTRATION-ACCEPTANCE |
| packages/testing-factories/README.md | Synthetic testing factory package boundary public API notes | QA/security owner | ACTIVE-PENDING-ORCHESTRATION-ACCEPTANCE |
| tests/unit/workspace-topology.spec.ts | Deterministic topology contract test | QA/engineering owner | ACTIVE-PENDING-ORCHESTRATION-ACCEPTANCE |
