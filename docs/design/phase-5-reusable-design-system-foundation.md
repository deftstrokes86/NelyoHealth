# Phase 5 Reusable Design System Foundation

## Status

- Scope: reusable design-system foundations for all platform pages.
- Homepage redesign: explicitly out of scope.
- Theme strategy: mobile-first light theme foundation with tokenized extensibility.
- Compliance target: WCAG 2.2 AA for text contrast and interactive focus behavior.

## Visual Direction

- Direction ID: `VIS-DIR-002`.
- Name: `Precision Calm`.
- Aesthetic: premium healthcare clarity inspired by Stripe, Linear, Apple, Headway, and Candid Health.
- Principles:
  - calm contrast with decisive hierarchy,
  - minimal but intentional depth,
  - restrained motion and safety-immediate transitions,
  - consistent reusable primitives over one-off page styles.

## Reusable Token Categories

The token source of truth is [packages/design-tokens/src/tokens.ts](packages/design-tokens/src/tokens.ts).

- Color palette: primitives plus semantic aliases for surfaces, text, borders, action, focus, and status.
- Typography scale: display/body/mono families, size scale, line heights, weights, and tracking.
- Elevation system: `elevation.none`, `hairline`, `sm`, `md`, `lg`.
- Shadows: `shadow.none` through `shadow.xl`, including `shadow.inset` and `shadow.focus`.
- Border radius system: `none`, `xs`, `sm`, `md`, `lg`, `xl`, `pill`.
- Grid system: mobile/tablet/desktop columns, gutters, margins, and max widths.
- Responsive breakpoints: `mobile`, `phablet`, `mobileWide`, `tablet`, `laptop`, `desktop`, `desktopWide`.
- Icon guidelines tokens: icon size set, stroke width, baseline offset, decorative opacity.
- Motion guidelines tokens: durations, easings, stagger, profile set, and movement distances.
- Spacing scale: `space-0` through `space-10`.
- Status colors: semantic foreground/background tokens for success, warning, danger, and info.

## Component-Level Reusable Tokens

- Button variants:
  - variants: primary, secondary, tertiary, danger,
  - sizes: sm, md, lg,
  - states: default, hover, focus-visible, disabled.
- Card variants:
  - variants: default, raised, interactive, muted, critical,
  - shared radius/padding/background/border/shadow tokens.
- Form controls:
  - unified label/input/hint sizing,
  - default/focus/error/success/disabled token support,
  - control height and spacing normalized.
- Navigation styles:
  - header heights mobile and tablet-plus,
  - nav item dimensions and active/hover state tokens.
- Badge styles:
  - variants: neutral, info, success, warning, danger,
  - consistent shape, typography, and spacing.

## Tailwind Integration

Tailwind-compatible reusable exports are provided by:

- [packages/design-tokens/src/tailwind.ts](packages/design-tokens/src/tailwind.ts)
- `nelyoTailwindTheme` for `theme.extend` mapping.
- `nelyoTailwindRecipes` for component recipe class composition.

Recommended app-level pattern:

1. import token CSS variables from `@nelyohealth/design-tokens/tokens.css`;
2. spread `nelyoTailwindTheme` into app `theme.extend`;
3. consume `nelyoTailwindRecipes` in shared UI wrappers to avoid duplicated classes.

## Accessibility and WCAG AA

- Contrast checks are enforced in [packages/design-tokens/src/contrast.ts](packages/design-tokens/src/contrast.ts).
- Required semantic pairs include text/surface and all status foreground-background pairs.
- Focus visibility is tokenized through `color.focus-ring` and `shadow.focus`.
- Minimum touch target remains tokenized at `size-touch = 44px`.
- Reduced motion support is preserved via profile tokens and existing reduced-motion media handling in shared UI CSS.

## Motion Guidelines

- Use `duration-fast` for micro feedback.
- Use `duration-standard` for component enter/update.
- Use `duration-page` only for page-level transitions and keep transitions interruptible.
- Use `duration-safety` for urgent safety state changes.
- Respect motion profiles from shared motion provider; reduce to `profile-reduced` or `profile-none` when user preference is set.

## Icon Guidelines

- Use outlined icons with tokenized stroke widths.
- Keep decorative icons below body text contrast importance; never use icon color as the only status signal.
- Pair status icons with visible text labels for accessibility.
- Keep icon sizes aligned to token slots and avoid arbitrary px values.

## Notes

- This foundation standardizes reusable values and variants; it does not claim final brand signoff for production launch.
- All tokens are centralized to keep future web and mobile extensions aligned.
