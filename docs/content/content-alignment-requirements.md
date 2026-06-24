# P00-14 Content Alignment Requirements

## Document Control

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Status | DRAFT-PENDING-SECURITY-ARCHITECTURE-QA-ACCESSIBILITY-PRIVACY-AND-OPERATIONS-APPROVAL |
| Phase | P00-14 |
| Supplemental work package | P00-14A required before P00-15 |
| Effective status | Not effective until approved by product, content, clinical safety, privacy, legal, finance, security, accessibility, operations, and design owners |
| Scope | Content alignment requirements, contracts, identifiers, approval model, and testability |
| Exclusions | No final website copy, production copy, content registry implementation, CMS decision, localization implementation, components, routes, fixtures, or schema code |
| Related decisions | REQ-NFR-066 through REQ-NFR-073 |

## Core Rule

Every website and application section must have a documented purpose, audience, component relationship, content source, approval path, and state coverage. Content must not be placed in a section merely because it visually fits.

## Stable Identifiers

P00-14A and Phase 1 must plan stable identifiers for `PAGE-*`, `SEC-*`, `CNT-*`, `CTA-*`, `MSG-*`, `FORM-*`, and `STATE-*`. Identifiers must remain stable when visible copy changes.

## Requirement Matrix

| Requirement ID | Purpose | Affected page or journey class | Affected audience | Design or content owner | Accessibility impact | Privacy impact | Clinical or safety impact | Browser validation | Automated validation | Approval status | Implementation phase | Pilot gate effect |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CNT-NFR-001 | Require every page to have a Page ID and page contract | All pages | All actors | Content Owner + Product Owner | Page purpose and heading structure become testable | Page contract declares patient/tenant context | Clinical/emergency pages declare safety owner | Browser page contract review | Page ID/schema check | REQUIRES_APPROVAL | P00-14A + Phase 1 | Blocks unregistered pages |
| CNT-NFR-002 | Require every governed section to have a Section ID and contract | All governed sections | All actors | Content Owner + Design Owner | Section heading, labels, and state copy become testable | Allowed/prohibited data classes are explicit | Emergency/clinical section ownership is explicit | Section browser review | Section ID/schema check | REQUIRES_APPROVAL | P00-14A + Phase 1 | Blocks orphan sections |
| CNT-NFR-003 | Require CTA contracts with declared actions | Forms, payments, booking, consultation, results, orders | All actors | Content Owner + Product Owner | Accessible names and disabled/loading states required | CTA cannot expose provider details before authorization | CTA cannot misrepresent clinical or irreversible actions | CTA browser review | CTA action/route tests | REQUIRES_APPROVAL | P00-14A + Phase 1 | Blocks misleading CTAs |
| CNT-NFR-004 | Require explicit content classes and reviewers | All content | All actors | Content Owner + Domain Owners | Accessibility copy gets reviewer ownership | Privacy/consent/provider disclosure get owner review | Clinical/emergency content gets clinical review | Content review gate | Content class validation | REQUIRES_APPROVAL | P00-14A | Blocks unowned content |
| CNT-NFR-005 | Only approved content may ship | Production release content | All actors | Content Owner | Approved accessible wording required | Prevents unapproved privacy/provider disclosure copy | Prevents unsupported clinical/emergency wording | Release browser review | Content status check | REQUIRES_APPROVAL | Phase 1 | Blocks release with draft content |
| CNT-NFR-006 | Require state-specific copy | Loading, empty, error, offline, unauthorized, forbidden, locked, expired, pending, cancelled, success, warning, urgent, emergency | All actors | Content Owner + Domain Owners | State copy must be understandable and screen-reader friendly | Locked/disclosure states explain boundaries without leakage | Emergency copy must be actionable and approved | State browser review | State copy coverage tests | REQUIRES_APPROVAL | P00-14A + Phase 1 | Blocks incomplete state content |
| CNT-NFR-007 | Enforce role, patient, tenant, and relationship alignment | All role/contextual pages | Patients, sponsors, guardians, employers, HMOs, clinicians, operators | Product Owner + Privacy Owner | Reduces cognitive confusion | Prevents cross-role, cross-patient, cross-tenant leakage | Prevents payer/clinical access conflation | Role/context browser review | Authorization/content isolation tests | REQUIRES_APPROVAL | Phase 1 | Blocks privacy pilot |
| CNT-NFR-008 | Enforce content-to-component contracts | Reusable components and governed content | All actors | Design Owner + Content Owner | Component semantics and labels remain valid | Components reject prohibited content classes | Components cannot display clinical claims in wrong context | Component browser review | Contract validation | REQUIRES_APPROVAL | P00-14A + Phase 1 | Blocks arbitrary copy injection |
| CNT-NFR-009 | Prohibit placeholder, unsupported, stale, or misleading copy | All release surfaces | All actors | Content Owner + QA Owner | Prevents inaccessible generic errors | Prevents leaked provider details and internal IDs | Prevents unsupported medical/legal/financial claims | Browser and content review | Placeholder/claim/sentinel scans | REQUIRES_APPROVAL | Phase 1 | Blocks release if detected |
| CNT-NFR-010 | Require content versioning and audit | Governed content registry | Reviewers and operators | Content Owner + Compliance Reviewer | Version history preserves reviewed wording | Supports privacy/legal traceability | Supports clinical/emergency rollback | Review evidence inspection | Version/status checks | REQUIRES_APPROVAL | P00-14A + Phase 1 | Blocks unversioned governed content |

## Page Contract

Every page must later record page ID, route, application, audience, authentication requirement, role, patient context, tenant context, journey, workflow state, primary purpose, secondary purpose, required sections, optional sections, prohibited content, primary CTA, secondary CTA, empty-state behavior, error behavior, offline behavior, accessibility requirements, motion profile, content owner, product owner, required approvers, and version.

## Section Contract

Every section must later record section ID, page ID, component, purpose, intended audience, data source, content source, required content keys, optional content keys, allowed data classifications, prohibited data, heading level, CTA, CTA destination/action, loading copy, empty copy, error copy, offline copy, unauthorized copy, success copy, urgent copy where relevant, emergency copy where relevant, responsive priority, truncation behavior, accessibility name, analytics rule, motion rule, owner, approval class, and version.

## Content Classes and Required Reviewers

| Content class | Required reviewers |
| --- | --- |
| PRODUCT | Product owner + content owner |
| MARKETING | Product owner + content owner |
| CLINICAL | Clinical reviewer + content owner |
| EMERGENCY | Clinical reviewer + operations owner + content owner |
| PRIVACY | Privacy owner + legal counsel |
| CONSENT | Privacy owner + legal counsel + clinical reviewer where care-related |
| LEGAL | Legal counsel + product owner |
| FINANCIAL | Finance owner + legal counsel |
| SECURITY | Security owner + privacy owner |
| OPERATIONAL | Operations owner + content owner |
| ACCESSIBILITY | Accessibility reviewer + content owner |
| PROVIDER-DISCLOSURE | Product owner + privacy owner + legal counsel + security owner |
| SUPPORT | Support owner + privacy owner |
| REGULATORY | Legal/compliance owner |

## Content Status

Use `DRAFT`, `IN-REVIEW`, `APPROVED`, `BLOCKED`, `SUPERSEDED`, and `RETIRED`. Only `APPROVED` content may be used in a production release.

## Content Source of Truth

A future content registry must become the source of truth for page copy, section copy, CTA labels, form labels, helper text, validation messages, error messages, empty states, loading states, success messages, warning messages, urgent messages, notification templates, consent copy, privacy explanations, and provider-disclosure explanations. P00-14 does not choose a CMS or implementation format. P00-14A must decide whether the canonical registry begins as typed repository content, structured JSON/YAML, MDX, CMS-managed content, or a hybrid model.

## Content-to-Component Contract

A component must not accept arbitrary unrelated content. Future contracts must define supported content type, required fields, optional fields, length guidance, rich-text restrictions, link restrictions, security restrictions, clinical restrictions, fallback behavior, localization behavior, and accessibility behavior.

## CTA Alignment

Every CTA must record CTA ID, visible label, accessible name, action, destination, required authorization, workflow transition, confirmation requirement, disabled state, loading state, error state, analytics event, and owner. Tests must prove that labels match actions.

Defects to prevent include `Pay now` opening a quote-only page, `View result` opening the wrong patient, `Get directions` appearing before authorized disclosure, `Join consultation` appearing without a valid appointment, `Cancel` performing irreversible deletion, and `Continue` concealing a financial commitment.

## Role and Context Alignment

Content must be tested against user role, patient context, tenant context, organization context, family relationship, sponsor relationship, guardian status, delegation status, coverage status, payment status, order status, clinical state, consent state, and credential state. Content intended for one role or context must not appear in another.

## Required State Copy

Every major section must have approved copy for loading, empty, error, offline, unauthorized, forbidden, locked, expired, pending, cancelled, success, warning, urgent, and emergency. Generic `Something went wrong` copy must not be used where a safer actionable message can be provided.

## Prohibited Content Defects

Implementation must reject or detect lorem ipsum, placeholder copy, unapproved copy, unsupported statistics, unsupported medical/legal/provider claims, broken links, mismatched CTA labels, duplicate headings, incorrect heading hierarchy, copy for another role/patient/tenant, exposed internal identifiers, leaked provider details, medicine names in routine lock-screen copy, result values in routine notifications, generic copy that hides a required action, and stale superseded content.

## Content Versioning

Every governed content item must support version, status, author, reviewer, approval date, effective date, superseded version, related requirement, related page and section, change reason, rollback, and audit.
