# Emergency Escalation Draft Runbook

## Document Control

| Field | Value |
|---|---|
| Document title | Emergency Escalation Draft Runbook |
| Codex prompt ID | P00-09 |
| Complete Breakdown work package | P00-12 Emergency, urgent, referral, and critical-result protocols |
| Issue ID | P00-CLN-002 |
| Owner role | Operations Lead + Clinical Lead |
| Clinical status | DRAFT-PENDING-CLINICAL-APPROVAL |
| Runbook status | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL |
| Review state | REQUIRES_APPROVAL |
| Required reviewers | Clinical lead, operations lead, legal counsel, privacy counsel, security lead |
| Last updated | 2026-06-24 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1-draft |
| Final approval authority | Clinical Lead or Medical Director plus Operations Lead |
| Configuration dependencies | Emergency service-area content, approved facility directory, communication policy, downtime manual fallback |
| Related decisions | REQ-CLN-023 to REQ-CLN-026, REQ-CLN-032 |
| Related open questions | OQ-00-180 to OQ-00-183, OQ-00-196 |
| Related journeys | JRN-011 |
| Related workflows | WFL-006, WFL-016, WFL-025 |

This runbook is not approved clinical guidance. It must not be used as a substitute for qualified clinical judgment. Operations staff must not diagnose, prescribe, interpret results, or provide unapproved medical advice.

## Runbook Purpose

Operational checklist for an already-triggered emergency escalation.

## Preconditions

Trigger source, current patient identity, current clinician, current location information, current communication channel, known emergency contact, and current system status are known or are actively being clarified.

## Step-by-Step Checklist

| Step ID | Step | Owner | Approval status | Future test or rehearsal |
|---|---|---|---|---|
| CLN-RUN-001 | Acknowledge escalation. | Operations Lead | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Emergency tabletop |
| CLN-RUN-002 | Confirm patient identity. | Operations Lead + clinician | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Identity scenario |
| CLN-RUN-003 | Confirm patient location. | Operations Lead + clinician | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Location unavailable scenario |
| CLN-RUN-004 | Confirm immediate communication. | Operations Lead | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Contact scenario |
| CLN-RUN-005 | Present approved emergency message. | Clinician or approved operator | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Message review |
| CLN-RUN-006 | Identify approved facility or emergency route. | Operations Lead | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Facility-directory scenario |
| CLN-RUN-007 | Notify clinical supervisor where required. | Operations Lead | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Supervisor escalation |
| CLN-RUN-008 | Support receiving-facility contact. | Operations Lead | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Receiving-facility rehearsal |
| CLN-RUN-009 | Support emergency-contact use where authorized. | Operations Lead + clinician | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Consent/contact scenario |
| CLN-RUN-010 | Generate transfer summary. | Treating clinician | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Transfer packet review |
| CLN-RUN-011 | Record every contact attempt. | Operations Lead | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Audit review |
| CLN-RUN-012 | Handle lost contact. | Operations Lead + clinical supervisor | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Lost-contact rehearsal |
| CLN-RUN-013 | Handle system outage. | Operations Lead + Security Lead | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Downtime rehearsal |
| CLN-RUN-014 | Handle map outage. | Operations Lead | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Map outage rehearsal |
| CLN-RUN-015 | Handle unavailable facility. | Operations Lead + clinical supervisor | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Facility unavailable scenario |
| CLN-RUN-016 | Preserve audit. | Operations Lead + Security Lead | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Audit evidence review |
| CLN-RUN-017 | Open incident when indicated. | Clinical Governance Lead | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Incident opening scenario |
| CLN-RUN-018 | Assign follow-up owner. | Clinical Lead + Operations Lead | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Follow-up ownership review |
| CLN-RUN-019 | Record disposition. | Treating clinician | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Disposition review |
| CLN-RUN-020 | Close only with approved evidence. | Clinical Lead + Operations Lead | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Closure evidence review |

## Prohibited Actions

Operations staff must not diagnose, give unapproved medical advice, delay action for payment, guarantee facility acceptance, fabricate location, edit clinical records directly, or close without evidence.

## Communication Templates

Template structure only: identify actor, verify patient, state that emergency guidance is required, present approved service-area content, confirm location, state that NelyoHealth is not emergency transport, record response, and escalate where needed. Wording requires clinical approval.

## Downtime Checklist

Use approved manual fallback, preserve minimum necessary notes, reconcile later, and open incident where safety evidence cannot be captured normally.

## Handoff and Closure

Closure requires approved evidence, assigned responsible owner, documented disposition, follow-up owner, and audit.
