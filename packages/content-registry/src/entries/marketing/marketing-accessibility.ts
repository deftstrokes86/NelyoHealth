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
  e(
    "hero.eyebrow",
    "Accessibility",
    "Care that reaches everyone — including the way you already use the internet."
  ),
  e(
    "hero.headline",
    "Accessibility is a healthcare requirement, not an afterthought.",
    "Our commitments — and the specific things we test to keep them honest."
  ),
  e(
    "hero.body",
    "Care that reaches everyone",
    "If a screen-reader user can't reach the primary CTA, the platform has failed. This page describes what we hold ourselves to — and where you can report the moments we didn't hit it."
  ),
  e(
    "commitment.wcag",
    "WCAG 2.2 AA target",
    "Every public page and every marketing component is tested against WCAG 2.2 AA. When we miss, we treat it as a bug, not a nice-to-have backlog item."
  ),
  e(
    "commitment.motion",
    "Reduced motion respected",
    "All decorative motion turns off when your system requests reduced motion. Emergency and safety-critical transitions still fire — because those aren't decorative."
  ),
  e(
    "commitment.keyboard",
    "Full keyboard operation",
    "Every interactive control is reachable and operable from the keyboard, with a focus outline you can actually see."
  ),
  e(
    "commitment.contrast",
    "Contrast tested in both themes",
    "Every colour pair is validated against WCAG AA — in light theme and in dark theme. New pairs added to the design system go through the same automated check."
  ),
  e(
    "faq.report",
    "How do I report an accessibility issue?",
    "Reach us through the contact page, or email the accessibility team directly. Please tell us the page, the assistive technology you use, and what specifically failed — we'll respond with a triage decision, not a canned reply."
  ),
  e(
    "cta.headline",
    "Found something we missed?",
    "Contact the accessibility team — we treat reports as bugs, not feature requests."
  )
];
