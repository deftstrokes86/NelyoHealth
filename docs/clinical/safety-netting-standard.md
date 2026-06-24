# Safety-Netting Standard

## Document Control

| Field | Value |
|---|---|
| Document title | Safety-Netting Standard |
| Codex prompt ID | P00-09 |
| Complete Breakdown work package | P00-11 Clinical scope and safety model |
| Issue ID | P00-CLN-001 |
| Owner role | Clinical Lead |
| Clinical status | DRAFT-PENDING-CLINICAL-APPROVAL |
| Review state | REQUIRES_APPROVAL |
| Required reviewers | Clinical lead, treating clinician, operations lead, privacy counsel, accessibility reviewer |
| Last updated | 2026-06-24 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1-draft |
| Final approval authority | Clinical Lead or Medical Director |
| Configuration dependencies | Safety-net template set, notification policy, language/accessibility policy |
| Related decisions | REQ-CLN-017, REQ-CLN-018, REQ-CLN-033 |
| Related open questions | OQ-00-191, OQ-00-202, OQ-00-203, OQ-00-204 |
| Related journeys | JRN-001, JRN-009, JRN-010, JRN-016 |
| Related workflows | WFL-006, WFL-015, WFL-016 |

This document is not approved clinical guidance. It must not be used as a substitute for qualified clinical judgment. Completion by Codex is not clinical approval. Changes require versioned review, approval evidence, and updates to related workflows, open questions, and future tests.

## Purpose

Define the minimum safety-net information following a remote consultation.

## Required Content

Where clinically applicable, safety netting includes what the clinician currently believes, what remains uncertain, expected course, what the patient should do, medication or care instructions, required tests, required referral, follow-up plan, warning signs, urgent-care triggers, emergency-care triggers, what to do if symptoms worsen, what to do if the patient cannot follow the plan, contact route, time sensitivity as approved configuration, and accessibility/language support.

## Patient Understanding

Use plain language, opportunity for questions, teach-back or equivalent confirmation where appropriate, written or accessible summary, interpreter or support-person considerations, and documentation of limitations.

## Delivery Channels

Supported channels are in-application summary, downloadable summary where approved, email/SMS/push notification without sensitive details, verbal instructions, and accessibility alternatives.

## Safety-Net Templates

Template structures are required for routine follow-up, diagnostic test pending, referral pending, medication prescribed, incomplete assessment, urgent escalation, emergency escalation, and failed contact. Exact clinical wording requires approval.

## Failure and Reopening

If instructions cannot be delivered, the patient does not understand, contact details are invalid, follow-up is missed, symptoms worsen, a new result changes the plan, or a corrected result changes the plan, the loop remains open or reopens with owner assignment.

## Rule Traceability

| Rule ID | Rule | Source requirement | Owning document | Clinical owner | Approval status | Related journey | Related workflow | Related open question | Future test or rehearsal | Configuration dependency |
|---|---|---|---|---|---|---|---|---|---|---|
| CLN-SAF-032 | Safety-net content includes current assessment, uncertainty, next steps, expected follow-up, warning signs, urgent and emergency care triggers, worsening symptoms, inability to follow plan, contact route, and understanding confirmation where appropriate. | P00-09 Document 5 | docs/clinical/safety-netting-standard.md | Treating clinician | REQUIRES_APPROVAL | JRN-001 | WFL-006 | OQ-00-202 | Safety-net summary test | Safety-net template approval |
| CLN-SAF-033 | Safety-net delivery channels use minimum necessary content and avoid routine notifications with diagnoses, medication names, or result values unless approved. | P00-09 Document 5 | docs/clinical/safety-netting-standard.md | Privacy counsel + Clinical Lead | REQUIRES_APPROVAL | JRN-001 | WFL-006 | OQ-00-204 | Notification redaction test | Notification policy |
| CLN-SAF-034 | Patient understanding is supported through plain language, questions, teach-back or equivalent where appropriate, accessible summary, interpreter/support-person considerations, and documented limitations. | P00-09 Document 5 | docs/clinical/safety-netting-standard.md | Treating clinician | REQUIRES_APPROVAL | JRN-001 | WFL-006 | OQ-00-203 | Understanding confirmation scenario | Language/accessibility policy |
| CLN-SAF-035 | Failed safety-net delivery, invalid contact, missed follow-up, worsening symptoms, new results, or corrected results reopen the relevant clinical loop. | P00-09 Document 5 | docs/clinical/safety-netting-standard.md | Clinical Lead + Operations Lead | REQUIRES_APPROVAL | JRN-016 | WFL-006, WFL-015 | OQ-00-191 | Reopening scenario | Follow-up ownership policy |
