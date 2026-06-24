# Referral Standard

## Document Control

| Field | Value |
|---|---|
| Document title | Referral Standard |
| Codex prompt ID | P00-09 |
| Complete Breakdown work package | P00-12 Emergency, urgent, referral, and critical-result protocols |
| Issue ID | P00-CLN-002 |
| Owner role | Clinical Lead + Operations Lead |
| Clinical status | DRAFT-PENDING-CLINICAL-APPROVAL |
| Review state | REQUIRES_APPROVAL |
| Required reviewers | Clinical lead, clinical supervisor, operations lead, privacy counsel, security lead, legal counsel |
| Last updated | 2026-06-24 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1-draft |
| Final approval authority | Clinical Lead or Medical Director plus Operations Lead |
| Configuration dependencies | Referral priority, packet, facility directory, outcome tracking, follow-up ownership |
| Related decisions | REQ-CLN-021, REQ-CLN-022, REQ-CLN-025, REQ-CLN-026 |
| Related open questions | OQ-00-183, OQ-00-185, OQ-00-186, OQ-00-187 |
| Related journeys | JRN-010, JRN-011 |
| Related workflows | WFL-016 |

This document is not approved clinical guidance. It must not be used as a substitute for qualified clinical judgment. Completion by Codex is not clinical approval. Changes require versioned review, approval evidence, and updates to related workflows, open questions, and future tests.

## Referral Categories

Conceptual categories are routine, priority, urgent, and emergency. Final clinical criteria require approval.

## Referral Creation

Referral creation includes clinical reason, required specialty or capability, priority, patient preference, geographic considerations, accessibility, HMO or network considerations where relevant, consent, minimum-necessary referral packet, clinician identity, and expiry or review requirement.

## Facility Selection

Hospital and specialist details may be shown for referral. Hospital referral is not governed by the pharmacy or laboratory pre-payment obscuration rule. Emergency facility guidance must not wait for payment. Routine referrals may follow ordinary administrative or coverage workflows.

## Referral Packet

The packet should contain minimum necessary identity, reason, relevant history, allergies, medication, observations, urgency, clinician identity, and requested capability. It should not include full longitudinal clinical records or unrelated diagnoses by default.

## Acceptance and Attendance

Track facility acceptance, appointment, patient attendance, no-show, facility rejection, alternative facility, patient cancellation, referral expiry, and outcome return.

## Outcome and Follow-Up

Track receiving facility outcome, treating clinician review, patient follow-up, open-loop tracking, unreturned outcome, failed patient contact, closure, and reopening.

## Referral Ownership

Referring clinician owns clinical reason and disposition. Patient participates in attendance and consent. Operations owns tracking and failed-contact coordination. Receiving facility owns its own acceptance and care process where supported. Clinical supervisor owns escalated clinical review. NelyoHealth does not guarantee facility acceptance.

## Rule Traceability

| Rule ID | Rule | Source requirement | Owning document | Clinical owner | Approval status | Related journey | Related workflow | Related open question | Future test or rehearsal | Configuration dependency |
|---|---|---|---|---|---|---|---|---|---|---|
| CLN-REF-001 | Referral categories are routine, priority, urgent, and emergency, with final criteria requiring approval. | P00-09 Document 9 | docs/clinical/referral-standard.md | Clinical Lead | REQUIRES_APPROVAL | JRN-010, JRN-011 | WFL-016 | OQ-00-185 | Referral category test | Referral priority configuration |
| CLN-REF-002 | Referral creation includes clinical reason, required specialty/capability, priority, patient preference, geography, accessibility, HMO/network considerations where relevant, consent, minimum-necessary packet, clinician identity, and expiry/review requirement. | P00-09 Document 9 | docs/clinical/referral-standard.md | Treating clinician | REQUIRES_APPROVAL | JRN-010 | WFL-016 | OQ-00-183 | Referral packet review | Referral packet configuration |
| CLN-REF-003 | Hospital and specialist details may be shown for referral; hospital referral is not governed by pharmacy/laboratory pre-payment obscuration. | P00-09 Document 9 | docs/clinical/referral-standard.md | Clinical Lead + Privacy counsel | APPROVED | JRN-010, JRN-011 | WFL-016 | OQ-00-183 | Disclosure-boundary review | Referral disclosure policy |
| CLN-REF-004 | Emergency facility guidance must not wait for payment; routine referrals may follow administrative or coverage workflows. | P00-09 Document 9 | docs/clinical/referral-standard.md | Clinical Lead | APPROVED | JRN-011 | WFL-016 | OQ-00-180 | Emergency facility guidance test | Emergency directory configuration |
| CLN-REF-005 | Referral packet uses proposed minimum necessary content and excludes unnecessary full clinical record content. | P00-09 Document 9 | docs/clinical/referral-standard.md | Treating clinician + Privacy counsel | REQUIRES_APPROVAL | JRN-010 | WFL-016 | OQ-00-183 | Packet minimization test | Referral packet approval |
| CLN-REF-006 | Acceptance and attendance track facility acceptance, appointment, patient attendance, no-show, facility rejection, alternative facility, patient cancellation, referral expiry, and outcome return. | P00-09 Document 9 | docs/clinical/referral-standard.md | Operations Lead | REQUIRES_APPROVAL | JRN-010 | WFL-016 | OQ-00-187 | Closed-loop referral test | Referral operations policy |
| CLN-REF-007 | Outcome and follow-up track receiving facility outcome, treating clinician review, patient follow-up, open-loop tracking, unreturned outcome, failed contact, closure, and reopening. | P00-09 Document 9 | docs/clinical/referral-standard.md | Clinical Lead + Operations Lead | REQUIRES_APPROVAL | JRN-010 | WFL-016 | OQ-00-186 | Referral outcome missing test | Follow-up policy |
| CLN-REF-008 | Referral ownership includes referring clinician, patient, operations team, receiving facility, and clinical supervisor, with limitations stated. | P00-09 Document 9 | docs/clinical/referral-standard.md | Clinical Lead + Operations Lead | REQUIRES_APPROVAL | JRN-010 | WFL-016 | OQ-00-186 | Ownership handoff rehearsal | Referral ownership policy |
