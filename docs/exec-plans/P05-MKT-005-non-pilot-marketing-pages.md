# P05-MKT-005 Non-PILOT Marketing Pages with Scope Caveats

## Objective

Build the DESIGN-NOW-IMPLEMENT-LATER and FUTURE public pages (`/employers`, `/hmos`, `/hospitals-and-referrals`, `/home-care`), each with a prominent, calm scope caveat that keeps trust and demand-capture without implying availability that does not exist yet. Follow the REVIEW-DEPENDENT rules from `docs/content/public-website-content-blueprint.md`.

## Existing context

- P05-MKT-004 delivered the PILOT-tier pages and the routing chrome.
- `docs/design/page-and-state-inventory.md` marks these four routes as DESIGN-NOW-IMPLEMENT-LATER or POST-PILOT.
- `docs/content/public-website-content-blueprint.md` requires that non-PILOT pages carry an explicit scope-caveat block, no coverage or accreditation guarantees, and CTA-CONTACT as the primary action instead of CTA-CREATE-ACCOUNT.

## Scope

Build the following pages, each composed of P05-MKT-002 components with copy resolved through `useContent` against P05-MKT-003 registry entries:

- `/employers` — audience Employers, PAGE-PUB-EMPLOYERS. Scope caveat, workflow preview, employer benefit narrative (aggregate visibility, member activation, funding boundaries), CTA-CONTACT + CTA-FAQ.
- `/hmos` — audience HMOs, PAGE-PUB-HMOS. Scope caveat, workflow preview, member coordination narrative, CTA-CONTACT + CTA-FAQ.
- `/hospitals-and-referrals` — audience Hospitals and referral partners, PAGE-PUB-HOSPITALS. Scope caveat, referral network preview, safety and clinical governance callout, CTA-CONTACT + CTA-FAQ.
- `/home-care` — audience Home-care organizations, PAGE-PUB-HOMECARE. Scope caveat marking this as POST-PILOT, expression-of-interest CTA-CONTACT + CTA-FAQ, plain-language explanation that home care is future-scope.

Each page includes:

- `ScopeCaveatBanner` component composed at page level from P05-MKT-002 primitives (Alert primitive with a Story wrapper). Copy strictly follows REVIEW-DEPENDENT rules — no guarantee wording, no coverage promises, no accreditation claim.
- `SiteHeader` + `EmergencyRibbon` + `SiteFooter` chrome from P05-MKT-004 layout.
- Loading, error, and offline states inherited from the resilience shell.

## Non-goals

- No account-creation CTA on these pages.
- No pricing, no coverage numbers, no license claim.
- No form submission that persists PII — contact form is a synthetic no-op handler consistent with P05-MKT-004.
- No new components — everything composes P05-MKT-002.
- No new content-registry families — everything reads from `marketing-segment-employers`, `marketing-segment-hmos`, `marketing-segment-hospitals`, `marketing-segment-home-care` (already added in P05-MKT-003).

## Source documents

- AGENTS.md
- docs/STATUS.md
- docs/governance/decision-register.md (`DEC-P05-MKT-001..005`)
- docs/design/page-and-state-inventory.md
- docs/content/public-website-content-blueprint.md (REVIEW-DEPENDENT rules)
- docs/content/content-strategy.md
- docs/content/microcopy-system.md
- docs/design/marketing-visual-language.md

## Locked rules

- Every non-PILOT page renders a visible scope caveat above any narrative content.
- No CTA-CREATE-ACCOUNT on non-PILOT pages.
- No unverified partner logos, accreditation badges, or license claims.
- No implication that HMO coverage, employer benefits, hospital partnerships, or home-care services are currently available.
- Emergency ribbon remains first tab stop.
- All copy sourced from content registry.

## Files expected to be affected

- apps/patient-web/app/employers/page.tsx (new)
- apps/patient-web/app/hmos/page.tsx (new)
- apps/patient-web/app/hospitals-and-referrals/page.tsx (new)
- apps/patient-web/app/home-care/page.tsx (new)
- apps/patient-web/next.config.mjs (add redirects `/for-employers → /employers`, `/for-hmos → /hmos`, `/for-hospitals → /hospitals-and-referrals`)
- packages/ui-foundation/src/marketing/ScopeCaveatBanner.tsx (new — thin wrapper over `Alert` + `Story`)
- packages/ui-foundation/src/index.ts (add re-export)
- tests/e2e/p05-mkt-005-non-pilot-pages.spec.ts (new)
- tests/accessibility/p05-mkt-005-non-pilot-pages.a11y.spec.ts (new)
- playwright.p05-mkt-005.config.ts (new)
- docs/governance/phase-5-requirements-traceability.md (update `P05-MKT-REQ-005`, `EG-006`)
- docs/governance/change-log.md (append)
- docs/STATUS.md (update)

## Dependency changes

None.

## Architecture impact

- Same architecture as P05-MKT-004; four additional page routes.
- `ScopeCaveatBanner` is a thin marketing composition; belongs to the shared package to preserve reuse.

## Data-model impact

None.

## API impact

None.

## UI and browser impact

- Playwright coverage at 390 / 768 / 1440 for every non-PILOT page.
- Text assertion: every non-PILOT page contains the exact scope-caveat copy sourced from the content registry.
- Redirect coverage: every old route (`/for-employers`, `/for-hmos`, `/for-hospitals`) 301-redirects to the new path.
- Accessibility audit on every page.

## Privacy and security

- Contact form is a synthetic no-op; no PII persistence.
- No provider-protected data referenced.

## Acceptance criteria

1. All four non-PILOT pages render with visible scope caveats sourced from the content registry.
2. No CTA-CREATE-ACCOUNT appears on any non-PILOT page.
3. Playwright + axe-core suites pass on desktop / tablet / mobile projects.
4. Redirect coverage passes.
5. `P05-MKT-REQ-005` and `P05-MKT-EG-006` flip to COMPLETED in the traceability doc.

## Validation commands

```bash
git status --short
git diff --check
node ./node_modules/@playwright/test/cli.js test --config playwright.p05-mkt-005.config.ts
```

## Rollback

- Delete the four new pages and the `ScopeCaveatBanner` component.
- Revert `next.config.mjs` redirect additions.
- Revert traceability and STATUS updates.

## Risks

- Caveats too weak — reads as "coming soon" hype. Mitigation: content-owner review before merge; copy paths through voice-tone lint.
- Caveats too strong — reads as abandonment. Mitigation: two-line reassurance pattern from `copy_patterns.md`.
- Contact form drift into real PII capture. Mitigation: runtime assertion; unit test enforces synthetic no-op.

## Decisions trail

- docs/governance/decision-register.md (`DEC-P05-MKT-001..005`)
- docs/governance/change-log.md
- docs/content/public-website-content-blueprint.md
- docs/design/page-and-state-inventory.md

## Completion evidence

P05-MKT-005 closes only when acceptance criteria are met and traceability/status records are updated with exact command and artifact evidence.
