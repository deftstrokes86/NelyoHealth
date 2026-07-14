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
  ),
  e(
    "ecosystem.eyebrow",
    "One connected healthcare ecosystem",
    "Every participant. Every hand-off. One record."
  ),
  e(
    "ecosystem.headline",
    "Healthcare doesn't happen in one place.",
    "It moves between people, buildings, and systems — and it usually loses something at each hand-off."
  ),
  e(
    "ecosystem.subheadline",
    "Healthcare involves many people.",
    "From your first symptom to your last follow-up, healthcare involves many people. NelyoHealth keeps everyone connected so your care doesn't fall apart between appointments."
  ),
  e(
    "ecosystem.patient.title",
    "You",
    "The record travels with you — and only unfolds for the roles you allow."
  ),
  e(
    "ecosystem.hint",
    "Tap a role to see what NelyoHealth coordinates for them.",
    "Interactive hint shown below the network on desktop and above the carousel on mobile."
  ),
  e(
    "ecosystem.cta",
    "See the coordination in your context",
    "Book a walkthrough tailored to the role you play in care."
  ),
  e(
    "ecosystem.node.doctor.title",
    "Doctor",
    "Diagnose. Treat. Follow up."
  ),
  e(
    "ecosystem.node.doctor.body",
    "The clinician's role",
    "The full patient chart shows up before the room does. Diagnoses, prescriptions, and referrals write back to the same record — with amendments, never overwrites."
  ),
  e(
    "ecosystem.node.hospital.title",
    "Hospital",
    "Receive referrals with the whole story attached."
  ),
  e(
    "ecosystem.node.hospital.body",
    "The hospital's role",
    "Referrals arrive with intake, consent, and clinical context already attached. Records access, care coordination, and discharge summaries all move on the same connected chart — no duplicate paperwork at the front desk."
  ),
  e(
    "ecosystem.node.pharmacy.title",
    "Pharmacy",
    "Fulfil prescriptions that are signed, sourced, and traceable."
  ),
  e(
    "ecosystem.node.pharmacy.body",
    "The pharmacy's role",
    "Signed prescriptions route with dosage, indication, and any relevant consented history. Fulfilment status flows back to the patient. Provider details unlock only after payment, and only for that order."
  ),
  e(
    "ecosystem.node.laboratory.title",
    "Laboratory",
    "Receive digital orders. Return results to the record."
  ),
  e(
    "ecosystem.node.laboratory.body",
    "The laboratory's role",
    "Diagnostic orders arrive with indication and consent attached. Results return to the ordering clinician automatically — the platform alerts the clinician the moment a result is signed off."
  ),
  e(
    "ecosystem.node.caregiver.title",
    "Caregiver",
    "Support a loved one's care on approved terms."
  ),
  e(
    "ecosystem.node.caregiver.body",
    "The caregiver's role",
    "Book appointments, coordinate refills, and stay across follow-ups for someone you look after — under permissions the patient granted, and can revoke, from their account."
  ),
  e(
    "ecosystem.node.employer.title",
    "Employer",
    "Provide healthcare benefits your team actually uses."
  ),
  e(
    "ecosystem.node.employer.body",
    "The employer's role",
    "Population-level coverage, eligibility, and uptake reporting — never individual clinical detail. The line between commercial data and clinical data is enforced in code, not policy."
  ),
  e(
    "ecosystem.node.hmo.title",
    "HMO",
    "Coordinate covered care without overriding the clinician."
  ),
  e(
    "ecosystem.node.hmo.body",
    "The HMO's role",
    "Authorisations, utilisation reporting, plan boundary decisions. Coverage runs alongside clinical judgment — never overrides it, and never gates emergency care."
  ),
  e(
    "ecosystem.node.family.title",
    "Family",
    "Stay in the loop — only where you've been invited."
  ),
  e(
    "ecosystem.node.family.body",
    "Family visibility",
    "Family members see the exact slices of care the patient chooses to share. Usually appointment status and receipts. Never the clinical chart unless it's specifically opened."
  ),
  e(
    "ecosystem.node.emergency.title",
    "Emergency",
    "Access critical information in the moment it matters."
  ),
  e(
    "ecosystem.node.emergency.body",
    "Emergency access",
    "A pre-authorised emergency view surfaces essential clinical context to responders — allergies, active prescriptions, safeguarding notes — the moment an emergency is flagged. Never blocked by payment or plan authorisation."
  ),
  e(
    "ecosystem.node.records.title",
    "Medical records",
    "One authoritative chart. Every role reads their slice."
  ),
  e(
    "ecosystem.node.records.body",
    "The record itself",
    "Signed clinical records use versioned amendments — never silent overwrites. Every access is logged. Every consent decision is visible and reversible from the patient's account."
  )
];
