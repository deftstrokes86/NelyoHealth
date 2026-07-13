import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-segment-hmos.${slug}`,
  family: "marketing-segment-hmos",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true,
  notes: "DESIGN-NOW-IMPLEMENT-LATER — scope caveat required on the page."
});

export const marketingSegmentHmosEntries: ContentEntry[] = [
  e("hero.eyebrow", "For HMOs", "Care coordination across your covered population."),
  e(
    "hero.headline",
    "Coordinate covered care with clinicians in the loop.",
    "Approvals stay with clinicians. Reporting stays operational."
  ),
  e(
    "hero.body",
    "HMO overview",
    "The HMO surface coordinates authorisations and utilisation reporting. Clinical decisions remain with clinicians in every workflow."
  ),
  e(
    "scope.caveat",
    "Scope caveat",
    "The HMO surface is designed but not yet implemented in the pilot. Interest and onboarding are being scoped ahead of enablement."
  ),
  e(
    "story.a.headline",
    "Authorisations don't override clinicians.",
    "The platform routes; clinicians decide."
  ),
  e(
    "story.a.body",
    "Authorisations don't override clinicians",
    "Authorisation workflows respect clinical judgment. Plan boundaries never block emergency care."
  ),
  e(
    "cta.headline",
    "Interested in early access?",
    "Reach out through the partner contact form."
  )
];
