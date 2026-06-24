# P00-14A Design Tokens

## Document Control

| Field | Value |
|---|---|
| Version | 0.1 |
| Status | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL |
| Effective date | NOT EFFECTIVE FOR PRODUCTION UNTIL APPROVED |
| Owner | Design Owner + Architecture Owner |
| Required reviewers | Accessibility, Product, Privacy, Security, Performance, Frontend |
| Approval authority | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance owners |
| Related decisions | REQ-DES-004 through REQ-DES-016 |
| Related open questions | OQ-00-634 through OQ-00-655 |
| Scope | Proposed design and content decisions for P00-14A only |
| Non-implementation notice | This does not constitute implemented UI, accessibility conformance, clinical-content approval, legal/privacy/financial approval, final visual assets, or dependency/font installation. |
| Change control | Changes require decision/open-question updates, owner review, and orchestration acceptance before production use. |
## Token Architecture

Use primitive tokens, semantic tokens, and component aliases where required. Components must use semantic tokens rather than raw values. Values below are proposed only and require design, accessibility, product, privacy, security, and performance review.

## Color Tokens

| Token ID | Name | Value | Purpose | Permitted foreground or background use | Contrast result | Theme | Approval status |
|---|---|---|---|---|---|---|---|
| TOK-COL-001 | brand.primary | #0F5F5C | Primary brand and active state | Background with white or foreground on light neutral | Preliminary contrast check required; target pass for white text | light | REQUIRES_APPROVAL |
| TOK-COL-002 | brand.primary.strong | #083F3D | High-emphasis brand | White foreground | Preliminary pass expected; formal calc required | light | REQUIRES_APPROVAL |
| TOK-COL-003 | accent.cobalt | #2563EB | Focus and action accent | White on accent, accent on white | Formal validation required | light | REQUIRES_APPROVAL |
| TOK-COL-004 | neutral.ink | #172124 | Primary text | On surface backgrounds | Preliminary pass expected | light | REQUIRES_APPROVAL |
| TOK-COL-005 | neutral.secondary | #536165 | Secondary text | On light surfaces only | Requires size/context validation | light | REQUIRES_APPROVAL |
| TOK-COL-006 | surface.base | #FBFAF6 | Base surface | Dark text | Preliminary pass expected | light | REQUIRES_APPROVAL |
| TOK-COL-007 | surface.card | #FFFFFF | Card/elevated surface | Dark text | Preliminary pass expected | light | REQUIRES_APPROVAL |
| TOK-COL-008 | border.default | #D8DED9 | Borders and dividers | Not used as sole signal | Not applicable | light | REQUIRES_APPROVAL |
| TOK-COL-009 | focus.ring | #1D4ED8 | Focus outline | Outline only | Must be visible on all surfaces | light | REQUIRES_APPROVAL |
| TOK-COL-010 | link.default | #0B5CAD | Links | On light surfaces | Formal validation required | light | REQUIRES_APPROVAL |
| TOK-COL-011 | info | #1E6B9E | Informational state | Text/icon with label | Formal validation required | light | REQUIRES_APPROVAL |
| TOK-COL-012 | success | #137A4B | Success state | Text/icon with label | Formal validation required | light | REQUIRES_APPROVAL |
| TOK-COL-013 | warning | #9A5B00 | Warning state | Text/icon with label | Formal validation required | light | REQUIRES_APPROVAL |
| TOK-COL-014 | error | #B42318 | Error state | Text/icon with label | Formal validation required | light | REQUIRES_APPROVAL |
| TOK-COL-015 | urgent | #C2410C | Urgent state | Text/icon with label | Formal validation required | light | REQUIRES_APPROVAL |
| TOK-COL-016 | emergency | #991B1B | Emergency state | Text/icon with label | Formal validation required | light | REQUIRES_APPROVAL |
| TOK-COL-017 | clinical | #0E7490 | Clinical status | With label/pattern | Formal validation required | light | REQUIRES_APPROVAL |
| TOK-COL-018 | financial | #6750A4 | Financial status | With label and amount | Formal validation required | light | REQUIRES_APPROVAL |
| TOK-COL-019 | provider.locked | #6B4E16 | Provider locked state | With lock label | Formal validation required | light | REQUIRES_APPROVAL |
| TOK-COL-020 | disabled | #9AA4A6 | Disabled content | Not for important text | Requires validation | light | REQUIRES_APPROVAL |
| TOK-COL-021 | overlay | #0B1114CC | Overlay scrim | White foreground | Formal validation required | light | REQUIRES_APPROVAL |
| TOK-COL-022 | data.1 | #0F5F5C | Chart category | With pattern/label | Not color-only | light | REQUIRES_APPROVAL |
| TOK-COL-023 | data.2 | #2563EB | Chart category | With pattern/label | Not color-only | light | REQUIRES_APPROVAL |
| TOK-COL-024 | data.3 | #9A5B00 | Chart category | With pattern/label | Not color-only | light | REQUIRES_APPROVAL |
| TOK-COL-025 | data.4 | #B42318 | Chart category | With pattern/label | Not color-only | light | REQUIRES_APPROVAL |
| TOK-COL-026 | surface.muted | #F0EEE6 | Muted surface | Dark text only | Formal validation required | light | REQUIRES_APPROVAL |

## Proposed Contrast-Pair Matrix

| Pair | Result |
|---|---|
| neutral.ink on surface.base | Preliminary pass expected; formal WCAG calculation required. |
| white on brand.primary | Preliminary pass expected; formal WCAG calculation required. |
| white on emergency | Preliminary pass expected; formal WCAG calculation required. |
| warning on surface.base | Requires formal validation by text size and use. |
| disabled on surface.base | Must not carry critical meaning. |

## Typography Tokens

| Token ID | Name | Proposed value | Purpose | Requirement | Approval status |
|---|---|---|---|---|---|
| TOK-TYP-001 | font.ui | Proposed: Atkinson Hyperlegible or Source Sans 3 after licensing review | Primary UI font | Self-host preferred if licence/performance approved | REQUIRES_APPROVAL |
| TOK-TYP-002 | font.display | Proposed: Source Serif 4 or no display font after review | Optional editorial headings | Must not reduce clarity | REQUIRES_APPROVAL |
| TOK-TYP-003 | font.mono | Proposed: IBM Plex Mono or system mono after licensing review | Codes, IDs, ledger references | Use sparingly | REQUIRES_APPROVAL |
| TOK-TYP-004 | size.body | 16px proposed base | Body copy | Supports zoom and reflow | REQUIRES_APPROVAL |
| TOK-TYP-005 | size.caption | 13px minimum proposed | Caption/meta | Not for critical copy | REQUIRES_APPROVAL |
| TOK-TYP-006 | size.h1 | 40px desktop / 32px mobile proposed | Page hero heading | Responsive clamp later | REQUIRES_APPROVAL |
| TOK-TYP-007 | size.h2 | 30px desktop / 26px mobile proposed | Section heading | Responsive clamp later | REQUIRES_APPROVAL |
| TOK-TYP-008 | weight.regular | 400 | Body | Font-dependent | REQUIRES_APPROVAL |
| TOK-TYP-009 | weight.medium | 500 | Labels and emphasis | Font-dependent | REQUIRES_APPROVAL |
| TOK-TYP-010 | weight.semibold | 600 | Headings/actions | Font-dependent | REQUIRES_APPROVAL |
| TOK-TYP-011 | lineheight.body | 1.55 | Body readability | Formal review required | REQUIRES_APPROVAL |
| TOK-TYP-012 | measure.body | 65-75ch | Long-form copy | Adjust by context | REQUIRES_APPROVAL |

Fonts must not be downloaded in P00-14A. Font licensing and self-hosting remain Phase 1 approval dependencies.

## Other Tokens

| Token range | Category | Proposed values | Purpose | Approval status |
|---|---|---|---|---|
| TOK-SPC-001..009 | Spacing | 4, 8, 12, 16, 24, 32, 48, 64, 96px proposed scale | Layout rhythm | REQUIRES_APPROVAL |
| TOK-SIZ-001..008 | Sizing | 24, 32, 40, 44, 48, 56, 64, 80px proposed controls/targets | Touch and component sizing | REQUIRES_APPROVAL |
| TOK-RAD-001..005 | Radius | 4, 8, 12, 16, 24px proposed | Modest warmth without toy-like controls | REQUIRES_APPROVAL |
| TOK-SHD-001..005 | Shadow/elevation | none, hairline, raised, overlay, modal proposed | Depth without glassmorphism | REQUIRES_APPROVAL |
| TOK-Z-001..007 | Z-index | base, sticky, dropdown, drawer, modal, toast, emergency proposed | Predictable stacking | REQUIRES_APPROVAL |
| TOK-BRK-001..005 | Breakpoints | 360, 640, 768, 1024, 1280px proposed | Mobile/tablet/desktop strategy | REQUIRES_APPROVAL |
| TOK-MOT range defined in motion-system | Motion | instant, fast, standard, emphasized, complex, exit, delay, stagger, easings, springs, distances, scale proposed | Tokenized motion | REQUIRES_APPROVAL |

## Token Naming

Naming must support CSS custom properties, TypeScript token objects, Tailwind mapping if later approved, and future native mobile mapping. No implementation files are created in P00-14A.

