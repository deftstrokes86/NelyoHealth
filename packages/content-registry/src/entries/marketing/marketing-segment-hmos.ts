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
  e(
    "hero.eyebrow",
    "For HMOs",
    "Population-level coordination with clinicians in the loop."
  ),
  e(
    "hero.headline",
    "Coordinate covered care without overriding the clinician.",
    "Authorisations respect clinical judgment. Emergency care is never gated."
  ),
  e(
    "hero.body",
    "HMO overview",
    "The HMO surface coordinates authorisations, utilisation reporting, and member journeys. Clinical decisions stay with the clinician on every path. Plan boundaries never block emergency care — that's a locked invariant, not a policy toggle."
  ),
  e(
    "scope.caveat",
    "Scope caveat",
    "The HMO surface is designed but not yet implemented in the pilot. We're scoping interest and onboarding conversations ahead of enablement — get in touch if you'd like to be on the early-access shortlist."
  ),
  e(
    "story.a.headline",
    "The plan doesn't override the clinician.",
    "Authorisation flows respect clinical judgment, and emergency care always surfaces."
  ),
  e(
    "story.a.body",
    "Authorisations don't override clinicians",
    "Authorisation logic runs alongside clinical decision-making — it doesn't replace it. Coverage boundaries are transparent to both sides, and when the plan says no, the clinician still sees the medically-necessary path so the conversation with the member is honest."
  ),
  e(
    "cta.headline",
    "Interested in early access?",
    "Reach out through the partner contact form."
  )
];
