# P00-14A Information Architecture

## Document Control

| Field | Value |
|---|---|
| Version | 0.1 |
| Status | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL |
| Effective date | NOT EFFECTIVE FOR PRODUCTION UNTIL APPROVED |
| Owner | Product Owner + Design Owner |
| Required reviewers | Content, Accessibility, Privacy, Security, Clinical Safety, Operations |
| Approval authority | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance owners |
| Related decisions | REQ-CNT-021 through REQ-CNT-024 |
| Related open questions | OQ-00-647, OQ-00-660, OQ-00-672 |
| Scope | Proposed design and content decisions for P00-14A only |
| Non-implementation notice | This does not constitute implemented UI, accessibility conformance, clinical-content approval, legal/privacy/financial approval, final visual assets, or dependency/font installation. |
| Change control | Changes require decision/open-question updates, owner review, and orchestration acceptance before production use. |
## Information Architecture Nodes

| Node ID | Node | Scope classification | Navigation model | Safety rule |
|---|---|---|---|---|
| IA-NODE-001 | Home | PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-002 | How NelyoHealth works | PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-003 | For patients | PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-004 | Family plans | PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-005 | Diaspora plans | PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-006 | For doctors | PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-007 | For pharmacies | PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-008 | For laboratories | PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-009 | For hospitals and referrals | PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-010 | For employers | PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-011 | For HMOs | PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-012 | Home care future scope | POST-PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-013 | Trust and safety | PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-014 | Privacy overview | LEGAL-REQUIRED | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-015 | Accessibility | PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-016 | Help and FAQ | PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-017 | Contact | PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-018 | Sign in | PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-019 | Create account | PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-020 | Legal and regulatory notices | LEGAL-REQUIRED | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-021 | Patient app | PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-022 | Doctor portal | PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-023 | Pharmacy portal | PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-024 | Laboratory portal | PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-025 | Organization portal | PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |
| IA-NODE-026 | Admin and operations portal | PILOT | Primary/secondary navigation with role-aware access | No emergency path hidden behind commercial navigation |

## Authenticated Applications

Patient application, doctor portal, pharmacy portal, laboratory portal, organization portal, and admin/operations portal share one foundation with role-specific density and navigation depth.

## Content Findability

Primary navigation, secondary navigation, context navigation, search, breadcrumbs, back behavior, deep linking, notifications, tasks, help, profile, and context switching must be defined per app. Emergency and urgent actions remain reachable without navigating through commercial menus.
