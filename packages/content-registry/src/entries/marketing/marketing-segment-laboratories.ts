import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-segment-laboratories.${slug}`,
  family: "marketing-segment-laboratories",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const marketingSegmentLaboratoriesEntries: ContentEntry[] = [
  e("hero.eyebrow", "For laboratories", "Diagnostic orders coordinated with clinicians."),
  e(
    "hero.headline",
    "Receive diagnostic orders with clinical context.",
    "Every routed lab order carries the clinician sign-off."
  ),
  e(
    "hero.body",
    "Coordinated laboratory ordering",
    "Diagnostic orders route to approved laboratories with the clinical context and consent boundary attached."
  ),
  e(
    "story.a.headline",
    "Results return to the ordering clinician.",
    "The chain of custody stays clean — from order to result to follow-up."
  ),
  e(
    "story.a.body",
    "Results return to the ordering clinician",
    "Results land back on the record that ordered them. Follow-up sits with the clinician who requested the test."
  ),
  e(
    "story.b.headline",
    "Provider details revealed after payment.",
    "Location, contact, and collection details unlock only when the order is funded."
  ),
  e(
    "story.b.body",
    "Provider details after payment",
    "Patient-facing views expose only an approved display name pre-payment. Full details unlock after successful payment — for that specific order."
  ),
  e(
    "trust.credential",
    "Only credentialed labs route through",
    "Registration and quality standards apply."
  ),
  e(
    "faq.integration",
    "How does result reporting integrate?",
    "Results reporting integrations are set up during onboarding. Contact us to discuss your lab's existing workflow."
  ),
  e(
    "cta.headline",
    "Interested in partnering?",
    "Reach out through the partner contact form."
  )
];
