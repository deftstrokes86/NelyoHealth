# Clinical Incident Policy

## Document Control

| Field | Value |
|---|---|
| Document title | Clinical Incident Policy |
| Codex prompt ID | P00-09 |
| Complete Breakdown work package | P00-11 Clinical scope and safety model |
| Issue ID | P00-CLN-001 |
| Owner role | Clinical Governance Lead |
| Clinical status | DRAFT-PENDING-CLINICAL-APPROVAL |
| Review state | REQUIRES_APPROVAL |
| Required reviewers | Clinical lead, operations lead, privacy counsel, security lead, legal counsel, compliance owner |
| Last updated | 2026-06-24 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1-draft |
| Final approval authority | Clinical Lead or Medical Director |
| Configuration dependencies | Incident taxonomy, severity model, reporting policy, closure authority |
| Related decisions | REQ-CLN-031, REQ-WFL-021 |
| Related open questions | OQ-00-198, OQ-00-199, OQ-00-200 |
| Related journeys | JRN-016 |
| Related workflows | WFL-025 |

This document is not approved clinical guidance. It must not be used as a substitute for qualified clinical judgment. Completion by Codex is not clinical approval. Changes require versioned review, approval evidence, and updates to related workflows, open questions, and future tests.

## Incident Definition

A clinical incident is an event or condition that caused or could have caused patient harm.

## Incident Categories

Categories include missed emergency, delayed escalation, wrong patient, wrong clinician, wrong prescription, wrong dosage, allergy-related error, duplicate treatment, lost or delayed result, wrong result association, unacknowledged critical result, failed patient contact, failed referral, incomplete consultation treated as complete, provider credential failure, clinical documentation loss, unsafe remote assessment, home-care incident in future scope, clinical privacy or security crossover, and clinical operations backlog.

## Severity

Severity uses qualitative concepts only. Final severity criteria remain REQUIRES-CLINICAL-APPROVAL and are separate from lifecycle state.

## Immediate Response

Immediate response includes patient-safety containment, clinical assessment, emergency escalation where needed, preservation of evidence, restriction of affected provider or workflow where needed, privacy and security involvement where relevant, operations coordination, and communication ownership.

## Investigation

Investigation includes timeline, actors, patient impact, clinical decision review, technology contribution, process contribution, communication contribution, human factors, contributing conditions, corrective action, and preventive action.

## Closure

Closure requires clinical-owner approval, corrective action, communication decision, monitoring plan, audit completion, reopening criteria, and external reporting review where applicable.

## Just Culture

The process should distinguish human error, at-risk behavior, reckless behavior, system design failure, training failure, and staffing or workload failure. P00-09 does not create disciplinary conclusions.

## Rule Traceability

| Rule ID | Rule | Source requirement | Owning document | Clinical owner | Approval status | Related journey | Related workflow | Related open question | Future test or rehearsal | Configuration dependency |
|---|---|---|---|---|---|---|---|---|---|---|
| CLN-INC-001 | A clinical incident is an event or condition that caused or could have caused patient harm. | P00-09 Document 6 | docs/clinical/clinical-incident-policy.md | Clinical Governance Lead | REQUIRES_APPROVAL | JRN-016 | WFL-025 | OQ-00-198 | Incident classification rehearsal | Incident policy |
| CLN-INC-002 | Incident categories include the P00-09 required safety categories. | P00-09 Document 6 | docs/clinical/clinical-incident-policy.md | Clinical Governance Lead | REQUIRES_APPROVAL | JRN-016 | WFL-025 | OQ-00-198 | Incident taxonomy review | Incident category configuration |
| CLN-INC-003 | Severity remains separate from incident lifecycle. | P00-09 Document 6 | docs/clinical/clinical-incident-policy.md | Clinical Governance Lead | APPROVED | JRN-016 | WFL-025 | OQ-00-198 | Lifecycle/severity review | Severity model approval |
| CLN-INC-004 | Immediate response includes patient-safety containment, clinical assessment, emergency escalation where needed, evidence preservation, workflow/provider restriction where needed, privacy/security involvement, operations coordination, and communication ownership. | P00-09 Document 6 | docs/clinical/clinical-incident-policy.md | Clinical Governance Lead | REQUIRES_APPROVAL | JRN-016 | WFL-025 | OQ-00-198 | Incident tabletop rehearsal | Containment runbook |
| CLN-INC-005 | Investigation records timeline, actors, patient impact, clinical decision review, technology, process, communication, human factors, contributing conditions, corrective action, and preventive action. | P00-09 Document 6 | docs/clinical/clinical-incident-policy.md | Clinical Governance Lead | REQUIRES_APPROVAL | JRN-016 | WFL-025 | OQ-00-198 | Investigation packet review | Investigation template |
| CLN-INC-006 | Closure requires clinical-owner approval, corrective action, communication decision, monitoring plan, audit completion, reopening criteria, and external reporting review where applicable. | P00-09 Document 6 | docs/clinical/clinical-incident-policy.md | Clinical Governance Lead | REQUIRES_APPROVAL | JRN-016 | WFL-025 | OQ-00-199 | Closure evidence review | Closure approval policy |
| CLN-INC-007 | Just-culture review distinguishes human error, at-risk behavior, reckless behavior, system design failure, training failure, and workload failure without creating disciplinary conclusions in P00-09. | P00-09 Document 6 | docs/clinical/clinical-incident-policy.md | Clinical Governance Lead | REQUIRES_APPROVAL | JRN-016 | WFL-025 | OQ-00-198 | Governance review | Just-culture policy |
