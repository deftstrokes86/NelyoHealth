# Result Release Policy

## Document Control

| Field | Value |
|---|---|
| Document title | Result Release Policy |
| Codex prompt ID | P00-10 |
| Complete Breakdown work package | P00-13 |
| Issue ID | P00-FUL-001 |
| Owner role | Laboratory Clinical Owner + Clinical Lead |
| Status | DRAFT-PENDING-APPROVAL |
| Clinical status | DRAFT-PENDING-APPROVAL |
| Review state | REQUIRES_APPROVAL |
| Required reviewers | Clinical Lead/Medical Director, Laboratory Clinical Owner, Laboratory Operations Lead, Legal Counsel, Regulatory Reviewer, Privacy Counsel, Security Lead |
| Last updated | 2026-06-24 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1 draft |
| Related decisions | REQ-LOCK-010, REQ-LOCK-011, REQ-CLN-020, REQ-CLN-027 through REQ-CLN-030, REQ-FUL-031 through REQ-FUL-037 |
| Related open questions | OQ-00-254 through OQ-00-264 |
| Related journeys | JRN-006, JRN-009, JRN-020 |
| Related workflows | WFL-015 Diagnostic result, WFL-012 Diagnostic order, WFL-014 Specimen, WFL-016 Referral |

Clinical result-release rules are not effective until approved by clinical and laboratory authorities. Final payment sequencing and disclosure-unlock evidence remain dependencies of P00-13 where linked to paid diagnostic orders. This policy does not replace qualified professional judgment.

## Scope

This draft covers laboratory result production, verification, release, patient access, clinician access, structured data, signed documents, critical results, corrected results, cancellation, failed contact, clinician review, follow-up, and treatment changes.

It does not approve critical-value thresholds, final patient-direct release sequencing, final result-release deadlines, final retention periods, final structured-result format, or a final signed-result mechanism.

## Result Ownership Boundary

Laboratory Operations owns specimen and processing operations. Diagnostics owns the canonical verified clinical DiagnosticResult. The laboratory does not own the patient's full clinical record. A result links to the originating DiagnosticOrder and does not replace it. A result version does not overwrite an earlier verified version.

## Policy Rules

| Rule ID | Rule | Source requirement | Owning document | Owning role | Approval status | Related journey | Related workflow | Related exception | Future test | Related open question or configuration dependency |
|---|---|---|---|---|---|---|---|---|---|---|
| RES-POL-001 | Proposed result content includes patient identity, diagnostic order, order item, specimen, laboratory, authorized verifier, result component, value, unit, reference range, abnormal flag, criticality status, method where relevant, collection time, receipt time, verification time, result version, signature, interpretation boundary, attachments, and correction history. Final mandatory content requires clinical and laboratory approval. | P00-10 result content | Result Release Policy | Laboratory Clinical Owner + Clinical Lead | REQUIRES_APPROVAL | JRN-006 | WFL-015 | EXC-044 | TST-RES-004 | OQ-00-258; OQ-00-259 |
| RES-POL-002 | Verification requires correct patient, order, order item, specimen, authorized verifier, laboratory/facility eligibility, completed quality checks, units, reference context, version, signature or equivalent, critical-result evaluation, and audit. | P00-10 verification | Result Release Policy | Laboratory Clinical Owner | REQUIRES_APPROVAL | JRN-006 | WFL-015 | EXC-044 | TST-RES-001; TST-RES-002; TST-RES-003 | OQ-00-257 |
| RES-POL-003 | Release categories are conceptual policy labels only and do not replace WFL-015 implementation-neutral states: PENDING-VERIFICATION, VERIFIED-NONCRITICAL, VERIFIED-CRITICAL, RELEASED-TO-CLINICIAN, RELEASED-TO-PATIENT, HELD-FOR-REVIEW, CORRECTION-PENDING, CORRECTED, SUPERSEDED, and CANCELLED. | P00-10 release categories | Result Release Policy | Clinical Lead + Architecture Lead | REQUIRES_APPROVAL | JRN-006 | WFL-015 | EXC-044 | TST-RES-006; TST-RES-007 | OQ-00-254 |
| RES-POL-004 | Final release sequencing must decide which actor may release, what each recipient receives, whether clinician review precedes patient release, which special categories require additional review, out-of-hours handling, and accessibility/language needs. | P00-10 release sequencing | Result Release Policy | Clinical Lead + Privacy Counsel | REQUIRES_APPROVAL | JRN-006 | WFL-015 | EXC-044 | TST-RES-006; TST-RES-007 | OQ-00-255; OQ-00-256 |
| RES-POL-005 | Result representation must include human-readable result, structured result components, units, reference ranges, verification status, version, signature, correction history, and consistent linkage. A PDF alone must not be the only canonical representation where structured data is required. | P00-10 structured and signed result | Result Release Policy | Laboratory Clinical Owner + Architecture Lead | REQUIRES_APPROVAL | JRN-006 | WFL-015 | EXC-044 | TST-RES-004; TST-RES-005 | OQ-00-258; OQ-00-259 |
| RES-POL-006 | Patient release requires identity and authorization check, privacy-safe notification content, in-application access, accessible presentation, plain-language explanation boundary, no autonomous interpretation, follow-up route, critical-result exception, and corrected-result notice. | P00-10 patient release | Result Release Policy | Clinical Lead + Privacy Counsel | REQUIRES_APPROVAL | JRN-006 | WFL-015 | EXC-044 | TST-RES-007 | OQ-00-256 |
| RES-POL-007 | Clinician review requires responsible clinician, backup clinical owner, review status, acknowledgment, interpretation, follow-up, treatment-change decision, referral or additional testing where clinically appropriate, patient communication, and closure. Review is explicit and not inferred from result release. | P00-10 clinician review | Result Release Policy | Clinical Lead | REQUIRES_APPROVAL | JRN-006 | WFL-015 | EXC-044 | TST-RES-015 | OQ-00-264 |
| RES-POL-008 | Critical results follow P00-09 and require approved criticality configuration, explicit notification, explicit acknowledgment, failed-contact escalation, patient contact, emergency handling, clinical action, documented resolution, audit, and incident linkage where applicable. | P00-09 critical-result protocol | Result Release Policy | Clinical Lead + Laboratory Clinical Owner | APPROVED | JRN-006; JRN-009 | WFL-015; WFL-025 | EXC-045 | TST-RES-008; TST-RES-009; TST-RES-010 | OQ-00-188 through OQ-00-195 |
| RES-POL-009 | Corrected or amended results preserve the original result, record correction reason, create new version, require authorized verifier and new signature, re-evaluate criticality, renotify and reacknowledge where required, assess impact, communicate to patient, prompt clinician follow-up, review incidents where indicated, and never silently overwrite. | REQ-LOCK-011; P00-10 corrected results | Result Release Policy | Laboratory Clinical Owner + Clinical Lead | APPROVED | JRN-006 | WFL-015 | EXC-049 | TST-RES-011; TST-RES-012 | OQ-00-260 |
| RES-POL-010 | Cancelled or invalid results require reason, invalid specimen/processing/wrong-patient/wrong-order/quality-control handling, replacement or recollection route, patient and clinician notification, and audit. | P00-10 cancelled/invalid results | Result Release Policy | Laboratory Clinical Owner + Operations Lead | REQUIRES_APPROVAL | JRN-006 | WFL-014; WFL-015 | EXC-044 | TST-RES-013 | OQ-00-263 |
| RES-POL-011 | Result release does not prescribe treatment, verification does not start pharmacy order, abnormal result does not automatically create medication, critical result does not automatically select a hospital or pharmacy, and a qualified clinician must review and authorize treatment changes. | REQ-CLN-020; P00-10 result-to-treatment boundary | Result Release Policy | Clinical Lead | APPROVED | JRN-006 | WFL-015; WFL-007; WFL-010 | EXC-044 | TST-RES-014; TST-RES-015 | OQ-00-264 |
| RES-POL-012 | Emergency safety actions may proceed under the emergency protocol and are not blocked by result-release state, clinician-review state, pharmacy state, laboratory state, payment, coverage, sponsor approval, HMO authorization, or provider-detail protection. | REQ-LOCK-010 | Result Release Policy | Clinical Lead + Operations Lead | APPROVED | JRN-001; JRN-009 | WFL-006; WFL-015; WFL-016 | EXC-001 | TST-RES-008; TST-RES-014 | OQ-00-030 |
| RES-POL-013 | Diagnostic-loop closure requires applicable evidence of result verification, release, clinician review, patient communication, critical-result acknowledgment, required clinical action, follow-up, corrected-result handling, documented resolution, and audit. | P00-10 closure | Result Release Policy | Clinical Lead + Laboratory Clinical Owner | REQUIRES_APPROVAL | JRN-006 | WFL-015 | EXC-044; EXC-045 | TST-RES-015 | OQ-00-264 |
| RES-POL-014 | Notification is distinct from acknowledgment for critical and noncritical result loops; critical-result closure cannot be inferred from notification delivery. | P00-09; P00-10 | Result Release Policy | Clinical Lead + Laboratory Clinical Owner | APPROVED | JRN-006 | WFL-015 | EXC-045 | TST-RES-008; TST-RES-009 | OQ-00-190; OQ-00-191 |
| RES-POL-015 | Result delay, held release, cancellation, and corrected-result handling must route to explicit workflow, communication, incident, or review paths rather than hidden state changes or direct database edits. | P00-10 failure/recovery | Result Release Policy | Operations Lead + Laboratory Clinical Owner | APPROVED | JRN-006; JRN-020 | WFL-015 | EXC-044; EXC-049 | TST-RES-011; TST-RES-013 | OQ-00-262; OQ-00-263 |
| RES-POL-016 | Future result-release tests use synthetic patients, orders, specimens, laboratories, result values, criticality classes, corrected results, notifications, acknowledgments, and follow-up paths only. | Locked testing rule | Result Release Policy | QA Lead + Security Lead | APPROVED | JRN-006 | WFL-015 | EXC-052 | TST-RES-001 through TST-RES-015 | P00-14 browser strategy |

## Future Result-Release Tests

Synthetic tests must cover verification, unauthorized verification, correct patient-order-specimen association, structured data, signed human-readable result, clinician release, patient release, critical result, acknowledgment, failed contact, corrected result, renotification, result cancellation, no auto-prescription, no auto-pharmacy search, and closed-loop follow-up.

## Approval Dependencies

Final release sequence, patient-direct release, clinician-first categories, signed-result mechanism, structured result format, retention period, correction renotification, delay escalation, cancellation behavior, and clinical-review ownership remain approval-gated through OQ-00-254 through OQ-00-264.

## Common Policy Status Statements

- Status: DRAFT-PENDING-APPROVAL.
- Clinical rules are not effective until approved by the designated clinical authority.
- Pharmacy rules are not effective until approved by pharmacy operations, clinical governance, legal, and regulatory reviewers.
- Laboratory rules are not effective until approved by laboratory operations, clinical governance, legal, and regulatory reviewers.
- Delivery rules are not effective until approved by operations, pharmacy, privacy, security, and legal reviewers.
- Final payment sequencing and disclosure-unlock evidence remain dependencies of P00-13.
- This document does not replace qualified professional judgment.
- Effective date: NOT EFFECTIVE UNTIL APPROVED.
- Version and change-control: every approved change requires a version increment, change reason, reviewer record, approval state, and preservation of previous versions.
- Required reviewers are listed in Document Control.
- Related decisions and open questions are listed in Document Control and the rule traceability tables.
