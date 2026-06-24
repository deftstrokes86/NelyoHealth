# Critical-Result Protocol

## Document Control

| Field | Value |
|---|---|
| Document title | Critical-Result Protocol |
| Codex prompt ID | P00-09 |
| Complete Breakdown work package | P00-12 Emergency, urgent, referral, and critical-result protocols |
| Issue ID | P00-CLN-002 |
| Owner role | Laboratory Clinical Owner + Clinical Lead |
| Clinical status | DRAFT-PENDING-CLINICAL-APPROVAL |
| Review state | REQUIRES_APPROVAL |
| Required reviewers | Clinical lead, laboratory clinical owner, operations lead, privacy counsel, security lead, legal counsel |
| Last updated | 2026-06-24 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1-draft |
| Final approval authority | Clinical Lead or Medical Director plus Laboratory Clinical Owner |
| Configuration dependencies | Critical-result configuration, result verification policy, notification policy, downtime fallback |
| Related decisions | REQ-CLN-027, REQ-CLN-028, REQ-CLN-029, REQ-CLN-030, REQ-WFL-021 |
| Related open questions | OQ-00-188 to OQ-00-197 |
| Related journeys | JRN-009, JRN-016 |
| Related workflows | WFL-012, WFL-015, WFL-025 |

This document is not approved clinical guidance. It must not be used as a substitute for qualified clinical judgment. Completion by Codex is not clinical approval. Changes require versioned review, approval evidence, and updates to related workflows, open questions, and future tests.

## Critical-Result Definition

A result is critical only according to approved, versioned clinical configuration. P00-09 does not invent values.

## Configuration Requirements

For each critical-result rule, record configuration ID, test, result component, units, patient context, laboratory method where relevant, criticality rule, clinical owner, source, version, approval, effective date, review date, superseded version, test evidence, applicable laboratories, and downtime representation.

## Verification

Verification requires correct patient, correct diagnostic order, correct specimen, correct units, correct reference context, authorized verifier, result version, signature or equivalent, criticality evaluation, and audit.

## Notification

Recipients are conceptually ordering clinician, backup clinician or clinical supervisor, operations escalation, patient according to approved protocol, and emergency contact where authorized and necessary.

## Acknowledgment

A notification sent is not an acknowledgment. Acknowledgment is an explicit recorded action by an authorized recipient.

## Escalation

Escalation covers unacknowledged result, clinician unavailable, patient unavailable, invalid contact details, patient refuses action, emergency condition, result corrected after escalation, laboratory outage, and platform outage. Exact intervals and attempts require clinical and operational approval.

## Patient Contact

Patient contact uses approved channels, identity confirmation, minimum-necessary disclosure, privacy-safe messages, emergency instruction, failed-contact sequence, emergency-contact use, and documentation.

## Corrected Results

Original result remains preserved. Correction reason, corrected version, new verification, re-evaluation of criticality, renotification, re-acknowledgment where needed, impact review, and incident review where indicated are required.

## Closure

Closure requires clinical acknowledgment, patient contact or documented escalation, clinical action, follow-up, resolution, audit, and incident linkage where applicable. Uploading or releasing the result alone does not close the loop.

## Rule Traceability

| Rule ID | Rule | Source requirement | Owning document | Clinical owner | Approval status | Related journey | Related workflow | Related open question | Future test or rehearsal | Configuration dependency |
|---|---|---|---|---|---|---|---|---|---|---|
| CLN-CRT-001 | A result is critical only according to approved, versioned clinical configuration. | P00-09 Document 10 | docs/clinical/critical-result-protocol.md | Laboratory Clinical Owner | APPROVED | JRN-009 | WFL-015 | OQ-00-189 | Critical config test | Critical-result configuration |
| CLN-CRT-002 | Each critical-result rule records configuration ID, test, component, units, patient context, method where relevant, criticality rule, owner, source, version, approval, effective date, review date, superseded version, test evidence, laboratories, and downtime representation. | P00-09 Document 10 | docs/clinical/critical-result-protocol.md | Laboratory Clinical Owner | APPROVED | JRN-009 | WFL-015 | OQ-00-189 | Configuration completeness review | Critical-result registry |
| CLN-CRT-003 | Verification requires correct patient, order, specimen, units, reference context, authorized verifier, result version, signature/equivalent, criticality evaluation, and audit. | P00-09 Document 10 | docs/clinical/critical-result-protocol.md | Laboratory Clinical Owner | REQUIRES_APPROVAL | JRN-009 | WFL-015 | OQ-00-189 | Verification scenario | Result verification policy |
| CLN-CRT-004 | Notification recipients are ordering clinician, backup clinician/supervisor, operations escalation, patient according to approved protocol, and emergency contact where authorized and necessary. | P00-09 Document 10 | docs/clinical/critical-result-protocol.md | Clinical Lead + Laboratory Clinical Owner | REQUIRES_APPROVAL | JRN-009 | WFL-015 | OQ-00-193 | Notification routing test | Notification policy |
| CLN-CRT-005 | Notification sent is not acknowledgment; acknowledgment is explicit recorded action by authorized recipient. | P00-09 Document 10 | docs/clinical/critical-result-protocol.md | Clinical Lead | APPROVED | JRN-009 | WFL-015 | OQ-00-190 | Acknowledgment test | Acknowledgment policy |
| CLN-CRT-006 | Escalation covers unacknowledged result, clinician unavailable, patient unavailable, invalid contact details, patient refuses action, emergency condition, corrected result after escalation, laboratory outage, and platform outage. | P00-09 Document 10 | docs/clinical/critical-result-protocol.md | Clinical Lead + Operations Lead | REQUIRES_APPROVAL | JRN-009 | WFL-015 | OQ-00-191 | Escalation tabletop | Critical escalation policy |
| CLN-CRT-007 | Patient contact uses approved channels, identity confirmation, minimum-necessary disclosure, privacy-safe messages, emergency instruction, failed-contact sequence, emergency-contact use, and documentation. | P00-09 Document 10 | docs/clinical/critical-result-protocol.md | Clinical Lead + Privacy counsel | REQUIRES_APPROVAL | JRN-009 | WFL-015 | OQ-00-193 | Patient contact scenario | Communication policy |
| CLN-CRT-008 | Corrected results preserve original result, correction reason, corrected version, new verification, re-evaluation, renotification, re-acknowledgment where needed, impact review, and incident review where indicated. | P00-09 Document 10 | docs/clinical/critical-result-protocol.md | Laboratory Clinical Owner | APPROVED | JRN-009 | WFL-015 | OQ-00-195 | Corrected critical result test | Correction policy |
| CLN-CRT-009 | Critical-result closure requires clinical acknowledgment, patient contact or documented escalation, clinical action, follow-up, resolution, audit, and incident linkage where applicable. | P00-09 Document 10 | docs/clinical/critical-result-protocol.md | Clinical Lead + Laboratory Clinical Owner | REQUIRES_APPROVAL | JRN-009 | WFL-015 | OQ-00-187 | Closure evidence test | Closure policy |
