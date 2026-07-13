# Marketing Visual Language

## Document Control

| Field | Value |
|---|---|
| Version | 0.1 |
| Status | DRAFT-FOR-DESIGN-CONTENT-ACCESSIBILITY-REVIEW |
| Effective date | NOT EFFECTIVE FOR PILOT UNTIL DESIGN AND ACCESSIBILITY OWNER APPROVAL |
| Owner | Design Owner |
| Required reviewers | Product, Design, Content, Accessibility, Privacy |
| Related decisions | `DEC-P05-MKT-002`, `DEC-P05-MKT-003`, `DEC-P05-MKT-006`, `DEC-P05-MKT-007` |
| Extends | `docs/design/brand-and-visual-direction.md` `VIS-DIR-002 Warm Care Grid` |
| Scope | Public marketing surface only; operational and clinical surfaces retain shell-foundation defaults. |
| Non-implementation notice | This is a design specification. No component, page, or content ships from this document alone. |

## Intent

The marketing surface is where NelyoHealth first earns trust. It has to read as a serious healthcare platform, not a consumer wellness brand, and it has to do that in both light and dark themes without asking the reader to hunt for information. Everything below is written to prevent the platform's marketing pages from drifting toward the anti-patterns rejected by `VIS-DIR-002` while still allowing an editorial voice.

## Seven Visual Pillars

1. **Editorial hierarchy.** A calm display scale — not a shouting one. Headlines set expectations; body sets the case. Fluid ramps hold their measure across mobile, tablet, and desktop without breaking the reading rhythm.
2. **Bespoke visual language.** Illustrations, not stock. Line-forward, tokenized fills, no realistic faces until photography approval is recorded. Culturally appropriate for a Nigerian-and-diaspora audience, no stereotype markers.
3. **Story-driven layouts.** Each section is a single idea with a single supporting visual. Eyebrow → headline → body → optional illustration. No accordions of unrelated feature bullets on the homepage.
4. **Purposeful motion.** Motion serves comprehension, not delight. Hero elements settle in; scroll reveals confirm arrival; state cross-fades communicate the transition. Emergency surfaces get none of it.
5. **Trust surfaces.** Privacy, safety, regulatory, and clinical assertions live in components with restrained styling — no glossy badges, no unverified claims. Every trust claim maps to an approved content entry.
6. **Segment-aware narratives.** The Home hero speaks to everyone; segment landing pages inherit the layout system but change eyebrow, tone, and illustration. The visual chassis is shared; the message is not.
7. **Premium interaction finish.** Focus rings, hover states, and control affordances are consistent, WCAG 2.2 AA compliant, and tokenized. Nothing on the marketing surface should feel undesigned when a keyboard user tabs through it.

## Type System (Editorial Extension)

All editorial sizes use `clamp()` so a mobile-first ramp scales up to tablet and desktop without breakpoint-hopping. Family is `family-display` (Fraunces) for display, `family-body` (Atkinson Hyperlegible) for prose. Font loading is CDN-hosted per `DEC-P05-MKT-007` — see the Privacy note below.

| Token | Value | Purpose |
|---|---|---|
| `marketing.display-2xl` | `clamp(2.5rem, 4vw + 1.5rem, 4.5rem)` | Hero headline |
| `marketing.display-xl`  | `clamp(2rem, 3vw + 1.25rem, 3.5rem)`   | Section-lead headline |
| `marketing.display-lg`  | `clamp(1.75rem, 2.5vw + 1rem, 2.75rem)`| Section heading |
| `marketing.display-md`  | `clamp(1.5rem, 2vw + 0.75rem, 2.25rem)`| Subsection heading |
| `marketing.display-sm`  | `clamp(1.25rem, 1.5vw + 0.5rem, 1.75rem)`| Minor heading, callouts |
| `marketing.prose-lg`    | `1.25rem`                              | Lead paragraph |
| `marketing.prose-md`    | `1.125rem`                             | Default body |
| `marketing.prose-sm`    | `1rem`                                 | Compact body |
| `marketing.eyebrow-size`| `0.8125rem` (with `0.16em` tracking, uppercase) | Section eyebrows |

Line height for display is `1.08`, prose is `1.7`. Display tracking is `-0.02em`. Display weight is `600`; body remains regular.

## Layout System

| Token | Value | Purpose |
|---|---|---|
| `marketing.content-narrow`    | `42rem`  | Testimonial, quote, focused CTA columns |
| `marketing.content-default`   | `64rem`  | Standard story section |
| `marketing.content-wide`      | `80rem`  | Hero and proof strip |
| `marketing.content-editorial` | `72ch`   | Prose paragraphs |
| `marketing.hero-y-{sm,md,lg}` | `3 / 5 / 7 rem` | Hero vertical padding by breakpoint |
| `marketing.section-y-{sm,md,lg}` | `2.5 / 3.5 / 5 rem` | Section vertical padding |
| `marketing.story-gap-{sm,md,lg}` | `1.5 / 2.5 / 3.5 rem` | Story block internal gap |

Hero, story, and prose recipes are exposed on `nelyoTailwindRecipes.editorial`.

## Hero Variants

All five variants share the same chassis (`nelyoTailwindRecipes.editorial.hero` + `heroHeading`). What changes is illustration slot, eyebrow tone, and the segment-aware body. No variant is a special component.

| Variant | Eyebrow | Illustration slot ID | Motion profile | Notes |
|---|---|---|---|---|
| `universal` | "One connected care platform" | `hero-universal-network` | `motion-hero-enter` | Home page. Broad audience. |
| `patient` | "For patients and families" | `hero-patient-journey` | `motion-hero-enter` | Individual patient landing. |
| `family-diaspora` | "Care that crosses borders" | `hero-family-diaspora-bridge` | `motion-hero-enter` | Sponsorship-first narrative. |
| `provider` | "For doctors and clinics" | `hero-provider-clinic` | `motion-hero-enter` | Prescriptive, operational tone. |
| `organization` | "For employers, HMOs, and hospitals" | `hero-organization-partnership` | `motion-hero-enter` | Trust and scale focus. |

## Story Pattern

A story section is `eyebrow → headline → body → illustration slot`. Illustration can be `left`, `right`, or `center`. Mobile stacks eyebrow-headline-body-illustration. Tablet and desktop can flow illustration to the side per the `story-gap-*` grid.

## Trust and Proof Patterns

- **TrustBar** (`icon + short-title + detail`, three items on tablet+ / stacked on mobile) presents privacy, verified-clinician, and coordination assertions. Copy must resolve from approved content entries; the icon carries no status meaning.
- **ProofStrip** presents safe metric claims. Forbidden wording ("best doctors", "guaranteed", "fully licensed", "nationwide service", "instant results", "cheapest care", "complete privacy", "zero risk") is blocked by the voice/tone lint in `packages/content-registry`.

## Motion Spec

Three named patterns, each with a reduced-motion equivalent. Duration and easing come from the token table; component code reads them via CSS variables or the `MarketingMotionProfile` records exported from `@nelyohealth/ui-foundation`.

| Pattern | Duration | Easing | Distance | Reduced-motion |
|---|---|---|---|---|
| `motion-hero-enter`   | 620 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | 24 px | 0 ms / 0 px |
| `motion-scroll-reveal`| 480 ms | `cubic-bezier(0.2, 0.8, 0.2, 1)`| 16 px | 0 ms / 0 px |
| `motion-cross-fade`   | 320 ms | `cubic-bezier(0.4, 0, 0.2, 1)`  | 0 px  | 60 ms cross-fade only |

Forbidden motion contexts:

- No decorative motion on emergency surfaces. Emergency components use `SAFETY-IMMEDIATE` (40 ms, no distance).
- No parallax or scroll-jack on any marketing surface.
- No auto-play carousel motion on trust or clinical claim components.

Every marketing motion respects the user's `prefers-reduced-motion` — enforced at the `MotionProvider` level and by test.

## Illustration Brief

- Line-forward SVG, tokenized fills, single stroke width (`marketing.illustration-stroke` = `1.75`).
- Fills use the `illustration-tone-*` variants — warm, cool, neutral, accent — so illustrations feel of-a-piece across the site and adapt in dark theme.
- Subject matter: care coordination, family connection, provider collaboration, secure records — never generic medical clip-art (no rod-of-Asclepius, no stethoscope-around-a-heart).
- No realistic faces until the photography approval decision is recorded.
- Nigerian and diaspora appropriate. Avoid stereotype signals (kente-print backgrounds, tribal-mark shorthand, "African child holding a phone" tropes). Prefer domestic and clinical settings that read as competent and modern.
- Illustrations must render at both `data-theme="light"` and `data-theme="dark"`. Line color inherits `currentColor`; fills use tokens so dark theme swaps them automatically.
- Corner radius `marketing.illustration-radius` = `1.5rem`. Shadow `marketing.illustration-shadow` on the container, never inside the SVG.

## Dark Theme

Every semantic color token has both a light and a dark value. `[data-theme="dark"]` on `<html>` toggles the palette. When no explicit theme is set, `prefers-color-scheme: dark` activates the dark palette via `:root:not([data-theme="light"])`.

Palette summary (dark values):

| Semantic | Light | Dark |
|---|---|---|
| `background`      | `#FFFDF8` | `#0B1A19` |
| `surface`         | `#F8F2E7` | `#122927` |
| `surface-raised`  | `#FFFFFF` | `#1A3936` |
| `surface-muted`   | `#F6F8F7` | `#0F2321` |
| `border`          | `#B8CAB9` | `#2B4A46` |
| `border-strong`   | `#8DA49F` | `#4D6661` |
| `text`            | `#102321` | `#F5EEE0` |
| `text-muted`      | `#4D6661` | `#B8CAB9` |
| `action`          | `#0D5E57` | `#2AA396` |
| `danger`          | `#7A1F17` | `#F0827A` |
| `focus-ring`      | `#1F4FB8` | `#7BB0F0` |
| `status-success-fg / bg` | `#1E5A39 / #E3F3EA` | `#7EE0A9 / #0F3421` |
| `status-warning-fg / bg` | `#7D4800 / #FFF1D8` | `#F5C15C / #4A2E00` |
| `status-danger-fg / bg`  | `#7C211A / #FDE6E4` | `#F0827A / #3E1512` |
| `status-info-fg / bg`    | `#1F4F70 / #E6F2FA` | `#7BB0F0 / #0F2740` |

## Contrast Audit

WCAG 2.2 AA requires 4.5:1 for normal text. Every pair listed below passes both light and dark. Enforcement lives in `packages/design-tokens/src/contrast.test.ts`, which now runs `evaluateContrast("light")` and `evaluateContrast("dark")` and fails CI if any pair drops.

| Pair | Light theme | Dark theme |
|---|---|---|
| `text` / `background` | pass | pass |
| `text` / `surface` | pass | pass |
| `text` / `surface-raised` | pass | pass |
| `text-muted` / `background` | pass | pass |
| `action` / `background` | pass | pass |
| `danger` / `background` | pass | pass |
| `status-success-fg` / `status-success-bg` | pass | pass |
| `status-warning-fg` / `status-warning-bg` | pass | pass |
| `status-danger-fg` / `status-danger-bg` | pass | pass |
| `status-info-fg` / `status-info-bg` | pass | pass |

Any new pair added to the marketing surface must be added to `requiredContrastPairs` in `contrast.ts` before it ships.

## Font Strategy and Privacy Note

Fonts are declared as tokenized families (`family-display` = Fraunces, `family-body` = Atkinson Hyperlegible). Loading is CDN-hosted (`fonts.googleapis.com` / `fonts.gstatic.com`) per `DEC-P05-MKT-007`. This creates a coherence gap between the platform's privacy copy and the plumbing: Google Fonts receives visitor IPs on every page load. Privacy Owner review is required before pilot. A one-issue migration to self-hosted `next/font/google` remains recorded as the reverse path if the decision changes.

## Anti-Patterns (reaffirmed)

Glassmorphism, neon gradients, decorative medical symbols, emoji-as-icons, color-only status, stock imagery implying unverified providers, decorative motion on emergency surfaces, low-contrast pastel text, over-rounded controls, dashboard-wallpaper heroes, fake trust badges — all rejected on marketing surfaces.

## Traceability

- `docs/governance/decision-register.md` — `DEC-P05-MKT-002`, `DEC-P05-MKT-003`, `DEC-P05-MKT-006`, `DEC-P05-MKT-007`
- `docs/governance/phase-5-requirements-traceability.md` — `P05-MKT-REQ-001`, `P05-MKT-REQ-007`, `P05-MKT-REQ-008`
- `docs/design/brand-and-visual-direction.md` — `VIS-DIR-002 Warm Care Grid`
- `docs/design/phase-5-reusable-design-system-foundation.md` — marketing extension note
- `packages/design-tokens/src/tokens.ts` — `marketing.*` and semantic `color.*.dark`
- `packages/design-tokens/generated/tokens.css` — light + `[data-theme="dark"]` + `prefers-color-scheme` blocks
- `packages/ui-foundation/src/motion/marketing-profiles.ts` — hero-enter, scroll-reveal, cross-fade profiles
