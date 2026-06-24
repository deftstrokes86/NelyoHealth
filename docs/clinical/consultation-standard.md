# Consultation Standard

## Document Control

| Field | Value |
|---|---|
| Document title | Consultation Standard |
| Codex prompt ID | P00-09 |
| Complete Breakdown work package | P00-11 Clinical scope and safety model |
| Issue ID | P00-CLN-001 |
| Owner role | Clinical Lead + Treating Clinician |
| Clinical status | DRAFT-PENDING-CLINICAL-APPROVAL |
| Review state | REQUIRES_APPROVAL |
| Required reviewers | Clinical lead, clinical supervisor, operations lead, privacy counsel, security lead, accessibility reviewer |
| Last updated | 2026-06-24 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1-draft |
| Final approval authority | Clinical Lead or Medical Director |
| Configuration dependencies | Consultation checklist, documentation template, video/audio rules, disconnection policy |
| Related decisions | REQ-CLN-007 to REQ-CLN-016, REQ-CLN-019, REQ-CLN-020 |
| Related open questions | OQ-00-167 to OQ-00-179 |
| Related journeys | JRN-001, JRN-008, JRN-009, JRN-011 |
| Related workflows | WFL-005, WFL-006, WFL-008, WFL-012, WFL-015 |

This document is not approved clinical guidance. It must not be used as a substitute for qualified clinical judgment. Completion by Codex is not clinical approval. Changes require versioned review, approval evidence, and updates to related workflows, open questions, and future tests.

## Before the Consultation

Appointment and clinician credential check, patient identity confirmation, current-location confirmation, emergency-contact review, consent, participant identification and consent, intake review, allergy and current-medication review, technical readiness, accessibility needs, language or communication needs, and privacy of environment are required where applicable.

## At Consultation Start

Confirm clinician identity and role, patient identity, participants, telemedicine limitations, emergency limitation, recording off, current location, and how disconnection will be handled.

## During Consultation

The clinician handles history, relevant observations, remote-examination limitations, patient-provided measurements, clinical uncertainty, differential assessment where appropriate, red-flag reassessment, medication reconciliation, allergy review, result review, shared decision-making, accessibility support, participant management, and transition to urgent or emergency protocol when needed.

## Video and Audio Standard

Video is preferred where visual assessment matters. Audio fallback may be used only when clinically acceptable. Background blur may be available, but face visibility must remain possible where clinically necessary. Camera-off, poor-quality video, audio failure, reconnection, no recording by default, and no silent session replay are documented boundaries.

## Consultation Disposition

Conceptual dispositions include advice or self-care guidance, prescription, diagnostic order, routine referral, urgent referral, emergency escalation, follow-up consultation, in-person examination required, and incomplete assessment. Disposition is separate from encounter lifecycle state.

## Documentation and Finalization

Consultation documentation includes identity confirmation, participants, consent, presenting complaint, relevant history, remote-examination limitations, findings or observations, clinical assessment, uncertainty, disposition, prescriptions, diagnostic orders, referrals, advice, follow-up, safety-net instructions, urgent or emergency escalation, clinician identity, signature or equivalent finalization, date/time, and amendments. Finalized records are not silently overwritten.

## Clinician Delay, No-Show, and Technical Failure

Policy requirements include patient notification, operations ownership, rescheduling, refund handoff, safety check where clinically necessary, and incident review for repeated failures. No time threshold is invented here.

## Post-Consultation

The patient receives visit summary, safety net, follow-up plan, prescription or test instructions where applicable, referral instructions, emergency instructions, question route, understanding confirmation where appropriate, and closure owner.

## Rule Traceability

| Rule ID | Rule | Source requirement | Owning document | Clinical owner | Approval status | Related journey | Related workflow | Related open question | Future test or rehearsal | Configuration dependency |
|---|---|---|---|---|---|---|---|---|---|---|
| CLN-SAF-026 | Before consultation, appointment, clinician credential, patient identity, location, emergency contact, consent, participants, intake, allergies, medication, technical readiness, accessibility, language, and privacy are reviewed. | P00-09 Document 4 | docs/clinical/consultation-standard.md | Treating clinician | REQUIRES_APPROVAL | JRN-001 | WFL-006 | OQ-00-177 | Consultation-start checklist test | Consultation checklist configuration |
| CLN-SAF-027 | At consultation start, clinician identity, patient identity, participants, limitations, emergency limitation, recording-off state, location, and disconnection handling are confirmed. | P00-09 Document 4 | docs/clinical/consultation-standard.md | Treating clinician | REQUIRES_APPROVAL | JRN-001 | WFL-006 | OQ-00-177 | Identity/location confirmation scenario | Consultation checklist configuration |
| CLN-SAF-028 | During consultation, history, observations, limitations, patient measurements, uncertainty, red flags, medication/allergy review, results, accessibility support, participants, and urgent/emergency transitions are addressed as relevant. | P00-09 Document 4 | docs/clinical/consultation-standard.md | Treating clinician | REQUIRES_APPROVAL | JRN-001 | WFL-006 | OQ-00-177 | Encounter documentation test | Documentation template approval |
| CLN-SAF-029 | Consultation dispositions remain separate from encounter lifecycle state. | P00-09 Document 4 | docs/clinical/consultation-standard.md | Clinical Lead | PROPOSED | JRN-001 | WFL-006 | OQ-00-164 | State/disposition mapping review | Workflow implementation review |
| CLN-SAF-030 | Documentation finalization uses draft preservation, signature, amendment, replacement, incomplete-note handling, late completion, supervisor review, and no silent overwrite. | P00-09 Document 4 | docs/clinical/consultation-standard.md | Treating clinician | APPROVED | JRN-001 | WFL-006 | OQ-00-179 | Amendment workflow test | Clinical record policy |
| CLN-SAF-031 | Clinician delay, no-show, and technical failure require patient notification, operations ownership, rescheduling, refund handoff, safety check where needed, and incident review for repeated failures without invented timing. | P00-09 Document 4 | docs/clinical/consultation-standard.md | Operations Lead + Clinical Lead | REQUIRES_APPROVAL | JRN-001 | WFL-005, WFL-006 | OQ-00-172 | No-show/delay scenario | Operations service policy |
