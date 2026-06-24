# Break-Glass Policy

| Field | Value |
|---|---|
| Document title | Break-Glass Policy |
| Codex prompt ID | P00-11 |
| Complete Breakdown work package | P00-14 |
| Issue ID | P00-DAT-001 |
| Owner role | Security Lead + Privacy Counsel + Clinical Lead |
| Privacy status | DRAFT-PENDING-PRIVACY-SECURITY-CLINICAL-AND-LEGAL-APPROVAL |
| Review state | REQUIRES_APPROVAL |
| Required reviewers | Security Lead, Privacy Counsel, Legal Counsel, Clinical Lead, Compliance Lead, Operations Lead |
| Last updated | 2026-06-24 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1 draft |
| Related decisions | REQ-DAT-020 through REQ-DAT-022 |
| Related open questions | OQ-00-326 through OQ-00-332 |

## Privacy Document Status

- Status: DRAFT-PENDING-PRIVACY-SECURITY-CLINICAL-AND-LEGAL-APPROVAL.
- This document is not a final legal interpretation and does not establish legal compliance.
- Final lawful bases, statutory periods, cross-border mechanisms, children's rules, and guardianship rules require qualified legal and privacy review.
- Effective date: NOT EFFECTIVE UNTIL APPROVED.
- Version and change-control: every approved change requires version increment, reviewer record, approval state, and preservation of previous versions.
## Purpose

Define exceptional emergency access to minimum-necessary information when ordinary authorization cannot safely meet an approved emergency or patient-safety need.

## Non-Goals

Break-glass is not for routine support, debugging, curiosity, financial investigation, employer requests, HMO convenience, sponsor requests, family disputes, routine audit, provider-detail marketplace bypass, avoiding consent/delegation processes, or avoiding tenant isolation.

## Break-Glass Rules

| Rule ID | Rule | Source requirement | Owning document | Data owner | Privacy owner | Legal-review status | Data classification | Processing purpose | Related actor | Related journey | Related workflow | Related open question | Future test | Owning implementation phase |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| BGA-POL-001 | Break-glass is exceptional and not a normal administrative feature. | P00-11 locked rule | Break-Glass Policy | Clinical Records | Privacy Counsel + Security Lead | REQUIRES_APPROVAL | PROTECTED-CLINICAL-DATA | Emergency access | Eligible clinical/safety actor | JRN-009 | WFL-006; WFL-025 | OQ-00-326 | TST-BGA-001 | P01 |
| BGA-POL-002 | Eligible actor classes are approval-gated candidates: treating clinician, clinical supervisor, emergency clinical owner, privacy/compliance officer for investigation, security incident responder, or other legally approved role. Platform administrator status alone is insufficient. | P00-11 eligible actors | Break-Glass Policy | Clinical Records | Privacy Counsel + Security Lead | REQUIRES_APPROVAL | PROTECTED-CLINICAL-DATA | Emergency/safety access | Clinician; Compliance; Security | JRN-009 | WFL-025 | OQ-00-326 | TST-BGA-002 | P01 |
| BGA-POL-003 | Preconditions include authenticated actor, strong authentication, eligible class, patient context, emergency/safety purpose, reason, requested scope, minimum-necessary fields, tenant context, conflict check, configured duration, and audit availability. | P00-11 preconditions | Break-Glass Policy | Clinical Records | Security Lead | REQUIRES_APPROVAL | PROTECTED-CLINICAL-DATA | Access control | Eligible actor | JRN-009 | WFL-025 | OQ-00-327 | TST-BGA-003 | P01 |
| BGA-POL-004 | No numeric break-glass duration is approved; duration is configured-policy and review-bound. | P00-11 duration rule | Break-Glass Policy | Security | Privacy Counsel | REQUIRES_APPROVAL | SECURITY-OPERATIONAL-DATA | Access duration | Eligible actor | JRN-009 | WFL-025 | OQ-00-327 | TST-BGA-007 | P00-12/P01 |
| BGA-POL-005 | Break-glass data scope is minimum necessary and excludes blanket longitudinal export, unrelated family members, unrelated tenants, unnecessary financial data, general provider-location marketplace access, unrelated audit history, authentication secrets, and raw payment credentials. | P00-11 data scope | Break-Glass Policy | Clinical Records | Privacy Counsel + Security Lead | APPROVED | PROTECTED-CLINICAL-DATA | Emergency access minimization | Eligible actor | JRN-009 | WFL-025 | OQ-00-330 | TST-BGA-006 | P01 |
| BGA-POL-006 | Workflow requires explicit action, approved purpose, patient/tenant confirmation, actor eligibility evaluation, restricted scope, access start, audit, review queue, notification consideration, expiry/revocation, closure/escalation, and misuse incident opening. | P00-11 workflow | Break-Glass Policy | Clinical Records | Privacy Counsel + Security Lead | REQUIRES_APPROVAL | PROTECTED-CLINICAL-DATA | Break-glass workflow | Eligible actor | JRN-009 | WFL-025 | OQ-00-331 | TST-BGA-011 | P01 |
| BGA-POL-007 | Break-glass does not bypass provider-detail marketplace rules or create routine support/admin access. | P00-11 non-goal | Break-Glass Policy | Marketplace and Matching | Privacy Counsel + Security Lead | APPROVED | PROVIDER-IDENTITY-LOCATION-DATA | Provider disclosure protection | Support; Admin | JRN-004; JRN-005 | WFL-008; WFL-013 | OQ-00-006 | TST-BGA-014 | P01 |
| BGA-POL-008 | Revocation occurs on configured expiry, session binding failure, context switch, logout, credential suspension, incident, misuse, or re-authentication failure. | P00-11 revocation | Break-Glass Policy | Security | Security Lead | REQUIRES_APPROVAL | SECURITY-OPERATIONAL-DATA | Revocation | Eligible actor | JRN-009 | WFL-025 | OQ-00-327 | TST-BGA-008 | P01 |
| BGA-POL-009 | Patient notification, delayed notification, withheld notification, legal restriction, clinical review, privacy review, security review, supervisor review, evidence, misuse escalation, and closure remain approval-gated. | P00-11 notification/review | Break-Glass Policy | Clinical Records | Privacy Counsel + Legal Counsel | REQUIRES_APPROVAL | PROTECTED-CLINICAL-DATA | Notification/review | Patient; Compliance | JRN-009 | WFL-025 | OQ-00-328; OQ-00-329 | TST-BGA-011 | P00-12/P01 |

## Future Break-Glass Tests

Synthetic tests must cover eligible actor, ineligible actor, wrong patient, wrong tenant, missing reason, unsupported purpose, excess scope, expiry, revocation, logout, concurrent sessions, patient notification, review, audit, administrator misuse, and provider-detail bypass attempt.
