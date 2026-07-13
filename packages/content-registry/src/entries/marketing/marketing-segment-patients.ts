import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-segment-patients.${slug}`,
  family: "marketing-segment-patients",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const marketingSegmentPatientsEntries: ContentEntry[] = [
  e("hero.eyebrow", "For patients and families", "Care that follows you."),
  e(
    "hero.headline",
    "Book a consult. See results. Keep everyone informed.",
    "One account for records, consults, and family updates."
  ),
  e(
    "hero.body",
    "Care for patients and families",
    "A single account for booking, records, prescriptions, and family updates — with consent boundaries that hold."
  ),
  e(
    "story.a.headline",
    "Your record stays with you.",
    "Consults, prescriptions, and lab results all live in the same place — securely."
  ),
  e(
    "story.a.body",
    "Your record stays with you",
    "You control who sees what. Approved family members see what you've explicitly shared — nothing more."
  ),
  e(
    "story.b.headline",
    "Simple booking, honest waits.",
    "See real availability instead of vague promises."
  ),
  e(
    "story.b.body",
    "Simple booking",
    "The platform shows real availability windows and the next reasonable slot — no false urgency."
  ),
  e(
    "trust.privacy",
    "You decide who sees what",
    "Consent lives on your record and can be revoked."
  ),
  e(
    "faq.access",
    "Can family members see my records?",
    "Only if you have approved them for specific records. Access is scoped to what you share, and you can revoke it at any time."
  ),
  e(
    "cta.headline",
    "Ready to start?",
    "Create an account to book your first consult."
  )
];
