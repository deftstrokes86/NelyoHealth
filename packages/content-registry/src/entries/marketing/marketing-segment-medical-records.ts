import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-segment-medical-records.${slug}`,
  family: "marketing-segment-medical-records",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true,
  notes: "DESIGN-NOW-IMPLEMENT-LATER — scope caveat required on the page."
});

export const marketingSegmentMedicalRecordsEntries: ContentEntry[] = [
  e(
    "hero.eyebrow",
    "For medical records",
    "One authoritative chart. Every role reads their slice."
  ),
  e(
    "hero.headline",
    "The record that follows the patient — not the visit.",
    "Signed, versioned, and readable only by the roles a patient has approved."
  ),
  e(
    "hero.body",
    "Medical records overview",
    "Signed clinical records use versioned amendments — never silent overwrites. Every access is logged, every consent decision is visible and reversible from the patient's account, and every role reads only the slice of the chart it's entitled to."
  ),
  e(
    "scope.caveat",
    "Scope caveat",
    "The standalone medical-records surface is designed but not yet implemented in the pilot. We're scoping interest and onboarding conversations ahead of enablement — get in touch if you'd like to be on the early-access shortlist."
  ),
  e(
    "story.a.headline",
    "Amendments, not overwrites.",
    "Once a record is signed, corrections happen as versioned amendments so the history stays intact."
  ),
  e(
    "story.a.body",
    "A record you can audit",
    "Every access, every amendment, every consent grant or revocation is logged against the record. If a patient asks who saw what and when, the answer is always available — to them, not just to us."
  ),
  e(
    "cta.headline",
    "Interested in early access?",
    "Reach out through the partner contact form."
  )
];
