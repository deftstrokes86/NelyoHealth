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
  e(
    "hero.eyebrow",
    "How coordinated care actually moves",
    "Five stages. One record. No re-explaining your history."
  ),
  e(
    "hero.headline",
    "From first symptom to full follow-up — on the same page.",
    "See the exact path a patient takes through NelyoHealth."
  ),
  e(
    "hero.body",
    "How coordinated care flows",
    "Every journey moves through the same five stages: intake, triage, consult, fulfilment, follow-up. The platform handles the routing so care teams focus on the person in front of them, and you don't have to chase updates between visits."
  ),
  e(
    "step.intake",
    "Intake — context collected once",
    "Answer a short structured intake before you're in the room. The platform pulls forward what you shared last time so you're never explaining chronic conditions from scratch."
  ),
  e(
    "step.triage",
    "Triage — the right care path, quickly",
    "A qualified clinician reviews the intake and routes you to the right care — a video consult, an in-person visit, or emergency guidance when the situation can't wait."
  ),
  e(
    "step.consult",
    "Consult — with the whole picture in view",
    "Whether the consult happens in-app or in person, the clinician has your consented history, current prescriptions, and recent results. Decisions get made from context, not guesswork."
  ),
  e(
    "step.fulfilment",
    "Fulfilment — orders route to approved partners",
    "Prescriptions and lab orders travel to credentialed pharmacies and labs with the clinical context attached. You see the approved partner before payment and the full pickup details after."
  ),
  e(
    "step.followup",
    "Follow-up — automated so nothing slips",
    "The platform tracks what needs a check-in and when. Reminders arrive with context — not just \"how are you doing?\" — and outcomes go back on the same record."
  ),
  e(
    "trust.a",
    "Every hand-off is logged",
    "The audit trail records who saw what, when, and under which consent. Care teams can retrace decisions when they need to."
  ),
  e(
    "trust.b",
    "Consent boundaries hold at every step",
    "Role permissions are checked at intake, at triage, at fulfilment, and at follow-up — not just at sign-in."
  ),
  e(
    "faq.speed",
    "How fast does this actually move?",
    "Routine consults usually book same-day. Prescription and lab orders route to approved partners within minutes of clinician sign-off. Emergency guidance surfaces immediately, regardless of payment status."
  ),
  e(
    "cta.headline",
    "See a tour tailored to your role",
    "Book a walkthrough for how you'll actually use the platform."
  )
];
