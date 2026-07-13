import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-segment-employers.${slug}`,
  family: "marketing-segment-employers",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true,
  notes: "DESIGN-NOW-IMPLEMENT-LATER — scope caveat required on the page."
});

export const marketingSegmentEmployersEntries: ContentEntry[] = [
  e("hero.eyebrow", "For employers", "Coordinate care for your workforce."),
  e(
    "hero.headline",
    "Support workforce care without touching clinical records.",
    "The employer view surfaces coverage and uptake, never clinical detail."
  ),
  e(
    "hero.body",
    "Employer care overview",
    "The employer surface coordinates coverage and eligibility. Clinical data stays with clinicians and patients — never with the employer."
  ),
  e(
    "scope.caveat",
    "Scope caveat",
    "The employer surface is designed but not yet implemented in the pilot. Interest and onboarding are being scoped ahead of enablement."
  ),
  e(
    "story.a.headline",
    "Coverage and uptake — not clinical detail.",
    "Employers see population-level trends, not patient records."
  ),
  e(
    "story.a.body",
    "Coverage and uptake",
    "Reporting focuses on coverage uptake and utilisation at the population level. Employers cannot see clinical detail."
  ),
  e(
    "cta.headline",
    "Interested in early access?",
    "Reach out through the partner contact form."
  )
];
