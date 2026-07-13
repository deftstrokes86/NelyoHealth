import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-segment-family-diaspora.${slug}`,
  family: "marketing-segment-family-diaspora",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const marketingSegmentFamilyDiasporaEntries: ContentEntry[] = [
  e("hero.eyebrow", "Care that crosses borders", "For families in Nigeria and the diaspora."),
  e(
    "hero.headline",
    "Support family in Nigeria without losing track.",
    "Sponsor consults and follow-ups within explicit consent boundaries."
  ),
  e(
    "hero.body",
    "Care that crosses borders",
    "Coordinate consults, follow-ups, and prescriptions for loved ones — under approvals the platform enforces."
  ),
  e(
    "story.a.headline",
    "Approve, sponsor, follow up.",
    "You cover care. The patient stays in control of their record."
  ),
  e(
    "story.a.body",
    "Approve, sponsor, follow up",
    "Sponsors pay and see the updates the patient chooses to share. Clinical records stay with the patient."
  ),
  e(
    "story.b.headline",
    "Payment never grants records access.",
    "Sponsors see what patients approve — not the full chart."
  ),
  e(
    "story.b.body",
    "Payment never grants records access",
    "Sponsoring care is separate from viewing records. The platform enforces that boundary at every step."
  ),
  e(
    "trust.consent",
    "Consent-scoped visibility",
    "Patients decide what sponsors see — always."
  ),
  e(
    "faq.records",
    "As a sponsor, can I see the medical records?",
    "No. Sponsors see what the patient explicitly shares — usually the appointment status and receipt, never the clinical chart unless the patient grants specific consent."
  ),
  e(
    "cta.headline",
    "Start supporting care today.",
    "Create a sponsor account and invite a family member."
  )
];
