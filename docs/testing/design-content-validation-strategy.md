# P00-14 Design and Content Validation Strategy

## Document Control

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Status | DRAFT-PENDING-SECURITY-ARCHITECTURE-QA-ACCESSIBILITY-PRIVACY-AND-OPERATIONS-APPROVAL |
| Phase | P00-14 |
| Supplemental work package | P00-14A required before P00-15 |
| Effective status | Not effective until approved by product, design, content, security, architecture, QA, accessibility, privacy, clinical safety, finance, legal/compliance, and operations owners |
| Scope | Validation design for experience quality, motion, UI UX Pro Max review, and content alignment |
| Exclusions | No test code, Playwright config, screenshots, visual baselines, UI components, routes, fixtures, design dependencies, or production copy |
| Related decisions | REQ-NFR-074 through REQ-NFR-078 |

## Official Source Checks

| Source | Issuer | Date checked | Capability confirmed | Version-sensitive detail | Phase 1 verification action | Security or supply-chain concern |
| --- | --- | --- | --- | --- | --- | --- |
| https://playwright.dev/docs/test-snapshots | Playwright | 2026-06-24 | Visual comparisons through screenshot assertions | Baseline behavior and thresholds are config-sensitive | Use only after approved baselines exist | Screenshots may contain sensitive data |
| https://playwright.dev/docs/screenshots | Playwright | 2026-06-24 | Screenshot capture | Capture APIs and storage behavior are version-sensitive | Store under approved ignored paths and scan before sharing | Screenshots can leak PHI/provider/payment data |
| https://playwright.dev/docs/emulation | Playwright | 2026-06-24 | Device, viewport, screen, and user-agent emulation | Device descriptors can change by Playwright version | Verify desktop/tablet/mobile projects in Phase 1 | Device emulation is evidence, not a substitute for all device review |
| https://playwright.dev/docs/aria-snapshots | Playwright | 2026-06-24 | ARIA snapshot testing | Snapshot syntax and match behavior are version-sensitive | Test accessibility-tree absence of protected details | ARIA snapshots can expose sensitive labels |
| https://playwright.dev/docs/accessibility-testing | Playwright | 2026-06-24 | Accessibility testing guidance | Tooling approach and integrations are version-sensitive | Combine automated checks with manual review | Automated checks do not prove conformance |

## Validation Layers

1. Schema validation
2. Content registry validation
3. Unit or component validation
4. Browser rendering validation
5. Responsive validation
6. Accessibility validation
7. Motion validation
8. Reduced-motion validation
9. Visual-regression validation
10. UI UX Pro Max review
11. Human design review
12. Human content review
13. Clinical, privacy, legal, finance, and security review where applicable

## Requirement Matrix

| Requirement ID | Purpose | Affected page or journey class | Affected audience | Design or content owner | Accessibility impact | Privacy impact | Clinical or safety impact | Browser validation | Automated validation | Approval status | Implementation phase | Pilot gate effect |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DCT-TST-001 | Validate every page has a registered Page ID and contract | All pages | All actors | Content Owner + QA Owner | Page semantics become auditable | Page context declares privacy boundaries | Clinical pages declare safety owner | Page browser review | Page registry validation | REQUIRES_APPROVAL | Phase 1 | Blocks unregistered pages |
| DCT-TST-002 | Validate every rendered governed section has a Section ID | All governed sections | All actors | Content Owner + Design Owner | Heading and landmark structure become testable | Section allowed/prohibited data is enforceable | Emergency/clinical state ownership is visible | Section browser review | Section registry validation | REQUIRES_APPROVAL | Phase 1 | Blocks orphan sections |
| DCT-TST-003 | Validate required and prohibited sections | All workflows | All actors | Product Owner + Content Owner | Reduces cognitive overload | Prevents wrong-role data exposure | Prevents missing emergency/clinical content | Journey browser review | Section presence/absence tests | REQUIRES_APPROVAL | Phase 1 | Blocks unsafe page composition |
| DCT-TST-004 | Validate content keys, types, status, and ownership | All governed content | All actors | Content Owner | Labels and helper text are governed | Prevents unapproved privacy/provider copy | Prevents unapproved clinical copy | Content browser review | Content registry checks | REQUIRES_APPROVAL | Phase 1 | Blocks draft content release |
| DCT-TST-005 | Validate CTA labels match actions | Booking, payment, consultation, result, provider, refund | All actors | Product Owner + Content Owner | Accessible name matches behavior | Prevents unauthorized disclosure actions | Prevents unsafe clinical/financial action mismatch | CTA browser review | CTA action/route tests | REQUIRES_APPROVAL | Phase 1 | Blocks misleading CTAs |
| DCT-TST-006 | Validate role, patient, tenant, and relationship isolation | All contextual pages | Patients, payers, clinicians, operators | Privacy Owner + Security Owner | Reduces cross-context confusion | Prevents role/patient/tenant leaks | Preserves payer/clinical separation | Cross-role browser review | Authorization/content tests | REQUIRES_APPROVAL | Phase 1 | Blocks privacy pilot |
| DCT-TST-007 | Validate heading hierarchy, links, focus, and tooltip accessibility | All pages | All users | Accessibility Reviewer + QA Owner | Required accessibility evidence | Prevents hidden provider details in labels/tooltips | Critical content remains reachable | Keyboard and accessibility-tree review | A11y and link checks | REQUIRES_APPROVAL | Phase 1 | Blocks inaccessible pages |
| DCT-TST-008 | Validate no placeholder copy, unsupported claims, forbidden sentinels, or protected details | All pages and artifacts | All actors | QA Owner + Domain Owners | Prevents confusing generic copy | Prevents provider/PHI/payment leaks | Prevents unsafe clinical/legal/financial claims | Browser and artifact review | Placeholder/claim/sentinel scans | REQUIRES_APPROVAL | Phase 1 | Blocks release defects |
| DCT-TST-009 | Validate responsive layout, overflow, truncation, and critical-content visibility | Desktop, tablet, mobile | All actors | Design Owner + QA Owner | Supports zoom/reflow/touch users | Prevents truncation hiding privacy/payment context | Keeps urgent/emergency action visible | Desktop/tablet/mobile browser review | Viewport/layout tests | REQUIRES_APPROVAL | Phase 1 | Blocks poor mobile/tablet release |
| DCT-TST-010 | Validate motion and reduced-motion safety | Animated interfaces | All actors, reduced-motion users | Design Owner + Accessibility Reviewer | Prevents motion-only information | Prevents protected data retention in animations | Emergency actions are not delayed | Motion browser review | Reduced-motion/motion tests | REQUIRES_APPROVAL | Phase 1 | Blocks unsafe motion |
| DCT-TST-011 | Validate visual quality beyond build success | Major pages | All actors | Design Owner + Product Owner | Visual hierarchy supports comprehension | Privacy boundaries are visible but non-leaking | Clinical urgency has correct priority | UI UX Pro Max + human design browser review | Visual baseline only after approval | REQUIRES_APPROVAL | P00-14A + Phase 1 | Blocks generic dashboard quality |
| DCT-TST-012 | Validate content review gates | Clinical, emergency, privacy, legal, finance, provider-disclosure, security, marketing | All actors | Content Owner + Domain Owner | Approved wording required | Prevents privacy/disclosure drift | Prevents unreviewed clinical/emergency wording | Review-record inspection | Content approval checks | REQUIRES_APPROVAL | P00-14A + Phase 1 | Blocks unapproved content |

## Required Automated Checks

Future checks must validate that every page has a registered Page ID, every rendered governed section has a Section ID, every required section exists, no unauthorized section exists, every content key resolves, no orphan content key exists, no duplicate content ID exists, content type matches component contract, CTA label matches action, CTA route exists, required states have copy, release content status is `APPROVED`, superseded content is absent, role/tenant/patient content is isolated, heading hierarchy is valid, links resolve, placeholder copy is absent, forbidden sentinels are absent, protected provider details are absent, unsupported claims are absent, layout overflow is absent, critical content is not clipped, unexpected truncation is absent, tooltip-only critical content is absent, reduced motion works, and animation does not delay safety actions.

## Interactive Browser Review

Codex must later inspect visual hierarchy, alignment, spacing, typography, density, component consistency, copy placement, content priority, section order, CTA placement, responsive layout, overflow, truncation, loading states, empty states, errors, offline state, urgent state, emergency state, focus order, screen-reader structure, motion, reduced motion, console output, and failed requests.

## Visual Evidence

Controlled evidence must include desktop screenshot, tablet screenshot, mobile screenshot, required states, reduced-motion mode, keyboard focus, critical alerts, page comparison, and visual diff where baselines are approved. Evidence must use synthetic data only.

## Design Review Gate

A major page does not pass merely because it builds, tests are green, it resembles a common dashboard, it uses accessible HTML, or it has no console errors. It must pass documented visual, interaction, content, and responsive quality review.

## Content Review Gate

A page must not pass when content is in the wrong section, section order conflicts with the journey, copy is unapproved, CTA action differs from its label, role-specific information leaks, state copy is missing, clinical or emergency copy lacks approval, financial copy is misleading, provider-detail copy weakens the privacy rule, or mobile content hierarchy is broken.

## P00-14 revision Phase 1 handoff additions

These steps are planning requirements only and must not be executed during P00-14.

1. Verify the current Motion package and React import path.
2. Pin the Motion version.
3. Install `motion`.
4. Establish the global `MotionConfig` boundary.
5. Implement reduced-motion behavior.
6. Create centralized motion tokens.
7. Create motion primitives or wrappers.
8. Test Motion on desktop, tablet, and mobile.
9. Review bundle and layout impact.
10. Verify the current Codex-compatible UI UX Pro Max installation.
11. Review `SKILL.md` and scripts.
12. Pin exact skill release or commit.
13. Install the skill project-locally.
14. Confirm Codex IDE invocation.
15. Record version and source.
16. Prevent automatic unreviewed upgrades.
17. Configure a controlled raw-output artifact path.
18. Add page and section identifier conventions.
19. Add content-contract schema validation.
20. Add CTA alignment validation.
21. Add state-copy validation.
22. Add forbidden placeholder and claim scans.
23. Add UI UX Pro Max design review to frontend Definition of Done.
24. Add browser-based design and content review.
25. Add reduced-motion tests.
26. Add visual regression only after approved baselines exist.

## P00-14A handoff

- **Prompt ID:** P00-14A
- **Title:** Experience design, visual system, motion system, and content architecture
- **Complete Breakdown relationship:** Supplemental work required before P00-15
- **Status after P00-14:** NOT STARTED
- **Gate:** P00-15 must not begin before P00-14A is accepted.

P00-14A must later create at minimum `docs/design/experience-principles.md`, `docs/design/brand-and-visual-direction.md`, `docs/design/design-system-specification.md`, `docs/design/design-tokens.md`, `docs/design/information-architecture.md`, `docs/design/navigation-and-dashboard-models.md`, `docs/design/page-and-state-inventory.md`, `docs/design/responsive-layout-strategy.md`, `docs/design/interaction-patterns.md`, `docs/design/motion-system.md`, `docs/design/design-qa-and-visual-review.md`, `docs/content/content-strategy.md`, `docs/content/voice-and-tone.md`, `docs/content/content-model.md`, `docs/content/page-section-content-matrix.md`, `docs/content/content-component-contracts.md`, `docs/content/content-approval-workflow.md`, `docs/content/microcopy-system.md`, `docs/content/clinical-content-governance.md`, `docs/content/error-empty-loading-and-success-copy.md`, and `docs/testing/design-and-content-validation.md`.
