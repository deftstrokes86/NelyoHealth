import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-accessibility.${slug}`,
  family: "marketing-accessibility",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const marketingAccessibilityEntries: ContentEntry[] = [
  e("hero.eyebrow", "Accessibility", "Care that reaches everyone."),
  e(
    "hero.headline",
    "Accessibility is a healthcare requirement.",
    "The platform targets WCAG 2.2 AA — verified, not just claimed."
  ),
  e(
    "hero.body",
    "Care that reaches everyone",
    "Accessibility is treated as a core requirement, not a bolt-on. This page describes what the platform commits to and where you can report issues."
  ),
  e(
    "commitment.wcag",
    "WCAG 2.2 AA target",
    "Every public page and every marketing component is tested against WCAG 2.2 AA."
  ),
  e(
    "commitment.motion",
    "Reduced motion respected",
    "All decorative motion turns off when your system requests reduced motion."
  ),
  e(
    "commitment.keyboard",
    "Full keyboard operation",
    "Every interactive control is reachable and operable from the keyboard, with visible focus."
  ),
  e(
    "commitment.contrast",
    "Contrast tested in both themes",
    "Colour pairs are validated for AA contrast in light and dark themes."
  ),
  e(
    "faq.report",
    "How do I report an accessibility issue?",
    "Reach out through the contact page or email the accessibility team. Include the page, the assistive technology you use, and what went wrong."
  ),
  e(
    "cta.headline",
    "Report an issue.",
    "Contact the accessibility team."
  )
];
