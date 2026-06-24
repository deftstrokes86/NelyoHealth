# Critical-Result Draft Runbook

## Document Control

| Field | Value |
|---|---|
| Document title | Critical-Result Draft Runbook |
| Codex prompt ID | P00-09 |
| Complete Breakdown work package | P00-12 Emergency, urgent, referral, and critical-result protocols |
| Issue ID | P00-CLN-002 |
| Owner role | Laboratory Clinical Owner + Operations Lead |
| Clinical status | DRAFT-PENDING-CLINICAL-APPROVAL |
| Runbook status | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL |
| Review state | REQUIRES_APPROVAL |
| Required reviewers | Clinical lead, laboratory clinical owner, operations lead, privacy counsel, security lead |
| Last updated | 2026-06-24 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1-draft |
| Final approval authority | Clinical Lead or Medical Director plus Laboratory Clinical Owner |
| Configuration dependencies | Critical-result catalogue, notification policy, failed-contact sequence, downtime fallback |
| Related decisions | REQ-CLN-027 to REQ-CLN-030, REQ-CLN-032 |
| Related open questions | OQ-00-188 to OQ-00-197 |
| Related journeys | JRN-009 |
| Related workflows | WFL-015, WFL-025 |

This runbook is not approved clinical guidance. It must not be used as a substitute for qualified clinical judgment. Operations staff must not interpret results independently or invent clinical advice.

## Runbook Purpose

Operational checklist for a verified critical result.

## Preconditions

Verified result, critical-rule identifier, patient identity, diagnostic order, ordering clinician, backup owner, contact channels, and current system status are available or being actively reconciled.

## Step-by-Step Checklist

| Step ID | Step | Owner | Approval status | Future test or rehearsal |
|---|---|---|---|---|
| CLN-RUN-021 | Confirm result verification. | Laboratory clinical owner | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Verification rehearsal |
| CLN-RUN-022 | Confirm patient-order-specimen match. | Laboratory clinical owner | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Match scenario |
| CLN-RUN-023 | Confirm critical configuration version. | Laboratory clinical owner | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Configuration review |
| CLN-RUN-024 | Notify ordering clinician. | Operations Lead | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Notification scenario |
| CLN-RUN-025 | Record delivery status. | Operations Lead | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Audit review |
| CLN-RUN-026 | Obtain explicit acknowledgment. | Ordering clinician or backup owner | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Acknowledgment test |
| CLN-RUN-027 | Escalate when unacknowledged. | Operations Lead + clinical supervisor | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Escalation rehearsal |
| CLN-RUN-028 | Contact patient according to protocol. | Clinician or approved operations role | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Patient contact scenario |
| CLN-RUN-029 | Confirm patient identity before disclosure. | Contacting actor | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Identity scenario |
| CLN-RUN-030 | Provide approved instruction. | Clinician or approved script owner | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Instruction review |
| CLN-RUN-031 | Use emergency contact when authorized. | Operations Lead + clinician | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Emergency-contact scenario |
| CLN-RUN-032 | Escalate emergency concern. | Clinical supervisor | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Emergency escalation scenario |
| CLN-RUN-033 | Handle failed contact. | Operations Lead | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Failed-contact rehearsal |
| CLN-RUN-034 | Handle clinician unavailability. | Clinical supervisor | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Backup-owner scenario |
| CLN-RUN-035 | Handle corrected result. | Laboratory clinical owner | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Corrected result rehearsal |
| CLN-RUN-036 | Handle platform outage. | Operations Lead + Security Lead | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Downtime rehearsal |
| CLN-RUN-037 | Link clinical incident where indicated. | Clinical Governance Lead | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Incident linkage review |
| CLN-RUN-038 | Record clinical action. | Treating clinician or backup owner | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Clinical action review |
| CLN-RUN-039 | Assign follow-up. | Clinical Lead + Operations Lead | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Follow-up ownership review |
| CLN-RUN-040 | Close only with approved evidence. | Clinical Lead + Laboratory Clinical Owner | DRAFT-PENDING-CLINICAL-AND-OPERATIONS-APPROVAL | Closure evidence review |

## Prohibited Actions

Operations staff must not interpret the result independently, change the result, invent advice, mark acknowledged without explicit evidence, close after notification alone, delete failed-contact history, or send detailed result values in insecure notifications.

## Downtime Checklist

Use approved manual fallback, preserve evidence, reconcile into the authoritative workflow later, and open incident where safety evidence is incomplete.

## Closure

Closure requires acknowledgment, patient action or escalation, documented resolution, and audit.
