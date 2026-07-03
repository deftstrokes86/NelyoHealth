import { tokenCssVariableName, tokens } from "./tokens.js";

const cssVar = (category: string, name: string) => `var(${tokenCssVariableName(category, name)})`;

export const nelyoTailwindTheme = {
  screens: {
    mobile: String(tokens.breakpoint.mobile.value),
    phablet: String(tokens.breakpoint.phablet.value),
    mobileWide: String(tokens.breakpoint.mobileWide.value),
    tablet: String(tokens.breakpoint.tablet.value),
    laptop: String(tokens.breakpoint.laptop.value),
    desktop: String(tokens.breakpoint.desktop.value),
    desktopWide: String(tokens.breakpoint.desktopWide.value)
  },
  fontFamily: {
    display: [cssVar("typography", "family-display")],
    sans: [cssVar("typography", "family-body")],
    mono: [cssVar("typography", "family-mono")]
  },
  fontSize: {
    xs: [cssVar("typography", "size-xs"), { lineHeight: cssVar("typography", "line-body") }],
    sm: [cssVar("typography", "size-sm"), { lineHeight: cssVar("typography", "line-body") }],
    base: [cssVar("typography", "size-md"), { lineHeight: cssVar("typography", "line-body") }],
    lg: [cssVar("typography", "size-lg"), { lineHeight: cssVar("typography", "line-body") }],
    xl: [cssVar("typography", "size-xl"), { lineHeight: cssVar("typography", "line-tight") }],
    "2xl": [cssVar("typography", "size-2xl"), { lineHeight: cssVar("typography", "line-tight") }],
    "3xl": [cssVar("typography", "size-3xl"), { lineHeight: cssVar("typography", "line-tight") }],
    "4xl": [cssVar("typography", "size-4xl"), { lineHeight: cssVar("typography", "line-tight") }]
  },
  colors: {
    nh: {
      bg: cssVar("color", "background"),
      surface: cssVar("color", "surface"),
      raised: cssVar("color", "surface-raised"),
      muted: cssVar("color", "surface-muted"),
      text: cssVar("color", "text"),
      textMuted: cssVar("color", "text-muted"),
      border: cssVar("color", "border"),
      borderStrong: cssVar("color", "border-strong"),
      action: cssVar("color", "action"),
      brand: {
        100: cssVar("color", "brand-100"),
        500: cssVar("color", "brand-500"),
        700: cssVar("color", "brand-700"),
        900: cssVar("color", "brand-900")
      },
      status: {
        success: cssVar("color", "status-success-fg"),
        warning: cssVar("color", "status-warning-fg"),
        danger: cssVar("color", "status-danger-fg"),
        info: cssVar("color", "status-info-fg")
      }
    }
  },
  spacing: {
    0: cssVar("spacing", "space-0"),
    px: cssVar("spacing", "space-px"),
    1: cssVar("spacing", "space-1"),
    1.5: cssVar("spacing", "space-1-5"),
    2: cssVar("spacing", "space-2"),
    2.5: cssVar("spacing", "space-2-5"),
    3: cssVar("spacing", "space-3"),
    3.5: cssVar("spacing", "space-3-5"),
    4: cssVar("spacing", "space-4"),
    5: cssVar("spacing", "space-5"),
    6: cssVar("spacing", "space-6"),
    7: cssVar("spacing", "space-7"),
    8: cssVar("spacing", "space-8"),
    9: cssVar("spacing", "space-9"),
    10: cssVar("spacing", "space-10"),
    11: cssVar("spacing", "space-11"),
    12: cssVar("spacing", "space-12")
  },
  borderRadius: {
    none: cssVar("radius", "none"),
    xs: cssVar("radius", "xs"),
    sm: cssVar("radius", "sm"),
    md: cssVar("radius", "md"),
    lg: cssVar("radius", "lg"),
    xl: cssVar("radius", "xl"),
    pill: cssVar("radius", "pill")
  },
  boxShadow: {
    nh0: cssVar("shadow", "none"),
    nh1: cssVar("shadow", "xs"),
    nh2: cssVar("shadow", "sm"),
    nh3: cssVar("shadow", "md"),
    nh4: cssVar("shadow", "lg"),
    nh5: cssVar("shadow", "xl"),
    nhInset: cssVar("shadow", "inset"),
    nhFocus: cssVar("shadow", "focus")
  },
  maxWidth: {
    content: cssVar("grid", "max-content"),
    reading: cssVar("grid", "max-reading")
  },
  transitionDuration: {
    fast: cssVar("motion", "duration-fast"),
    standard: cssVar("motion", "duration-standard"),
    slow: cssVar("motion", "duration-slow"),
    page: cssVar("motion", "duration-page")
  },
  transitionTimingFunction: {
    standard: cssVar("motion", "ease-standard"),
    emphasized: cssVar("motion", "ease-emphasized"),
    entrance: cssVar("motion", "ease-entrance"),
    exit: cssVar("motion", "ease-exit")
  }
} as const;

export const nelyoTailwindRecipes = {
  button: {
    base: [
      "inline-flex items-center justify-center whitespace-nowrap",
      "rounded-[var(--nh-button-radius)] border",
      "text-[length:var(--nh-button-font-size)] font-semibold",
      "min-h-[var(--nh-button-height-md)] px-[var(--nh-button-padding-x-md)]",
      "transition-all duration-[var(--nh-motion-duration-fast)] ease-[var(--nh-motion-ease-standard)]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nh-color-focus-ring)] focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-[var(--nh-button-disabled-opacity)]"
    ].join(" "),
    variant: {
      primary:
        "bg-[var(--nh-button-primary-bg)] text-[var(--nh-button-primary-fg)] border-transparent hover:bg-[var(--nh-button-primary-hover-bg)]",
      secondary:
        "bg-[var(--nh-button-secondary-bg)] text-[var(--nh-button-secondary-fg)] border-[var(--nh-button-secondary-border)]",
      tertiary:
        "bg-[var(--nh-button-tertiary-bg)] text-[var(--nh-button-tertiary-fg)] border-transparent hover:bg-[var(--nh-button-ghost-bg-hover)]",
      danger:
        "bg-[var(--nh-button-danger-bg)] text-[var(--nh-button-danger-fg)] border-transparent"
    },
    size: {
      sm: "min-h-[var(--nh-button-height-sm)] px-[var(--nh-button-padding-x-sm)]",
      md: "min-h-[var(--nh-button-height-md)] px-[var(--nh-button-padding-x-md)]",
      lg: "min-h-[var(--nh-button-height-lg)] px-[var(--nh-button-padding-x-lg)]"
    }
  },
  card: {
    base: [
      "rounded-[var(--nh-card-radius)] border border-[var(--nh-card-base-border)]",
      "bg-[var(--nh-card-base-bg)] p-[var(--nh-card-padding-md)] text-[var(--nh-color-text)]",
      "shadow-[var(--nh-card-base-shadow)]"
    ].join(" "),
    variant: {
      default: "",
      raised: "shadow-[var(--nh-card-raised-shadow)]",
      interactive:
        "transition-shadow duration-[var(--nh-motion-duration-standard)] ease-[var(--nh-motion-ease-standard)] hover:shadow-[var(--nh-card-interactive-hover-shadow)]",
      muted: "bg-[var(--nh-card-muted-bg)]",
      critical: "border-[var(--nh-card-critical-border)]"
    }
  },
  formControl: {
    label:
      "text-[length:var(--nh-form-control-label-size)] font-[var(--nh-form-control-label-weight)] text-[var(--nh-color-text)]",
    input: [
      "w-full min-h-[var(--nh-form-control-height)] rounded-[var(--nh-form-control-radius)]",
      "border border-[var(--nh-form-control-input-border)] bg-[var(--nh-form-control-input-bg)] text-[var(--nh-form-control-input-fg)]",
      "px-[var(--nh-form-control-padding-x)] py-[var(--nh-form-control-padding-y)]",
      "placeholder:text-[var(--nh-form-control-input-placeholder)]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nh-form-control-input-focus-ring)] focus-visible:ring-offset-2",
      "disabled:bg-[var(--nh-form-control-disabled-bg)] disabled:text-[var(--nh-form-control-disabled-fg)]"
    ].join(" "),
    textarea: "min-h-[120px] resize-y",
    helperText: "text-[length:var(--nh-form-control-hint-size)] text-[var(--nh-color-text-muted)]",
    state: {
      error: "border-[var(--nh-form-control-input-error-border)]",
      success: "border-[var(--nh-form-control-input-success-border)]"
    }
  },
  navigation: {
    container: [
      "h-[var(--nh-navigation-height-header-mobile)] tablet:h-[var(--nh-navigation-height-header)]",
      "bg-[var(--nh-navigation-surface-bg)] border-b border-[var(--nh-navigation-surface-border)]",
      "px-4 tablet:px-6"
    ].join(" "),
    item: [
      "inline-flex items-center min-h-[var(--nh-navigation-item-height)] rounded-[var(--nh-navigation-item-radius)]",
      "px-[var(--nh-navigation-item-padding-x)] text-[var(--nh-navigation-item-fg)]",
      "transition-colors duration-[var(--nh-motion-duration-fast)] ease-[var(--nh-motion-ease-standard)]",
      "hover:bg-[var(--nh-navigation-item-hover-bg)]"
    ].join(" "),
    itemActive:
      "bg-[var(--nh-navigation-item-active-bg)] text-[var(--nh-navigation-item-active-fg)] hover:bg-[var(--nh-navigation-item-active-bg)]"
  },
  badge: {
    base: [
      "inline-flex items-center gap-1 rounded-[var(--nh-badge-radius)]",
      "px-[var(--nh-badge-padding-x)] py-[var(--nh-badge-padding-y)]",
      "text-[length:var(--nh-badge-font-size)] font-[var(--nh-badge-font-weight)]"
    ].join(" "),
    variant: {
      neutral: "bg-[var(--nh-badge-neutral-bg)] text-[var(--nh-badge-neutral-fg)]",
      info: "bg-[var(--nh-badge-info-bg)] text-[var(--nh-badge-info-fg)]",
      success: "bg-[var(--nh-badge-success-bg)] text-[var(--nh-badge-success-fg)]",
      warning: "bg-[var(--nh-badge-warning-bg)] text-[var(--nh-badge-warning-fg)]",
      danger: "bg-[var(--nh-badge-danger-bg)] text-[var(--nh-badge-danger-fg)]"
    }
  },
  icon: {
    base: "inline-block align-[var(--nh-icon-align-offset)] shrink-0",
    size: {
      xs: "size-[var(--nh-icon-size-xs)]",
      sm: "size-[var(--nh-icon-size-sm)]",
      md: "size-[var(--nh-icon-size-md)]",
      lg: "size-[var(--nh-icon-size-lg)]",
      xl: "size-[var(--nh-icon-size-xl)]"
    }
  }
} as const;
