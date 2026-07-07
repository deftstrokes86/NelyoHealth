# P05-MKT-001 Marketing Visual Language and Token Extension

## Objective

Establish the marketing-specific visual language on top of `VIS-DIR-002 Warm Care Grid` — editorial display typography scale, hero spacing scale, marketing max-widths, motion patterns for hero enter / scroll reveal / cross-fade, and a bespoke-illustration direction — so that the P05-MKT-002 marketing component library and the resulting marketing pages read as a world-class telemedicine surface without breaching the anti-pattern list.

## Existing context

- `docs/design/brand-and-visual-direction.md` proposes `VIS-DIR-002 Warm Care Grid` as the primary direction; anti-patterns explicitly rejected.
- `docs/design/phase-5-reusable-design-system-foundation.md` defines the reusable token surface — this issue extends it with marketing-only tokens without disturbing shell foundations.
- `packages/design-tokens/src/tokens.ts` and `packages/design-tokens/src/tailwind.ts` are the source of truth.
- `packages/ui-foundation/src/motion/` provides motion profiles used by shells.
- `DEC-P05-MKT-002` anchors the visual language to VIS-DIR-002; `DEC-P05-MKT-003` mandates bespoke illustrations and forbids photography until a separate approval.

## Scope

- Extend `packages/design-tokens/src/tokens.ts` with:
  - Editorial display typography scale (`display-2xl`, `display-xl`, `display-lg`, `display-md`, `display-sm`) with size, line-height, tracking, weight — mobile-first with fluid clamp() ramps for tablet and desktop.
  - Editorial body scale (`prose-lg`, `prose-md`, `prose-sm`) for long-form sections.
  - Marketing spacing scale (`hero-y-*`, `section-y-*`, `story-gap-*`) that composes on top of existing spacing tokens.
  - Marketing max-widths (`content-narrow`, `content-default`, `content-wide`, `content-editorial`) for prose columns and hero blocks.
  - Motion pattern tokens: `motion-hero-enter`, `motion-scroll-reveal`, `motion-cross-fade`, each with reduced-motion equivalents.
  - Illustration tokens: `illustration-max-width`, `illustration-radius`, `illustration-shadow`, `illustration-tone-*`.
  - **Dark-theme palette** — full semantic pair coverage (background, surface, surface-raised, surface-muted, border, border-strong, text, text-muted, action, focus-ring, on-brand, on-accent, status-* variants) so every semantic token has both a light and dark value. Contrast-tested pairs for both themes. `[data-theme="dark"]` selector on `<html>` toggles the palette; `prefers-color-scheme: dark` provides the default when no user override is set.
  - **Font strategy** — the design-tokens package continues to declare the semantic families (`family-display: Fraunces`, `family-body: Atkinson Hyperlegible`). Actual font loading uses Google Fonts CDN (see `DEC-P05-MKT-007`) wired via the app-level `<link>` in `apps/patient-web/app/layout.tsx`.
- Update `packages/design-tokens/src/tailwind.ts` to expose the new tokens via `nelyoTailwindTheme` and add new recipes for editorial layouts.
- Add `packages/ui-foundation/src/motion/marketing-profiles.ts` with hero, scroll-reveal, and cross-fade profiles reusing the existing `MotionProvider`.
- Write `docs/design/marketing-visual-language.md`:
  - Visual pillars (editorial hierarchy, bespoke visual language, story-driven layouts, purposeful motion, trust surfaces, segment-aware narratives, premium interaction finish).
  - Concrete hero patterns for each variant (universal, patient, family/diaspora, provider, organization) — layout, type ramp, color, motion.
  - Story-section pattern (heading + eyebrow + body + optional illustration slot).
  - Trust bar / proof strip pattern and safe-wording rules.
  - Motion spec: durations, easings, reduced-motion equivalents, forbidden motion contexts (emergency = no decorative motion).
  - Illustration brief: subject matter, tone, cultural sensitivity, "Nigerian and diaspora appropriate without stereotype" guidance, forbidden imagery patterns.
  - Contrast audit table for new color pairs.
- Update `docs/design/brand-and-visual-direction.md` traceability to reference the new marketing extension.
- Update `docs/design/phase-5-reusable-design-system-foundation.md` to add a "Marketing extension" note pointing at the new doc.

## Non-goals

- No component implementation — belongs to P05-MKT-002.
- No content authoring — belongs to P05-MKT-003.
- No photography direction — forbidden by `DEC-P05-MKT-003` until a separate approval.
- No new fonts installed — Fraunces and Atkinson Hyperlegible stacks are already tokenized; live-hosted font files remain deferred.
- No animation library added.

## Source documents

- AGENTS.md
- docs/STATUS.md
- docs/governance/decision-register.md (`DEC-P05-MKT-002`, `DEC-P05-MKT-003`)
- docs/design/brand-and-visual-direction.md
- docs/design/phase-5-reusable-design-system-foundation.md
- docs/design/experience-principles.md
- docs/design/motion-system.md
- docs/design/motion-requirements.md
- docs/design/visual-quality-bar.md
- docs/content/brand.md
- NelyoHealth_Build_Implementation_Map_for_Codex.md (Phase 5)

## Locked rules

- Anti-patterns rejected: glassmorphism, neon gradients, decorative medical symbols, emoji as icons, color-only status, stock imagery implying unverified providers, decorative motion on emergency screens.
- Emergency surfaces use `SAFETY-IMMEDIATE` motion profile — no decorative marketing motion.
- WCAG 2.2 AA contrast required for every new pair.
- Reduced-motion equivalents mandatory for every new motion pattern.
- All colors sourced from existing primitives; new semantic aliases only.
- Bespoke illustrations only; no stock, no photography, no emoji symbols.

## Files expected to be affected

- packages/design-tokens/src/tokens.ts (extend)
- packages/design-tokens/src/tailwind.ts (extend)
- packages/design-tokens/src/tokens.test.ts (extend to cover new tokens)
- packages/design-tokens/src/contrast.test.ts (extend for new pairs)
- packages/ui-foundation/src/motion/marketing-profiles.ts (new)
- packages/ui-foundation/src/index.ts (add re-exports)
- docs/design/marketing-visual-language.md (new)
- docs/design/brand-and-visual-direction.md (traceability update)
- docs/design/phase-5-reusable-design-system-foundation.md (extension note)
- docs/governance/phase-5-requirements-traceability.md (update `P05-MKT-REQ-001`, `P05-MKT-REQ-007`)
- docs/governance/change-log.md (append)
- docs/STATUS.md (update)

## Dependency changes

None. Fluid type ramps use CSS `clamp()`; motion uses the existing `MotionProvider`; no animation library.

## Architecture impact

- New tokens live in the same token file, category `marketing`, so token drift checks continue to work.
- Marketing motion profiles reuse `MotionProvider` and share the reduced-motion policy.
- No boundary changes.

## Data-model impact

None.

## API impact

None.

## UI and browser impact

- No visible UI changes yet — this issue produces tokens and a doc, not components.
- Contrast test expands to cover new pairs.

## Privacy and security

None — pure design system extension.

## Acceptance criteria

1. `packages/design-tokens/src/tokens.ts` exports the new marketing token categories; `pnpm tokens:check` (or the offline equivalent) passes.
2. `packages/design-tokens/src/tailwind.ts` exposes the new tokens through `nelyoTailwindTheme`.
3. Contrast tests report zero AA failures across every new pair, **for both light and dark themes**.
4. `docs/design/marketing-visual-language.md` exists and covers the seven visual pillars, five hero variants, story pattern, trust pattern, motion spec, illustration brief, and contrast audit **for both themes**.
5. Reduced-motion tokens exist for every new motion pattern.
6. Every semantic color token has both a light and dark value; the `[data-theme="dark"]` selector on `<html>` toggles the palette; the palette follows `prefers-color-scheme: dark` when no user override is set.
7. Governance traceability and STATUS updated.

## Validation commands

```bash
git status --short
git diff --check
node ./node_modules/vitest/vitest.mjs run packages/design-tokens
```

## Rollback

- Revert token additions and marketing profile file.
- Revert the marketing visual language doc.
- Revert traceability and STATUS updates.

## Risks

- Type ramp fluid math needs viewport calibration. Mitigation: snapshot at 390/768/1024/1440/1920 in a docs preview.
- Over-saturating warm surfaces damages clinical seriousness. Mitigation: reserve warm surfaces for hero and story; keep operational surfaces neutral.
- Reduced-motion equivalents forgotten. Mitigation: token schema requires both `default` and `reduced` sub-tokens for each motion pattern; test enforces presence.

## Decisions trail

- docs/governance/decision-register.md (`DEC-P05-MKT-002`, `DEC-P05-MKT-003`)
- docs/governance/change-log.md
- docs/design/brand-and-visual-direction.md
- docs/design/phase-5-reusable-design-system-foundation.md

## Completion evidence

P05-MKT-001 closes only when acceptance criteria are met and traceability/status records are updated with exact command and artifact evidence.
