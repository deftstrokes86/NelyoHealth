import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-segment-hospitals.${slug}`,
  family: "marketing-segment-hospitals",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true,
  notes: "DESIGN-NOW-IMPLEMENT-LATER — scope caveat required on the page."
});

export const marketingSegmentHospitalsEntries: ContentEntry[] = [
  e(
    "hero.eyebrow",
    "For hospitals and referrals",
    "Referrals that arrive with clinical context — not a blank chart."
  ),
  e(
    "hero.headline",
    "Receive referrals with the whole story attached.",
    "Intake, triage, consent, and prior notes travel with the patient."
  ),
  e(
    "hero.body",
    "Hospitals overview",
    "The hospital and referral surface coordinates hand-offs so your receiving team knows why the patient is arriving. Consent is captured at the referring side and travels with the record — no more \"who sent you?\" at the front desk."
  ),
  e(
    "scope.caveat",
    "Scope caveat",
    "The hospital referral surface is designed but not yet implemented in the pilot. We're scoping interest and onboarding conversations ahead of enablement — get in touch if you'd like to be on the early-access shortlist."
  ),
  e(
    "story.a.headline",
    "Referrals carry consent — not surprise.",
    "Patients agree to the referral before it moves."
  ),
  e(
    "story.a.body",
    "Referrals carry consent",
    "Patient consent is captured explicitly before a referral leaves the sending clinician. Your receiving team gets the clinical story, the reason for the referral, and confirmation that the patient knows they're being sent to you."
  ),
  e(
    "cta.headline",
    "Interested in early access?",
    "Reach out through the partner contact form."
  )
];
