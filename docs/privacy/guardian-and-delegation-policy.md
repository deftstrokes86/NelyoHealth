# Guardian and Delegation Policy

| Field | Value |
|---|---|
| Document title | Guardian and Delegation Policy |
| Codex prompt ID | P00-11 |
| Complete Breakdown work package | P00-14 |
| Issue ID | P00-DAT-001 |
| Owner role | Privacy Counsel + Clinical Lead + Product Owner |
| Privacy status | DRAFT-PENDING-PRIVACY-AND-LEGAL-APPROVAL |
| Review state | REQUIRES_APPROVAL |
| Required reviewers | Privacy Counsel, Legal Counsel, Clinical Lead, Security Lead, Product Owner, Operations Lead |
| Last updated | 2026-06-24 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1 draft |
| Live minor functionality | DESIGN-NOW-IMPLEMENT-LATER |
| Related decisions | REQ-DAT-007 through REQ-DAT-019 |
| Related open questions | OQ-00-280 through OQ-00-291 |

## Privacy Document Status

- Status: DRAFT-PENDING-PRIVACY-AND-LEGAL-APPROVAL.
- This document is not a final legal interpretation and does not establish legal compliance.
- Final lawful bases, statutory periods, cross-border mechanisms, children's rules, and guardianship rules require qualified legal and privacy review.
- Effective date: NOT EFFECTIVE UNTIL APPROVED.
- Version and change-control: every approved change requires version increment, reviewer record, approval state, and preservation of previous versions.
## Canonical Distinctions

| Concept | Definition | Explicit non-equivalence | Approval status |
|---|---|---|---|
| Guardian|Verified authority for another person after approved evidence review|Not parent claim, payer, sponsor, emergency contact, or family admin by default|REQUIRES_APPROVAL |
| Parent|Relationship claim or evidence category|Not automatically verified guardian authority|REQUIRES_APPROVAL |
| FamilyPlanAdministrator|Family funding/admin role|Not guardian, clinical proxy, caregiver, or record accessor|APPROVED |
| Sponsor|Funding actor|Not clinical authority or cross-border clinical recipient by default|APPROVED |
| Payer|Payment-responsible actor|Not clinical record accessor by default|APPROVED |
| EmergencyContact|Contact for emergency use|Not caregiver or record accessor by default|REQUIRES_APPROVAL |
| ClinicalProxy|Approved clinical access/decision role|Not caregiver or payer by default|REQUIRES_APPROVAL |
| Caregiver|Logistics or care-task helper|Not clinical decision-maker by default|REQUIRES_APPROVAL |
| AuthorizedRepresentative|Actor with verified authority for a specific request|Not universal delegate|REQUIRES_APPROVAL |
| ConsultationParticipant|Actor allowed into a specific encounter|Not standing access to records|REQUIRES_APPROVAL |
| Minor assent|Minor response where clinically and legally appropriate|Not guardian consent or adult consent|REQUIRES_APPROVAL |

## Guardian and Delegation Rules

| Rule ID | Rule | Source requirement | Owning document | Data owner | Privacy owner | Legal-review status | Data classification | Processing purpose | Related actor | Related journey | Related workflow | Related open question | Future test | Owning implementation phase |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| GDN-POL-001 | Guardian authority requires identity, relationship, legal-authority, restriction, expiry, source, integrity, review-owner, and audit evidence; final sufficiency requires legal review. | P00-11 guardian evidence | Guardian and Delegation Policy | Patients and Relationships | Privacy Counsel | REQUIRES_APPROVAL | SENSITIVE-PERSONAL-DATA | Guardian verification | Guardian | JRN-013 | WFL-002 | OQ-00-280 | TST-GDN-001 | P00-12/P01 |
| GDN-POL-002 | Guardian lifecycle supports draft, evidence required, submitted, under review, more information required, verified, restricted, suspended, disputed, rejected, revoked, and expired states. | P00-11 lifecycle | Guardian and Delegation Policy | Patients and Relationships | Privacy Counsel | REQUIRES_APPROVAL | SENSITIVE-PERSONAL-DATA | Guardian lifecycle | Guardian | JRN-013 | WFL-002 | OQ-00-281 | TST-GDN-002 | P01 |
| GDN-POL-003 | Multiple guardians with different capabilities, primary contact, financial payer role, clinical decision authority, conflicts, restrictions, suspension, emergency handling, escalation, temporary controls, appeal, and audit must be supported conceptually. | P00-11 multiple guardians | Guardian and Delegation Policy | Patients and Relationships | Privacy Counsel | REQUIRES_APPROVAL | SENSITIVE-PERSONAL-DATA | Guardian governance | Guardian | JRN-013 | WFL-002 | OQ-00-281 | TST-GDN-003 | P01 |
| GDN-POL-004 | No guardian may silently remove another guardian; disputes route to review and audit. | P00-11 multiple guardians | Guardian and Delegation Policy | Patients and Relationships | Privacy Counsel | REQUIRES_APPROVAL | SENSITIVE-PERSONAL-DATA | Dispute handling | Guardian | JRN-013 | WFL-002 | OQ-00-282 | TST-GDN-004 | P01 |
| GDN-POL-005 | Minor assent can record age/maturity context, clinical appropriateness, information presented, minor response, guardian response, clinician role, conflict, emergency question, evidence, and audit without final age thresholds. | P00-11 minor assent | Guardian and Delegation Policy | Patients and Relationships | Privacy Counsel | REQUIRES_APPROVAL | PROTECTED-CLINICAL-DATA | Minor assent | Minor; Guardian; Clinician | JRN-013 | WFL-002 | OQ-00-284 | TST-GDN-005 | P00-12/P01 |
| GDN-POL-006 | Age-of-majority transition reviews identity, account activation, account control, guardian access, existing consent, new adult consent, delegations, sponsor/family links, pending orders, notification, dispute, and audit while preserving the same Patient. | P00-11 age transition | Guardian and Delegation Policy | Patients and Relationships | Privacy Counsel | REQUIRES_APPROVAL | SENSITIVE-PERSONAL-DATA; PROTECTED-CLINICAL-DATA | Age transition | Patient; Guardian | JRN-013 | WFL-002 | OQ-00-285 | TST-GDN-006 | P00-12/P01 |
| GDN-POL-007 | Adult delegation is capability-specific: schedule, reschedule, cancel, pay, approve spending, receipts, join consultation, receive medicine, manage delivery, home-care logistics, care instructions, limited summary, specified records, emergency updates, and operations communication. | P00-11 adult delegation | Guardian and Delegation Policy | Patients and Relationships | Privacy Counsel | REQUIRES_APPROVAL | SENSITIVE-PERSONAL-DATA; PROTECTED-CLINICAL-DATA | Delegation | Patient; Delegate | JRN-014 | WFL-023 | OQ-00-288 | TST-GDN-007 | P01 |
| GDN-POL-008 | Every adult delegation capability records grantor, grantee, scope, patient, effective date, expiry, revocation, consent dependency, clinical dependency, audit, and approval status. | P00-11 adult delegation | Guardian and Delegation Policy | Patients and Relationships | Privacy Counsel | REQUIRES_APPROVAL | SENSITIVE-PERSONAL-DATA | Delegation evidence | Patient; Delegate | JRN-014 | WFL-023 | OQ-00-289 | TST-GDN-008 | P01 |
| GDN-POL-009 | ClinicalProxy requires verification, decision scope, record access scope, clinical participation, incapacity question, temporary authority, revocation, conflict, review, and audit. | P00-11 clinical proxy | Guardian and Delegation Policy | Clinical Records | Privacy Counsel + Clinical Lead | REQUIRES_APPROVAL | PROTECTED-CLINICAL-DATA | Clinical proxy | ClinicalProxy | JRN-014 | WFL-023 | OQ-00-287 | TST-GDN-009 | P00-12/P01 |
| GDN-POL-010 | Caregiver support is limited to logistics, home-care support, medicine receipt where authorized, appointment assistance, and limited care instructions; it prohibits clinical decision-making, prescribing, diagnosis, and universal record access. | P00-11 caregiver | Guardian and Delegation Policy | Patients and Relationships | Privacy Counsel | APPROVED | SENSITIVE-PERSONAL-DATA; PROTECTED-CLINICAL-DATA | Caregiver support | Caregiver | JRN-014 | WFL-023 | OQ-00-288 | TST-GDN-010 | P01 |
| GDN-POL-011 | Revocation or suspension affects sessions, future access, upcoming appointments, consultation participation, provider communications, delivery receipt, notifications, and audit, but does not delete clinical history. | P00-11 revocation | Guardian and Delegation Policy | Patients and Relationships | Privacy Counsel | APPROVED | SENSITIVE-PERSONAL-DATA; PROTECTED-CLINICAL-DATA | Revocation | Guardian; Delegate | JRN-014 | WFL-002; WFL-023 | OQ-00-289 | TST-GDN-011 | P01 |

## Future Guardian and Delegation Tests

Synthetic tests must cover guardian evidence required, rejected evidence, multiple guardians, restricted guardian, suspended guardian, disputed guardian, revocation, adult delegation, capability-limited delegation, wrong grantee, wrong patient, expired delegation, ClinicalProxy versus Caregiver, age-of-majority transition, and no duplicate patient identity.
