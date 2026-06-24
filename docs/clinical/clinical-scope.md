# Clinical Scope

## Document Control

| Field | Value |
|---|---|
| Document title | Clinical Scope |
| Codex prompt ID | P00-09 |
| Complete Breakdown work package | P00-11 Clinical scope and safety model |
| Issue ID | P00-CLN-001 |
| Owner role | Clinical Lead |
| Clinical status | DRAFT-PENDING-CLINICAL-APPROVAL |
| Review state | REQUIRES_APPROVAL |
| Required reviewers | Clinical lead, product owner, operations lead, legal counsel, privacy counsel, security lead |
| Last updated | 2026-06-24 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1-draft |
| Final approval authority | Clinical Lead or Medical Director |
| Configuration dependencies | Scope catalogue, service area, clinician credential policy, red-flag configuration |
| Related decisions | REQ-CLN-001, REQ-CLN-002, REQ-CLN-003, REQ-CLN-034 |
| Related open questions | OQ-00-161 to OQ-00-164 |
| Related journeys | JRN-001, JRN-008, JRN-009, JRN-010, JRN-011 |
| Related workflows | WFL-005, WFL-006, WFL-012, WFL-015, WFL-016 |

This document is not approved clinical guidance. It must not be used as a substitute for qualified clinical judgment. Completion by Codex is not clinical approval. Changes require versioned review, approval evidence, and updates to related workflows, open questions, and future tests.

## Purpose

Define what the proposed adult pilot may support and what must be escalated, deferred, or excluded. This document creates reviewable scope boundaries only; it does not approve clinical care categories.

## Pilot Population

- Adults aged 18 and above.
- Patients within an approved service area.
- Patients able to provide or participate in consent, with delegation handled by later approved policy.
- Patients whose communication, accessibility, language, and connectivity needs can be safely supported.
- Patients whose condition remains suitable for remote assessment in the treating clinician's judgment.

Exclusions and conditional cases are safety classifications, not final diagnosis lists. Paediatric/pediatric clinical care remains DESIGN-NOW-IMPLEMENT-LATER.

## Proposed Supported Consultation Categories

Each category is DRAFT-PENDING-CLINICAL-APPROVAL and remains subject to clinician judgment. No category guarantees telemedicine suitability for every symptom.

| Rule ID | Category | Proposed scope | Review status |
|---|---|---|---|
| CLN-SCP-001 | General adult outpatient consultation | Adult outpatient remote assessment when safe. | DRAFT-PENDING-CLINICAL-APPROVAL |
| CLN-SCP-002 | Review of non-emergency symptoms | Initial symptom review without suspected emergency. | DRAFT-PENDING-CLINICAL-APPROVAL |
| CLN-SCP-003 | Follow-up of previously assessed conditions | Review of known issue when remote follow-up is safe. | DRAFT-PENDING-CLINICAL-APPROVAL |
| CLN-SCP-004 | Review of existing results | Clinician review and explanation of verified results. | DRAFT-PENDING-CLINICAL-APPROVAL |
| CLN-SCP-005 | Medication review | Clinician medication reconciliation and review. | DRAFT-PENDING-CLINICAL-APPROVAL |
| CLN-SCP-006 | Clinician-directed prescription | Only after assessment by an authorized clinician. | DRAFT-PENDING-CLINICAL-APPROVAL |
| CLN-SCP-007 | Clinician-directed laboratory ordering | Only by authorized clinician; detailed policy remains P00-10. | DRAFT-PENDING-CLINICAL-APPROVAL |
| CLN-SCP-008 | Routine referral | Closed-loop referral coordination. | DRAFT-PENDING-CLINICAL-APPROVAL |
| CLN-SCP-009 | Safety-net and follow-up review | Clinician-owned follow-up and safety-net reinforcement. | DRAFT-PENDING-CLINICAL-APPROVAL |

## Conditional Consultation Categories

| Rule ID | Conditional factor | Required action |
|---|---|---|
| CLN-SCP-010 | Video, additional measurements, existing records, in-person examination, specialist review, diagnostic testing, clinical-supervisor review, interpreter support, support-person involvement, or reliable patient location is required. | Treat as conditional and route according to clinician judgment and approved configuration. |

## Excluded or Deferred Categories

| Rule ID | Category | Classification |
|---|---|---|
| CLN-SCP-011 | Emergency presentations | Excluded from routine telemedicine; route to emergency protocol. |
| CLN-SCP-012 | Paediatric/pediatric clinical care | DESIGN-NOW-IMPLEMENT-LATER for the first adult pilot. |
| CLN-SCP-013 | Immediate physical procedure, live home-care treatment, unapproved specialties, cross-border clinical practice, inpatient care, emergency transport, autonomous diagnosis, or autonomous prescribing | Excluded or deferred until explicit approval. |

NelyoHealth is not an emergency medical service, ambulance service, emergency dispatch service, replacement for emergency care, guarantee of transport, or guarantee of facility acceptance.

## Clinical Scope Decision Table

| Category | Proposed scope | Remote suitability considerations | Video requirement | In-person requirement | Urgent or emergency trigger | Required clinician role | Required information | Required configuration | Exclusions | Approval authority | Review status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Adult outpatient | Candidate pilot scope | Complaint, history, location, communication, red flags | CLINICALLY-MANAGED-CONFIGURATION | When clinician cannot safely assess remotely | Red flags or clinician concern | Authorized clinician | Minimum intake | Scope and red-flag catalogue | Emergency, inpatient, procedure care | Clinical Lead | DRAFT-PENDING-CLINICAL-APPROVAL |
| Result review | Candidate pilot scope | Correct patient, order, result, and criticality | As clinically needed | If result requires physical assessment | Critical result or deterioration | Authorized clinician | Verified result and context | Critical-result configuration | Autonomous interpretation | Clinical Lead + laboratory owner | DRAFT-PENDING-CLINICAL-APPROVAL |
| Referral coordination | Candidate pilot scope | Referral priority and facility capability | As clinically needed | If receiving facility requires attendance | Urgent or emergency referral | Treating clinician | Referral reason, packet, consent | Referral priority rules | Facility acceptance guarantee | Clinical Lead + Operations | DRAFT-PENDING-CLINICAL-APPROVAL |

## Scope Change Control

New specialties, condition categories, test categories, prescribing categories, patient populations, and care modalities require clinical review, operational readiness, privacy review, security review, legal or regulatory review where applicable, test coverage, incident monitoring, and rollback criteria.

## Rule Traceability

| Rule ID | Source requirement | Owning document | Clinical owner | Approval status | Related journey | Related workflow | Related open question | Future test or rehearsal | Configuration dependency |
|---|---|---|---|---|---|---|---|---|---|
| CLN-SCP-001 to CLN-SCP-013 | P00-09 locked safety rules and Document 1 | docs/clinical/clinical-scope.md | Clinical Lead | DRAFT-PENDING-CLINICAL-APPROVAL unless direct locked exclusion | JRN-001, JRN-008, JRN-009, JRN-010, JRN-011 | WFL-005, WFL-006, WFL-012, WFL-015, WFL-016 | OQ-00-161 to OQ-00-164 | Clinical reviewer walkthrough and synthetic suitability scenarios | Scope catalogue, suitability rules, red-flag configuration |
