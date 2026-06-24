# Urgent-Care Protocol

## Document Control

| Field | Value |
|---|---|
| Document title | Urgent-Care Protocol |
| Codex prompt ID | P00-09 |
| Complete Breakdown work package | P00-12 Emergency, urgent, referral, and critical-result protocols |
| Issue ID | P00-CLN-002 |
| Owner role | Clinical Lead + Operations Lead |
| Clinical status | DRAFT-PENDING-CLINICAL-APPROVAL |
| Review state | REQUIRES_APPROVAL |
| Required reviewers | Clinical lead, clinical supervisor, operations lead, privacy counsel, security lead |
| Last updated | 2026-06-24 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1-draft |
| Final approval authority | Clinical Lead or Medical Director plus Operations Lead |
| Configuration dependencies | Urgent criteria, urgent response policy, referral priority configuration |
| Related decisions | REQ-CLN-005, REQ-CLN-021, REQ-CLN-023 |
| Related open questions | OQ-00-164, OQ-00-184, OQ-00-185, OQ-00-187 |
| Related journeys | JRN-010, JRN-011 |
| Related workflows | WFL-006, WFL-016 |

This document is not approved clinical guidance. It must not be used as a substitute for qualified clinical judgment. Completion by Codex is not clinical approval. Changes require versioned review, approval evidence, and updates to related workflows, open questions, and future tests.

## Urgent Versus Emergency

Urgent care requires accelerated clinical or in-person action but is not automatically the same as emergency escalation. Final clinical criteria require approval.

## Urgent Detection

Urgent detection may arise from intake, clinician assessment, new symptom report, diagnostic result, failed routine plan, worsening condition, or referral failure.

## Urgent Actions

Clinician review, priority in-person assessment, facility guidance, referral packet, patient instruction, follow-up ownership, failed-contact handling, and escalation to emergency when condition changes.

## Commercial Boundary

Urgent safety action must not be delayed by marketplace comparison, sponsor approval, funding selection, plan authorization, or payment failure. Financial processing may follow according to policy.

## Closure

Closure requires patient contacted, instructions received, referral or attendance outcome tracked where supported, clinician follow-up, escalation when unresolved, and audit.

## Rule Traceability

| Rule ID | Rule | Source requirement | Owning document | Clinical owner | Approval status | Related journey | Related workflow | Related open question | Future test or rehearsal | Configuration dependency |
|---|---|---|---|---|---|---|---|---|---|---|
| CLN-URG-001 | Urgent and emergency are distinct; final clinical criteria require approval. | P00-09 Document 8 | docs/clinical/urgent-care-protocol.md | Clinical Lead | REQUIRES_APPROVAL | JRN-010, JRN-011 | WFL-006, WFL-016 | OQ-00-164 | Urgent/emergency routing test | Urgent criteria configuration |
| CLN-URG-002 | Urgent detection can arise from intake, clinician assessment, new symptom report, diagnostic result, failed routine plan, worsening condition, or referral failure. | P00-09 Document 8 | docs/clinical/urgent-care-protocol.md | Clinical Lead | REQUIRES_APPROVAL | JRN-010 | WFL-006, WFL-015, WFL-016 | OQ-00-164 | Urgent detection scenario | Urgent criteria configuration |
| CLN-URG-003 | Urgent action includes clinician review, priority in-person assessment, facility guidance, referral packet, patient instruction, follow-up ownership, failed-contact handling, and emergency escalation if condition changes. | P00-09 Document 8 | docs/clinical/urgent-care-protocol.md | Treating clinician + Operations Lead | REQUIRES_APPROVAL | JRN-010 | WFL-016 | OQ-00-184 | Urgent referral scenario | Urgent response policy |
| CLN-URG-004 | Urgent safety action must not be delayed by marketplace comparison, sponsor approval, funding selection, plan authorization, or payment failure. | P00-09 Document 8 | docs/clinical/urgent-care-protocol.md | Clinical Lead | APPROVED | JRN-010, JRN-011 | WFL-006, WFL-016 | OQ-00-184 | Commercial-block bypass test | Urgent route policy |
| CLN-URG-005 | Urgent closure requires patient contacted, instructions received, referral/attendance outcome tracked where supported, clinician follow-up, escalation when unresolved, and audit. | P00-09 Document 8 | docs/clinical/urgent-care-protocol.md | Clinical Lead + Operations Lead | REQUIRES_APPROVAL | JRN-010 | WFL-016 | OQ-00-187 | Urgent closure test | Closure policy |
