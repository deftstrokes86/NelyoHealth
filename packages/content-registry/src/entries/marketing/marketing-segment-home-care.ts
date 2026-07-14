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
  e(
    "hero.eyebrow",
    "For home care",
    "Care that reaches the household — on the same record as clinic care."
  ),
  e(
    "hero.headline",
    "Home visits, clinic visits, one longitudinal chart.",
    "Coordinated care shouldn't stop at the clinic door."
  ),
  e(
    "hero.body",
    "Home care overview",
    "Home-care visits coordinate on the same record and consent boundaries as clinic-based care. Same audit trail. Same role permissions. Nothing gets lost in a home-visit notebook that never makes it back to the file."
  ),
  e(
    "scope.caveat",
    "Scope caveat",
    "The home-care surface is designed but not yet implemented in the pilot. We're scoping interest and onboarding conversations ahead of enablement — get in touch if you'd like to be on the early-access shortlist."
  ),
  e(
    "story.a.headline",
    "The chart travels with the patient — not with the visit.",
    "Home-visit notes join the same connected record as clinic notes."
  ),
  e(
    "story.a.body",
    "One record follows the patient",
    "Home-visit notes, clinic notes, and follow-ups all sit on one connected record — with role permissions and consent scoping enforced end-to-end."
  ),
  e(
    "cta.headline",
    "Interested in early access?",
    "Reach out through the partner contact form."
  )
];
