import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-segment-home-care.${slug}`,
  family: "marketing-segment-home-care",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true,
  notes: "DESIGN-NOW-IMPLEMENT-LATER — scope caveat required on the page."
});

export const marketingSegmentHomeCareEntries: ContentEntry[] = [
  e("hero.eyebrow", "For home care", "Care that reaches the household."),
  e(
    "hero.headline",
    "Coordinate home-care visits with the same audit surface.",
    "Home care sits on the same connected record as clinic care."
  ),
  e(
    "hero.body",
    "Home care overview",
    "Home-care visits are coordinated on the same record and consent boundaries as clinic-based care — same audit trail, same role permissions."
  ),
  e(
    "scope.caveat",
    "Scope caveat",
    "The home-care surface is designed but not yet implemented in the pilot. Interest and onboarding are being scoped ahead of enablement."
  ),
  e(
    "story.a.headline",
    "One record follows the patient.",
    "Home-visit notes join the same chart as clinic notes."
  ),
  e(
    "story.a.body",
    "One record follows the patient",
    "Home visits, clinic visits, and follow-ups all sit on one record — with role permissions enforced end-to-end."
  ),
  e(
    "cta.headline",
    "Interested in early access?",
    "Reach out through the partner contact form."
  )
];
