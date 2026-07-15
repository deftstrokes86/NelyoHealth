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
  ),
  e(
    "fragmented.eyebrow",
    "The Reality",
    "Section 2 eyebrow — sets a documentary, honest tone before the emotional recognition."
  ),
  e(
    "fragmented.headline",
    "Healthcare isn't broken. It's disconnected.",
    "The core reframing. Not a criticism of clinicians or hospitals — a naming of the system-level problem."
  ),
  e(
    "fragmented.body",
    "You visit one hospital. Your test happens somewhere else. Your prescription is filled by another provider.",
    "You visit one hospital. Your test happens somewhere else. Your prescription is filled by another provider. Between them, your records stay behind — so you carry the summary in your head, the folder in your bag, and repeat your story again. Every appointment often starts from zero. The people caring for you rarely have the full picture, and the parts of your care rarely see each other. None of this is anyone's fault. It's what happens when the pieces of care don't talk."
  ),
  e(
    "fragmented.card.record.title",
    "You become the medical record.",
    "First card. Names the specific weight of holding your own history in your head."
  ),
  e(
    "fragmented.card.record.body",
    "You become the medical record.",
    "After every appointment you're expected to remember medications, diagnoses, laboratory results and previous treatments — because the next provider rarely has the full picture. The record ends up in your head, or in a folder in your bag."
  ),
  e(
    "fragmented.card.repeat.title",
    "Every visit starts from the beginning.",
    "Second card. Names the fatigue of re-telling."
  ),
  e(
    "fragmented.card.repeat.body",
    "Every visit starts from the beginning.",
    "The same questions. The same explanations. The same medical history you already gave last visit. Instead of continuing your care, each appointment often feels like starting over — one more time, from the beginning, with someone new."
  ),
  e(
    "fragmented.card.disconnect.title",
    "Care continues — but the information doesn't.",
    "Third card. Names the drop between the actors."
  ),
  e(
    "fragmented.card.disconnect.body",
    "Care continues but the information doesn't.",
    "Your doctor recommends tests. The laboratory performs them. The pharmacy dispenses medication. Your family helps at home. Each part does its job well — but none of them naturally stay connected. The pieces move forward while the picture stays in fragments."
  ),
  e(
    "fragmented.card.memory.title",
    "Healthcare shouldn't depend on memory.",
    "Fourth card. Names the alternative — care that doesn't leak into WhatsApp threads."
  ),
  e(
    "fragmented.card.memory.body",
    "Healthcare shouldn't depend on memory.",
    "Missed follow-ups. Forgotten prescriptions. Lost reports. Reminders that live inside WhatsApp threads and paper envelopes. Healthcare should move forward with you — not depend on how carefully you remembered to write it down, or where you last put it."
  ),
  e(
    "fragmented.transition.headline",
    "Healthcare works best when everyone works together.",
    "Transition headline. Sets up Section 3 without naming the platform."
  ),
  e(
    "fragmented.transition.body",
    "The challenge isn't finding doctors, hospitals, laboratories, or pharmacies.",
    "The challenge isn't finding doctors, hospitals, laboratories, or pharmacies. The challenge is helping them work together around one patient."
  )
];
