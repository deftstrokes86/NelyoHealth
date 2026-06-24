# ADR-0004: Use a governed visual system, Motion for React, UI UX Pro Max review, and page-section content contracts

## Status

ACCEPTED-IN-PRINCIPLE

IMPLEMENTATION-PENDING-P00-14A-AND-PHASE-1

Exact design tokens, Motion version, skill version, and content registry format remain PROPOSED.

## Document Control

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Phase | P00-14 |
| Supplemental work package | P00-14A required before P00-15 |
| Effective status | Not effective until approved by product, design, content, security, architecture, QA, accessibility, privacy, clinical safety, finance, legal/compliance, and operations owners |
| Scope | Architecture decision for visual quality, governed motion, advisory design skill use, and content contracts |
| Exclusions | No final visual system, Motion dependency, UI UX Pro Max installation, design tokens, components, content registry implementation, or production copy |
| Related requirements | DES-NFR-001 through DES-NFR-010, MOT-NFR-001 through MOT-NFR-010, UXP-REQ-001 through UXP-REQ-007, CNT-NFR-001 through CNT-NFR-010, DCT-TST-001 through DCT-TST-012 |
| Related decisions | REQ-NFR-051 through REQ-NFR-078 |

## Context

NelyoHealth cannot ship as a generic admin template, unrelated dashboard collection, visually inconsistent marketplace, inaccessible form library, technically functional but poorly composed screen set, or design that creates anxiety, confusion, distrust, or excessive cognitive load.

The platform must preserve locked privacy, clinical safety, emergency, payment, accessibility, performance, and provider-disclosure requirements while establishing a high-quality product experience.

## Decision

NelyoHealth will create a canonical design system, use design tokens, use Motion for React for governed motion, respect reduced-motion preferences, use UI UX Pro Max as a reviewed advisory skill, pin and inspect the skill before use, require design and implementation-review passes, maintain page and section content contracts, maintain content ownership and approvals, test content alignment, validate major pages in a real browser, require visual quality as part of Definition of Done, and preserve accessibility, privacy, clinical safety, security, financial transparency, and performance over decoration.

P00-14A must complete before P00-15 begins.

## Rejected Alternatives

| Alternative | Reason rejected |
| --- | --- |
| Let Codex invent each page independently | Would produce inconsistent design, content, and motion decisions. |
| Use arbitrary Tailwind values per screen | Would weaken design-system consistency and reviewability. |
| Use motion values directly inside every component | Would undermine reduced-motion, performance, and safety controls. |
| Use animation without reduced-motion support | Would violate accessibility and safety requirements. |
| Install UI UX Pro Max globally without review | Would create unpinned supply-chain, licensing, and filesystem/network risks. |
| Treat skill output as source of truth | Would allow advisory third-party output to override approved NelyoHealth requirements. |
| Hard-code copy directly throughout components without contracts | Would make content approval, versioning, and isolation hard to prove. |
| Validate content only through proofreading | Would miss role, patient, tenant, CTA, state, and provider-disclosure defects. |
| Accept functional tests as sufficient visual validation | Functional tests cannot prove experience quality or visual coherence. |
| Use screenshots without responsive or interactive review | Screenshots alone cannot prove keyboard, focus, motion, content alignment, or accessibility behavior. |

## Consequences

| Type | Consequence |
| --- | --- |
| Positive | Visual quality becomes an explicit release requirement. |
| Positive | P00-14A creates a controlled bridge between planning and implementation. |
| Positive | Motion becomes accessible, consistent, and safety-aware. |
| Positive | Page/section/content contracts make copy placement testable. |
| Positive | UI UX Pro Max can improve design quality without becoming an authority. |
| Negative | P00-15 is blocked until P00-14A is accepted. |
| Negative | Phase 1 has more validation gates before UI release. |
| Negative | Skill and Motion installation require supply-chain verification. |

## Supersession Triggers

This ADR requires review when the Motion library changes, UI UX Pro Max is replaced, skill permissions expand, design tokens materially change, a new theme is added, a new language is added, a CMS is introduced, content registry format changes, clinical content ownership changes, visual review is removed, or reduced-motion behavior changes.

## Approval Boundary

This ADR does not approve final fonts, colors, shadows, radii, illustrations, icon system, imagery policy, motion token values, production copy, CMS, localization model, UI UX Pro Max installation, or Motion dependency installation.

## P00-14A Completion Linkage

P00-14A completed the proposed design and content direction required by this ADR. The selected proposed primary visual direction is `VIS-DIR-002 Warm Care Grid`. The completed artifact set includes experience principles, brand and visual direction, design-system specification, design tokens, information architecture, navigation/dashboard models, page/state inventory, responsive layout strategy, interaction patterns, motion system, design QA and visual review, UI UX Pro Max review brief, content strategy, voice and tone, content model, public website content blueprint, page-section content matrix, content-component contracts, content approval workflow, microcopy system, clinical content governance, state-message templates, and design/content validation.

This linkage does not approve final assets, final fonts, final color system, final Motion version, UI UX Pro Max installation, production copy, content registry implementation, CMS, localization, or Phase 1 UI implementation.
