# P05-ISS-003 Design System Primitives Expansion

## Objective

Expand the shared UI foundation from the current six primitives (Alert, Button, Dialog, Field, Stack, Surface) to the full set required by `docs/design/design-system-specification.md` so that both application shells and the P05-MKT-* marketing components sit on typed, accessible, tokenized primitives instead of one-off styles.

## Existing context

- Phase 5 kickoff and P05-ISS-001 completed the shell foundation and shared token boundary.
- P05-ISS-002 added workflow-level low-bandwidth resilience with unit + integration evidence.
- `packages/ui-foundation` currently exports six primitives; `docs/design/design-system-specification.md` specifies 32 primitives (CMP-PRM-001 through CMP-PRM-032).
- `packages/design-tokens` already exposes color/typography/spacing/motion/elevation/radius/breakpoint tokens plus a Tailwind bridge; primitives must consume tokens, never raw values.
- `DEC-P05-MKT-005` establishes this issue as a hard prerequisite for `P05-MKT-002`.

## Scope

Add the following typed React primitives under `packages/ui-foundation/src/primitives/` and re-export them from `packages/ui-foundation/src/index.ts`:

- CMP-PRM-002 Link
- CMP-PRM-003 Input
- CMP-PRM-004 Textarea
- CMP-PRM-005 Select
- CMP-PRM-006 Combobox
- CMP-PRM-007 Checkbox
- CMP-PRM-008 Radio
- CMP-PRM-009 Switch
- CMP-PRM-010 Date input
- CMP-PRM-011 Time input
- CMP-PRM-012 File input
- CMP-PRM-013 OTP input
- CMP-PRM-014 Label
- CMP-PRM-015 Helper text
- CMP-PRM-016 Error text
- CMP-PRM-017 Badge
- CMP-PRM-018 Status indicator
- CMP-PRM-019 Avatar
- CMP-PRM-020 Divider
- CMP-PRM-021 Tooltip
- CMP-PRM-022 Popover
- CMP-PRM-023 Menu
- CMP-PRM-025 Drawer
- CMP-PRM-026 Tabs
- CMP-PRM-027 Accordion
- CMP-PRM-028 Toast
- CMP-PRM-030 Skeleton
- CMP-PRM-031 Spinner
- CMP-PRM-032 Progress indicator
- Card primitive (currently only CSS in `styles.css`; promote to typed component)

Each primitive must:

- Render every required state per the specification (default, focus, hover, active, disabled, loading, error, and any state-specific variants such as validation-success, indeterminate for Checkbox, checked for Switch, etc.).
- Meet WCAG 2.2 AA contrast for all state color pairs (verified through `packages/design-tokens/src/contrast.ts`).
- Provide keyboard operation matching the ARIA Authoring Practices Guide for its role (menu, tabs, dialog, drawer, combobox, tooltip, popover, accordion).
- Manage focus visibly through the `focus-ring` token and `shadow.focus`.
- Provide correct ARIA attributes and semantic labels; support `aria-describedby` linkage between Input/Textarea/Select/Combobox/Date/Time/File/OTP and Label + Helper text + Error text.
- Maintain 44px minimum touch target where interactive.
- Provide `reduced-motion` equivalents for any animated state.
- Ship strict TypeScript prop types; no `any`, no `unknown` fallbacks.

## Non-goals

- No new marketing-only composed components (owned by P05-MKT-002).
- No domain component (CMP-DOM-*) work — those belong to later phases where clinical data models exist.
- No content-registry entries — those belong to P05-MKT-003 / P05-ISS-004.
- No shell chrome additions (profile switching, notification center, connection indicator) — deferred to a later shell-chrome issue.
- No new external dependencies without ADR review.

## Source documents

- AGENTS.md
- docs/STATUS.md
- docs/governance/decision-register.md (`DEC-P05-MKT-005`)
- docs/governance/phase-5-requirements-traceability.md
- docs/design/design-system-specification.md
- docs/design/phase-5-reusable-design-system-foundation.md
- docs/design/experience-principles.md
- docs/design/motion-system.md
- docs/design/motion-requirements.md
- NelyoHealth_Build_Implementation_Map_for_Codex.md (Phase 5 section)

## Locked rules

- Primitives must not contain domain-specific business logic (Phase 5 exit-gate criterion 6).
- Primitives must not import from `apps/*`; the dependency direction is `apps → packages/ui-foundation → packages/design-tokens`.
- All color, spacing, radius, elevation, shadow, and motion values are consumed as tokens.
- Synthetic-only data in every test artifact.
- No `console.log`, no `TODO` comments left in shipped code.

## Files expected to be affected

Planned create/update targets:

- packages/ui-foundation/src/primitives/*.tsx (new files: Link, Input, Textarea, Select, Combobox, Checkbox, Radio, Switch, DateInput, TimeInput, FileInput, OtpInput, Label, HelperText, ErrorText, Badge, StatusIndicator, Avatar, Divider, Tooltip, Popover, Menu, Drawer, Tabs, Accordion, Toast, Skeleton, Spinner, Progress, Card)
- packages/ui-foundation/src/primitives/*.test.tsx (one unit-test file per primitive)
- packages/ui-foundation/src/styles.css (new state classes as needed; existing selectors preserved)
- packages/ui-foundation/src/index.ts (add re-exports)
- packages/ui-foundation/src/hooks/ (shared hooks: useFocusTrap, useControllableState, useId)
- apps/patient-web/app/_gallery/page.tsx and apps/patient-web/app/_gallery/[primitive]/page.tsx (dev-gated gallery routes; `NEXT_PUBLIC_ENABLE_GALLERY=1`)
- tests/e2e/p05-iss-003-primitives-gallery.spec.ts
- tests/accessibility/p05-iss-003-primitives-gallery.a11y.spec.ts
- playwright.p05-iss-003.config.ts
- docs/governance/phase-5-requirements-traceability.md (update)
- docs/governance/change-log.md (append)
- docs/STATUS.md (update)

Final file list may be reduced by implementation choices if acceptance criteria are still met.

## Dependency changes

No new production dependencies are authorized by default. Radix Primitives, Headless UI, or similar libraries are explicitly deferred pending an ADR — the initial pass implements primitives directly with tokens + ARIA. If a helper for focus-trap, dismissable-layer, or portal is required, it will be added in a follow-up ADR and executed as a separate issue.

Existing dependencies (`react`, `react-dom`, `@nelyohealth/design-tokens`) are sufficient.

## Architecture impact

- Primitives package remains framework-agnostic below `react` — no Next.js APIs in `packages/ui-foundation`.
- The gallery route lives inside `apps/patient-web/app/_gallery` for evidence; it is dev-gated and excluded from production builds via env flag.
- Shared hooks land in `packages/ui-foundation/src/hooks/` and are not re-exported from the package root unless needed by consumers.

## Data-model impact

None.

## API impact

None.

## UI and browser impact

- Every primitive is inspectable in the gallery at representative widths 390 px / 768 px / 1440 px.
- Playwright coverage validates: hover, focus-visible, active, disabled, loading, error, empty, success where applicable, and reduced-motion snapshots.
- Accessibility suite runs `@axe-core/playwright` on every gallery page.
- No visual regression on existing shell scaffolds.

## Privacy and security

- Primitives handle no PHI, no finance data, and no provider details.
- Toast, Tooltip, and Popover implementations must not leak inner content to the accessibility tree when dismissed; verified in a11y tests.
- Gallery routes are dev-gated and stripped from production builds; verified in a boundary test.

## Acceptance criteria

1. All ~30 primitives from the scope list are exported from `@nelyohealth/ui-foundation`.
2. Each primitive has a passing unit test covering rendered states, keyboard operation, and ARIA attributes.
3. `packages/design-tokens/src/contrast.ts` reports zero AA failures for every token pair consumed by primitives in every documented state.
4. Playwright gallery suite passes on desktop (1440), tablet (768), and mobile (390) projects.
5. Accessibility suite reports zero critical or serious issues on every gallery page.
6. TypeScript strict mode compiles with no errors; no `any` or `unknown` in primitive prop types.
7. Bundle boundary test: no `apps/*` import from `packages/ui-foundation`; no domain identifier appears in the primitives package.
8. `docs/governance/phase-5-requirements-traceability.md` records the evidence; `docs/STATUS.md` and `docs/governance/change-log.md` updated.

## Validation commands

```bash
git status --short
git diff --check
node ./node_modules/vitest/vitest.mjs run packages/ui-foundation
node ./node_modules/vitest/vitest.mjs run packages/design-tokens
node ./node_modules/@playwright/test/cli.js test --config playwright.p05-iss-003.config.ts
```

## Rollback

- Revert `packages/ui-foundation/src/primitives/*` additions and the gallery routes.
- Revert `packages/ui-foundation/src/index.ts` re-export additions.
- Revert token additions (none expected; primitives consume existing tokens).
- Revert traceability and STATUS updates.
- Preserve change-log evidence of the attempted execution and reason for rollback.

## Risks

- Scope creep from re-implementing behavior that a small headless library would give for free. Mitigation: keep the initial pass minimal; defer library adoption to a separate ADR.
- Motion regressions on reduced-motion. Mitigation: reduced-motion Playwright projects mandatory.
- Focus-trap complexity for Dialog, Drawer, Menu, Popover, Combobox. Mitigation: shared `useFocusTrap` hook with unit tests before any consumer uses it.
- Over-large gallery bundle. Mitigation: dynamic imports per primitive route.

## Decisions trail

- docs/governance/decision-register.md (`DEC-P05-MKT-005`)
- docs/governance/change-log.md
- docs/design/design-system-specification.md
- docs/design/phase-5-reusable-design-system-foundation.md

## Completion evidence

P05-ISS-003 closes only when acceptance criteria are met and traceability/status records are updated with exact command and artifact evidence. Evidence includes: unit test totals, Playwright run summary, axe-core report summary, contrast audit summary, and boundary-test output.
