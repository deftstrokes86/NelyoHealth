import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-segment-doctors.${slug}`,
  family: "marketing-segment-doctors",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const marketingSegmentDoctorsEntries: ContentEntry[] = [
  e("hero.eyebrow", "For doctors and clinics", "Practice in one workflow."),
  e(
    "hero.headline",
    "One patient view. One workflow. Fewer handoffs.",
    "Intake, prescribing, referrals, and follow-up on the same record."
  ),
  e(
    "hero.body",
    "Practice in one connected workflow",
    "Bring intake, prescribing, referrals, and follow-up into a single connected workflow — with clinical decisions where they belong."
  ),
  e(
    "story.a.headline",
    "Clinical decisions stay with you.",
    "The platform routes, records, and reminds. It does not diagnose or prescribe."
  ),
  e(
    "story.a.body",
    "Clinical decisions stay with clinicians",
    "The platform handles routing and audit. Every diagnostic and prescribing decision remains with a qualified clinician."
  ),
  e(
    "story.b.headline",
    "Sign records, add amendments, keep the audit clean.",
    "Finalised clinical records use amendments or versions — never silent overwrite."
  ),
  e(
    "story.b.body",
    "Amendments over overwrite",
    "Signed records are versioned. Corrections are added as amendments so history is preserved."
  ),
  e(
    "trust.audit",
    "Audit-ready by default",
    "Every action is logged and traceable."
  ),
  e(
    "faq.autonomy",
    "Does the platform make clinical decisions?",
    "No. Clinical decisions remain with qualified clinicians. The platform coordinates, routes, and audits — but never diagnoses or prescribes."
  ),
  e(
    "cta.headline",
    "Book a walkthrough for your practice.",
    "See how the platform fits into your day."
  )
];
