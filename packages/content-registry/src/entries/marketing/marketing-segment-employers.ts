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
  e(
    "hero.eyebrow",
    "For employers",
    "Coverage that respects the line between HR and healthcare."
  ),
  e(
    "hero.headline",
    "Sponsor workforce care without touching the clinical record.",
    "Employer reporting stays operational. Clinical data stays between the clinician and the patient."
  ),
  e(
    "hero.body",
    "Employer care overview",
    "The employer surface coordinates coverage, eligibility, and uptake reporting. It does not — and structurally cannot — surface clinical detail to your team. The boundary between commercial data and clinical data is enforced in code, not policy."
  ),
  e(
    "scope.caveat",
    "Scope caveat",
    "The employer surface is designed but not yet implemented in the pilot. We're scoping interest and onboarding conversations ahead of enablement — get in touch if you'd like to be on the early-access shortlist."
  ),
  e(
    "story.a.headline",
    "You see coverage. Not chart notes.",
    "The employer view aggregates uptake and eligibility — never individual clinical detail."
  ),
  e(
    "story.a.body",
    "Coverage and uptake",
    "Reporting focuses on population-level uptake and utilisation — how many employees activated care, how many follow-ups happened, coverage burn against plan. Clinical detail belongs to the patient, not the employer."
  ),
  e(
    "cta.headline",
    "Interested in early access?",
    "Reach out through the partner contact form."
  )
];
