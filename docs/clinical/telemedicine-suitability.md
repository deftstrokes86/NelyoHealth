# Telemedicine Suitability

## Document Control

| Field | Value |
|---|---|
| Document title | Telemedicine Suitability |
| Codex prompt ID | P00-09 |
| Complete Breakdown work package | P00-11 Clinical scope and safety model |
| Issue ID | P00-CLN-001 |
| Owner role | Clinical Lead |
| Clinical status | DRAFT-PENDING-CLINICAL-APPROVAL |
| Review state | REQUIRES_APPROVAL |
| Required reviewers | Clinical lead, clinical supervisor, product owner, accessibility reviewer, operations lead |
| Last updated | 2026-06-24 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1-draft |
| Final approval authority | Clinical Lead or Medical Director |
| Configuration dependencies | Suitability rules, red-flag categories, video/audio rules, accessibility and connectivity policy |
| Related decisions | REQ-CLN-004, REQ-CLN-006, REQ-CLN-009, REQ-CLN-010, REQ-CLN-034 |
| Related open questions | OQ-00-163 to OQ-00-170, OQ-00-204 |
| Related journeys | JRN-001, JRN-011 |
| Related workflows | WFL-005, WFL-006 |

This document is not approved clinical guidance. It must not be used as a substitute for qualified clinical judgment. Completion by Codex is not clinical approval. Changes require versioned review, approval evidence, and updates to related workflows, open questions, and future tests.

## Suitability Principles

Suitability is patient-specific, complaint-specific, time-specific, clinician-reviewed, and reassessed as information changes. NelyoHealth does not autonomously decide that an emergency is absent or that remote care is sufficient.

## Suitability Dimensions

Presenting complaint, symptom severity, red flags, patient age and population, medical history, current medication, pregnancy where relevant, required physical examination, required measurements, communication ability, cognitive capacity, consent, privacy of environment, accessibility, language, connectivity, video quality, current location, emergency support, clinician specialty and competence, and provider credential status are suitability dimensions.

## Conceptual Suitability Outcomes

- REMOTE-ASSESSMENT-PROPOSED
- REMOTE-ASSESSMENT-WITH-LIMITATIONS
- IN-PERSON-ASSESSMENT-REQUIRED
- URGENT-ESCALATION-REQUIRED
- EMERGENCY-ESCALATION-REQUIRED
- INSUFFICIENT-INFORMATION
- OUTSIDE-PILOT-SCOPE

These are documentation concepts, not final implementation enums.

## Suitability Assessment Stages

1. Pre-booking screening.
2. Intake screening.
3. Clinician review before consultation.
4. Confirmation at consultation start.
5. Reassessment during consultation.
6. Reassessment after disconnection.
7. Reassessment after new result or symptom report.

## Red Flags

Categories requiring clinical review include breathing or airway concern, chest or circulation concern, neurological concern, altered consciousness, severe bleeding, severe allergic reaction, severe pain, acute pregnancy-related concern, self-harm or violence risk, severe infection concern, sudden deterioration, major injury, poisoning or overdose, inability to maintain hydration or essential function, critical result, and clinician concern despite incomplete information. Exact definitions require clinical approval.

## Audio Fallback Rules

Audio fallback may be considered only where clinically acceptable. Visual assessment may still be required. The clinician must document limitations, patient information provided, escalation action, and the distinction between technical failure and clinical completion.

## Environmental Suitability

Patient privacy, patient safety, ability to speak freely, presence of another person, noise, lighting, camera position, device stability, data connectivity, emergency location, and communication accessibility affect suitability.

## Suitability Test Requirements

Future rehearsals and synthetic browser scenarios must cover suitability reassessment, red-flag interruption, location unavailable, audio fallback limitation, poor video, low bandwidth, inaccessible communication, and emergency escalation.

## Rule Traceability

| Rule ID | Rule | Source requirement | Owning document | Clinical owner | Approval status | Related journey | Related workflow | Related open question | Future test or rehearsal | Configuration dependency |
|---|---|---|---|---|---|---|---|---|---|---|
| CLN-TRI-001 | Suitability is patient-specific, complaint-specific, time-specific, clinician-reviewed, and reassessed when information changes. | P00-09 Document 3 | docs/clinical/telemedicine-suitability.md | Clinical Lead | APPROVED | JRN-001 | WFL-006 | OQ-00-164 | Suitability reassessment test | Suitability configuration |
| CLN-TRI-002 | Pre-booking screening may collect risk information but cannot decide that emergency is absent. | P00-09 Document 3 | docs/clinical/telemedicine-suitability.md | Clinical Lead | APPROVED | JRN-001 | WFL-005 | OQ-00-163 | Pre-booking escalation test | Red-flag configuration |
| CLN-TRI-003 | Intake screening covers complaint, severity category, history, medications, allergies, pregnancy where relevant, measurements, attachments, accessibility, language, location, emergency contact, consent, and participants where clinically relevant. | P00-09 Document 3 | docs/clinical/telemedicine-suitability.md | Clinical Lead | REQUIRES_APPROVAL | JRN-001 | WFL-006 | OQ-00-177 | Minimum intake form scenario | Clinical intake configuration |
| CLN-TRI-004 | Conceptual suitability outcomes are not final implementation enums. | P00-09 Document 3 | docs/clinical/telemedicine-suitability.md | Clinical Lead | PROPOSED | JRN-001 | WFL-006 | OQ-00-164 | State mapping review | Architecture implementation review |
| CLN-TRI-005 | Emergency red-flag categories are categories for review, not final thresholds. | P00-09 Document 3 | docs/clinical/telemedicine-suitability.md | Clinical Lead | APPROVED | JRN-011 | WFL-006 | OQ-00-163 | No-threshold regression scan | Red-flag configuration |
| CLN-TRI-006 | Audio fallback may be considered only when clinically acceptable and limitations are documented. | P00-09 Document 3 | docs/clinical/telemedicine-suitability.md | Clinical Lead | REQUIRES_APPROVAL | JRN-001 | WFL-006 | OQ-00-168 | Audio fallback scenario | Video/audio policy |
| CLN-TRI-007 | Poor environment, privacy, lighting, device, language, accessibility, or connectivity may make remote care unsafe. | P00-09 Document 3 | docs/clinical/telemedicine-suitability.md | Clinical Lead | REQUIRES_APPROVAL | JRN-001 | WFL-006 | OQ-00-204 | Low-bandwidth accessibility scenario | Accessibility and reliability policy |
| CLN-TRI-008 | Current location and emergency support are suitability dimensions. | P00-09 Document 3 | docs/clinical/telemedicine-suitability.md | Clinical Lead | REQUIRES_APPROVAL | JRN-011 | WFL-006 | OQ-00-165 | Location unavailable test | Emergency location policy |
