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
  e(
    "hero.eyebrow",
    "Frequently asked questions",
    "The questions we get before people sign up — answered plainly."
  ),
  e(
    "hero.headline",
    "Honest answers to the things you're actually wondering.",
    "No marketing spin. Where the platform isn't ready yet, we say so."
  ),
  e(
    "hero.body",
    "Common questions",
    "Below are the questions we hear most often — from patients, family sponsors, clinicians, and organisation partners. If yours isn't here, the contact page routes to the right team."
  ),
  e(
    "q.who",
    "Who is NelyoHealth actually for?",
    "Patients who want their record in one place, family sponsors coordinating care from abroad, clinicians who want the paperwork to stop leaking, and organisations coordinating care for a covered population — with clear boundaries between the commercial and clinical sides."
  ),
  e(
    "q.data",
    "Where does my data live?",
    "Records are stored on approved regional infrastructure. Access is scoped to the roles you approve. Sponsors, employers, and payers never see the clinical chart unless you specifically share it."
  ),
  e(
    "q.payment",
    "Does paying for care unlock the record?",
    "No. Payment covers services rendered. Record access is a separate consent decision, handled through role permissions you control from your account settings."
  ),
  e(
    "q.emergency",
    "What happens in an actual emergency?",
    "Call your local emergency service — always. Emergency guidance in the app surfaces immediately, regardless of your account state, plan authorisation, or payment history. The platform doesn't dispatch emergency services."
  ),
  e(
    "q.family",
    "How does family sponsorship work?",
    "You sponsor specific appointments and orders. You get receipts and status updates. You do not get the clinical chart — unless the patient explicitly shares it with you, and they can withdraw that at any time."
  ),
  e(
    "q.provider-details",
    "Why don't I see pharmacy details before I pay?",
    "Location and contact details for pharmacies and labs unlock only after successful payment, and only for the specific order. It's a privacy boundary that protects both patients and provider partners from the marketplace being scraped."
  ),
  e(
    "cta.headline",
    "Still wondering about something?",
    "The contact page routes to the right team — patients, partners, or press."
  )
];
