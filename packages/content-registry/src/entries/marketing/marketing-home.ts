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
  e(
    "hero.eyebrow",
    "One record. One team. Every step of care.",
    "Coordinated care built for Nigeria and the diaspora."
  ),
  e(
    "hero.headline",
    "Care that keeps up with your life — not the other way round.",
    "See the same chart, the same clinician, the same follow-up. Everywhere care happens."
  ),
  e(
    "hero.body",
    "Coordinated care from intake to follow-up",
    "Book a consult, share the details you choose, get a prescription or lab order, and pick up the next step without repeating your history to another stranger. NelyoHealth threads intake, triage, consult, fulfilment, and follow-up onto one connected record so care teams — and the people who love you — stay in sync."
  ),
  e(
    "story.a.headline",
    "Your chart, not five WhatsApp threads.",
    "When your clinician can see everything at once, decisions get faster and safer."
  ),
  e(
    "story.a.body",
    "One patient view",
    "Consults, prescriptions, and lab results live in one place, updated the moment they happen. Your clinician stops guessing, you stop re-explaining, and the follow-up gets easier for everyone."
  ),
  e(
    "story.b.headline",
    "Support family from anywhere — without seeing what you shouldn't.",
    "Sponsors pay, book, and get status updates. Records stay with the patient."
  ),
  e(
    "story.b.body",
    "Support family from anywhere",
    "Diaspora sponsors help cover consultations and follow-ups on approved terms. The patient controls what a sponsor can see — usually receipts and appointment status, never the clinical chart unless they explicitly share it."
  ),
  e(
    "trust.privacy",
    "Privacy that stands up to scrutiny",
    "Consent and role boundaries are enforced end-to-end. Payment does not unlock records."
  ),
  e(
    "trust.verified",
    "Credentialed clinicians",
    "Every clinician on the platform is verified and monitored against clinical standards. If someone isn't in good standing, they don't practise here."
  ),
  e(
    "trust.coordination",
    "Care that closes the loop",
    "Follow-ups, referrals, and results route automatically instead of getting lost between visits."
  ),
  e(
    "faq.who",
    "Who is NelyoHealth actually for?",
    "Patients who want their record in one place. Family sponsors coordinating care from abroad. Clinicians who want to practise without the paperwork tax. Employers and HMOs coordinating covered populations — with clear boundaries between commercial data and clinical data."
  ),
  e(
    "faq.data",
    "Where does my data live, and who sees it?",
    "Records are stored on approved regional infrastructure. Access is scoped to the roles you approve. Sponsors, employers, and payers never see the clinical chart unless you explicitly share it — and you can revoke access at any time from your account."
  ),
  e(
    "cta.headline",
    "Ready to see coordinated care in practice?",
    "Book a walkthrough tailored to how you'll use the platform."
  ),
  e(
    "cta.body",
    "Ready to see it in practice",
    "Pick the tour that matches your role — patient, family sponsor, clinician, or organisation partner. No card required, and no automated call from a sales team on the other end."
  )
];
