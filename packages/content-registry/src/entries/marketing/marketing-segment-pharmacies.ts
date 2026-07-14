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
  e(
    "hero.eyebrow",
    "For pharmacies",
    "Serve real prescriptions with real clinical context."
  ),
  e(
    "hero.headline",
    "Every routed prescription arrives signed, sourced, and ready.",
    "No more calling the prescriber to confirm a scribble. No more mismatched patient details."
  ),
  e(
    "hero.body",
    "Coordinated pharmacy fulfilment",
    "Prescriptions arrive from credentialed clinicians with the clinical context attached — dosage, duration, indication, any relevant history the patient has approved. Your team focuses on dispensing and counselling instead of chasing signatures."
  ),
  e(
    "story.a.headline",
    "Signed prescriptions only.",
    "Every routed order carries a valid clinician signature and an audit trail."
  ),
  e(
    "story.a.body",
    "Approved prescriptions only",
    "The platform only routes prescriptions from clinicians in good standing. If the signature isn't valid, the order doesn't leave the platform. That protects your team and the patient."
  ),
  e(
    "story.b.headline",
    "Details unlock only after the order is funded.",
    "Location, contact, and pickup information stay protected pre-payment."
  ),
  e(
    "story.b.body",
    "Provider details after payment",
    "Patient-facing views show only your approved display name before payment. Full pickup details unlock for that specific order once payment is successful. It's a boundary that protects both sides of the marketplace."
  ),
  e(
    "trust.approved",
    "Only credentialed partners route through",
    "Registration and standing checks apply on every routing decision."
  ),
  e(
    "faq.partner",
    "How does my pharmacy become an approved partner?",
    "Partner onboarding happens through a direct conversation with our operations team so we can verify credentials and match integration needs. Reach out through the partner contact form to start."
  ),
  e(
    "cta.headline",
    "Interested in partnering?",
    "Get in touch through the partner contact form."
  )
];
