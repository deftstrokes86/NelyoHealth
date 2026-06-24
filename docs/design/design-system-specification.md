# P00-14A Design-System Specification

## Document Control

| Field | Value |
|---|---|
| Version | 0.1 |
| Status | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL |
| Effective date | NOT EFFECTIVE FOR PRODUCTION UNTIL APPROVED |
| Owner | Design Owner + Architecture Owner |
| Required reviewers | Product, Accessibility, Privacy, Security, Clinical Safety, QA |
| Approval authority | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance owners |
| Related decisions | REQ-DES-001 through REQ-DES-012 |
| Related open questions | OQ-00-646 through OQ-00-654 |
| Scope | Proposed design and content decisions for P00-14A only |
| Non-implementation notice | This does not constitute implemented UI, accessibility conformance, clinical-content approval, legal/privacy/financial approval, final visual assets, or dependency/font installation. |
| Change control | Changes require decision/open-question updates, owner review, and orchestration acceptance before production use. |
## System Layers

1. Foundations
2. Primitives
3. Components
4. Domain components
5. Patterns
6. Templates
7. Pages

## Foundations

Foundations cover color, typography, spacing, sizing, grid, containers, radius, borders, elevation, icons, imagery, motion, responsive breakpoints, focus, and data visualization. Components must use semantic tokens, not raw values.

## Required Primitives

| Component ID | Component | Layer | Required states | Accessibility requirements | Responsive behavior | Motion behavior | Related requirement |
|---|---|---|---|---|---|---|---|
| CMP-PRM-001 | Button | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-002 | Link | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-003 | Input | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-004 | Textarea | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-005 | Select | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-006 | Combobox | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-007 | Checkbox | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-008 | Radio | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-009 | Switch | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-010 | Date input | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-011 | Time input | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-012 | File input | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-013 | OTP input | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-014 | Label | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-015 | Helper text | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-016 | Error text | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-017 | Badge | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-018 | Status indicator | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-019 | Avatar | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-020 | Divider | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-021 | Tooltip | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-022 | Popover | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-023 | Menu | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-024 | Dialog | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-025 | Drawer | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-026 | Tabs | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-027 | Accordion | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-028 | Toast | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-029 | Alert | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-030 | Skeleton | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-031 | Spinner | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |
| CMP-PRM-032 | Progress indicator | Primitive | Required default/focus/disabled/loading/error states | Labels, keyboard, focus visible, ARIA where required | Mobile full-width option, touch target >=44px | SUBTLE or NONE | DSYS-REQ-002 |

## Domain Components

| Component ID | Component | Layer | Allowed content | Prohibited content | Required states | Accessibility requirements | Responsive behavior | Motion behavior | Related section contracts |
|---|---|---|---|---|---|---|---|---|---|
| CMP-DOM-001 | Patient identity summary | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-002 | Appointment card | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-003 | Waiting-room panel | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-004 | Consultation participant list | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-005 | Clinical summary | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-006 | Allergy warning | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-007 | Medication item | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-008 | Prescription view | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-009 | Diagnostic-order view | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-010 | Result view | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-011 | Critical-result alert | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-012 | Referral timeline | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-013 | Provider quote card | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-014 | Protected provider offer | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-015 | Authorized fulfilment location | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-016 | Payment summary | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-017 | Funding-source selector | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-018 | Refund status | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-019 | Ledger-backed balance | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-020 | Family member card | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-021 | Sponsor approval card | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-022 | Credential status | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-023 | Operational queue item | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-024 | Incident timeline | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-025 | Audit history entry | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |
| CMP-DOM-026 | Emergency action panel | Domain component | Only approved content class and authorized data | Protected provider and cross-patient/tenant content prohibited | Loading, empty, partial, error, offline, locked where applicable | Semantic labels, heading discipline, keyboard operation | Mobile card/detail pattern; desktop table/detail where useful | SAFETY-IMMEDIATE for emergency, STANDARD otherwise | Related SEC-* contracts |

## Component State Standard

Every interactive component must define default, hover where applicable, focus visible, pressed, active, selected, disabled, read only, loading, error, success, warning, expired, offline, and reduced-motion states.

## Theming Recommendation

Pilot recommendation: light theme only, with high-contrast review requirements and no silent dark-mode assumption. Dark or system-preference themes remain open questions requiring design, accessibility, performance, and product approval.
