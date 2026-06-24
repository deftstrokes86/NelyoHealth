# Emergency Protocol

## Document Control

| Field | Value |
|---|---|
| Document title | Emergency Protocol |
| Codex prompt ID | P00-09 |
| Complete Breakdown work package | P00-12 Emergency, urgent, referral, and critical-result protocols |
| Issue ID | P00-CLN-002 |
| Owner role | Clinical Lead + Operations Lead |
| Clinical status | DRAFT-PENDING-CLINICAL-APPROVAL |
| Review state | REQUIRES_APPROVAL |
| Required reviewers | Clinical lead, clinical supervisor, operations lead, legal counsel, privacy counsel, security lead |
| Last updated | 2026-06-24 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1-draft |
| Final approval authority | Clinical Lead or Medical Director plus Operations Lead |
| Configuration dependencies | Emergency content by service area, facility directory, contact policy, downtime fallback |
| Related decisions | REQ-CLN-005, REQ-CLN-006, REQ-CLN-023, REQ-CLN-024, REQ-CLN-025, REQ-CLN-026, REQ-CLN-032, REQ-WFL-019 |
| Related open questions | OQ-00-163, OQ-00-165, OQ-00-180 to OQ-00-183, OQ-00-196 |
| Related journeys | JRN-011 |
| Related workflows | WFL-005, WFL-006, WFL-016, WFL-025 |

This document is not approved clinical guidance. It must not be used as a substitute for qualified clinical judgment. Completion by Codex is not clinical approval. Changes require versioned review, approval evidence, and updates to related workflows, open questions, and future tests.

## Emergency Definition

Emergency means a condition requiring immediate action beyond normal telemedicine operation. P00-09 does not create a final diagnostic list. NelyoHealth is not an emergency medical service, ambulance service, emergency dispatch service, replacement for emergency care, guarantee of emergency transport, or guarantee that a facility will accept the patient.

## Detection Inputs

Detection inputs include intake responses, patient statements, clinician assessment, participant report, patient-provided measurements, uploaded image or document, diagnostic result, critical-result alert, sudden deterioration, communication failure during suspected emergency, and operations report.

## Emergency Trigger Categories

Emergency trigger categories are clinically approved categories rather than invented thresholds.

## Immediate User Experience

The experience must provide a persistent on-screen emergency message, clear statement that NelyoHealth is not emergency transport, configured emergency contact information, nearest suitable facility guidance where available, current-location confirmation, emergency-contact option, accessibility, audio/text alternatives, no commercial comparison, and no payment gate. Wording requires clinical approval.

## Clinician Actions

Stop ordinary workflow, communicate urgency, confirm location, confirm immediate support, provide configured emergency instruction, initiate transfer summary, attempt receiving-facility contact where supported, attempt emergency-contact notification where authorized, document actions and limitations, remain connected where clinically and operationally appropriate, escalate to operations, and open clinical incident where indicated.

## Operations Actions

Receive emergency escalation, verify current available information, use approved facility directory, support contact attempts, record attempts, escalate when contact fails, preserve audit, avoid unapproved clinical advice, support downtime path, and complete post-event review.

## Transfer Summary

Proposed minimum content: patient identity, current location, presenting emergency concern, relevant history, allergies, current medication, relevant observations, actions already taken, clinician identity, contact information for follow-up, and time of escalation. Minimum-necessary and consent rules apply.

## Receiving-Facility Contact

Record attempt, outcome, declined, unable to contact, alternative facility, patient-directed attendance, audit, and no guarantee of acceptance. Exact attempt counts and time intervals require approval.

## Failed Patient Contact

Use approved contact channels, emergency-contact use where authorized, operations escalation, clinical-supervisor escalation, incident review, documentation, and closure authority. No counts or timing are invented.

## Payment and Coverage

Emergency escalation proceeds regardless of payment status, coverage, HMO eligibility, sponsor approval, employer approval, refund state, or provider-detail disclosure state. Pharmacy and laboratory provider-detail protection does not block emergency facility guidance.

## Downtime

Video outage, application outage, messaging outage, map outage, facility-directory outage, payment outage, identity-service outage, logging outage, and partial system failure require safe degraded behavior and manual approved operations.

## Closure

Emergency escalation is not closed merely because instructions were displayed. Closure requires approved evidence and post-event review.

## Rule Traceability

| Rule ID | Rule | Source requirement | Owning document | Clinical owner | Approval status | Related journey | Related workflow | Related open question | Future test or rehearsal | Configuration dependency |
|---|---|---|---|---|---|---|---|---|---|---|
| CLN-EMR-001 | Emergency means a condition requiring immediate action beyond normal telemedicine operation; P00-09 does not create a final diagnostic list. | P00-09 Document 7 | docs/clinical/emergency-protocol.md | Clinical Lead | REQUIRES_APPROVAL | JRN-011 | WFL-006 | OQ-00-163 | Emergency category review | Red-flag configuration |
| CLN-EMR-002 | Detection inputs include intake, patient statements, clinician assessment, participant report, measurements, uploads, result, critical alert, sudden deterioration, suspected-emergency communication failure, and operations report. | P00-09 Document 7 | docs/clinical/emergency-protocol.md | Clinical Lead | REQUIRES_APPROVAL | JRN-011 | WFL-006 | OQ-00-163 | Detection source scenario | Emergency detection configuration |
| CLN-EMR-003 | Emergency trigger categories use clinically approved categories, not invented thresholds. | P00-09 Document 7 | docs/clinical/emergency-protocol.md | Clinical Lead | APPROVED | JRN-011 | WFL-006 | OQ-00-163 | No-threshold scan | Emergency configuration |
| CLN-EMR-004 | Immediate user experience shows persistent safety message, configured emergency information, facility guidance where available, location confirmation, emergency-contact option, accessibility, audio/text alternatives, no comparison, and no payment gate. | P00-09 Document 7 | docs/clinical/emergency-protocol.md | Clinical Lead + Product Owner | REQUIRES_APPROVAL | JRN-011 | WFL-006 | OQ-00-180 | Emergency UX browser test | Emergency content configuration |
| CLN-EMR-005 | Clinician stops ordinary workflow, communicates urgency, confirms location/support, provides configured emergency instruction, prepares transfer summary, attempts facility/emergency-contact paths where supported and authorized, documents actions, remains connected where appropriate, escalates to operations, and opens incident where indicated. | P00-09 Document 7 | docs/clinical/emergency-protocol.md | Treating clinician | REQUIRES_APPROVAL | JRN-011 | WFL-006 | OQ-00-181 | Emergency clinician runbook rehearsal | Emergency operations policy |
| CLN-EMR-006 | Operations receive escalation, verify available information, use approved facility directory, support contact attempts, record attempts, escalate failed contact, preserve audit, avoid unapproved advice, support downtime, and complete post-event review. | P00-09 Document 7 | docs/clinical/emergency-protocol.md | Operations Lead | REQUIRES_APPROVAL | JRN-011 | WFL-006, WFL-025 | OQ-00-181 | Emergency operations rehearsal | Emergency operations policy |
| CLN-EMR-007 | Transfer summary uses minimum necessary patient, location, concern, history, allergies, medication, observations, actions, clinician identity, follow-up contact, and escalation time fields. | P00-09 Document 7 | docs/clinical/emergency-protocol.md | Treating clinician | REQUIRES_APPROVAL | JRN-011 | WFL-016 | OQ-00-183 | Transfer packet review | Transfer summary approval |
| CLN-EMR-008 | Receiving-facility contact records attempt, outcome, declined, unable-to-contact, alternative facility, patient-directed attendance, audit, and no guarantee of acceptance without counts or intervals. | P00-09 Document 7 | docs/clinical/emergency-protocol.md | Operations Lead | REQUIRES_APPROVAL | JRN-011 | WFL-016 | OQ-00-182 | Receiving-facility contact rehearsal | Facility directory approval |
| CLN-EMR-009 | Failed patient contact uses approved channels, emergency contact where authorized, operations escalation, clinical-supervisor escalation, incident review, documentation, and closure authority. | P00-09 Document 7 | docs/clinical/emergency-protocol.md | Clinical Lead + Operations Lead | REQUIRES_APPROVAL | JRN-011 | WFL-006 | OQ-00-191 | Failed contact scenario | Contact policy approval |
| CLN-EMR-010 | Emergency escalation proceeds regardless of payment, coverage, HMO eligibility, sponsor approval, employer approval, refund state, or provider-detail disclosure state. | P00-09 Document 7 | docs/clinical/emergency-protocol.md | Clinical Lead | APPROVED | JRN-011 | WFL-006 | OQ-00-180 | Commercial-block bypass test | Emergency route policy |
| CLN-EMR-011 | Video, application, messaging, map, facility-directory, payment, identity-service, logging, and partial outages use safe degraded behavior and approved manual operations. | P00-09 Document 7 | docs/clinical/emergency-protocol.md | Operations Lead + Security Lead | REQUIRES_APPROVAL | JRN-011 | WFL-006 | OQ-00-196 | Downtime tabletop rehearsal | Downtime runbook approval |
| CLN-EMR-012 | Emergency escalation is not closed merely because instructions were displayed; closure requires evidence and post-event review. | P00-09 Document 7 | docs/clinical/emergency-protocol.md | Clinical Lead | REQUIRES_APPROVAL | JRN-011 | WFL-006 | OQ-00-187 | Emergency closure evidence test | Closure policy |
