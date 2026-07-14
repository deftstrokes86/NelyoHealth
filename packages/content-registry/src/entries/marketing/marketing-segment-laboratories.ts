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
  e(
    "hero.eyebrow",
    "For laboratories",
    "Diagnostic orders with real clinical context."
  ),
  e(
    "hero.headline",
    "Receive orders that already answer your questions.",
    "Every routed order arrives with clinician sign-off, patient consent, and the indication attached."
  ),
  e(
    "hero.body",
    "Coordinated laboratory ordering",
    "Diagnostic orders route from credentialed clinicians with everything your team needs — the indication, the patient's consented history, the collection preference. Your bench focuses on the science instead of chasing missing details."
  ),
  e(
    "story.a.headline",
    "Results return to the clinician who ordered them.",
    "Chain of custody stays clean from order through result to follow-up."
  ),
  e(
    "story.a.body",
    "Results return to the ordering clinician",
    "Results land back on the same record that placed the order. Follow-up conversations stay with the clinician who requested the test — not lost to the next appointment or the wrong specialist."
  ),
  e(
    "story.b.headline",
    "Location and collection details unlock after payment.",
    "Patients see only your approved display name pre-payment."
  ),
  e(
    "story.b.body",
    "Provider details after payment",
    "The platform holds back your address, collection windows, and contact details until an order is funded. Then those details unlock for that specific order — protecting both sides of the marketplace."
  ),
  e(
    "trust.credential",
    "Credentialed labs only",
    "Registration and quality-standard checks apply before any order routes."
  ),
  e(
    "faq.integration",
    "How does result reporting integrate with our LIS?",
    "Integration options are agreed during onboarding to match your existing lab information system. Reach out through the partner contact form and we'll set up a scoping call."
  ),
  e(
    "cta.headline",
    "Interested in partnering?",
    "Get in touch through the partner contact form."
  )
];
