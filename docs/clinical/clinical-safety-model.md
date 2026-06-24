# Clinical Safety Model

## Document Control

| Field | Value |
|---|---|
| Document title | Clinical Safety Model |
| Codex prompt ID | P00-09 |
| Complete Breakdown work package | P00-11 Clinical scope and safety model |
| Issue ID | P00-CLN-001 |
| Owner role | Clinical Lead + Clinical Governance Lead |
| Clinical status | DRAFT-PENDING-CLINICAL-APPROVAL |
| Review state | REQUIRES_APPROVAL |
| Required reviewers | Clinical lead, clinical supervisor, operations lead, privacy counsel, security lead, legal counsel |
| Last updated | 2026-06-24 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1-draft |
| Final approval authority | Clinical Lead or Medical Director |
| Configuration dependencies | Clinical safety configuration registry, incident categories, critical-result rules, referral priorities, emergency routing content |
| Related decisions | REQ-CLN-001 to REQ-CLN-035 |
| Related open questions | OQ-00-161 to OQ-00-204 |
| Related journeys | JRN-001, JRN-009, JRN-010, JRN-011, JRN-016 |
| Related workflows | WFL-005, WFL-006, WFL-012, WFL-015, WFL-016, WFL-025 |

This document is not approved clinical guidance. It must not be used as a substitute for qualified clinical judgment. Completion by Codex is not clinical approval. Changes require versioned review, approval evidence, and updates to related workflows, open questions, and future tests.

## Safety Objectives

- Identify emergencies early.
- Avoid false reassurance.
- Avoid unsafe remote care.
- Preserve patient identity.
- Preserve clinical provenance.
- Close follow-up loops.
- Escalate critical results.
- Use verified providers.
- Avoid clinical decisions driven by revenue.
- Prevent privacy or access failures from becoming safety failures.

## Clinical Safety Roles

| Role | Proposed responsibility | Approval status |
|---|---|---|
| Treating clinician | Clinical assessment, disposition, documentation, safety net, prescribing or ordering decisions. | DRAFT-PENDING-CLINICAL-APPROVAL |
| Clinical supervisor | Escalation review, incident closure, backup clinical judgment where assigned. | DRAFT-PENDING-CLINICAL-APPROVAL |
| Clinical governance lead | Configuration approval, safety review, scope changes, incident learning. | DRAFT-PENDING-CLINICAL-APPROVAL |
| Operations escalation lead | Queue ownership, failed-contact coordination, downtime execution. | REQUIRES-OPERATIONS-APPROVAL |
| Credentialing lead | Credential validity and provider-work gating. | REQUIRES-OPERATIONS-APPROVAL |
| Laboratory clinical owner | Critical-result configuration and lab escalation model. | DRAFT-PENDING-CLINICAL-APPROVAL |
| Pharmacy clinical owner | High-level prescribing and fulfilment safety interface. | DRAFT-PENDING-CLINICAL-APPROVAL |
| Privacy lead | Minimum-necessary disclosure and notification safety. | REQUIRES_APPROVAL |
| Security lead | Access, audit, and incident crossover controls. | REQUIRES_APPROVAL |
| Incident coordinator | Case coordination without clinical substitution. | REQUIRES_APPROVAL |
| Backup clinical owner | Backup coverage model where later approved. | REQUIRES_APPROVAL |

## Clinical Requirements Traceability

| Rule ID | Rule | Approval status | Related open question |
|---|---|---|---|
| CLN-REQ-001 | Adult outpatient pilot clinical boundary remains limited to adults aged 18 and above unless later approved. | APPROVED | OQ-00-161 |
| CLN-REQ-002 | Clinical rules require qualified clinical approval before becoming effective. | APPROVED | OQ-00-201 |
| CLN-REQ-003 | Human clinicians retain diagnostic, prescribing, ordering, interpretation, and disposition authority. | APPROVED | OQ-00-178 |
| CLN-REQ-004 | Telemedicine suitability is continuously reassessed as information, connectivity, and examination limits change. | APPROVED | OQ-00-164 |
| CLN-REQ-005 | Emergency and urgent cases leave ordinary booking and marketplace flow. | APPROVED | OQ-00-180 |
| CLN-REQ-006 | Current patient location or best available emergency location is required for emergency escalation. | REQUIRES_APPROVAL | OQ-00-165 |
| CLN-REQ-007 | Patient and clinician identity are confirmed before or at consultation start. | REQUIRES_APPROVAL | OQ-00-177 |
| CLN-REQ-008 | Minimum clinical intake is collected where clinically relevant without making every field mandatory by default. | REQUIRES_APPROVAL | OQ-00-177 |
| CLN-REQ-009 | Remote examination limitations are identified, communicated, documented, and acted upon. | REQUIRES_APPROVAL | OQ-00-167 |
| CLN-REQ-010 | Video is preferred where visual assessment matters; audio fallback is not universally equivalent. | REQUIRES_APPROVAL | OQ-00-168 |
| CLN-REQ-011 | Background blur may be available, but face visibility must be possible when clinically necessary. | REQUIRES_APPROVAL | OQ-00-169 |
| CLN-REQ-012 | Consultation recording is off by default and session replay is not silent clinical recording. | APPROVED | OQ-00-151 |
| CLN-REQ-013 | Additional consultation participants require known role, patient knowledge, consent or approved basis, documentation, and removal path. | REQUIRES_APPROVAL | OQ-00-171 |
| CLN-REQ-014 | Consultation documentation must capture identity, consent, participants, complaint, history, limitations, assessment, uncertainty, disposition, safety net, clinician, finalization, time, and amendments. | REQUIRES_APPROVAL | OQ-00-177 |
| CLN-REQ-015 | Finalized clinical notes and safety-event documentation use amendment, correction, replacement, or supersession with provenance. | APPROVED | OQ-00-179 |
| CLN-REQ-016 | Disconnection does not equal clinical completion. | APPROVED | OQ-00-175 |
| CLN-REQ-017 | Safety-netting is mandatory where clinically applicable. | REQUIRES_APPROVAL | OQ-00-202 |
| CLN-REQ-018 | Every open follow-up loop has clinical, operational, escalation, and backup ownership plus closure and reopening evidence. | REQUIRES_APPROVAL | OQ-00-186 |
| CLN-REQ-019 | Only an authorized clinician with valid credentials may prescribe after clinical assessment. | APPROVED | OQ-00-178 |
| CLN-REQ-020 | A laboratory result cannot automatically create a prescription or medication purchase. | APPROVED | OQ-00-178 |
| CLN-REQ-021 | Routine, priority, urgent, and emergency referrals are distinct categories. | REQUIRES_APPROVAL | OQ-00-185 |
| CLN-REQ-022 | Referrals are closed-loop and not complete when a document is generated. | APPROVED | OQ-00-187 |
| CLN-REQ-023 | Emergency escalation is independent of payment, funding, sponsor approval, HMO or employer authorization, registration, marketplace comparison, and provider-detail obscuration. | APPROVED | OQ-00-180 |
| CLN-REQ-024 | Emergency content is verified, configurable by service area, versioned, approved, tested, and monitored for currency. | REQUIRES_APPROVAL | OQ-00-180 |
| CLN-REQ-025 | Transfer summaries use minimum-necessary data for emergency or referral handoff. | REQUIRES_APPROVAL | OQ-00-183 |
| CLN-REQ-026 | Receiving-facility and failed-contact attempts are tracked without invented attempt counts or intervals. | REQUIRES_APPROVAL | OQ-00-182 |
| CLN-REQ-027 | Critical-result rules are versioned clinical configuration, not hard-coded values. | APPROVED | OQ-00-189 |
| CLN-REQ-028 | Critical-result acknowledgment is explicit and distinct from notification sent. | APPROVED | OQ-00-190 |
| CLN-REQ-029 | Failed critical-result contact escalates according to approved channels and ownership. | REQUIRES_APPROVAL | OQ-00-191 |
| CLN-REQ-030 | Corrected critical results require preservation, reverification, criticality reevaluation, renotification, and impact review. | APPROVED | OQ-00-195 |
| CLN-REQ-031 | Clinical incidents are first-class safety workflows with containment, investigation, correction, monitoring, closure, reopening, and learning. | REQUIRES_APPROVAL | OQ-00-198 |
| CLN-REQ-032 | Downtime behavior must preserve emergency and critical-result safety with approved manual fallback and later reconciliation. | REQUIRES_APPROVAL | OQ-00-196 |
| CLN-REQ-033 | Accessibility and connectivity are clinical safety concerns. | APPROVED | OQ-00-204 |
| CLN-REQ-034 | No vital-sign, symptom-duration, laboratory, age, pregnancy, mental-health, contact-attempt, escalation, or response-time threshold is invented in P00-09. | APPROVED | OQ-00-201 |
| CLN-REQ-035 | Clinical configuration changes require owner, source, version, effective date, approval, review, supersession, test evidence, and rollback or deactivation path. | APPROVED | OQ-00-201 |

All `CLN-REQ-*` rows map to source requirement P00-09 locked safety rules, owning document `docs/clinical/clinical-safety-model.md`, owner Clinical Lead, related journeys JRN-001/JRN-009/JRN-010/JRN-011/JRN-016, related workflows WFL-005/WFL-006/WFL-012/WFL-015/WFL-016/WFL-025, future clinical reviewer walkthrough, and CLINICALLY-MANAGED-CONFIGURATION where content or thresholds apply.

## Hazard Catalogue

No numeric probability or risk score is assigned in P00-09.

| Hazard ID | Scenario | Preventive control | Detection | Immediate response | Recovery | Owner | Required approval | Future test or rehearsal |
|---|---|---|---|---|---|---|---|---|
| CLN-SAF-001 | Missed emergency | Red-flag categories, location check, clinician authority | Intake, clinician review, patient report | Emergency protocol | Incident review and follow-up | Clinical Lead | REQUIRES_APPROVAL | Emergency tabletop |
| CLN-SAF-002 | Delayed emergency escalation | Emergency bypass of commercial flow | Audit and operations queue | Stop ordinary workflow | Post-event review | Clinical Lead + Operations | REQUIRES_APPROVAL | Emergency bypass test |
| CLN-SAF-003 | Wrong patient | Identity confirmation | Mismatch detection | Stop workflow | Correct record linkage review | Clinical Lead + Security | REQUIRES_APPROVAL | Wrong-patient scenario |
| CLN-SAF-004 | Wrong clinician | Credential and assignment check | Assignment mismatch | Reassign or suspend work | Credential review | Credentialing lead | REQUIRES_APPROVAL | Credential gate test |
| CLN-SAF-005 | Unverified clinician | Credential gate | Credential status event | Block new clinical work | Reassignment review | Credentialing lead | REQUIRES_APPROVAL | Suspension scenario |
| CLN-SAF-006 | Incomplete history | Minimum intake and clinician review | Clinician documentation gap | Seek information or escalate | Complete or mark incomplete | Treating clinician | REQUIRES_APPROVAL | Intake gap scenario |
| CLN-SAF-007 | Missing allergy | Intake and medication review | Clinician review | Stop prescribing path | Correct documentation | Treating clinician | REQUIRES_APPROVAL | Allergy scenario |
| CLN-SAF-008 | Missing medication | Medication reconciliation | Clinician review | Seek information | Update record by amendment | Treating clinician | REQUIRES_APPROVAL | Medication scenario |
| CLN-SAF-009 | Unsafe audio-only assessment | Video/audio policy | Documented limitation | Escalate to video or in-person | Safety-net and follow-up | Clinical Lead | REQUIRES_APPROVAL | Audio fallback scenario |
| CLN-SAF-010 | Poor-quality video | Video-quality check | Clinician observation | Reconnect, audio only if safe, or escalate | Document limitation | Treating clinician | REQUIRES_APPROVAL | Low-bandwidth scenario |
| CLN-SAF-011 | Failed consultation recovery | Draft preservation and reconnect path | Session interruption | Reconnect or reschedule | Incomplete assessment closure | Operations + clinician | REQUIRES_APPROVAL | Disconnection scenario |
| CLN-SAF-012 | Lost clinical note | Draft preservation and versioning | Missing draft alert | Preserve available evidence | Late completion or incident | Clinical Records owner | REQUIRES_APPROVAL | Draft preservation test |
| CLN-SAF-013 | Wrong prescription | Clinician-only prescribing | Clinical review | Stop fulfilment where possible | Amendment/replacement | Treating clinician | REQUIRES_APPROVAL | Prescription boundary test |
| CLN-SAF-014 | Duplicate prescription | Review of active prescriptions | Duplicate detection | Clinician review | Cancel/replace with provenance | Treating clinician | REQUIRES_APPROVAL | Duplicate scenario |
| CLN-SAF-015 | Lost diagnostic order | Order ownership and audit | Missing order status | Operations escalation | Reissue or close with evidence | Diagnostics owner | REQUIRES_APPROVAL | Lost order scenario |
| CLN-SAF-016 | Wrong result-to-patient association | Patient/order/specimen verification | Result mismatch | Hold release | Correct result workflow | Laboratory owner | REQUIRES_APPROVAL | Result association test |
| CLN-SAF-017 | Unacknowledged critical result | Explicit acknowledgment workflow | Overdue acknowledgment signal | Escalate to backup owner | Resolution and incident review | Laboratory clinical owner | REQUIRES_APPROVAL | Critical-result rehearsal |
| CLN-SAF-018 | Failed patient contact | Approved contact policy | Failed-contact queue | Escalate according to policy | Closure evidence | Operations + clinician | REQUIRES_APPROVAL | Failed contact scenario |
| CLN-SAF-019 | Failed referral | Closed-loop referral tracking | Outcome not returned | Follow-up required | Reopen/escalate | Operations + clinician | REQUIRES_APPROVAL | Referral failure test |
| CLN-SAF-020 | Patient no-show after urgent referral | Follow-up ownership | Non-attendance report | Contact and escalate | Document outcome | Operations + clinician | REQUIRES_APPROVAL | No-show scenario |
| CLN-SAF-021 | Provider suspension during care | Credential status gate | Suspension event | Review/reassign active care | Supervisor review | Credentialing lead | REQUIRES_APPROVAL | Suspension rehearsal |
| CLN-SAF-022 | Misleading automated advice | Human clinician authority | Content review | Remove unsafe advice | Incident review | Clinical governance | REQUIRES_APPROVAL | Decision-support review |
| CLN-SAF-023 | Privacy breach affecting care | Minimum-necessary access | Incident report | Containment | Privacy/security crossover | Privacy + Security | REQUIRES_APPROVAL | Privacy crossover scenario |
| CLN-SAF-024 | Payment blocking safety action | Emergency/urgent bypass | Blocked-flow detection | Bypass commercial gate | Audit and correction | Clinical + Finance | APPROVED | Payment bypass test |
| CLN-SAF-025 | Language, accessibility, connectivity, downtime, or operations backlog | Accessibility and resilience controls | Patient report, browser evidence, queues | Safe fallback | Follow-up and incident review | Clinical + Operations | REQUIRES_APPROVAL | Accessibility/downtime rehearsal |

## Safety-Control Hierarchy

- Prevention: scope boundaries, credential checks, identity/location confirmation, configured red flags, minimum intake, and clinician authority.
- Detection: reassessment, clinical review, audit events, support queues, patient reports, failed-contact queues, and result criticality evaluation.
- Containment: emergency interruption, urgent escalation, work suspension, record preservation, privacy/security containment, and incident opening.
- Recovery: follow-up, rescheduling, referral closure, corrected result renotification, amendment, and documented resolution.
- Monitoring: exception queues, incident trends, critical-result acknowledgment, referral outcomes, accessibility failures, and downtime events.
- Learning: governance review, configuration supersession, training update, and rollback/deactivation.

## Clinical Configuration Governance

Clinical red flags, critical-result rules, referral priority rules, telemedicine-suitability rules, video requirements, safety-net content, emergency facility routing, and contact/escalation policies require configuration identifier, owner, source basis, version, approval, effective date, review date, supersession history, test evidence, and rollback or deactivation path.

## Clinical Change Management

Every clinical change requires proposal, clinical rationale, impact assessment, approval, versioning, test update, training, effective date, monitoring, rollback, and supersession history. No review interval is invented in P00-09.

## Clinical Governance Review

Periodic, incident-triggered, regulatory-change, new-specialty, new-provider-type, safety-metric, and open-question reviews are required, with cadence set by approved governance policy.
