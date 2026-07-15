import type { DesignTokens, TokenAuditSummary } from "./types.js";
const d = (
  value: string | number,
  description: string,
  category = "scale",
  dark?: string
) => ({
  value,
  description,
  category,
  ...(dark ? { dark } : {})
});
export const visualDirection = {
  id: "VIS-DIR-002",
  name: "Warm Care Grid",
  intent:
    "Premium healthcare aesthetic inspired by Stripe, Linear, Apple, Headway, and Candid Health: restrained, trustworthy, and operationally clear."
} as const;
export const tokens = {
  color: {
    "neutral-0": d("#FFFFFF", "Pure white surface", "primitive"),
    "neutral-50": d("#F6F8F7", "App wash background", "primitive"),
    "neutral-100": d("#EEF2F1", "Subtle raised background", "primitive"),
    "neutral-200": d("#DCE5E3", "Soft border and dividers", "primitive"),
    "neutral-300": d("#C4D2CF", "Strong border", "primitive"),
    "neutral-500": d("#6A7D79", "Muted body text", "primitive"),
    "neutral-700": d("#324542", "Secondary ink", "primitive"),
    "neutral-900": d("#122927", "Primary ink", "primitive"),
    "brand-900": d("#0D474B", "Brand deep", "primitive"),
    "brand-700": d("#155E66", "Brand action", "primitive"),
    "brand-500": d("#1F7F8C", "Brand interactive", "primitive"),
    "brand-100": d("#D8EEF1", "Brand subtle surface", "primitive"),
    "accent-700": d("#1F4FB8", "Accent action", "primitive"),
    "accent-100": d("#DFE8FF", "Accent subtle surface", "primitive"),
    "ink-900": d("#102321", "Primary readable ink", "primitive"),
    "ink-700": d("#21423E", "Secondary ink", "primitive"),
    "ink-500": d("#496760", "Muted ink", "primitive"),
    "paper-000": d("#FFFDF8", "Warm paper surface", "primitive"),
    "paper-050": d("#F8F2E7", "Raised warm surface", "primitive"),
    "paper-100": d("#F0E3D1", "Subtle panel surface", "primitive"),
    "grid-100": d("#D9E2D6", "Care grid line", "primitive"),
    "grid-200": d("#B8CAB9", "Care grid divider", "primitive"),
    "teal-900": d("#073B37", "Deep care teal", "primitive"),
    "teal-700": d("#0D5E57", "Primary action teal", "primitive"),
    "teal-500": d("#16897F", "Interactive teal", "primitive"),
    "teal-100": d("#D7F2ED", "Light care teal", "primitive"),
    "amber-700": d("#9A5B00", "Warning amber text", "primitive"),
    "amber-300": d("#F5C15C", "Warning amber surface", "primitive"),
    "coral-700": d("#7A1F17", "Risk coral text", "primitive"),
    "coral-200": d("#F5B6A8", "Risk coral surface", "primitive"),
    "sky-700": d("#235C78", "Information sky text", "primitive"),
    "sky-100": d("#D7EBF4", "Information sky surface", "primitive"),
    "success-700": d("#23613D", "Success text", "primitive"),
    "success-100": d("#DFF1E5", "Success surface", "primitive"),
    "on-brand": d("#FFFFFF", "Text or icon on brand surfaces", "semantic", "#F5EEE0"),
    "on-accent": d("#FFFFFF", "Text or icon on accent surfaces", "semantic", "#FFFFFF"),
    "status-success-fg": d(
      "#1E5A39",
      "Success readable foreground",
      "semantic",
      "#7EE0A9"
    ),
    "status-success-bg": d("#E3F3EA", "Success background", "semantic", "#0F3421"),
    "status-warning-fg": d(
      "#7D4800",
      "Warning readable foreground",
      "semantic",
      "#F5C15C"
    ),
    "status-warning-bg": d("#FFF1D8", "Warning background", "semantic", "#4A2E00"),
    "status-danger-fg": d(
      "#7C211A",
      "Danger readable foreground",
      "semantic",
      "#F0827A"
    ),
    "status-danger-bg": d("#FDE6E4", "Danger background", "semantic", "#3E1512"),
    "status-info-fg": d("#1F4F70", "Info readable foreground", "semantic", "#7BB0F0"),
    "status-info-bg": d("#E6F2FA", "Info background", "semantic", "#0F2740"),
    "focus-ring": d("#1F4FB8", "Focus ring stroke", "semantic", "#7BB0F0"),
    background: d("#FFFDF8", "Application background", "semantic", "#0B1A19"),
    surface: d("#F8F2E7", "Primary surface", "semantic", "#122927"),
    "surface-raised": d("#FFFFFF", "Raised cards and panels", "semantic", "#1A3936"),
    "surface-muted": d("#F6F8F7", "Muted grouped sections", "semantic", "#0F2321"),
    border: d("#B8CAB9", "Accessible border", "semantic", "#2B4A46"),
    "border-strong": d("#8DA49F", "Strong border", "semantic", "#4D6661"),
    text: d("#102321", "Primary text", "semantic", "#F5EEE0"),
    "text-muted": d("#4D6661", "Muted text", "semantic", "#B8CAB9"),
    action: d("#0D5E57", "Primary action", "semantic", "#2AA396"),
    danger: d("#7A1F17", "Safety and destructive state", "semantic", "#F0827A")
  },
  typography: {
    "family-display": d(
      "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif",
      "Display stack — native OS UI font. Unified with body per user directive (2026-07-15) superseding DEC-P05-MKT-002 Fraunces choice.",
      "semantic"
    ),
    "family-body": d(
      "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif",
      "Body stack — native OS UI font. Unified with display per user directive (2026-07-15) superseding DEC-P05-MKT-002 Atkinson Hyperlegible choice.",
      "semantic"
    ),
    "family-mono": d(
      "IBM Plex Mono, SFMono-Regular, Consolas, monospace",
      "Operational IDs and diagnostic values",
      "semantic"
    ),
    "size-xs": d("0.75rem", "Caption"),
    "size-sm": d("0.875rem", "Small body"),
    "size-md": d("1rem", "Base body"),
    "size-lg": d("1.125rem", "Large body"),
    "size-xl": d("1.5rem", "Section heading"),
    "size-2xl": d("2rem", "Page heading"),
    "size-3xl": d("2.75rem", "Hero heading"),
    "size-4xl": d("3.5rem", "Display heading"),
    "line-flat": d("1", "Control line height"),
    "line-tight": d("1.12", "Display line height"),
    "line-body": d("1.55", "Body line height"),
    "line-relaxed": d("1.7", "Long-form line height"),
    "weight-regular": d("400", "Regular body weight"),
    "weight-medium": d("500", "Medium emphasis"),
    "weight-semibold": d("600", "Semibold emphasis"),
    "weight-strong": d("700", "Strong emphasis"),
    "tracking-tight": d("-0.02em", "Display tracking"),
    "tracking-normal": d("0", "Normal tracking"),
    "tracking-wide": d("0.03em", "Label tracking")
  },
  spacing: {
    "space-0": d("0", "No spacing"),
    "space-px": d("1px", "Hairline spacing"),
    "space-1": d("0.25rem", "Tiny spacing"),
    "space-1-5": d("0.375rem", "Between tiny and small spacing"),
    "space-2": d("0.5rem", "Small spacing"),
    "space-2-5": d("0.625rem", "Between small and compact spacing"),
    "space-3": d("0.75rem", "Compact spacing"),
    "space-3-5": d("0.875rem", "Between compact and base spacing"),
    "space-4": d("1rem", "Base spacing"),
    "space-5": d("1.5rem", "Section spacing"),
    "space-6": d("2rem", "Wide spacing"),
    "space-7": d("3rem", "Panel spacing"),
    "space-8": d("4rem", "Hero spacing"),
    "space-9": d("5rem", "Large section spacing"),
    "space-10": d("6rem", "Page rhythm spacing"),
    "space-11": d("7rem", "Extended section spacing"),
    "space-12": d("8rem", "Landing-level vertical rhythm")
  },
  sizing: {
    "size-touch": d("44px", "Minimum touch target", "interaction"),
    "size-control-sm": d("36px", "Small compact control", "interaction"),
    "size-control-md": d("44px", "Default control", "interaction"),
    "size-control-lg": d("52px", "Prominent control", "interaction"),
    "size-icon-sm": d("16px", "Small icon slot", "icon"),
    "size-icon-md": d("24px", "Default icon slot", "icon"),
    "size-icon-lg": d("32px", "Large icon slot", "icon"),
    "size-avatar-sm": d("28px", "Small avatar", "component"),
    "size-avatar-md": d("40px", "Default avatar", "component"),
    "size-avatar-lg": d("56px", "Large avatar", "component"),
    "size-panel-sm": d("20rem", "Small panel width", "layout"),
    "size-panel-md": d("32rem", "Medium panel width", "layout"),
    "size-panel-lg": d("48rem", "Large panel width", "layout"),
    "size-content": d("72rem", "Max readable content", "layout"),
    "size-content-wide": d("80rem", "Wide content region", "layout")
  },
  radius: {
    none: d("0", "No radius"),
    xs: d("0.25rem", "Tight radius"),
    sm: d("0.375rem", "Small radius"),
    md: d("0.75rem", "Base radius"),
    xl: d("1.5rem", "XL radius"),
    lg: d("1.25rem", "Large radius"),
    pill: d("999px", "Pill radius")
  },
  elevation: {
    none: d("none", "Flat surface"),
    hairline: d("0 0 0 1px rgba(16, 35, 33, 0.08)", "Hairline boundary"),
    sm: d("0 8px 20px rgba(16, 35, 33, 0.08)", "Small lift"),
    md: d("0 18px 42px rgba(16, 35, 33, 0.12)", "Panel lift"),
    lg: d("0 26px 70px rgba(16, 35, 33, 0.16)", "Dialog lift")
  },
  shadow: {
    none: d("none", "No shadow"),
    xs: d("0 1px 2px rgba(18, 41, 39, 0.05)", "Subtle resting shadow"),
    sm: d("0 4px 10px rgba(18, 41, 39, 0.08)", "Small component shadow"),
    md: d("0 12px 24px rgba(18, 41, 39, 0.12)", "Card hover shadow"),
    lg: d("0 24px 48px rgba(18, 41, 39, 0.16)", "Dialog and flyout shadow"),
    xl: d("0 36px 72px rgba(18, 41, 39, 0.2)", "Modal stack shadow"),
    inset: d("inset 0 1px 0 rgba(255, 255, 255, 0.75)", "Inset highlight"),
    focus: d("0 0 0 3px rgba(31, 79, 184, 0.24)", "Focus ring shadow")
  },
  zIndex: {
    base: d(0, "Base layer"),
    raised: d(10, "Raised element"),
    sticky: d(20, "Sticky controls"),
    dropdown: d(30, "Dropdown menus"),
    overlay: d(40, "Overlay"),
    drawer: d(50, "Drawer"),
    dialog: d(60, "Dialog"),
    toast: d(70, "Toast"),
    emergency: d(90, "Emergency escalation layer")
  },
  breakpoint: {
    mobile: d("360px", "Small mobile"),
    phablet: d("480px", "Large mobile"),
    mobileWide: d("640px", "Large mobile landscape"),
    tablet: d("768px", "Tablet"),
    laptop: d("1024px", "Laptop"),
    desktop: d("1280px", "Desktop"),
    desktopWide: d("1440px", "Large desktop")
  },
  grid: {
    "columns-mobile": d(4, "Mobile grid columns", "layout"),
    "columns-tablet": d(8, "Tablet grid columns", "layout"),
    "columns-desktop": d(12, "Desktop grid columns", "layout"),
    "gutter-mobile": d("1rem", "Mobile gutter", "layout"),
    "gutter-tablet": d("1.5rem", "Tablet gutter", "layout"),
    "gutter-desktop": d("2rem", "Desktop gutter", "layout"),
    "margin-mobile": d("1rem", "Mobile outer margin", "layout"),
    "margin-tablet": d("2rem", "Tablet outer margin", "layout"),
    "margin-desktop": d("3rem", "Desktop outer margin", "layout"),
    "max-content": d("1200px", "Content max width", "layout"),
    "max-reading": d("72ch", "Reading measure", "layout")
  },
  icon: {
    "size-xs": d("12px", "Micro status icon", "icon"),
    "size-sm": d("16px", "Small icon", "icon"),
    "size-md": d("20px", "Default icon", "icon"),
    "size-lg": d("24px", "Large icon", "icon"),
    "size-xl": d("32px", "Hero icon", "icon"),
    "stroke-default": d("1.75", "Default icon stroke width", "icon"),
    "stroke-strong": d("2", "Strong icon stroke width", "icon"),
    "align-offset": d("-0.05em", "Optical baseline alignment", "icon"),
    "decorative-opacity": d("0.72", "Decorative icon opacity", "icon")
  },
  status: {
    success: d(
      "var(--nh-color-status-success-fg)",
      "Success semantic status foreground",
      "semantic"
    ),
    warning: d(
      "var(--nh-color-status-warning-fg)",
      "Warning semantic status foreground",
      "semantic"
    ),
    danger: d("var(--nh-color-status-danger-fg)", "Danger semantic status foreground", "semantic"),
    info: d("var(--nh-color-status-info-fg)", "Info semantic status foreground", "semantic"),
    "success-bg": d("var(--nh-color-status-success-bg)", "Success status background", "semantic"),
    "warning-bg": d("var(--nh-color-status-warning-bg)", "Warning status background", "semantic"),
    "danger-bg": d("var(--nh-color-status-danger-bg)", "Danger status background", "semantic"),
    "info-bg": d("var(--nh-color-status-info-bg)", "Info status background", "semantic")
  },
  button: {
    "font-size": d("0.9375rem", "Button text size", "component"),
    "font-weight": d("600", "Button text weight", "component"),
    "height-sm": d("36px", "Small button height", "component"),
    "height-md": d("44px", "Default button height", "component"),
    "height-lg": d("52px", "Large button height", "component"),
    radius: d("var(--nh-radius-pill)", "Button radius", "component"),
    "padding-x-sm": d("0.75rem", "Small horizontal padding", "component"),
    "padding-x-md": d("1rem", "Default horizontal padding", "component"),
    "padding-x-lg": d("1.25rem", "Large horizontal padding", "component"),
    "primary-bg": d("var(--nh-color-brand-700)", "Primary background", "component"),
    "primary-fg": d("var(--nh-color-on-brand)", "Primary foreground", "component"),
    "primary-hover-bg": d("var(--nh-color-brand-900)", "Primary hover background", "component"),
    "secondary-bg": d("var(--nh-color-neutral-0)", "Secondary background", "component"),
    "secondary-fg": d("var(--nh-color-neutral-900)", "Secondary foreground", "component"),
    "secondary-border": d("var(--nh-color-neutral-300)", "Secondary border", "component"),
    "tertiary-bg": d("transparent", "Tertiary background", "component"),
    "tertiary-fg": d("var(--nh-color-brand-700)", "Tertiary foreground", "component"),
    "danger-bg": d("var(--nh-color-status-danger-fg)", "Danger background", "component"),
    "danger-fg": d("#FFFFFF", "Danger foreground", "component"),
    "ghost-bg-hover": d("var(--nh-color-neutral-100)", "Ghost hover background", "component"),
    "disabled-opacity": d("0.52", "Disabled opacity", "component")
  },
  card: {
    radius: d("var(--nh-radius-lg)", "Card radius", "component"),
    "padding-sm": d("1rem", "Small card padding", "component"),
    "padding-md": d("1.5rem", "Default card padding", "component"),
    "padding-lg": d("2rem", "Large card padding", "component"),
    "base-bg": d("var(--nh-color-surface-raised)", "Card base background", "component"),
    "base-border": d("var(--nh-color-neutral-200)", "Card base border", "component"),
    "base-shadow": d("var(--nh-shadow-xs)", "Card base shadow", "component"),
    "raised-shadow": d("var(--nh-shadow-md)", "Card raised shadow", "component"),
    "interactive-hover-shadow": d(
      "var(--nh-shadow-lg)",
      "Interactive card hover shadow",
      "component"
    ),
    "muted-bg": d("var(--nh-color-surface-muted)", "Muted card background", "component"),
    "critical-border": d("var(--nh-color-status-danger-fg)", "Critical card border", "component")
  },
  formControl: {
    height: d("44px", "Default form control height", "component"),
    radius: d("var(--nh-radius-md)", "Form control radius", "component"),
    "padding-x": d("0.875rem", "Form control horizontal padding", "component"),
    "padding-y": d("0.625rem", "Form control vertical padding", "component"),
    "label-size": d("0.875rem", "Form label size", "component"),
    "label-weight": d("600", "Form label weight", "component"),
    "hint-size": d("0.8125rem", "Form hint size", "component"),
    "input-bg": d("var(--nh-color-neutral-0)", "Input background", "component"),
    "input-fg": d("var(--nh-color-neutral-900)", "Input text color", "component"),
    "input-border": d("var(--nh-color-neutral-300)", "Input border", "component"),
    "input-placeholder": d("var(--nh-color-neutral-500)", "Input placeholder color", "component"),
    "input-focus-ring": d("var(--nh-color-focus-ring)", "Input focus ring color", "component"),
    "input-error-border": d("var(--nh-color-status-danger-fg)", "Input error border", "component"),
    "input-success-border": d(
      "var(--nh-color-status-success-fg)",
      "Input success border",
      "component"
    ),
    "disabled-bg": d("var(--nh-color-neutral-100)", "Disabled input background", "component"),
    "disabled-fg": d("var(--nh-color-neutral-500)", "Disabled input foreground", "component")
  },
  navigation: {
    "height-header": d("64px", "Primary header height", "component"),
    "height-header-mobile": d("56px", "Mobile header height", "component"),
    "item-height": d("40px", "Navigation item height", "component"),
    "item-padding-x": d("0.75rem", "Navigation item horizontal padding", "component"),
    "item-radius": d("var(--nh-radius-pill)", "Navigation item radius", "component"),
    "item-fg": d("var(--nh-color-neutral-700)", "Navigation item foreground", "component"),
    "item-hover-bg": d("var(--nh-color-neutral-100)", "Navigation hover background", "component"),
    "item-active-bg": d("var(--nh-color-brand-100)", "Navigation active background", "component"),
    "item-active-fg": d("var(--nh-color-brand-900)", "Navigation active foreground", "component"),
    "surface-bg": d("var(--nh-color-neutral-0)", "Navigation surface background", "component"),
    "surface-border": d("var(--nh-color-neutral-200)", "Navigation surface border", "component")
  },
  badge: {
    radius: d("var(--nh-radius-pill)", "Badge radius", "component"),
    "font-size": d("0.75rem", "Badge text size", "component"),
    "font-weight": d("600", "Badge text weight", "component"),
    "padding-x": d("0.5rem", "Badge horizontal padding", "component"),
    "padding-y": d("0.25rem", "Badge vertical padding", "component"),
    "dot-size": d("0.5rem", "Badge dot size", "component"),
    "neutral-bg": d("var(--nh-color-neutral-100)", "Neutral badge background", "component"),
    "neutral-fg": d("var(--nh-color-neutral-700)", "Neutral badge foreground", "component"),
    "info-bg": d("var(--nh-color-status-info-bg)", "Info badge background", "component"),
    "info-fg": d("var(--nh-color-status-info-fg)", "Info badge foreground", "component"),
    "success-bg": d("var(--nh-color-status-success-bg)", "Success badge background", "component"),
    "success-fg": d("var(--nh-color-status-success-fg)", "Success badge foreground", "component"),
    "warning-bg": d("var(--nh-color-status-warning-bg)", "Warning badge background", "component"),
    "warning-fg": d("var(--nh-color-status-warning-fg)", "Warning badge foreground", "component"),
    "danger-bg": d("var(--nh-color-status-danger-bg)", "Danger badge background", "component"),
    "danger-fg": d("var(--nh-color-status-danger-fg)", "Danger badge foreground", "component")
  },
  motion: {
    "duration-none": d("0ms", "No animation"),
    "duration-micro": d("90ms", "Micro acknowledgment"),
    "duration-fast": d("120ms", "Fast feedback"),
    "duration-standard": d("220ms", "Default reveal"),
    "duration-slow": d("360ms", "Expressive reveal"),
    "duration-page": d("420ms", "Page transition reveal"),
    "duration-safety": d("40ms", "Safety-critical immediate transition"),
    "ease-standard": d("cubic-bezier(.2,.8,.2,1)", "Standard easing"),
    "ease-emphasized": d("cubic-bezier(.18,.9,.2,1.08)", "Emphasized easing"),
    "ease-entrance": d("cubic-bezier(.16,1,.3,1)", "Entrance easing"),
    "ease-exit": d("cubic-bezier(.4,0,1,1)", "Exit easing"),
    "stagger-sm": d("30ms", "Small stagger increment"),
    "stagger-md": d("50ms", "Default stagger increment"),
    "profile-none": d("none", "Disable motion", "profile"),
    "profile-reduced": d("reduced", "Reduced motion", "profile"),
    "profile-subtle": d("subtle", "Subtle motion", "profile"),
    "profile-standard": d("standard", "Standard motion", "profile"),
    "profile-emphasized": d("emphasized", "Emphasized but bounded motion", "profile"),
    "profile-safety-immediate": d(
      "safety-immediate",
      "Immediate safety state transitions",
      "profile"
    ),
    "distance-sm": d("4px", "Small reveal offset"),
    "distance-md": d("10px", "Default reveal offset"),
    "distance-lg": d("18px", "Large reveal offset")
  },
  marketing: {
    "display-2xl": d(
      "clamp(2.5rem, 4vw + 1.5rem, 4.5rem)",
      "Editorial display hero heading",
      "typography"
    ),
    "display-xl": d(
      "clamp(2rem, 3vw + 1.25rem, 3.5rem)",
      "Editorial display heading",
      "typography"
    ),
    "display-lg": d(
      "clamp(1.75rem, 2.5vw + 1rem, 2.75rem)",
      "Editorial section heading",
      "typography"
    ),
    "display-md": d(
      "clamp(1.5rem, 2vw + 0.75rem, 2.25rem)",
      "Editorial subsection heading",
      "typography"
    ),
    "display-sm": d(
      "clamp(1.25rem, 1.5vw + 0.5rem, 1.75rem)",
      "Editorial minor heading",
      "typography"
    ),
    "display-line-height": d("1.08", "Editorial display line height", "typography"),
    "display-tracking": d("-0.02em", "Editorial display tracking", "typography"),
    "display-weight": d("600", "Editorial display weight", "typography"),
    "prose-lg": d("1.25rem", "Large editorial prose", "typography"),
    "prose-md": d("1.125rem", "Default editorial prose", "typography"),
    "prose-sm": d("1rem", "Compact editorial prose", "typography"),
    "prose-line-height": d("1.7", "Editorial prose line height", "typography"),
    "eyebrow-size": d("0.8125rem", "Eyebrow label size", "typography"),
    "eyebrow-tracking": d("0.16em", "Eyebrow label tracking", "typography"),
    "eyebrow-weight": d("600", "Eyebrow label weight", "typography"),
    "hero-y-sm": d("3rem", "Mobile hero vertical padding", "spacing"),
    "hero-y-md": d("5rem", "Tablet hero vertical padding", "spacing"),
    "hero-y-lg": d("7rem", "Desktop hero vertical padding", "spacing"),
    "section-y-sm": d("2.5rem", "Mobile section vertical rhythm", "spacing"),
    "section-y-md": d("3.5rem", "Tablet section vertical rhythm", "spacing"),
    "section-y-lg": d("5rem", "Desktop section vertical rhythm", "spacing"),
    "story-gap-sm": d("1.5rem", "Mobile story block gap", "spacing"),
    "story-gap-md": d("2.5rem", "Tablet story block gap", "spacing"),
    "story-gap-lg": d("3.5rem", "Desktop story block gap", "spacing"),
    "content-narrow": d("42rem", "Narrow editorial column", "layout"),
    "content-default": d("64rem", "Default marketing column", "layout"),
    "content-wide": d("80rem", "Wide marketing column", "layout"),
    "content-editorial": d("72ch", "Editorial reading measure", "layout"),
    "motion-hero-enter-duration": d(
      "620ms",
      "Hero enter animation duration",
      "motion"
    ),
    "motion-hero-enter-ease": d(
      "cubic-bezier(0.16, 1, 0.3, 1)",
      "Hero enter easing",
      "motion"
    ),
    "motion-hero-enter-distance": d("24px", "Hero enter translate distance", "motion"),
    "motion-hero-enter-reduced-duration": d(
      "0ms",
      "Hero enter reduced-motion duration",
      "motion"
    ),
    "motion-hero-enter-reduced-distance": d(
      "0px",
      "Hero enter reduced-motion distance",
      "motion"
    ),
    "motion-scroll-reveal-duration": d(
      "480ms",
      "Scroll reveal animation duration",
      "motion"
    ),
    "motion-scroll-reveal-ease": d(
      "cubic-bezier(0.2, 0.8, 0.2, 1)",
      "Scroll reveal easing",
      "motion"
    ),
    "motion-scroll-reveal-distance": d(
      "16px",
      "Scroll reveal translate distance",
      "motion"
    ),
    "motion-scroll-reveal-reduced-duration": d(
      "0ms",
      "Scroll reveal reduced-motion duration",
      "motion"
    ),
    "motion-scroll-reveal-reduced-distance": d(
      "0px",
      "Scroll reveal reduced-motion distance",
      "motion"
    ),
    "motion-cross-fade-duration": d(
      "320ms",
      "Cross-fade animation duration",
      "motion"
    ),
    "motion-cross-fade-ease": d(
      "cubic-bezier(0.4, 0, 0.2, 1)",
      "Cross-fade easing",
      "motion"
    ),
    "motion-cross-fade-reduced-duration": d(
      "60ms",
      "Cross-fade reduced-motion duration",
      "motion"
    ),
    "illustration-max-width": d("40rem", "Illustration max width", "illustration"),
    "illustration-radius": d("1.5rem", "Illustration container radius", "illustration"),
    "illustration-shadow": d(
      "0 24px 60px rgba(16, 35, 33, 0.14)",
      "Illustration container shadow",
      "illustration"
    ),
    "illustration-stroke": d("1.75", "Illustration line stroke width", "illustration"),
    "illustration-tone-warm": d(
      "var(--nh-color-paper-050)",
      "Warm illustration fill",
      "illustration"
    ),
    "illustration-tone-cool": d(
      "var(--nh-color-teal-100)",
      "Cool illustration fill",
      "illustration"
    ),
    "illustration-tone-neutral": d(
      "var(--nh-color-neutral-100)",
      "Neutral illustration fill",
      "illustration"
    ),
    "illustration-tone-accent": d(
      "var(--nh-color-brand-100)",
      "Accent illustration fill",
      "illustration"
    )
  }
} satisfies DesignTokens;
export const tokenAuditSummary: TokenAuditSummary[] = Object.entries(tokens).map(
  ([category, group]) => ({
    category: category as keyof typeof tokens,
    count: Object.keys(group).length
  })
);
export const tokenCssVariableName = (category: string, name: string) =>
  `--nh-${category.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}-${name}`;
