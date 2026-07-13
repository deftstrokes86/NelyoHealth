import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-faq.${slug}`,
  family: "marketing-faq",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const marketingFaqEntries: ContentEntry[] = [
  e("hero.eyebrow", "Frequently asked questions", "Answers before you sign up."),
  e(
    "hero.headline",
    "Common questions, honest answers.",
    "Everything below is drafted for review — no marketing spin."
  ),
  e(
    "hero.body",
    "Common questions",
    "The questions below cover the areas we're asked about most. Each answer is drafted for Content Owner review."
  ),
  e(
    "q.who",
    "Who is NelyoHealth for?",
    "Patients, families supporting relatives, providers running clinics, and organisations coordinating care for a covered population."
  ),
  e(
    "q.data",
    "Where is my data stored?",
    "Records are stored on approved regional infrastructure. Access follows explicit consent and role permissions."
  ),
  e(
    "q.payment",
    "Does paying for care grant record access?",
    "No. Payment covers services rendered. Record access is granted through separate consent and role permissions."
  ),
  e(
    "q.emergency",
    "What happens in an emergency?",
    "Emergency guidance surfaces immediately. Emergency care is never blocked by payment, plan authorisation, or booking status."
  ),
  e(
    "q.family",
    "How does family sponsorship work?",
    "Sponsors pay for care and see what the patient chooses to share — usually the appointment status and receipt, never the clinical chart unless the patient grants specific consent."
  ),
  e(
    "q.provider-details",
    "Why don't I see pharmacy details before paying?",
    "Provider location and contact details unlock only after successful payment, and only for the specific order. This is a core privacy boundary of the platform."
  ),
  e(
    "cta.headline",
    "Still have questions?",
    "Reach out through the contact page."
  )
];
