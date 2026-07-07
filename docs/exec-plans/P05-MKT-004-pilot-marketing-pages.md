# P05-MKT-004 PILOT Marketing Pages

## Objective

Build the PILOT-tier public marketing pages (home + segment + trust + privacy + accessibility + FAQ + contact + legal + emergency) plus the auth chrome around sign-in / create-account / forgot-password / reset-password, by composing the P05-MKT-002 marketing components with the P05-MKT-003 content registry. Retire the `batch1-production-page.tsx` mega-component; each URL gets a purpose-built page component.

## Existing context

- Current patient-web homepage renders through a single `Batch1ProductionPage` component that switches on `routeKey` and holds inline strings.
- The uncommitted marketing work has been reset at the start of the P05-MKT-* track.
- `docs/design/page-and-state-inventory.md` enumerates the PILOT pages and required states.
- `docs/content/public-website-content-blueprint.md` defines the home section sequence (13 sections) and per-page requirements.

## Scope

Build one Next.js route per URL in the inventory list, each composed of marketing components with copy resolved through `useContent`:

**PILOT tier (must ship):**

- `/` — home. Home section sequence from `public-website-content-blueprint.md`:
  1. Hero (universal variant)
  2. Trust statement (TrustBar)
  3. What NelyoHealth coordinates (StorySection)
  4. How it works (WorkflowStepper)
  5. Consultation and follow-up (StorySection)
  6. Pharmacy and laboratory fulfilment (StorySection)
  7. Family and diaspora support (SegmentGrid or StorySection)
  8. Employers and HMOs (SegmentGrid entry with scope caveat)
  9. Provider participation (SegmentGrid)
  10. Safety, privacy, and accessibility (TrustBar or StorySection)
  11. FAQ (FAQAccordion)
  12. Primary CTA (CTASection)
  13. Footer (SiteFooter)
- `/how-it-works`
- `/patients`
- `/family-plans`
- `/diaspora`
- `/doctors`
- `/pharmacies`
- `/laboratories`
- `/trust-and-safety`
- `/privacy-overview`
- `/accessibility`
- `/faq`
- `/contact`
- `/legal-and-regulatory-notices`
- `/emergency` — SAFETY-IMMEDIATE motion profile; emergency guidance rendered above every other block.

**Auth chrome:**

- `/sign-in`, `/create-account`, `/forgot-password`, `/reset-password` — marketing header + footer wrap around form primitives from P05-ISS-003. Form logic remains a scaffold that does not perform a real auth call; this is chrome + microcopy only.

**Route alignment and redirects:**

- Rename existing routes to match the inventory: `/for-diaspora → /diaspora`, `/for-employers → /employers` (retained but non-PILOT), `/for-hmos → /hmos`, `/for-doctors → /doctors`, `/for-care-partners → /family-plans`, `/for-pharmacies → /pharmacies`, `/for-labs → /laboratories`, `/for-hospitals → /hospitals-and-referrals`, `/trust-safety → /trust-and-safety`.
- Emit `next.config` redirects preserving 301 semantics from old to new paths so external links do not break.

**Chrome:**

- `SiteHeader` on every page (from P05-MKT-002).
- `EmergencyRibbon` on every page (SAFETY-IMMEDIATE tone; keyboard-first tab stop).
- `SiteFooter` on every page.

**Migration:**

- Delete `apps/patient-web/src/components/screens/batch1-production-page.tsx`.
- Delete `apps/patient-web/src/components/screens/batch2-production-page.tsx` if no route depends on it after migration.
- Delete `apps/patient-web/src/screens/batch1-route-catalog.ts` (content sourcing replaced by the content registry).
- Delete `apps/patient-web/src/screens/batch2-route-catalog.ts` if unused after migration.

## Non-goals

- No production auth backend — auth forms are chrome + microcopy scaffolds.
- No DESIGN-NOW-IMPLEMENT-LATER pages — belongs to P05-MKT-005.
- No new components — everything composes P05-MKT-002.
- No new content entries — everything reads from P05-MKT-003 registry.
- No mobile-app parity (Expo) — belongs to later phase.
- No analytics wiring.

## Source documents

- AGENTS.md
- docs/STATUS.md
- docs/governance/decision-register.md (`DEC-P05-MKT-001..005`)
- docs/design/page-and-state-inventory.md
- docs/content/public-website-content-blueprint.md
- docs/content/page-section-content-matrix.md
- docs/content/microcopy-system.md
- docs/content/copy_patterns.md
- docs/design/marketing-visual-language.md
- docs/design/information-architecture.md
- docs/design/navigation-and-dashboard-models.md
- docs/design/responsive-layout-strategy.md
- NelyoHealth_Build_Implementation_Map_for_Codex.md (Phase 5)

## Locked rules

- No inline strings — every visible token resolves through `useContent`.
- Emergency ribbon reachable as the first tab stop on every public page (browser test enforces).
- No provider-protected data anywhere in marketing pages.
- No banned claims (enforced by P05-MKT-003 lint at build time; visible at runtime through the compiled registry).
- Every page has loading, error, and offline states rendered when the shell reports a resilience transition (`workflow-resilience.ts` from P05-ISS-002).
- LCP under 2.0s and CLS = 0 for the home page at both desktop and mobile viewports.
- WCAG 2.2 AA contrast on every visible pair; keyboard-only navigation completes the primary CTA on every page.

## Files expected to be affected

- apps/patient-web/app/page.tsx (rewrite)
- apps/patient-web/app/how-it-works/page.tsx (new)
- apps/patient-web/app/patients/page.tsx (new)
- apps/patient-web/app/family-plans/page.tsx (new)
- apps/patient-web/app/diaspora/page.tsx (new)
- apps/patient-web/app/doctors/page.tsx (new)
- apps/patient-web/app/pharmacies/page.tsx (new)
- apps/patient-web/app/laboratories/page.tsx (new)
- apps/patient-web/app/trust-and-safety/page.tsx (new)
- apps/patient-web/app/privacy-overview/page.tsx (new)
- apps/patient-web/app/accessibility/page.tsx (new)
- apps/patient-web/app/faq/page.tsx (new)
- apps/patient-web/app/contact/page.tsx (new)
- apps/patient-web/app/legal-and-regulatory-notices/page.tsx (new)
- apps/patient-web/app/emergency/page.tsx (new)
- apps/patient-web/app/sign-in/page.tsx (new — replaces /login)
- apps/patient-web/app/create-account/page.tsx (new — replaces /register)
- apps/patient-web/app/forgot-password/page.tsx (rewrite)
- apps/patient-web/app/reset-password/page.tsx (rewrite)
- apps/patient-web/app/layout.tsx (add SiteHeader / EmergencyRibbon / SiteFooter wrapper)
- apps/patient-web/next.config.mjs (redirects)
- apps/patient-web/src/components/screens/batch1-production-page.tsx (delete)
- apps/patient-web/src/components/screens/batch2-production-page.tsx (delete if unused)
- apps/patient-web/src/screens/batch1-route-catalog.ts (delete)
- apps/patient-web/src/screens/batch2-route-catalog.ts (delete if unused)
- tests/e2e/p05-mkt-004-pilot-pages.spec.ts (new)
- tests/accessibility/p05-mkt-004-pilot-pages.a11y.spec.ts (new)
- tests/unit/marketing-inline-string-boundary.spec.ts (new — no inline strings inspection)
- playwright.p05-mkt-004.config.ts (new)
- docs/governance/phase-5-requirements-traceability.md (update `P05-MKT-REQ-004`, exit-gates `EG-001..EG-005`)
- docs/governance/change-log.md (append)
- docs/STATUS.md (update)

## Dependency changes

None.

## Architecture impact

- Each URL owns its own page component; no mega-component switch.
- `useContent` is the sole path from copy source to render.
- Redirects live in `next.config.mjs`; no dynamic route rewrites required.
- Emergency route uses the SAFETY-IMMEDIATE motion profile; verified in a snapshot test.

## Data-model impact

None.

## API impact

None.

## UI and browser impact

- Full Playwright coverage at 390 / 768 / 1440 for every PILOT page.
- Accessibility audit (axe-core) on every page.
- Reduced-motion project verifies emergency and marketing motion opt-out.
- LCP and CLS measured via a Playwright performance trace on the home page (desktop and mobile).
- Visual snapshots on stable component regions; targeted assertions on dynamic sections.

## Privacy and security

- No PHI, no payment data, no provider details rendered anywhere on marketing pages.
- Auth forms are microcopy scaffolds only; they must not submit to any endpoint. Any submit handler returns a synthetic acknowledgement and is guarded by a runtime assertion.
- Contact form (if included in `/contact`) posts to a synthetic no-op handler; no PII persistence yet.

## Acceptance criteria

1. All 15 PILOT pages plus 4 auth chrome pages render with `SiteHeader` + `EmergencyRibbon` + `SiteFooter`.
2. Every page reads all copy through `useContent`; boundary test (`marketing-inline-string-boundary.spec.ts`) passes.
3. Redirect map preserves 301 semantics from every old path to the new inventory path.
4. Playwright + axe-core suites pass on desktop / tablet / mobile projects.
5. Home LCP ≤ 2.0s and CLS = 0 on desktop and mobile local traces.
6. Emergency ribbon is the first keyboard tab stop on every page.
7. `batch1-production-page.tsx`, `batch1-route-catalog.ts`, and their batch2 siblings (if unused) are deleted.
8. `P05-MKT-EG-001` through `EG-005` flip to COMPLETED in the traceability doc.

## Validation commands

```bash
git status --short
git diff --check
node ./node_modules/vitest/vitest.mjs run tests/unit/marketing-inline-string-boundary.spec.ts
node ./node_modules/@playwright/test/cli.js test --config playwright.p05-mkt-004.config.ts
```

## Rollback

- Revert new/rewritten pages; restore the deleted `batch1-production-page.tsx` and route catalog from HEAD.
- Revert `next.config.mjs` redirects.
- Revert the layout wrapper.
- Revert traceability and STATUS updates.

## Risks

- Page-content parity gaps between the current inline-string surface and the new registry-sourced pages. Mitigation: content-parity checklist walk-through against `page-section-content-matrix.md` before merge.
- SEO impact from route renames. Mitigation: 301 redirects preserved; canonical tags on every page.
- LCP regressions from over-eager illustration loading. Mitigation: illustrations lazy-load below-the-fold; hero illustrations inline SVG.
- Redirect loops. Mitigation: redirect test in the boundary spec.

## Decisions trail

- docs/governance/decision-register.md (`DEC-P05-MKT-001..005`)
- docs/governance/change-log.md
- docs/design/page-and-state-inventory.md
- docs/content/public-website-content-blueprint.md

## Completion evidence

P05-MKT-004 closes only when acceptance criteria are met and traceability/status records are updated with exact command and artifact evidence.
