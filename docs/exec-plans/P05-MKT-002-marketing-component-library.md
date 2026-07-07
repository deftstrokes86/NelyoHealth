# P05-MKT-002 Marketing Component Library

## Objective

Build the composed marketing components required to assemble the public marketing surface. Components sit on the P05-ISS-003 primitives, consume the P05-MKT-001 tokens and motion profiles, and take all copy from the content registry (populated in P05-MKT-003). No inline strings, no domain logic, no photography.

## Existing context

- P05-ISS-003 delivers the expanded primitive set; P05-MKT-001 delivers the marketing visual language and tokens.
- `packages/ui-foundation/src/marketing/site-header.tsx` currently exists in `apps/patient-web/src/components/marketing/`. It will be re-homed into the shared package and expanded.
- `DEC-P05-MKT-005` orders these dependencies; this issue is blocked until P05-ISS-003 and P05-MKT-001 close.

## Scope

Deliver the following typed components under `packages/ui-foundation/src/marketing/`:

- `SiteHeader` — sticky, segment-aware navigation with mobile drawer.
- `SiteFooter` — role-aware link groups, trust badges (safe wording only), legal strip.
- `EmergencyRibbon` — SAFETY-IMMEDIATE tone; visible above commercial hierarchy on every public page.
- `HeroBlock` — five variants: `universal`, `patient`, `family-diaspora`, `provider`, `organization`. Each takes an `illustrationId` prop that resolves to a bespoke illustration slot; no photography.
- `StorySection` — eyebrow + headline + body + optional illustration slot; supports left/right/center-aligned illustration.
- `ProofStrip` — safe-wording metrics/claims (no forbidden claims); layout responsive from stacked to horizontal.
- `WorkflowStepper` — visual step sequence (intake → triage → consult → fulfilment → follow-up).
- `SegmentGrid` — grid of segment cards linking to segment landing pages.
- `TrustBar` — icon + short title + detail; consumes `LucideIcon`-compatible slots via primitive Icon.
- `FAQAccordion` — accessible accordion built on the P05-ISS-003 Accordion primitive.
- `CTASection` — dual CTA with a trust reassurance line beneath.
- `PricingMatrix` — responsive plan comparison; no unverified claims.
- `QuoteBlock` — synthetic-only quote scaffold; renders a caveat until a real quote is approved.
- `LegalNoticeStrip` — approved-legal-wording slot; renders a "DRAFT-PENDING-APPROVAL" ribbon while legal review is open.
- `IllustrationSlot` — accepts an `illustrationId`; renders the resolved bespoke SVG from `packages/ui-foundation/src/marketing/illustrations/*.svg`; falls back to a neutral tokenized placeholder when the ID is unknown.

Every component:

- Reads all copy through a `useContent(id)` accessor keyed to the content registry; no inline strings.
- Renders correctly at 390 / 768 / 1440.
- Renders correctly in **both light and dark themes** — every gallery route validates both `data-theme="light"` and `data-theme="dark"`.
- Supports keyboard operation and screen-reader labels.
- Uses the P05-MKT-001 motion profiles; respects reduced-motion.
- Ships with unit tests, an accessibility test, and a gallery page.
- Carries zero domain-specific business logic (Phase 5 exit-gate criterion 6).

Additional shell utility:

- `ThemeToggle` — a small primitive-based control that flips `data-theme` on `<html>`, persists preference in `localStorage` under `nh-theme`, and defaults to `prefers-color-scheme`. Lives in `SiteHeader` mobile drawer and desktop nav trailing slot.

Add a component gallery at `apps/patient-web/app/_gallery/marketing/[component]/page.tsx`, dev-gated by `NEXT_PUBLIC_ENABLE_GALLERY=1`, one route per component.

Ship a minimal bespoke illustration set (12–18 SVGs) under `packages/ui-foundation/src/marketing/illustrations/` covering the five hero variants, five workflow steps, plus placeholder art for trust, family/diaspora, and provider narratives. Style: line-forward, tokenized fills, no realistic faces (until photography approval), Nigerian-and-diaspora-appropriate motifs without stereotype.

## Non-goals

- No page assembly — the actual PILOT pages are built in P05-MKT-004.
- No content authoring — copy comes from P05-MKT-003.
- No new primitives — additions must come from an amendment to P05-ISS-003.
- No shell chrome (profile switcher, notification center, connection indicator) — separate issue.
- No analytics hooks in marketing components — those are added when analytics ADR is closed.

## Source documents

- AGENTS.md
- docs/STATUS.md
- docs/governance/decision-register.md (`DEC-P05-MKT-002`, `DEC-P05-MKT-005`)
- docs/design/design-system-specification.md
- docs/design/marketing-visual-language.md (delivered by P05-MKT-001)
- docs/design/interaction-patterns.md
- docs/design/responsive-layout-strategy.md
- docs/design/motion-system.md
- docs/content/public-website-content-blueprint.md
- docs/content/copy_patterns.md
- NelyoHealth_Build_Implementation_Map_for_Codex.md (Phase 5)

## Locked rules

- Every visible string comes from the content registry.
- No component embeds a domain-specific decision, price, or clinical statement.
- Emergency-facing components (EmergencyRibbon) must be reachable by keyboard as the first tab stop.
- No motion on emergency components beyond `SAFETY-IMMEDIATE`.
- No decorative iconography inside `LegalNoticeStrip`.
- Illustrations are tokenized SVG only; no PNG/JPG assets until photography approval.

## Files expected to be affected

- packages/ui-foundation/src/marketing/*.tsx (new — one file per component)
- packages/ui-foundation/src/marketing/*.test.tsx (unit tests)
- packages/ui-foundation/src/marketing/illustrations/*.svg (new)
- packages/ui-foundation/src/marketing/illustrations/index.ts (illustration registry)
- packages/ui-foundation/src/hooks/useContent.ts (new; delegates to content-registry lookup)
- packages/ui-foundation/src/hooks/useContent.test.ts (new)
- packages/ui-foundation/src/index.ts (add re-exports)
- packages/ui-foundation/src/styles.css (marketing selectors as needed)
- apps/patient-web/app/_gallery/marketing/[component]/page.tsx (dev-gated)
- apps/patient-web/src/components/marketing/site-header.tsx (delete; superseded by shared component)
- tests/e2e/p05-mkt-002-marketing-gallery.spec.ts
- tests/accessibility/p05-mkt-002-marketing-gallery.a11y.spec.ts
- playwright.p05-mkt-002.config.ts
- docs/governance/phase-5-requirements-traceability.md (update `P05-MKT-REQ-002`, `P05-MKT-REQ-007`)
- docs/governance/change-log.md (append)
- docs/STATUS.md (update)

## Dependency changes

None expected. If a focus-trap or dismissable-layer helper is required for Drawer/Menu/Popover behavior, we lift the one delivered as part of P05-ISS-003.

## Architecture impact

- Marketing components live under `packages/ui-foundation/src/marketing/` — same package as primitives, sub-folder for scope.
- Illustrations are static SVG modules imported directly; no runtime asset fetch.
- `useContent` reads from the compiled content registry; missing IDs throw in development, render a tokenized placeholder in production, and the boundary test flags them at build.

## Data-model impact

None.

## API impact

None.

## UI and browser impact

- Full gallery coverage for every marketing component at 390 / 768 / 1440.
- Emergency ribbon reachable as first tab stop on every gallery page that includes it.
- Reduced-motion Playwright project verifies motion opt-out.
- LCP under 2s on gallery hero pages measured in local trace.

## Privacy and security

- No content that could leak protected provider details; the schema in `packages/content-registry/src/schema.ts` already blocks provider-protected content from carrying pre-payment provider-location details.
- `IllustrationSlot` renders SVG only; no external asset fetch, no XSS surface from user input (props are typed).

## Acceptance criteria

1. All 14 marketing components exported from `@nelyohealth/ui-foundation`.
2. Every component has a passing unit test and reads all copy through `useContent`.
3. `apps/patient-web/app/_gallery/marketing/` renders one route per component and passes Playwright at desktop/tablet/mobile.
4. Accessibility suite reports zero critical or serious issues on every gallery route.
5. Emergency ribbon appears as first tab stop on any gallery route that renders it.
6. Bespoke illustration set (≥12 SVGs) ships and resolves through the illustration registry.
7. Boundary test: no `apps/*` import from `packages/ui-foundation/src/marketing/`; no domain identifier appears in the marketing package; no inline string outside test scaffolds.
8. Governance traceability and STATUS updated.

## Validation commands

```bash
git status --short
git diff --check
node ./node_modules/vitest/vitest.mjs run packages/ui-foundation
node ./node_modules/@playwright/test/cli.js test --config playwright.p05-mkt-002.config.ts
```

## Rollback

- Revert `packages/ui-foundation/src/marketing/*` additions and the gallery routes.
- Restore `apps/patient-web/src/components/marketing/site-header.tsx` from HEAD.
- Revert traceability and STATUS updates.

## Risks

- Illustration set becoming a bottleneck. Mitigation: ship 12 SVGs first; add remainder in P05-MKT-004 as pages demand.
- `useContent` fallback masking missing IDs. Mitigation: dev-mode throws; boundary test in CI.
- Component bloat around HeroBlock variants. Mitigation: single component with variant prop; internal composition; no five separate files.

## Decisions trail

- docs/governance/decision-register.md (`DEC-P05-MKT-002`, `DEC-P05-MKT-003`, `DEC-P05-MKT-005`)
- docs/governance/change-log.md
- docs/design/marketing-visual-language.md
- docs/design/design-system-specification.md

## Completion evidence

P05-MKT-002 closes only when acceptance criteria are met and traceability/status records are updated with exact command and artifact evidence.
