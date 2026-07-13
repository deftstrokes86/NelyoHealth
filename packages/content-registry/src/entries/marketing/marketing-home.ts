import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string, cta?: string): ContentEntry => ({
  id: `marketing-home.${slug}`,
  family: "marketing-home",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  ...(cta ? { cta } : {}),
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const marketingHomeEntries: ContentEntry[] = [
  e("hero.eyebrow", "One connected care platform", "For patients, families, providers, and organisations."),
  e(
    "hero.headline",
    "Care that follows the patient — not the paperwork.",
    "Coordinated care from intake to follow-up on one secure surface."
  ),
  e(
    "hero.body",
    "Coordinated care in Nigeria and the diaspora",
    "Route intake, triage, consult, fulfilment, and follow-up on a single surface built for how care actually moves across clinics, labs, and pharmacies."
  ),
  e(
    "story.a.headline",
    "One patient view. One workflow.",
    "Clinicians see the whole picture instead of piecing it together across notebooks, WhatsApp threads, and paper referrals."
  ),
  e(
    "story.a.body",
    "One patient view",
    "Intake, consult notes, prescriptions, and lab results live on one connected record — with role boundaries the platform enforces."
  ),
  e(
    "story.b.headline",
    "Support family from anywhere.",
    "Family sponsors can book, pay, and track care for loved ones without ever seeing what they aren't supposed to see."
  ),
  e(
    "story.b.body",
    "Support family from anywhere",
    "Diaspora sponsors book consults and cover care within explicit consent boundaries — no accidental over-sharing."
  ),
  e(
    "trust.privacy",
    "Privacy by design",
    "Consent and role boundaries are enforced end-to-end, not bolted on after the fact."
  ),
  e(
    "trust.verified",
    "Verified clinicians",
    "Licensed professionals, credential-checked, and monitored against clinical standards."
  ),
  e(
    "trust.coordination",
    "End-to-end coordination",
    "From first consult to follow-up — connected, audit-ready, and never left to memory."
  ),
  e(
    "faq.who",
    "Who is NelyoHealth for?",
    "Patients, families supporting relatives, providers running clinics, and organisations coordinating care for a covered population."
  ),
  e(
    "faq.data",
    "Where is my data stored?",
    "Records are stored on approved regional infrastructure. Access follows explicit consent and role permissions — payment alone never unlocks records."
  ),
  e(
    "cta.headline",
    "Ready to see coordinated care in practice?",
    "Book a walkthrough tailored to your role."
  ),
  e(
    "cta.body",
    "Ready to see it in practice",
    "Book a walkthrough tailored to your role — patient, family sponsor, provider, or organisation."
  )
];
