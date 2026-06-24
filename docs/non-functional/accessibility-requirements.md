# Accessibility Requirements

## Document Control

| Field | Value |
|---|---|
| Document title | Accessibility Requirements |
| Codex prompt ID | P00-14 |
| Complete Breakdown work package | P00-17 |
| Issue ID | P00-NFR-001 |
| Owner role | Accessibility Lead + QA Lead + Product Owner |
| Status | DRAFT-PENDING-SECURITY-ARCHITECTURE-QA-ACCESSIBILITY-PRIVACY-AND-OPERATIONS-APPROVAL |
| Review state | PROPOSED; NOT EFFECTIVE UNTIL APPROVED |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1 |
| Required reviewers | Accessibility Lead; QA Lead; Product Owner; Clinical Safety Lead; Privacy/DPO; Security Lead; Operations Lead |
| Approval authority | Accessibility + Product + QA owners |
| Related decisions | REQ-NFR-001 through REQ-NFR-050 |
| Related open questions | OQ-00-492 through OQ-00-591 |
| Change control | Any conformance claim, assistive-tech matrix, or accessibility target requires qualified review. |

This document defines implementation requirements, not completed controls. No browser tooling has been installed in Phase 0. No security certification is implied. No accessibility conformance claim is implied. No availability or performance commitment is effective until approved. Numeric targets remain approval-controlled.

## Accessibility Target

WCAG 2.2 AA is the proposed target. Automated testing alone cannot establish conformance. Manual assessment and inclusive user review are required. Final conformance claim requires qualified review.

## Accessibility Requirements Matrix

| Requirement ID | User need | Affected component or journey | Requirement | WCAG mapping question | Automated test | Manual test | Assistive technology | Evidence | Owner | Approval status | Pilot gate |
|---|---|---|---|---|---|---|---|---|---|---|---|
| A11Y-NFR-001 | Operate without mouse | All journeys | All controls are keyboard reachable with logical order and no trap. | WCAG 2.1.1/2.4.x mapping to confirm | Playwright keyboard | Manual keyboard | Keyboard only | Test report | Accessibility + QA | REQUIRES_APPROVAL | PILOT-GATE |
| A11Y-NFR-002 | Understand current focus | Dialogs, drawers, menus, forms | Focus is visible and managed on open, close, route change, async update, payment return, failed request, emergency escalation, critical alert, disclosure, logout, expiry, context switch. | Mapping pending | Playwright focus | Manual focus | Keyboard/screen reader | Focus report | Accessibility + QA | REQUIRES_APPROVAL | PILOT-GATE |
| A11Y-NFR-003 | Use screen reader | All journeys | Semantic structure, names, landmarks, headings, forms, errors, status, live regions, tables, charts, maps, video, notifications, progress, waiting room, payment/order/result states. | Mapping pending | ARIA assertions | Screen-reader review | Screen reader matrix pending | Audit notes | Accessibility Lead | REQUIRES_APPROVAL | PILOT-GATE |
| A11Y-NFR-004 | Provider privacy in a11y tree | Pharmacy/lab matching | Protected provider fields are absent from accessibility tree pre-payment; no hidden accessible address/map/contact/directions; providerDisplayName labeled correctly. | Mapping pending | ARIA snapshot + privacy scanner | Manual a11y tree inspection | Screen reader | PBT report | Security + Accessibility | APPROVED boundary | PILOT-GATE |
| A11Y-NFR-005 | Use maps safely | Post-payment provider details; emergency | Post-payment map has structured accessible text alternative; directions keyboard accessible; unavailable map control is not focusable pre-payment. | Mapping pending | Playwright + ARIA | Manual map review | Keyboard/screen reader | Map a11y report | Accessibility + Product | REQUIRES_APPROVAL | PILOT-GATE |
| A11Y-NFR-006 | Perceive visual content | All UI | Contrast, text resize, reflow, non-text contrast, focus visibility, color independence, reduced motion, flashing, spacing, typography, icon labels, status differentiation. | WCAG 1.4.x mapping pending | Axe/visual checks | Manual review | Low vision tools | Visual audit | Accessibility + Design | REQUIRES_APPROVAL | RELEASE-GATE |
| A11Y-NFR-007 | Touch and motor access | Mobile/tablet | Target size, spacing, drag alternatives, gesture alternatives, accidental activation, timeout extension question, rotation, one-handed use, mobile keyboard. | Mapping pending | Mobile Playwright | Manual touch review | Mobile assistive tech | Mobile a11y report | Accessibility + QA | REQUIRES_APPROVAL | PILOT-GATE |
| A11Y-NFR-008 | Complete forms | Registration, intake, consent, payment, guardianship | Labels, instructions, required fields, errors, summary, associations, input purpose, autocomplete, confirmation, undo/correction, accessible OTP. | Mapping pending | Form assertions | Manual form review | Keyboard/screen reader | Form report | Product + Accessibility | REQUIRES_APPROVAL | PILOT-GATE |
| A11Y-NFR-009 | Communicate in consultation | Video/audio | Caption/transcription question, mute/camera status, device permission/test, audio fallback, text chat, interpreter workflow, communication support, no recording by default. | Mapping pending | Browser media checks | Manual clinical review | Caption and interpreter policy approval question logged | Consultation audit | Clinical + Accessibility | REQUIRES_APPROVAL | PILOT-GATE |
| A11Y-NFR-010 | Understand health tasks | Clinical, pharmacy, lab, emergency | Plain language, consistent terminology, progressive disclosure, confirmations, safety-net comprehension, critical alerts, medication instructions, result explanations, error recovery, no dark patterns. | Mapping pending | Content lint where possible | Clinical/plain-language review | Screen reader/user review | Content audit | Product + Clinical | REQUIRES_APPROVAL | PILOT-GATE |
| A11Y-NFR-011 | Recover from errors | Forms/payment/upload/booking | Error summary, inline errors, focus movement, status messages, retry/cancel, high-impact confirmation, undo/correction. | Mapping pending | Playwright error flows | Manual review | Keyboard/screen reader | Error-flow report | QA + Accessibility | REQUIRES_APPROVAL | PILOT-GATE |
| A11Y-NFR-012 | Handle critical alerts | Emergency/critical results | Critical and emergency alerts are perceivable, understandable, focus-safe, screen-reader announced, and not blocked by payment/marketplace. | Mapping pending | Playwright + ARIA | Clinical/a11y review | Screen reader | Alert evidence | Clinical + Accessibility | APPROVED boundary | PILOT-GATE |
| A11Y-NFR-013 | Navigate low bandwidth | Core workflows | Degraded states remain accessible, announce progress/failure, preserve drafts, avoid duplicate submits, and offer safe retry. | Mapping pending | Network-throttle tests | Manual review | Keyboard/screen reader | Low-bandwidth report | QA + Accessibility | REQUIRES_APPROVAL | PILOT-GATE |
| A11Y-NFR-014 | Maintain privacy in notifications | Notifications/deep links | Notification text and deep links avoid unnecessary clinical/provider/payment secrets and are understandable with assistive tech. | Mapping pending | Notification checks | Manual review | Screen reader/mobile | Notification audit | Privacy + Accessibility | REQUIRES_APPROVAL | PILOT-GATE |
| A11Y-NFR-015 | Test accessibility continuously | Test strategy | Automated scans, ARIA snapshots where stable, keyboard-only, manual focus, screen reader, zoom/reflow, reduced motion, contrast, mobile/tablet, critical-journey audit, inclusive user testing. | Mapping pending | CI a11y | Manual/inclusive review | Approved matrix pending | A11y test report | QA + Accessibility | REQUIRES_APPROVAL | RELEASE-GATE |

## Accessibility Testing

Future tests cover keyboard, focus, screen reader, ARIA tree, error summary, text resize, zoom/reflow, reduced motion, contrast, touch, video controls, payment, consent, provider disclosure, maps, emergency alerts, and critical-result alerts. Automated tools are evidence only, not conformance proof.

