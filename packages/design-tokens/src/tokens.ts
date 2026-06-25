import type { DesignTokens, TokenAuditSummary } from "./types.js";
const d = (value: string | number, description: string, category = "scale") => ({
  value,
  description,
  category
});
export const visualDirection = {
  id: "VIS-DIR-002",
  name: "Warm Care Grid",
  intent: "High-trust healthcare operations with warm calm, clear hierarchy, and restrained motion."
} as const;
export const tokens = {
  color: {
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
    background: d("#FFFDF8", "Application background", "semantic"),
    surface: d("#F8F2E7", "Primary surface", "semantic"),
    border: d("#B8CAB9", "Accessible border", "semantic"),
    text: d("#102321", "Primary text", "semantic"),
    action: d("#0D5E57", "Primary action", "semantic"),
    danger: d("#7A1F17", "Safety and destructive state", "semantic")
  },
  typography: {
    "family-display": d(
      "Fraunces, Georgia, serif",
      "Expressive display stack; local fallback only",
      "semantic"
    ),
    "family-body": d(
      "Atkinson Hyperlegible, Verdana, sans-serif",
      "Readable body stack; local fallback only",
      "semantic"
    ),
    "size-xs": d("0.75rem", "Caption"),
    "size-sm": d("0.875rem", "Small body"),
    "size-md": d("1rem", "Base body"),
    "size-lg": d("1.125rem", "Large body"),
    "size-xl": d("1.5rem", "Section heading"),
    "size-2xl": d("2rem", "Page heading"),
    "size-3xl": d("2.75rem", "Hero heading"),
    "line-tight": d("1.12", "Display line height"),
    "line-body": d("1.55", "Body line height"),
    "weight-strong": d("700", "Strong emphasis")
  },
  spacing: {
    "space-0": d("0", "No spacing"),
    "space-1": d("0.25rem", "Tiny spacing"),
    "space-2": d("0.5rem", "Small spacing"),
    "space-3": d("0.75rem", "Compact spacing"),
    "space-4": d("1rem", "Base spacing"),
    "space-5": d("1.5rem", "Section spacing"),
    "space-6": d("2rem", "Wide spacing"),
    "space-7": d("3rem", "Panel spacing"),
    "space-8": d("4rem", "Hero spacing")
  },
  sizing: {
    "size-touch": d("44px", "Minimum touch target", "interaction"),
    "size-icon-sm": d("16px", "Small icon slot", "icon"),
    "size-icon-md": d("24px", "Default icon slot", "icon"),
    "size-icon-lg": d("32px", "Large icon slot", "icon"),
    "size-panel-sm": d("20rem", "Small panel width", "layout"),
    "size-panel-md": d("32rem", "Medium panel width", "layout"),
    "size-panel-lg": d("48rem", "Large panel width", "layout"),
    "size-content": d("72rem", "Max readable content", "layout")
  },
  radius: {
    none: d("0", "No radius"),
    sm: d("0.375rem", "Small radius"),
    md: d("0.75rem", "Base radius"),
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
  zIndex: {
    base: d(0, "Base layer"),
    raised: d(10, "Raised element"),
    sticky: d(20, "Sticky controls"),
    overlay: d(40, "Overlay"),
    dialog: d(60, "Dialog"),
    toast: d(70, "Toast"),
    emergency: d(90, "Emergency escalation layer")
  },
  breakpoint: {
    mobile: d("360px", "Small mobile"),
    phablet: d("480px", "Large mobile"),
    tablet: d("768px", "Tablet"),
    laptop: d("1024px", "Laptop"),
    desktop: d("1280px", "Desktop")
  },
  motion: {
    "duration-none": d("0ms", "No animation"),
    "duration-fast": d("120ms", "Fast feedback"),
    "duration-standard": d("220ms", "Default reveal"),
    "duration-slow": d("360ms", "Expressive reveal"),
    "duration-safety": d("40ms", "Safety-critical immediate transition"),
    "ease-standard": d("cubic-bezier(.2,.8,.2,1)", "Standard easing"),
    "ease-emphasized": d("cubic-bezier(.18,.9,.2,1.08)", "Emphasized easing"),
    "ease-exit": d("cubic-bezier(.4,0,1,1)", "Exit easing"),
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
    "distance-md": d("10px", "Default reveal offset")
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
