import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-segment-pharmacies.${slug}`,
  family: "marketing-segment-pharmacies",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const marketingSegmentPharmaciesEntries: ContentEntry[] = [
  e("hero.eyebrow", "For pharmacies", "Prescriptions routed on approved terms."),
  e(
    "hero.headline",
    "Serve patients from a coordinated care surface.",
    "Approved prescriptions arrive with the clinical context you need."
  ),
  e(
    "hero.body",
    "Coordinated pharmacy fulfilment",
    "Prescriptions route to approved partners with clinical context — after patient consent and payment authorisation."
  ),
  e(
    "story.a.headline",
    "Approved prescriptions only.",
    "Every routed prescription is signed by a licensed clinician."
  ),
  e(
    "story.a.body",
    "Approved prescriptions only",
    "The platform routes prescriptions that carry a valid signature and audit trail — never freeform orders."
  ),
  e(
    "story.b.headline",
    "Provider details revealed after payment.",
    "Location, contact, and pickup details unlock only when the order is funded."
  ),
  e(
    "story.b.body",
    "Provider details after payment",
    "Patient-facing views expose only an approved display name pre-payment. Full details unlock after successful payment — for that specific order."
  ),
  e(
    "trust.approved",
    "Only approved partners route through",
    "Registration and credential checks apply."
  ),
  e(
    "faq.partner",
    "How do I become an approved partner?",
    "Partner registration is currently through onboarding conversations. Contact us to start the credentialing process."
  ),
  e(
    "cta.headline",
    "Interested in partnering?",
    "Reach out through the partner contact form."
  )
];
