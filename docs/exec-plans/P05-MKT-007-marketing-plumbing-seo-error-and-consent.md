# P05-MKT-007 Marketing Plumbing — SEO, Fonts, Error Pages, and Cookie Consent

## Objective

Close the "world-class" plumbing gaps that are not covered by P05-MKT-001..006: Google Fonts CDN wiring, per-page SEO metadata contract, `sitemap.xml` and `robots.txt` generation, `schema.org` structured data for Organization / MedicalOrganization / FAQPage, marketing-safe 404 and 500 pages, and a dormant cookie-consent shell that renders only when the analytics ADR later lands. Perf budgets (INP, FCP, TBT) added alongside the existing LCP/CLS gates.

## Existing context

- P05-MKT-001 declares font semantic families but leaves live font loading to app-level wiring.
- P05-MKT-003 adds `marketing-seo`, `marketing-error-pages`, and `marketing-cookie-consent` families and entry sets.
- P05-MKT-004 requires every page to expose `generateMetadata` resolving SEO entries.
- `DEC-P05-MKT-007` records the Google Fonts CDN choice with an explicit privacy-coherence caveat.

## Scope

**Font loading:**

- Add the Google Fonts CDN `<link>` for `Fraunces` (display) and `Atkinson Hyperlegible` (body) into `apps/patient-web/app/layout.tsx` with `preconnect` and `display=swap`.
- Fall back to the tokenized local stacks (`Georgia`, `Verdana`) on load failure via the existing token declarations.
- Add a Content Security Policy meta tag that permits `fonts.googleapis.com` and `fonts.gstatic.com` origins.
- **Residual privacy note:** Google Fonts CDN receives the visitor's IP on every page load. This is recorded as a coherence caveat in `DEC-P05-MKT-007` for future Privacy Owner review before pilot.

**SEO metadata contract:**

- Add `apps/patient-web/src/lib/seo.ts` — a typed helper that reads `marketing-seo.<page-slug>.*` entries from the content registry and returns a Next.js `Metadata` object.
- Wire `generateMetadata` in every marketing page (`app/**/page.tsx`) to use this helper.
- Include `title`, `description`, `keywords` (short and specific — no keyword stuffing), `openGraph`, `twitter`, `canonical`, `robots`, and `alternates` fields.

**sitemap.xml + robots.txt:**

- Add `apps/patient-web/app/sitemap.ts` — Next.js `MetadataRoute.Sitemap` generator that enumerates all PILOT and non-PILOT public routes with `lastModified` from git.
- Add `apps/patient-web/app/robots.ts` — permits all PILOT and non-PILOT routes; disallows `/api/`, `/_gallery/`, and any dev-gated route.

**schema.org structured data:**

- Add `apps/patient-web/src/lib/structured-data.ts` — typed JSON-LD generators for `Organization`, `MedicalOrganization`, `WebSite`, `WebPage`, `FAQPage`, `BreadcrumbList`.
- Inject `<script type="application/ld+json">` per-page via Next.js `<Script>` in the appropriate route components.
- Validate JSON-LD shape with a unit test (no external network call).

**Marketing-safe 404 and 500:**

- `apps/patient-web/app/not-found.tsx` — renders `SiteHeader` + `EmergencyRibbon` + a calm "page not found" story block + primary CTA to home + secondary CTA to contact. All copy from `marketing-error-pages.not-found.*`.
- `apps/patient-web/app/error.tsx` — client component; renders the same chrome + a "something is temporarily unavailable" block with a retry action. Copy from `marketing-error-pages.error.*`. Reset callback wired.
- `apps/patient-web/app/global-error.tsx` — root-level fallback in case a root layout error occurs; minimal HTML shell with an emergency link.

**Cookie-consent shell (dormant):**

- `packages/ui-foundation/src/marketing/CookieConsentBanner.tsx` — small, tokenized bottom-of-viewport banner explaining what the site currently stores (only theme preference, only `localStorage`, no tracking cookies today).
- Banner is **rendered only when `NEXT_PUBLIC_ENABLE_COOKIE_CONSENT=1`**. Off by default because no analytics ships today (per `ADR-0010`). This gives us a ready-to-flip surface for the moment analytics enters scope.
- Copy from `marketing-cookie-consent.*` family.

**Perf budgets:**

- Extend `playwright.p05-mkt-006.config.ts` to capture per-page Web Vitals: LCP ≤ 2.0s, CLS = 0, INP ≤ 200ms, FCP ≤ 1.5s, TBT ≤ 200ms — measured on both desktop (1440) and mobile (390) traces.
- Add a budget report to the `.artifacts/p05-mkt-006/` bundle.

## Non-goals

- No analytics wiring (blocked by `ADR-0010` and separate ADR).
- No self-hosted font migration in this issue — Google Fonts CDN is authorized by `DEC-P05-MKT-007`. If Privacy Owner review flips the decision, a follow-up issue migrates to `next/font/google` or `next/font/local`.
- No blog / editorial content management system.
- No internationalization / multi-locale content (English only in this pass).
- No dark-mode-specific OG images (single OG image per page in the current pass).

## Source documents

- AGENTS.md
- docs/STATUS.md
- docs/governance/decision-register.md (`DEC-P05-MKT-001..007`)
- docs/adr/ADR-0010-no-production-phi-in-product-analytics-or-session-replay.md
- docs/content/public-website-content-blueprint.md
- docs/content/error-empty-loading-and-success-copy.md
- docs/privacy/ (NDPR consent expectations)
- NelyoHealth_Build_Implementation_Map_for_Codex.md (Phase 5)

## Locked rules

- No cookies set by NelyoHealth today beyond `localStorage` theme preference. Cookie-consent banner is off by default and remains off until an analytics ADR authorizes it.
- Google Fonts CDN privacy caveat recorded in `DEC-P05-MKT-007`; Privacy Owner review required before pilot.
- All SEO copy passes the P05-MKT-003 voice/tone lint (no banned claims in titles, descriptions, or OG tags).
- Structured data must not reference protected provider details.
- Error pages carry the emergency ribbon; emergency escalation is available on error and not-found.

## Files expected to be affected

- apps/patient-web/app/layout.tsx (Google Fonts `<link>`, CSP meta)
- apps/patient-web/app/sitemap.ts (new)
- apps/patient-web/app/robots.ts (new)
- apps/patient-web/app/not-found.tsx (new)
- apps/patient-web/app/error.tsx (new)
- apps/patient-web/app/global-error.tsx (new)
- apps/patient-web/src/lib/seo.ts (new)
- apps/patient-web/src/lib/structured-data.ts (new)
- apps/patient-web/src/lib/structured-data.test.ts (new)
- apps/patient-web/app/**/page.tsx (add `generateMetadata` + JSON-LD)
- packages/ui-foundation/src/marketing/CookieConsentBanner.tsx (new)
- packages/ui-foundation/src/marketing/CookieConsentBanner.test.tsx (new)
- packages/ui-foundation/src/index.ts (re-export)
- tests/e2e/p05-mkt-007-plumbing.spec.ts (new)
- tests/accessibility/p05-mkt-007-plumbing.a11y.spec.ts (new)
- playwright.p05-mkt-007.config.ts (new)
- docs/governance/phase-5-requirements-traceability.md (update)
- docs/governance/change-log.md (append)
- docs/STATUS.md (update)

## Dependency changes

None. Next.js provides `MetadataRoute`, `Script`, and metadata generators out of the box.

## Architecture impact

- SEO helper and structured-data generators live in `apps/patient-web/src/lib/` — app-scoped, not shared, because canonical URLs and Organization data are patient-web specific.
- Cookie-consent banner is package-level for reuse across other apps if they ever need consent surfaces.

## Data-model impact

None.

## API impact

None.

## UI and browser impact

- 404 and error pages render at 390 / 768 / 1440 with full chrome and emergency ribbon.
- Cookie-consent shell renders correctly when its env flag is on; hidden when off.
- Font loading does not shift layout (verified via CLS = 0 assertion).
- Web Vitals budgets pass on both desktop and mobile.

## Privacy and security

- **DEC-P05-MKT-007 privacy note carried forward here**: Google Fonts CDN receives visitor IP on every page load. This is a coherence caveat given the platform's privacy claims. Privacy Owner review required before pilot; if flipped, migration to `next/font/google` self-hosted is a one-issue change.
- CSP restricts font origins to `fonts.googleapis.com` and `fonts.gstatic.com` only.
- No cookies set by NelyoHealth. `localStorage` used only for theme preference (`nh-theme` key).
- Structured data excludes any protected provider details.
- Error pages do not leak stack traces or internal identifiers.

## Acceptance criteria

1. Google Fonts CDN wired via `<link>`; CSP permits only the two required origins; local fallback stacks work when CDN is blocked.
2. Every marketing page exposes `generateMetadata` sourcing from the content registry via `apps/patient-web/src/lib/seo.ts`.
3. `sitemap.xml` and `robots.txt` produced by Next.js metadata routes; PILOT + non-PILOT routes enumerated; dev-gated routes disallowed.
4. Structured data injected on every relevant page; JSON-LD unit test passes; no protected content leaks.
5. 404, error, and global-error pages render with `SiteHeader` + `EmergencyRibbon` + `SiteFooter` and pass axe-core.
6. Cookie-consent banner rendered only when the env flag is on; unit test verifies both states.
7. Web Vitals budgets pass across every marketing page (LCP ≤ 2.0s, CLS = 0, INP ≤ 200ms, FCP ≤ 1.5s, TBT ≤ 200ms) on desktop and mobile.
8. Governance traceability and STATUS updated.

## Validation commands

```bash
git status --short
git diff --check
node ./node_modules/vitest/vitest.mjs run apps/patient-web packages/ui-foundation
node ./node_modules/@playwright/test/cli.js test --config playwright.p05-mkt-007.config.ts
```

## Rollback

- Revert app-level layout changes, sitemap/robots routes, error pages, SEO/structured-data lib, and cookie-consent banner.
- Revert traceability and STATUS updates.
- Google Fonts CDN removal only requires deleting the `<link>` — fallback stacks continue to render.

## Risks

- Google Fonts CDN privacy caveat surfacing during a Privacy Owner review after pilot marketing goes live. Mitigation: self-host migration is a one-issue change; recorded as a residual condition in the traceability doc.
- Structured data drift from real Organization details. Mitigation: JSON-LD sourced from the content registry, not inline.
- Web Vitals regressions from font weight requests. Mitigation: only load the weights that display + body tokens declare; verify via network trace.
- Cookie-consent shell drifting into a real consent banner before analytics ADR closes. Mitigation: dormant-by-default via env flag; boundary test enforces default-off.

## Decisions trail

- docs/governance/decision-register.md (`DEC-P05-MKT-007`, `DEC-P05-MKT-008`)
- docs/governance/change-log.md
- docs/adr/ADR-0010-no-production-phi-in-product-analytics-or-session-replay.md

## Completion evidence

P05-MKT-007 closes only when acceptance criteria are met and traceability/status records are updated with exact command and artifact evidence.
