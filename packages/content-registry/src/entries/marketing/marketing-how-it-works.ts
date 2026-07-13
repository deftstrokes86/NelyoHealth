import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-how-it-works.${slug}`,
  family: "marketing-how-it-works",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const marketingHowItWorksEntries: ContentEntry[] = [
  e("hero.eyebrow", "How the platform works", "Intake through follow-up on one surface."),
  e(
    "hero.headline",
    "Care flows through five clear steps.",
    "Intake, triage, consult, fulfilment, follow-up."
  ),
  e(
    "hero.body",
    "How coordinated care flows",
    "Every patient journey passes through the same five stages — with hand-offs the platform routes automatically."
  ),
  e(
    "step.intake",
    "Intake",
    "Structured intake collects the right context without asking twice. Consent boundaries are stated up front."
  ),
  e(
    "step.triage",
    "Triage",
    "Clinical review routes the patient to the right care path — consult, referral, or emergency guidance."
  ),
  e(
    "step.consult",
    "Consult",
    "Consult happens in-app or in-person, always on the same connected record."
  ),
  e(
    "step.fulfilment",
    "Fulfilment",
    "Prescriptions and lab orders route to approved partners — with provider details revealed only after payment."
  ),
  e(
    "step.followup",
    "Follow-up",
    "Automatic reminders and outcome capture close the loop instead of relying on memory."
  ),
  e(
    "trust.a",
    "No hand-off is left to memory",
    "Every transition is logged and audit-ready."
  ),
  e(
    "trust.b",
    "Consent boundaries are enforced end-to-end",
    "Role permissions apply at every step, not just at sign-in."
  ),
  e(
    "faq.speed",
    "How long does it take?",
    "Time depends on care need. Emergencies escalate immediately; routine consults are usually booked within the same day."
  ),
  e(
    "cta.headline",
    "See a walkthrough for your role.",
    "Choose the tour that matches how you'll use the platform."
  )
];
