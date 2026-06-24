# P00-14A Motion System

## Document Control

| Field | Value |
|---|---|
| Version | 0.1 |
| Status | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL |
| Effective date | NOT EFFECTIVE FOR PRODUCTION UNTIL APPROVED |
| Owner | Design Owner + Architecture Owner |
| Required reviewers | Product, Design, Content, Accessibility, Privacy, Security, Clinical Safety, Operations, and domain owners where relevant |
| Approval authority | Product, Design, Content, Accessibility, Privacy, Security, and affected domain owners |
| Related decisions | REQ-DES-013 through REQ-DES-018 |
| Related open questions | OQ-00-653 through OQ-00-656 |
| Non-implementation notice | Proposed design/content specification only; no UI, conformance, clinical/legal/privacy/financial approval, assets, dependencies, fonts, or implementation files. |
| Change control | Changes require owner review, register updates, and orchestration acceptance. |
## Motion Technology

Motion for React is planned. The package is motion; React imports are planned from motion/react. Exact version is verified and pinned in Phase 1. CSS transitions remain suitable for simple isolated changes. Motion is used for coordinated presence, layout, sequencing, and state changes. No package is installed in P00-14A.

## Proposed Motion Tokens

| Token ID | Proposed value | Purpose | Reduced-motion alternative | Performance note | Approval status |
|---|---|---|---|---|---|
| TOK-MOT-001 | Instant 0ms | Proposed motion token | Reduced: opacity or immediate change | Avoid layout shift and long tasks | REQUIRES_APPROVAL |
| TOK-MOT-002 | Fast 120ms | Proposed motion token | Reduced: opacity or immediate change | Avoid layout shift and long tasks | REQUIRES_APPROVAL |
| TOK-MOT-003 | Standard 180ms | Proposed motion token | Reduced: opacity or immediate change | Avoid layout shift and long tasks | REQUIRES_APPROVAL |
| TOK-MOT-004 | Emphasized 240ms | Proposed motion token | Reduced: opacity or immediate change | Avoid layout shift and long tasks | REQUIRES_APPROVAL |
| TOK-MOT-005 | Complex 320ms | Proposed motion token | Reduced: opacity or immediate change | Avoid layout shift and long tasks | REQUIRES_APPROVAL |
| TOK-MOT-006 | Exit 120ms | Proposed motion token | Reduced: opacity or immediate change | Avoid layout shift and long tasks | REQUIRES_APPROVAL |
| TOK-MOT-007 | Delay 80ms max | Proposed motion token | Reduced: opacity or immediate change | Avoid layout shift and long tasks | REQUIRES_APPROVAL |
| TOK-MOT-008 | Stagger 40ms | Proposed motion token | Reduced: opacity or immediate change | Avoid layout shift and long tasks | REQUIRES_APPROVAL |
| TOK-MOT-009 | Ease standard cubic-bezier(0.2,0,0,1) | Proposed motion token | Reduced: opacity or immediate change | Avoid layout shift and long tasks | REQUIRES_APPROVAL |
| TOK-MOT-010 | Ease enter cubic-bezier(0,0,0,1) | Proposed motion token | Reduced: opacity or immediate change | Avoid layout shift and long tasks | REQUIRES_APPROVAL |
| TOK-MOT-011 | Ease exit cubic-bezier(0.4,0,1,1) | Proposed motion token | Reduced: opacity or immediate change | Avoid layout shift and long tasks | REQUIRES_APPROVAL |
| TOK-MOT-012 | Spring gentle proposed | Proposed motion token | Reduced: opacity or immediate change | Avoid layout shift and long tasks | REQUIRES_APPROVAL |
| TOK-MOT-013 | Spring responsive proposed | Proposed motion token | Reduced: opacity or immediate change | Avoid layout shift and long tasks | REQUIRES_APPROVAL |
| TOK-MOT-014 | Distance small 4px | Proposed motion token | Reduced: opacity or immediate change | Avoid layout shift and long tasks | REQUIRES_APPROVAL |
| TOK-MOT-015 | Distance medium 12px | Proposed motion token | Reduced: opacity or immediate change | Avoid layout shift and long tasks | REQUIRES_APPROVAL |
| TOK-MOT-016 | Scale feedback 0.98 | Proposed motion token | Reduced: opacity or immediate change | Avoid layout shift and long tasks | REQUIRES_APPROVAL |

## Motion Profiles

| Profile | Use |
|---|---|
| NONE | Static legal, compliance, and dense reading pages. |
| REDUCED | User preference or constrained device; remove transforms/parallax. |
| SUBTLE | Routine feedback, hover/focus, small state confirmation. |
| STANDARD | Dialogs, drawers, safe page transitions, lists. |
| EMPHASIZED | Rare non-safety onboarding emphasis after review. |
| SAFETY-IMMEDIATE | Emergency, urgent, critical result, authorization loss; no decorative delay. |

Every page family receives a motion profile in the page inventory.

## Component Motion Patterns

| Motion pattern ID | Component/pattern | Profile | Token rule | Reduced-motion rule | Test requirement |
|---|---|---|---|---|---|
| MOT-PAT-001 | Button | SUBTLE or STANDARD | Uses TOK-MOT tokens only | Reduced-motion alternative required | Browser and automated tests required |
| MOT-PAT-002 | Input validation | SUBTLE or STANDARD | Uses TOK-MOT tokens only | Reduced-motion alternative required | Browser and automated tests required |
| MOT-PAT-003 | Dialog | SUBTLE or STANDARD | Uses TOK-MOT tokens only | Reduced-motion alternative required | Browser and automated tests required |
| MOT-PAT-004 | Drawer | SUBTLE or STANDARD | Uses TOK-MOT tokens only | Reduced-motion alternative required | Browser and automated tests required |
| MOT-PAT-005 | Menu | SUBTLE or STANDARD | Uses TOK-MOT tokens only | Reduced-motion alternative required | Browser and automated tests required |
| MOT-PAT-006 | Toast | SUBTLE or STANDARD | Uses TOK-MOT tokens only | Reduced-motion alternative required | Browser and automated tests required |
| MOT-PAT-007 | Alert | SUBTLE or STANDARD | Uses TOK-MOT tokens only | Reduced-motion alternative required | Browser and automated tests required |
| MOT-PAT-008 | Accordion | SUBTLE or STANDARD | Uses TOK-MOT tokens only | Reduced-motion alternative required | Browser and automated tests required |
| MOT-PAT-009 | Tabs | SUBTLE or STANDARD | Uses TOK-MOT tokens only | Reduced-motion alternative required | Browser and automated tests required |
| MOT-PAT-010 | Stepper | SUBTLE or STANDARD | Uses TOK-MOT tokens only | Reduced-motion alternative required | Browser and automated tests required |
| MOT-PAT-011 | List insertion | SUBTLE or STANDARD | Uses TOK-MOT tokens only | Reduced-motion alternative required | Browser and automated tests required |
| MOT-PAT-012 | List removal | SUBTLE or STANDARD | Uses TOK-MOT tokens only | Reduced-motion alternative required | Browser and automated tests required |
| MOT-PAT-013 | Page transition | SUBTLE or STANDARD | Uses TOK-MOT tokens only | Reduced-motion alternative required | Browser and automated tests required |
| MOT-PAT-014 | Dashboard refresh | SUBTLE or STANDARD | Uses TOK-MOT tokens only | Reduced-motion alternative required | Browser and automated tests required |
| MOT-PAT-015 | Skeleton | SUBTLE or STANDARD | Uses TOK-MOT tokens only | Reduced-motion alternative required | Browser and automated tests required |
| MOT-PAT-016 | Payment transition | SUBTLE or STANDARD | Uses TOK-MOT tokens only | Reduced-motion alternative required | Browser and automated tests required |
| MOT-PAT-017 | Order transition | SUBTLE or STANDARD | Uses TOK-MOT tokens only | Reduced-motion alternative required | Browser and automated tests required |
| MOT-PAT-018 | Result transition | SUBTLE or STANDARD | Uses TOK-MOT tokens only | Reduced-motion alternative required | Browser and automated tests required |
| MOT-PAT-019 | Provider-detail reveal | STANDARD with protected-data removal | Uses TOK-MOT tokens only | Reduced-motion alternative required | Browser and automated tests required |
| MOT-PAT-020 | Map appearance | SUBTLE or STANDARD | Uses TOK-MOT tokens only | Reduced-motion alternative required | Browser and automated tests required |
| MOT-PAT-021 | Video room | SUBTLE or STANDARD | Uses TOK-MOT tokens only | Reduced-motion alternative required | Browser and automated tests required |
| MOT-PAT-022 | Emergency alert | SAFETY-IMMEDIATE | Uses TOK-MOT tokens only | Reduced-motion alternative required | Browser and automated tests required |

## Protected Data Rule

When authorization is removed, protected content is removed immediately. Exit animation must not preserve protected text, address, coordinates, directions, or contact details. Alternative provider details must never enter the DOM. Provider replacement invalidates stale motion state. Reduced motion preserves the same authorization boundary.

## Reduced Motion

Phase 1 must implement a global MotionConfig with user preference, component-level useReducedMotion where needed, transform removal, parallax removal, autoplay removal, immediate safety transitions, opacity-only alternatives where appropriate, automated tests, and manual browser review.
