# Phase 5 Requirements Traceability

## Status

Phase 5 execution is active with `P05-ISS-001` completed and `P05-ISS-002` started for workflow-level low-bandwidth resilience and retry semantics.

This document now records implemented evidence for the first Phase 5 increment and identifies remaining Phase 5 gate work.

## Canonical Step Reconciliation

| Canonical step (implementation map) | P05-ISS-001 coverage status | Notes |
|---|---|---|
| 1. Shared design-system token and component foundation | COMPLETED-P05-ISS-001 | Shared tokenized shell classes and reusable shell state card structure are implemented in `packages/ui-foundation/src/styles.css`. |
| 2. Four application shells with role-aware foundations | COMPLETED-P05-ISS-001 | Patient/provider/organization/admin shell pages now render role-aware navigation scaffolds and six deterministic state cards each. |
| 3. Accessibility automation for shared shell/component states | COMPLETED-P05-ISS-001 | ISS-014 accessibility suite passes across desktop/tablet/mobile projects with shell state scaffolds rendered. |
| 4. Low-bandwidth and resilient UI state behavior | IN-PROGRESS-P05-ISS-002 | Workflow-level resilience and retry state machine is implemented in patient-web with integration evidence; browser UX parity remains pending. |
| 5. Browser visual-validation matrix across representative widths and states | COMPLETED-P05-ISS-001 | ISS-014 browser suite validates all four shells across desktop/tablet/mobile with six required state cards per shell. |
| 6. Full Phase 5 exit-gate completion | IN-PROGRESS-BY-INCREMENTS | Phase 5 execution begins with `P05-ISS-001`; gate closure will follow evidence capture. |

## Requirement map

| Requirement ID | Requirement | Source | Primary implementation | Supporting implementation | Status |
|---|---|---|---|---|---|
| P05-REQ-001 | Shared design-system includes core token and component foundations | Implementation map Phase 5 | packages/ui-foundation | apps/*-web shells, tests/unit, tests/e2e | COMPLETED-P05-ISS-001 |
| P05-REQ-002 | Shells exist for patient, provider, HMO/employer, and admin/operations | Implementation map Phase 5 | apps/patient-web, apps/provider-web, apps/organization-web, apps/admin-web | tests/e2e, tests/accessibility | COMPLETED-P05-ISS-001 |
| P05-REQ-003 | Accessibility automation covers keyboard, focus, labels, contrast, reduced-motion, and text resizing | Implementation map Phase 5 | tests/accessibility | tests/e2e, shell foundations | COMPLETED-P05-ISS-001 |
| P05-REQ-004 | Low-bandwidth behavior includes progressive loading, retry, draft resilience, and connection-status handling | Implementation map Phase 5 | apps/patient-web workflow resilience state machine | tests/integration and patient-web unit evidence | IN-PROGRESS-P05-ISS-002 |
| P05-REQ-005 | Browser validation matrix covers representative widths and critical UI states | Implementation map Phase 5 | tests/e2e | playwright config projects and accessibility suite | COMPLETED-P05-ISS-001 |
| P05-REQ-006 | Shared UI components remain domain-logic-neutral | Implementation map Phase 5 | packages/ui-foundation | code review and boundary tests | COMPLETED-P05-ISS-001 |

## Exit-gate map

| Gate ID | Exit gate | Evidence source | Status |
|---|---|---|---|
| P05-EG-001 | All four application shells deploy | Shell build/runtime checks and browser launch evidence | PARTIAL-P05-ISS-001 |
| P05-EG-002 | Shared components pass automated accessibility checks | Accessibility test suite evidence | PARTIAL-P05-ISS-001 |
| P05-EG-003 | All pages have loading, empty, error, unauthorized, and offline states | Browser/state test evidence per shell | PARTIAL-P05-ISS-001 |
| P05-EG-004 | Patient workflows are usable on small mobile screens | Mobile viewport browser evidence plus workflow resilience transition evidence | IN-PROGRESS-P05-ISS-002 |
| P05-EG-005 | Codex has opened and inspected each shell in a real browser | Browser validation logs and reports | COMPLETED-P05-ISS-001 |
| P05-EG-006 | No domain-specific business logic exists inside shared UI components | Boundary tests and code review evidence | PARTIAL-P05-ISS-001 |

## Deterministic evidence artifacts

- Kickoff scope: `docs/exec-plans/P05-phase-5-kickoff-scope.md`
- First execution issue: `docs/exec-plans/P05-ISS-001-design-system-and-shell-foundation.md`
- Second execution issue: `docs/exec-plans/P05-ISS-002-low-bandwidth-resilience-and-retry-semantics.md`
- Unit evidence command: `node node_modules/vitest/vitest.mjs run tests/unit/phase5-shell-scaffolds.spec.ts` (passed: 3 tests)
- Browser evidence command: `node node_modules/@playwright/test/cli.js test -c playwright.iss014.config.ts` (passed: 24 tests)
- Workflow resilience evidence command: `node node_modules/vitest/vitest.mjs run apps/patient-web/src/workflow-resilience.test.ts tests/integration/patient-workflow-resilience-runtime.spec.ts` (passed: 2 files, 6 tests)
- Browser and accessibility specs:
	- `tests/e2e/iss014-web-shells.spec.ts`
	- `tests/accessibility/iss014-web-shells.a11y.spec.ts`
- Workflow resilience specs:
  - `apps/patient-web/src/workflow-resilience.test.ts`
  - `tests/integration/patient-workflow-resilience-runtime.spec.ts`
- Cross-viewport coverage: desktop/tablet/mobile projects per shell plus matching accessibility projects.

## P05-MKT-* marketing surface track (added 2026-07-07)

An owner-authorized parallel marketing track was added inside Phase 5 to cover the full public marketing surface (see `DEC-P05-MKT-001` in `docs/governance/decision-register.md`). This explicitly overrides the "Homepage redesign: explicitly out of scope" note in `docs/design/phase-5-reusable-design-system-foundation.md`.

### Marketing requirement map

| Requirement ID | Requirement | Source | Primary implementation | Status |
|---|---|---|---|---|
| P05-MKT-REQ-001 | Marketing visual language extends VIS-DIR-002 with editorial display scale, hero spacing, marketing max-widths, and motion patterns. | docs/design/brand-and-visual-direction.md; DEC-P05-MKT-002 | packages/design-tokens, docs/design/marketing-visual-language.md | COMPLETED-P05-MKT-001 (2026-07-13) |
| P05-MKT-REQ-002 | Marketing components (SiteHeader, SiteFooter, EmergencyRibbon, HeroBlock variants, StorySection, ProofStrip, WorkflowStepper, SegmentGrid, TrustBar, FAQAccordion, CTASection, PricingMatrix, QuoteBlock, LegalNoticeStrip) sit on typed primitives with keyboard/a11y coverage. | docs/design/design-system-specification.md; DEC-P05-MKT-005 | packages/ui-foundation/src/marketing/ | COMPLETED-P05-MKT-002 (2026-07-13) |
| P05-MKT-REQ-003 | Marketing copy is authored exclusively as `packages/content-registry` entries (draft status, synthetic-only) with voice/tone lint enforcing the banned-claim list. | docs/content/public-website-content-blueprint.md; DEC-P05-MKT-004 | packages/content-registry/src/entries/marketing/ | PENDING-P05-MKT-003 |
| P05-MKT-REQ-004 | PILOT public marketing pages ship for home, how-it-works, patients, family-plans, diaspora, doctors, pharmacies, laboratories, trust-and-safety, privacy-overview, accessibility, faq, contact, legal-and-regulatory-notices, emergency, plus auth chrome. | docs/design/page-and-state-inventory.md | apps/patient-web/app/*/page.tsx | PENDING-P05-MKT-004 |
| P05-MKT-REQ-005 | DESIGN-NOW-IMPLEMENT-LATER surfaces (employers, hmos, hospitals-and-referrals, home-care) ship with explicit scope caveats. | docs/content/public-website-content-blueprint.md REVIEW-DEPENDENT rules | apps/patient-web/app/(employers/hmos/hospitals-and-referrals/home-care)/page.tsx | PENDING-P05-MKT-005 |
| P05-MKT-REQ-006 | Cross-viewport visual + a11y evidence matrix passes for every marketing page and every marketing component. | Implementation map Phase 5 browser matrix | tests/e2e/*, tests/accessibility/* | PENDING-P05-MKT-006 |
| P05-MKT-REQ-007 | Bespoke illustration system used across marketing pages; no photography until a separate owner approval decision is recorded. | DEC-P05-MKT-003 | packages/ui-foundation/src/marketing/illustrations/ | COMPLETED-P05-MKT-002 (2026-07-13; 16 bespoke SVGs + IllustrationSlot + registry shipped) |
| P05-MKT-REQ-008 | Marketing pages render in both light and dark themes; every semantic token has both values; `[data-theme="dark"]` toggles palette; defaults to `prefers-color-scheme`; contrast tests cover both themes. | DEC-P05-MKT-006 | packages/design-tokens, packages/ui-foundation, apps/patient-web | PARTIAL-P05-MKT-002 (dual-theme palette, components, ThemeToggle, and gallery ship rendering in both themes; per-page dual-theme validation closes in P05-MKT-004) |
| P05-MKT-REQ-009 | Google Fonts CDN loads Fraunces + Atkinson Hyperlegible with CSP restricting font origins. Residual privacy caveat recorded; Privacy Owner review pending before pilot. | DEC-P05-MKT-007 | apps/patient-web/app/layout.tsx | PENDING-P05-MKT-007 |
| P05-MKT-REQ-010 | Every marketing page exposes `generateMetadata` resolving `marketing-seo.<page-slug>.*` entries into Next.js metadata (title, description, OG, canonical, robots). `sitemap.xml` and `robots.txt` produced by Next.js metadata routes. | DEC-P05-MKT-008 | apps/patient-web/app/sitemap.ts, robots.ts, **/page.tsx, src/lib/seo.ts | PENDING-P05-MKT-007 |
| P05-MKT-REQ-011 | Schema.org structured data (Organization, MedicalOrganization, WebSite, WebPage, FAQPage, BreadcrumbList) injected per page; excludes any protected provider details. | DEC-P05-MKT-008 | apps/patient-web/src/lib/structured-data.ts | PENDING-P05-MKT-007 |
| P05-MKT-REQ-012 | Marketing-safe 404, 500, and global-error pages render with `SiteHeader` + `EmergencyRibbon` + `SiteFooter`; copy sourced from `marketing-error-pages` family. | DEC-P05-MKT-008 | apps/patient-web/app/not-found.tsx, error.tsx, global-error.tsx | PENDING-P05-MKT-007 |
| P05-MKT-REQ-013 | Cookie-consent shell rendered only when `NEXT_PUBLIC_ENABLE_COOKIE_CONSENT=1`; off by default because no analytics ships today (per ADR-0010). | DEC-P05-MKT-008 | packages/ui-foundation/src/marketing/CookieConsentBanner.tsx | PENDING-P05-MKT-007 |
| P05-MKT-REQ-014 | Web Vitals budgets pass on every marketing page: LCP ≤ 2.0s, CLS = 0, INP ≤ 200ms, FCP ≤ 1.5s, TBT ≤ 200ms on desktop and mobile traces. | DEC-P05-MKT-008 | playwright.p05-mkt-007.config.ts | PENDING-P05-MKT-007 |
| P05-MKT-REQ-015 | Primitive set includes Table and Timeline (Phase 5 implementation map). | DEC-P05-MKT-009 | packages/ui-foundation/src/primitives/Table.tsx, Timeline.tsx | PENDING-P05-ISS-003 |

### Marketing exit-gate map

| Gate ID | Exit gate | Evidence source | Status |
|---|---|---|---|
| P05-MKT-EG-001 | All PILOT public marketing pages render across mobile/tablet/desktop with content-registry-sourced copy and pass automated a11y checks. | Playwright + a11y suite over P05-MKT-004 pages | PENDING |
| P05-MKT-EG-002 | Emergency ribbon and emergency-escalation pathway are visible above commercial hierarchy on every public page. | Playwright assertion per page | PENDING |
| P05-MKT-EG-003 | Voice/tone lint records zero banned-claim hits across all `public-site` content entries. | CI job on `packages/content-registry` | PENDING |
| P05-MKT-EG-004 | No marketing page contains inline strings; all copy resolves via `useContent`. | Boundary test in `tests/unit/` | PENDING |
| P05-MKT-EG-005 | LCP ≤2.0s and CLS = 0 on home page at desktop and mobile viewports. | Local perf trace + Playwright | PENDING |
| P05-MKT-EG-006 | DESIGN-NOW-IMPLEMENT-LATER pages carry visible scope caveats matching REVIEW-DEPENDENT rules. | Content review + Playwright text assertion | PENDING |
| P05-MKT-EG-007 | Both light and dark themes pass contrast + a11y checks on every marketing page and component. | Playwright + axe-core over both `data-theme` values | PENDING |
| P05-MKT-EG-008 | Web Vitals budgets pass on every marketing page (LCP, CLS, INP, FCP, TBT). | Playwright performance trace per page × desktop/mobile | PENDING |
| P05-MKT-EG-009 | SEO surfaces (metadata, sitemap, robots, structured data) valid and complete for every PILOT and non-PILOT page. | JSON-LD unit test + sitemap enumeration test | PENDING |
| P05-MKT-EG-010 | Marketing-safe error pages (404, 500, global-error) render with emergency access. | Playwright + axe-core over error routes | PENDING |

## Residual conditions

- Full pnpm repository-level verification commands may remain constrained by lockfile minimum-release-age policy in this environment.
- `playwright.iss014.config.ts` now uses direct app-local Next.js launch commands to avoid pnpm lockfile policy blockers during deterministic evidence runs.
- Remaining Phase 5 increments are required for full browser-level low-bandwidth UX coverage and complete exit-gate closure.
- Marketing photography approval decision is not yet recorded; bespoke illustrations are the only permitted media until an owner decision authorizes photography.
- Google Fonts CDN privacy coherence caveat recorded in `DEC-P05-MKT-007`. Privacy Owner review is required before pilot. Migration to self-hosted `next/font/google` is a one-issue change if the decision is reversed.
