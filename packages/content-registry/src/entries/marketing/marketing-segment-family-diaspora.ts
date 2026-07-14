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
  e(
    "hero.eyebrow",
    "Care that crosses borders",
    "For families supporting loved ones back home."
  ),
  e(
    "hero.headline",
    "Support Mama's care from Lagos to London — without losing the thread.",
    "Book, pay, and follow up on approved terms. Records stay with your family, not with you."
  ),
  e(
    "hero.body",
    "Care that crosses borders",
    "You can sponsor consultations, cover prescriptions, and see when the next follow-up is happening — all from your account. Your loved one keeps full control of their clinical record, and the platform enforces the boundary between what you cover and what you can see."
  ),
  e(
    "story.a.headline",
    "Sponsor care. Skip the awkward money transfers.",
    "Pay for the consult and the pharmacy directly — no more chasing bank details across time zones."
  ),
  e(
    "story.a.body",
    "Approve, sponsor, follow up",
    "You choose which appointments to cover and which pharmacies to fund. The clinician and the patient handle the clinical side. You get receipts and status updates. Nothing more, unless the patient explicitly opens more."
  ),
  e(
    "story.b.headline",
    "Paying doesn't unlock the chart.",
    "The platform separates payment from records access — always."
  ),
  e(
    "story.b.body",
    "Payment never grants records access",
    "This is a core boundary, enforced in code. Sponsors see what patients approve — usually the fact that an appointment happened and the invoice was covered. Clinical detail stays between the patient and the clinician."
  ),
  e(
    "trust.consent",
    "Consent-scoped visibility",
    "Your family member decides what you see, and can change that at any time."
  ),
  e(
    "faq.records",
    "As a sponsor, will I see the medical records?",
    "No — not by default. You'll see appointment status and receipts for what you cover. To see clinical detail (a lab result, a prescription, a consult note), your family member has to explicitly share it with you from their account. They can withdraw that sharing at any time."
  ),
  e(
    "cta.headline",
    "Start supporting care today",
    "Create a sponsor account and invite the family member you'd like to help."
  )
];
