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
  e("hero.eyebrow", "For hospitals and referrals", "Refer and receive with context."),
  e(
    "hero.headline",
    "Receive referrals with the clinical context attached.",
    "Referrals arrive with intake, triage, and consent — not a blank chart."
  ),
  e(
    "hero.body",
    "Hospitals overview",
    "The hospital and referral surface passes clinical context and consent with every referral. It coordinates hand-offs — not admissions."
  ),
  e(
    "scope.caveat",
    "Scope caveat",
    "The hospital referral surface is designed but not yet implemented in the pilot. Interest and onboarding are being scoped ahead of enablement."
  ),
  e(
    "story.a.headline",
    "Referrals carry consent, not surprise.",
    "Every referred patient has consented to the referral."
  ),
  e(
    "story.a.body",
    "Referrals carry consent",
    "Patient consent is captured before the referral moves. The receiving team knows why the patient is arriving."
  ),
  e(
    "cta.headline",
    "Interested in early access?",
    "Reach out through the partner contact form."
  )
];
