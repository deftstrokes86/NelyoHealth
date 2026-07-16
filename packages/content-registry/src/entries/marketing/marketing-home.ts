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
  ),
  e(
    "journey.eyebrow",
    "The Journey",
    "Section 4 eyebrow — signals this is a walkthrough of a real care episode, not a feature list."
  ),
  e(
    "journey.headline",
    "One journey. Every step connected.",
    "Chosen over \"From your first symptom to feeling better\" — pays off the disconnection theme from Section 2 and the coordination theme from Section 3."
  ),
  e(
    "journey.body",
    "Good healthcare isn't just about a diagnosis.",
    "Good healthcare isn't just about getting a diagnosis. It's about making sure every step that follows is connected. From your first symptom to your recovery, NelyoHealth keeps your care moving forward — with the right people, at the right time, with the right information."
  ),
  e(
    "journey.step1.headline",
    "You notice something isn't right.",
    "Step 1 of 8. Opens with a familiar, low-stakes moment — no urgency or fear, just a decision to act."
  ),
  e(
    "journey.step1.body",
    "You notice something isn't right.",
    "A headache that won't go away. A persistent cough. Your child develops a fever. Instead of guessing or waiting, you decide to seek help."
  ),
  e(
    "journey.step1.cta",
    "Start your care journey",
    "Step 1 CTA — routes to account creation."
  ),
  e(
    "journey.step2.headline",
    "Understand what might be happening.",
    "Step 2 of 8. Introduces the AI assistant strictly as a preparation aid, never a diagnostic authority."
  ),
  e(
    "journey.step2.body",
    "Understand what might be happening.",
    "NelyoHealth's AI helps organise your symptoms and prepares useful information before you speak with a clinician. It doesn't diagnose you. It helps you have a more informed consultation."
  ),
  e(
    "journey.step2.cta",
    "Prepare for your consultation",
    "Step 2 CTA — routes to account creation."
  ),
  e(
    "journey.step3.headline",
    "Meet the right healthcare professional.",
    "Step 3 of 8. The clinician arrives already briefed — no blank-slate consultation."
  ),
  e(
    "journey.step3.body",
    "Meet the right healthcare professional.",
    "You're connected with a licensed healthcare provider who reviews your symptoms, medical history, and previous records before your consultation begins."
  ),
  e(
    "journey.step3.cta",
    "Talk to a clinician",
    "Step 3 CTA — routes to the doctors segment page."
  ),
  e(
    "journey.step4.headline",
    "Your care continues — not your paperwork.",
    "Step 4 of 8. Pays off the Section 2 promise that patients shouldn't have to carry their own file between providers."
  ),
  e(
    "journey.step4.body",
    "Your care continues — not your paperwork.",
    "Prescriptions, referrals, and laboratory requests are shared securely with the right providers. You don't need to carry paper files between appointments."
  ),
  e(
    "journey.step4.cta",
    "Continue your care",
    "Step 4 CTA — routes to account creation."
  ),
  e(
    "journey.step5.headline",
    "Complete your tests and treatment.",
    "Step 5 of 8. Laboratory and pharmacy are shown as one connected step, not two separate errands."
  ),
  e(
    "journey.step5.body",
    "Complete your tests and treatment.",
    "If laboratory tests are needed, participating laboratories receive your request digitally. Prescriptions can be fulfilled by trusted pharmacies connected to the platform."
  ),
  e(
    "journey.step5.cta",
    "Complete treatment",
    "Step 5 CTA — routes to the pharmacies segment page."
  ),
  e(
    "journey.step6.headline",
    "Stay connected after your appointment.",
    "Step 6 of 8. Establishes that recovery, not the consult, is the actual finish line."
  ),
  e(
    "journey.step6.body",
    "Stay connected after your appointment.",
    "Recovery doesn't stop when the consultation ends. You'll receive reminders, follow-up care, and ongoing support to help you stay on track."
  ),
  e(
    "journey.step6.cta",
    "Stay on track",
    "Step 6 CTA — routes to account creation."
  ),
  e(
    "journey.step7.headline",
    "Your care circle stays informed.",
    "Step 7 of 8. Consent-gated family visibility — reinforces the privacy boundary established in Section 3."
  ),
  e(
    "journey.step7.body",
    "Your care circle stays informed.",
    "With your permission, family members or caregivers can receive updates and help support your recovery. It's perfect for elderly parents, children, or loved ones living independently."
  ),
  e(
    "journey.step7.cta",
    "Invite family",
    "Step 7 CTA — routes to the family plans page."
  ),
  e(
    "journey.step8.headline",
    "Every step becomes part of your story.",
    "Step 8 of 8. Closes the loop back to \"one connected record\" from the homepage hero."
  ),
  e(
    "journey.step8.body",
    "Every step becomes part of your story.",
    "Your consultations, prescriptions, laboratory results, and treatment history are securely organised into one continuous health record — ready whenever you need care again."
  ),
  e(
    "journey.step8.cta",
    "View your health journey",
    "Step 8 CTA — routes to account creation."
  ),
  e(
    "journey.transition.headline",
    "Healthcare works better when everyone works together.",
    "Closing panel headline. Sets up Section 5, the AI trust section, without naming it."
  ),
  e(
    "journey.transition.body",
    "Behind every consultation is a network of people working together.",
    "Behind every consultation is a network of healthcare professionals, caregivers, and organisations working together to help you recover — not just treat today's symptoms."
  ),
  e(
    "journey.transition.cta",
    "Explore the people behind your care",
    "Closing panel CTA. Anchors down to Section 5, the AI trust section, which explains who stays responsible for care."
  ),
  e(
    "ai.eyebrow",
    "Artificial Intelligence",
    "Section 5 eyebrow."
  ),
  e(
    "ai.headline",
    "Technology should make healthcare feel more human.",
    "Central message of Section 5 — reframes AI as something that clears space for people, not a replacement for them."
  ),
  e(
    "ai.body",
    "Healthcare is built on trust, experience, and human judgment.",
    "Healthcare is built on trust, experience, and human judgment. Artificial intelligence doesn't replace the people who care for you. It simply removes repetitive work, organises information, and helps your healthcare team spend more time focused on what matters most — you."
  ),
  e(
    "ai.group1.headline",
    "Helping patients feel informed",
    "Group 1 of 3. Explains how AI improves the patient experience before a consultation."
  ),
  e(
    "ai.group1.body",
    "Helping patients feel informed",
    "Before every consultation, AI can help organise symptoms, prepare medical information, and explain care plans in clear, everyday language. It helps patients feel prepared — not overwhelmed."
  ),
  e(
    "ai.group1.bullet1",
    "Organises symptoms before appointments",
    "Group 1, bullet 1."
  ),
  e(
    "ai.group1.bullet2",
    "Explains medical information in simpler language",
    "Group 1, bullet 2."
  ),
  e(
    "ai.group1.bullet3",
    "Sends reminders for medications and follow-ups",
    "Group 1, bullet 3."
  ),
  e(
    "ai.group2.headline",
    "Helping clinicians focus on care",
    "Group 2 of 3. Explains that AI reduces administrative work, not clinical judgment."
  ),
  e(
    "ai.group2.body",
    "Helping clinicians focus on care",
    "Healthcare professionals should spend their time listening, diagnosing, and treating patients — not searching through records or repeating documentation. AI helps organise information so clinicians can focus on delivering better care."
  ),
  e(
    "ai.group2.bullet1",
    "Summarises previous consultations",
    "Group 2, bullet 1."
  ),
  e(
    "ai.group2.bullet2",
    "Highlights allergies, medications, and test results",
    "Group 2, bullet 2."
  ),
  e(
    "ai.group2.bullet3",
    "Reduces repetitive documentation",
    "Group 2, bullet 3."
  ),
  e(
    "ai.group3.headline",
    "Helping healthcare work together",
    "Group 3 of 3. Explains ecosystem-level coordination, tying back to Section 3."
  ),
  e(
    "ai.group3.body",
    "Helping healthcare work together",
    "Healthcare involves many people — doctors, laboratories, pharmacies, caregivers, hospitals. AI helps the right information reach the right people at the right time, making every step feel connected."
  ),
  e(
    "ai.group3.bullet1",
    "Coordinates referrals",
    "Group 3, bullet 1."
  ),
  e(
    "ai.group3.bullet2",
    "Keeps care teams updated",
    "Group 3, bullet 2."
  ),
  e(
    "ai.group3.bullet3",
    "Supports continuity of care",
    "Group 3, bullet 3."
  ),
  e(
    "ai.trust.headline",
    "People make healthcare. AI helps them do it better.",
    "Trust panel headline — the section's thesis stated plainly."
  ),
  e(
    "ai.trust.body",
    "Every decision remains a licensed professional's responsibility.",
    "Every diagnosis, prescription, and treatment decision on NelyoHealth remains the responsibility of licensed healthcare professionals. Artificial intelligence simply helps organise information, reduce administrative work, and improve communication across the healthcare journey."
  ),
  e(
    "ai.trust.badge1",
    "Licensed clinicians make every medical decision.",
    "Trust badge 1 of 4."
  ),
  e(
    "ai.trust.badge2",
    "AI supports care. It never replaces doctors.",
    "Trust badge 2 of 4."
  ),
  e(
    "ai.trust.badge3",
    "Patient information stays private and secure.",
    "Trust badge 3 of 4."
  ),
  e(
    "ai.trust.badge4",
    "Human oversight at every stage.",
    "Trust badge 4 of 4."
  ),
  e(
    "ai.cta.primary",
    "See how connected care works",
    "Section 5 primary CTA — loops back up to the ecosystem section."
  ),
  e(
    "ai.cta.secondary",
    "Learn how we protect your data",
    "Section 5 secondary CTA — routes to the privacy overview page."
  ),
  e(
    "solutions.eyebrow",
    "Solutions",
    "Section 6 eyebrow."
  ),
  e(
    "solutions.headline",
    "One platform. Built for everyone involved in healthcare.",
    "Chosen over \"Whoever you are in healthcare, you belong here\" — states the section's claim plainly and pairs with the \"One journey\" headline from Section 4."
  ),
  e(
    "solutions.body",
    "Healthcare works best when everyone has the right information.",
    "Healthcare works best when everyone has the right information at the right time. NelyoHealth gives every participant — from patients and doctors to pharmacies, employers, and families — the tools they need to deliver better coordinated care."
  ),
  e(
    "solutions.cta.secondary",
    "Learn more",
    "Shared secondary-link label used under every audience tab; each tab points it at that audience's own segment page."
  ),
  e("solutions.patients.label", "Patients", "Tab 1 nav label."),
  e("solutions.doctors.label", "Doctors", "Tab 2 nav label."),
  e("solutions.hospitals.label", "Hospitals", "Tab 3 nav label."),
  e("solutions.pharmacies.label", "Pharmacies", "Tab 4 nav label."),
  e("solutions.laboratories.label", "Laboratories", "Tab 5 nav label."),
  e("solutions.employers.label", "Employers", "Tab 6 nav label."),
  e("solutions.hmos.label", "HMOs", "Tab 7 nav label."),
  e("solutions.diaspora.label", "Diaspora Families", "Tab 8 nav label."),
  e(
    "solutions.patients.headline",
    "Healthcare that stays with you — not just your appointment.",
    "Tab 1 of 8: Patients."
  ),
  e(
    "solutions.patients.body",
    "Healthcare that stays with you",
    "Whether you're managing a long-term condition, treating an illness, or simply looking after your health, NelyoHealth keeps every step of your care connected."
  ),
  e("solutions.patients.benefit1", "Book consultations", "Patients, benefit 1."),
  e("solutions.patients.benefit2", "Access one complete health record", "Patients, benefit 2."),
  e("solutions.patients.benefit3", "Receive prescriptions and lab requests digitally", "Patients, benefit 3."),
  e("solutions.patients.benefit4", "Get reminders and follow-up support", "Patients, benefit 4."),
  e(
    "solutions.patients.cta",
    "Start your healthcare journey",
    "Tab 1 primary CTA — routes to account creation."
  ),
  e(
    "solutions.doctors.headline",
    "Spend more time treating patients. Less time managing paperwork.",
    "Tab 2 of 8: Doctors."
  ),
  e(
    "solutions.doctors.body",
    "Spend more time treating patients",
    "NelyoHealth helps clinicians review patient information quickly, coordinate care more effectively, and stay connected with the wider healthcare team."
  ),
  e("solutions.doctors.benefit1", "Complete patient history", "Doctors, benefit 1."),
  e("solutions.doctors.benefit2", "AI-assisted consultation summaries", "Doctors, benefit 2."),
  e("solutions.doctors.benefit3", "Digital referrals", "Doctors, benefit 3."),
  e("solutions.doctors.benefit4", "Secure follow-ups", "Doctors, benefit 4."),
  e(
    "solutions.doctors.cta",
    "Join as a healthcare professional",
    "Tab 2 primary CTA — routes to the partner contact form."
  ),
  e(
    "solutions.hospitals.headline",
    "Coordinate care beyond your walls.",
    "Tab 3 of 8: Hospitals."
  ),
  e(
    "solutions.hospitals.body",
    "Coordinate care beyond your walls",
    "Improve continuity of care by connecting consultations, referrals, laboratories, pharmacies, and patient records across every stage of treatment."
  ),
  e("solutions.hospitals.benefit1", "Digital referrals", "Hospitals, benefit 1."),
  e("solutions.hospitals.benefit2", "Shared medical records", "Hospitals, benefit 2."),
  e("solutions.hospitals.benefit3", "Connected departments", "Hospitals, benefit 3."),
  e("solutions.hospitals.benefit4", "Better patient continuity", "Hospitals, benefit 4."),
  e(
    "solutions.hospitals.cta",
    "Partner with NelyoHealth",
    "Tab 3 primary CTA — routes to the partner contact form."
  ),
  e(
    "solutions.pharmacies.headline",
    "Confident dispensing starts with trusted information.",
    "Tab 4 of 8: Pharmacies."
  ),
  e(
    "solutions.pharmacies.body",
    "Confident dispensing starts with trusted information",
    "Receive verified prescriptions, keep patients informed, and become an active participant in every patient's recovery journey."
  ),
  e("solutions.pharmacies.benefit1", "Verified prescriptions", "Pharmacies, benefit 1."),
  e("solutions.pharmacies.benefit2", "Medication status updates", "Pharmacies, benefit 2."),
  e("solutions.pharmacies.benefit3", "Secure communication", "Pharmacies, benefit 3."),
  e("solutions.pharmacies.benefit4", "Better adherence", "Pharmacies, benefit 4."),
  e(
    "solutions.pharmacies.cta",
    "Register your pharmacy",
    "Tab 4 primary CTA — routes to the partner contact form."
  ),
  e(
    "solutions.laboratories.headline",
    "Deliver results that move care forward.",
    "Tab 5 of 8: Laboratories."
  ),
  e(
    "solutions.laboratories.body",
    "Deliver results that move care forward",
    "Receive digital laboratory requests, upload results securely, and keep clinicians informed without unnecessary delays."
  ),
  e("solutions.laboratories.benefit1", "Digital requests", "Laboratories, benefit 1."),
  e("solutions.laboratories.benefit2", "Secure reporting", "Laboratories, benefit 2."),
  e("solutions.laboratories.benefit3", "Faster turnaround", "Laboratories, benefit 3."),
  e("solutions.laboratories.benefit4", "Better coordination", "Laboratories, benefit 4."),
  e(
    "solutions.laboratories.cta",
    "Join our laboratory network",
    "Tab 5 primary CTA — routes to the partner contact form."
  ),
  e(
    "solutions.employers.headline",
    "Healthcare your employees will actually use.",
    "Tab 6 of 8: Employers."
  ),
  e(
    "solutions.employers.body",
    "Healthcare your employees will actually use",
    "Provide your workforce with easier access to consultations, follow-up care, and coordinated healthcare, while giving HR teams visibility into programme engagement."
  ),
  e("solutions.employers.benefit1", "Employee healthcare", "Employers, benefit 1."),
  e("solutions.employers.benefit2", "Preventive care", "Employers, benefit 2."),
  e("solutions.employers.benefit3", "Health dashboards", "Employers, benefit 3."),
  e("solutions.employers.benefit4", "Reduced absenteeism", "Employers, benefit 4."),
  e(
    "solutions.employers.cta",
    "Explore corporate healthcare",
    "Tab 6 primary CTA — routes to the partner contact form."
  ),
  e(
    "solutions.hmos.headline",
    "Better coordination creates better healthcare outcomes.",
    "Tab 7 of 8: HMOs."
  ),
  e(
    "solutions.hmos.body",
    "Better coordination creates better outcomes",
    "Work with a connected ecosystem that simplifies patient journeys, improves visibility, and helps members receive the care they need with fewer administrative barriers."
  ),
  e("solutions.hmos.benefit1", "Digital authorisations", "HMOs, benefit 1."),
  e("solutions.hmos.benefit2", "Better claims support", "HMOs, benefit 2."),
  e("solutions.hmos.benefit3", "Connected providers", "HMOs, benefit 3."),
  e("solutions.hmos.benefit4", "Improved member experience", "HMOs, benefit 4."),
  e(
    "solutions.hmos.cta",
    "Partner with NelyoHealth",
    "Tab 7 primary CTA — routes to the partner contact form."
  ),
  e(
    "solutions.diaspora.headline",
    "Take care of home — even when you're thousands of miles away.",
    "Tab 8 of 8: Diaspora Families."
  ),
  e(
    "solutions.diaspora.body",
    "Take care of home from anywhere",
    "Support parents and loved ones in Nigeria with coordinated healthcare, trusted providers, and secure updates that help you stay connected to their wellbeing."
  ),
  e("solutions.diaspora.benefit1", "Book care remotely", "Diaspora families, benefit 1."),
  e("solutions.diaspora.benefit2", "Follow treatment progress", "Diaspora families, benefit 2."),
  e("solutions.diaspora.benefit3", "Stay informed", "Diaspora families, benefit 3."),
  e("solutions.diaspora.benefit4", "Support loved ones confidently", "Diaspora families, benefit 4."),
  e(
    "solutions.diaspora.cta",
    "Care for family in Nigeria",
    "Tab 8 primary CTA — routes to account creation."
  ),
  e(
    "solutions.transition.headline",
    "Different people. One connected healthcare journey.",
    "Closing panel headline. Sets up Section 7, the trust section, without naming it."
  ),
  e(
    "solutions.transition.body",
    "Healthcare only works when everyone has the information they need.",
    "Healthcare only works when everyone involved has the information they need. NelyoHealth brings patients, families, clinicians, and healthcare organisations together around one shared goal — better care."
  ),
  e(
    "solutions.transition.cta",
    "See why people trust NelyoHealth",
    "Closing panel CTA — routes to the trust and safety page, since no in-page trust section exists yet on the homepage."
  ),
  e(
    "family-abroad.eyebrow",
    "For Nigerians Abroad",
    "Section 7 eyebrow."
  ),
  e(
    "family-abroad.headline",
    "Take care of home, wherever life takes you.",
    "Chosen over \"Because caring for family shouldn't depend on your location\" — the stronger, more affirmative emotional beat to close on."
  ),
  e(
    "family-abroad.body",
    "Living abroad doesn't stop you from worrying about the people you love.",
    "Living abroad doesn't stop you from worrying about the people you love. When a parent feels unwell, you're often left coordinating care through phone calls, messages, and relatives — without knowing exactly what's happening. NelyoHealth helps you stay connected to your family's healthcare journey, even when you're thousands of miles away."
  ),
  e(
    "family-abroad.story.title",
    "A familiar moment.",
    "Highlighted story panel title."
  ),
  e(
    "family-abroad.story.line1",
    "It's 2:15 a.m.",
    "Story line 1 of 9."
  ),
  e(
    "family-abroad.story.line2",
    "Your phone rings.",
    "Story line 2 of 9."
  ),
  e(
    "family-abroad.story.line3",
    "Your mother isn't feeling well.",
    "Story line 3 of 9."
  ),
  e(
    "family-abroad.story.line4",
    "You immediately begin making calls.",
    "Story line 4 of 9."
  ),
  e(
    "family-abroad.story.line5",
    "You ask neighbours for updates.",
    "Story line 5 of 9."
  ),
  e(
    "family-abroad.story.line6",
    "You wonder whether she has seen a doctor.",
    "Story line 6 of 9."
  ),
  e(
    "family-abroad.story.line7",
    "You worry if she remembered her medication.",
    "Story line 7 of 9."
  ),
  e(
    "family-abroad.story.line8",
    "You hope someone is keeping you informed.",
    "Story line 8 of 9."
  ),
  e(
    "family-abroad.story.line9",
    "No one should have to coordinate healthcare this way.",
    "Story line 9 of 9 — the turn, sets up the feature highlights that follow."
  ),
  e(
    "family-abroad.card1.headline",
    "Book healthcare from anywhere.",
    "Card 1 of 6."
  ),
  e(
    "family-abroad.card1.body",
    "Book healthcare from anywhere",
    "Arrange consultations for your loved ones without waiting until your next trip home."
  ),
  e(
    "family-abroad.card2.headline",
    "Stay informed with permission.",
    "Card 2 of 6 — consent and privacy are the point of this card."
  ),
  e(
    "family-abroad.card2.body",
    "Stay informed with permission",
    "Receive updates about appointments and progress only when your family member chooses to share them."
  ),
  e(
    "family-abroad.card3.headline",
    "Support ongoing care.",
    "Card 3 of 6."
  ),
  e(
    "family-abroad.card3.body",
    "Support ongoing care",
    "Help loved ones stay on track with medications, follow-up appointments, and long-term treatment plans."
  ),
  e(
    "family-abroad.card4.headline",
    "Trusted healthcare network.",
    "Card 4 of 6."
  ),
  e(
    "family-abroad.card4.body",
    "Trusted healthcare network",
    "Connect your family with verified doctors, hospitals, pharmacies, and laboratories across the NelyoHealth ecosystem."
  ),
  e(
    "family-abroad.card5.headline",
    "One healthcare history.",
    "Card 5 of 6."
  ),
  e(
    "family-abroad.card5.body",
    "One healthcare history",
    "Medical records stay organised, making future consultations easier and reducing the need to repeat medical information."
  ),
  e(
    "family-abroad.card6.headline",
    "Peace of mind.",
    "Card 6 of 6."
  ),
  e(
    "family-abroad.card6.body",
    "Peace of mind",
    "Spend less time worrying about what might be happening and more time knowing your loved ones are supported."
  ),
  e(
    "family-abroad.trust.headline",
    "Built around trust, privacy, and consent.",
    "Trust panel headline."
  ),
  e(
    "family-abroad.trust.body",
    "Healthcare information belongs to the patient.",
    "Healthcare information belongs to the patient. Family members only receive updates when permission has been given, and every interaction is protected using industry-standard security and privacy practices."
  ),
  e("family-abroad.trust.badge1", "Patient-controlled access", "Trust badge 1 of 4."),
  e("family-abroad.trust.badge2", "Secure communication", "Trust badge 2 of 4."),
  e("family-abroad.trust.badge3", "NDPR-compliant data handling", "Trust badge 3 of 4."),
  e("family-abroad.trust.badge4", "Family support with consent", "Trust badge 4 of 4."),
  e(
    "family-abroad.cta.primary",
    "Support your family in Nigeria",
    "Section 7 primary CTA — routes to account creation."
  ),
  e(
    "family-abroad.cta.secondary",
    "Learn how family care works",
    "Section 7 secondary CTA — routes to the diaspora segment page."
  ),
  e(
    "trust-safety.eyebrow",
    "Trust & Safety",
    "Section 8 eyebrow."
  ),
  e(
    "trust-safety.headline",
    "Healthcare begins with trust.",
    "Chosen over \"Every decision we make starts with protecting yours\" — plainer and pairs with the section's closing line, \"Trust isn't a feature. It's the foundation.\""
  ),
  e(
    "trust-safety.body",
    "When people trust us with their healthcare, they're trusting us with some of the most personal information they'll ever share.",
    "When people trust us with their healthcare, they're trusting us with some of the most personal information they'll ever share. That's why every part of NelyoHealth — from verified healthcare professionals to secure medical records and patient-controlled consent — is designed to protect that trust."
  ),
  e(
    "trust-safety.card1.headline",
    "Your information stays private.",
    "Card 1 of 6. Icon: ShieldCheck."
  ),
  e(
    "trust-safety.card1.body",
    "Your information stays private.",
    "Your medical information belongs to you. Only the healthcare professionals involved in your care can access it, and only with the permissions required to provide treatment."
  ),
  e(
    "trust-safety.card1.expanded",
    "Patient-controlled access and role-based permissions.",
    "Access follows your care team, not the other way round. A pharmacist sees what's needed to fill a prescription. A laboratory sees what's needed to run a test. Nobody sees more than their role requires, and every access is logged against your record."
  ),
  e(
    "trust-safety.card2.headline",
    "Your consent comes first.",
    "Card 2 of 6. Icon: UserCheck."
  ),
  e(
    "trust-safety.card2.body",
    "Your consent comes first.",
    "You decide who can view your medical information, including family members, caregivers, and healthcare providers."
  ),
  e(
    "trust-safety.card2.expanded",
    "Consent, granted and withdrawn on your terms.",
    "Consent isn't a one-time checkbox. You can grant a family member access to your appointment status today and withdraw it tomorrow, directly from your account. Nothing is shared beyond what you've explicitly approved."
  ),
  e(
    "trust-safety.card3.headline",
    "Verified healthcare professionals.",
    "Card 3 of 6. Icon: BadgeCheck."
  ),
  e(
    "trust-safety.card3.body",
    "Verified healthcare professionals.",
    "Every clinician on NelyoHealth goes through credential verification before joining the platform."
  ),
  e(
    "trust-safety.card3.expanded",
    "Licence checks, identity checks, and ongoing standards.",
    "Before a clinician can practise on NelyoHealth, we verify their licence, confirm their identity, and check they're in good standing. That verification doesn't stop at onboarding — it continues for as long as they practise on the platform."
  ),
  e(
    "trust-safety.card4.headline",
    "Secure by design.",
    "Card 4 of 6. Icon: LockKeyhole."
  ),
  e(
    "trust-safety.card4.body",
    "Secure by design.",
    "Medical records are encrypted, protected, and securely stored using modern security practices."
  ),
  e(
    "trust-safety.card4.expanded",
    "Encrypted in transit and at rest.",
    "Your records are encrypted both while they're being sent and while they're stored — so the same protection applies whether a doctor is reviewing your chart or your data is simply sitting safely in our systems."
  ),
  e(
    "trust-safety.card5.headline",
    "Clinical governance.",
    "Card 5 of 6. Icon: HeartHandshake."
  ),
  e(
    "trust-safety.card5.body",
    "Clinical governance.",
    "Clinical policies, professional oversight, and quality assurance help ensure healthcare is delivered responsibly across the platform."
  ),
  e(
    "trust-safety.card5.expanded",
    "A governance framework behind every consultation.",
    "A clinical governance framework sits behind every consultation — covering how clinicians are onboarded, how quality is monitored, and how concerns are raised and resolved. It's the structure that keeps care accountable."
  ),
  e(
    "trust-safety.card6.headline",
    "Built for Nigeria.",
    "Card 6 of 6. Icon: Shield."
  ),
  e(
    "trust-safety.card6.body",
    "Built for Nigeria.",
    "NelyoHealth is designed with Nigerian healthcare regulations and the Nigeria Data Protection Act (NDPA) in mind, while following internationally recognised security best practices."
  ),
  e(
    "trust-safety.card6.expanded",
    "Local expectations, internationally recognised practices.",
    "We've built our privacy and data-handling practices around what Nigerian patients actually expect — informed consent, local data handling, and control that stays with you — alongside security practices recognised internationally."
  ),
  e(
    "trust-safety.governance.headline",
    "Technology supports care. Healthcare professionals lead it.",
    "Clinical governance panel headline — soft teal panel below the trust grid."
  ),
  e(
    "trust-safety.governance.body",
    "Every diagnosis, prescription, and treatment decision is made by qualified healthcare professionals.",
    "Every diagnosis, prescription, and treatment decision is made by qualified healthcare professionals. Technology helps organise information and improve coordination, but it never replaces professional medical judgement."
  ),
  e(
    "trust-safety.governance.principle1",
    "Qualified clinicians make medical decisions.",
    "Governance principle 1 of 3."
  ),
  e(
    "trust-safety.governance.principle2",
    "Clinical oversight is built into the platform.",
    "Governance principle 2 of 3."
  ),
  e(
    "trust-safety.governance.principle3",
    "Patients remain at the centre of every decision.",
    "Governance principle 3 of 3."
  ),
  e(
    "trust-safety.privacy.headline",
    "Your health information belongs to you.",
    "Privacy promise centered statement headline."
  ),
  e(
    "trust-safety.privacy.body",
    "You decide who can access your records.",
    "You decide who can access your records. You control whether family members receive updates. You can review and manage your permissions whenever you choose."
  ),
  e(
    "trust-safety.metric1.value",
    "100%",
    "Trust metric 1 of 4 — value."
  ),
  e(
    "trust-safety.metric1.label",
    "Licensed clinicians verified before joining",
    "Trust metric 1 of 4 — label."
  ),
  e(
    "trust-safety.metric2.value",
    "100%",
    "Trust metric 2 of 4 — value."
  ),
  e(
    "trust-safety.metric2.label",
    "Patient-controlled consent",
    "Trust metric 2 of 4 — label."
  ),
  e(
    "trust-safety.metric3.value",
    "24/7",
    "Trust metric 3 of 4 — value."
  ),
  e(
    "trust-safety.metric3.label",
    "Security monitoring",
    "Trust metric 3 of 4 — label."
  ),
  e(
    "trust-safety.metric4.value",
    "End-to-end",
    "Trust metric 4 of 4 — value."
  ),
  e(
    "trust-safety.metric4.label",
    "Encrypted communication",
    "Trust metric 4 of 4 — label."
  ),
  e(
    "trust-safety.final.headline",
    "Trust isn't a feature. It's the foundation.",
    "Final trust statement headline — closes the homepage narrative."
  ),
  e(
    "trust-safety.final.line1",
    "Every consultation.",
    "Final statement, line 1 of 6."
  ),
  e(
    "trust-safety.final.line2",
    "Every prescription.",
    "Final statement, line 2 of 6."
  ),
  e(
    "trust-safety.final.line3",
    "Every laboratory result.",
    "Final statement, line 3 of 6."
  ),
  e(
    "trust-safety.final.line4",
    "Every conversation.",
    "Final statement, line 4 of 6."
  ),
  e(
    "trust-safety.final.line5",
    "Every piece of information.",
    "Final statement, line 5 of 6."
  ),
  e(
    "trust-safety.final.line6",
    "Protected with the same care we expect for our own families.",
    "Final statement, line 6 of 6 — the closing turn."
  ),
  e(
    "trust-safety.cta.primary",
    "Learn more about how we protect your healthcare",
    "Section 8 primary CTA — routes to the trust and safety page."
  ),
  e(
    "trust-safety.cta.secondary",
    "Read our Privacy Policy",
    "Section 8 secondary CTA — routes to the privacy overview page."
  ),
  e(
    "faq-conversation.eyebrow",
    "Questions",
    "Homepage FAQ section eyebrow (design brief calls this \"Section 11\"; placed directly after Trust & Safety per instruction)."
  ),
  e(
    "faq-conversation.headline",
    "Honest answers before you get started.",
    "Homepage FAQ section headline."
  ),
  e(
    "faq-conversation.body",
    "Choosing a healthcare platform is an important decision.",
    "Choosing a healthcare platform is an important decision. These are some of the questions people ask us most before creating an account."
  ),
  e(
    "faq-conversation.q1.question",
    "Is NelyoHealth only for online consultations?",
    "Question 1 of 12."
  ),
  e(
    "faq-conversation.q1.answer",
    "No.",
    "No. NelyoHealth supports much more than virtual consultations. Depending on your needs, your care journey may include in-person appointments, laboratory tests, prescriptions, pharmacy services, and follow-up care. Our goal is to help every part of your healthcare work together — not simply provide video calls."
  ),
  e(
    "faq-conversation.q2.question",
    "Can I use NelyoHealth if I already have a doctor?",
    "Question 2 of 12."
  ),
  e(
    "faq-conversation.q2.answer",
    "Absolutely.",
    "Absolutely. NelyoHealth is designed to complement your existing healthcare relationships. If your doctor is part of the platform, staying connected becomes even easier. If not, you can still use many of the platform's features and continue receiving care from your preferred healthcare providers where appropriate."
  ),
  e(
    "faq-conversation.q3.question",
    "Can I book appointments for my parents or family members?",
    "Question 3 of 12."
  ),
  e(
    "faq-conversation.q3.answer",
    "Yes.",
    "Yes. Many people use NelyoHealth to help coordinate care for elderly parents, children, or loved ones. With the patient's permission, family members and caregivers can help book appointments, follow treatment plans, and stay informed throughout the care journey."
  ),
  e(
    "faq-conversation.q4.question",
    "Will my medical information remain private?",
    "Question 4 of 12."
  ),
  e(
    "faq-conversation.q4.answer",
    "Yes.",
    "Yes. Your health information belongs to you. Only authorised healthcare professionals involved in your care can access your records, and only when appropriate. You decide whether family members or caregivers receive updates, and you can manage those permissions at any time."
  ),
  e(
    "faq-conversation.q5.question",
    "Can I receive prescriptions through NelyoHealth?",
    "Question 5 of 12."
  ),
  e(
    "faq-conversation.q5.answer",
    "Yes, where clinically appropriate.",
    "Yes, where clinically appropriate. Licensed healthcare professionals can issue digital prescriptions during your consultation. Participating pharmacies on the platform can securely receive and fulfil those prescriptions in accordance with applicable regulations."
  ),
  e(
    "faq-conversation.q6.question",
    "What if I need laboratory tests?",
    "Question 6 of 12."
  ),
  e(
    "faq-conversation.q6.answer",
    "If your clinician recommends laboratory tests, participating laboratories can receive your request digitally.",
    "If your clinician recommends laboratory tests, participating laboratories on the platform can receive your request digitally. Once available, your results become part of your health record, making follow-up consultations easier and reducing unnecessary paperwork."
  ),
  e(
    "faq-conversation.q7.question",
    "Can Nigerians living abroad use NelyoHealth for their families?",
    "Question 7 of 12."
  ),
  e(
    "faq-conversation.q7.answer",
    "Yes.",
    "Yes. Nigerians living abroad can help coordinate healthcare for loved ones in Nigeria. With the patient's consent, family members can stay informed about appointments, treatment progress, and ongoing care while respecting privacy at every step."
  ),
  e(
    "faq-conversation.q8.question",
    "Can my employer provide NelyoHealth as a staff benefit?",
    "Question 8 of 12."
  ),
  e(
    "faq-conversation.q8.answer",
    "Yes.",
    "Yes. Employers can offer NelyoHealth as part of their employee wellbeing programme, giving staff easier access to consultations, coordinated healthcare services, and ongoing support."
  ),
  e(
    "faq-conversation.q9.question",
    "Can I use my HMO?",
    "Question 9 of 12."
  ),
  e(
    "faq-conversation.q9.answer",
    "Where supported, eligible HMOs can integrate with NelyoHealth.",
    "Where supported, eligible HMOs can integrate with NelyoHealth to help make accessing covered healthcare services easier. Coverage depends on your healthcare plan and participating HMO partners."
  ),
  e(
    "faq-conversation.q10.question",
    "Does NelyoHealth replace hospitals or my family doctor?",
    "Question 10 of 12."
  ),
  e(
    "faq-conversation.q10.answer",
    "No.",
    "No. NelyoHealth is not a replacement for hospitals, clinics, or your regular healthcare providers. It is designed to connect everyone involved in your care so your healthcare experience becomes more coordinated and less stressful."
  ),
  e(
    "faq-conversation.q11.question",
    "What happens during an emergency?",
    "Question 11 of 12."
  ),
  e(
    "faq-conversation.q11.answer",
    "NelyoHealth is not an emergency response service.",
    "NelyoHealth is not an emergency response service. If you or someone else is experiencing a medical emergency, contact your local emergency services or go to the nearest emergency department immediately. When appropriate, NelyoHealth can support follow-up care after the emergency has been treated."
  ),
  e(
    "faq-conversation.q12.question",
    "How much does NelyoHealth cost?",
    "Question 12 of 12."
  ),
  e(
    "faq-conversation.q12.answer",
    "Creating an account is free.",
    "Creating an account is free. The cost of consultations, laboratory services, medications, and other healthcare services depends on the provider and the care you receive. You'll always be able to see any applicable fees before confirming a paid service."
  ),
  e(
    "faq-conversation.panel.headline",
    "Didn't find the answer you were looking for?",
    "Bottom panel headline — soft teal panel closing the FAQ section."
  ),
  e(
    "faq-conversation.panel.body",
    "Bottom panel body",
    "Our support team is here to help you understand how NelyoHealth works and find the right care for your needs."
  ),
  e(
    "faq-conversation.panel.cta.primary",
    "Contact Support",
    "Bottom panel primary button — routes to the contact page."
  ),
  e(
    "faq-conversation.panel.cta.secondary",
    "Browse Help Centre",
    "Bottom panel secondary button — routes to the existing FAQ page, the closest equivalent to a help centre."
  ),
  e(
    "final-cta.eyebrow",
    "Your next step",
    "Section 12 eyebrow — the homepage's final section, before the footer."
  ),
  e(
    "final-cta.headline",
    "Healthcare works better when everyone stays connected.",
    "Chosen over \"A better healthcare experience begins with one decision\" — closes the loop on the connection theme running through the whole homepage, without introducing decision pressure."
  ),
  e(
    "final-cta.body",
    "Whether you're looking for care, supporting someone you love, growing your medical practice, or improving healthcare access for your organisation, NelyoHealth is designed to bring the right people together around one shared goal.",
    "Whether you're looking for care, supporting someone you love, growing your medical practice, or improving healthcare access for your organisation, NelyoHealth is designed to bring the right people together around one shared goal: better healthcare. Whenever you're ready, we're here."
  ),
  e(
    "final-cta.card1.headline",
    "Find care that stays connected.",
    "Card 1 of 4. Audience: Patients. Icon: HeartPulse."
  ),
  e(
    "final-cta.card1.body",
    "Find care that stays connected.",
    "Book a consultation, manage your health record, and keep every step of your care together."
  ),
  e(
    "final-cta.card1.cta",
    "Create Patient Account",
    "Card 1 primary button — routes to account creation."
  ),
  e(
    "final-cta.card2.headline",
    "Join a connected care network.",
    "Card 2 of 4. Audience: Healthcare Professionals. Icon: Stethoscope."
  ),
  e(
    "final-cta.card2.body",
    "Join a connected care network.",
    "Support more patients while spending less time coordinating information."
  ),
  e(
    "final-cta.card2.cta",
    "Join as a Doctor",
    "Card 2 primary button — routes to the partner contact form."
  ),
  e(
    "final-cta.card2.secondary",
    "Learn about clinician onboarding",
    "Card 2 secondary link — routes to the doctors segment page."
  ),
  e(
    "final-cta.card3.headline",
    "Build better healthcare together.",
    "Card 3 of 4. Audience: Healthcare Organisations. Icon: Building2."
  ),
  e(
    "final-cta.card3.body",
    "Build better healthcare together.",
    "Partner with NelyoHealth to connect hospitals, laboratories, pharmacies, HMOs, and healthcare services."
  ),
  e(
    "final-cta.card3.cta",
    "Become a Partner",
    "Card 3 primary button — routes to the partner contact form."
  ),
  e(
    "final-cta.card4.headline",
    "Stay close to the people who matter most.",
    "Card 4 of 4. Audience: Diaspora Families. Icon: Globe."
  ),
  e(
    "final-cta.card4.body",
    "Stay close to the people who matter most.",
    "Support your loved ones' healthcare in Nigeria, wherever you are in the world."
  ),
  e(
    "final-cta.card4.cta",
    "Support Family in Nigeria",
    "Card 4 primary button — routes to account creation."
  ),
  e(
    "final-cta.reassurance.headline",
    "Need more time? That's perfectly okay.",
    "Secondary reassurance panel headline."
  ),
  e(
    "final-cta.reassurance.body",
    "Healthcare decisions are important.",
    "Healthcare decisions are important. Take your time. Explore the platform, read our privacy commitments, or speak with our team before deciding. We're here whenever you need us."
  ),
  e(
    "final-cta.reassurance.cta.primary",
    "Learn More",
    "Reassurance panel primary button — routes to the how-it-works page."
  ),
  e(
    "final-cta.reassurance.cta.secondary",
    "Contact Our Team",
    "Reassurance panel secondary button — routes to the contact page."
  ),
  e(
    "final-cta.statement.headline",
    "Healthcare is personal. The way we experience it should be too.",
    "Final brand statement headline — the homepage's closing thought."
  ),
  e(
    "final-cta.statement.body",
    "NelyoHealth exists to make healthcare feel more connected, more transparent, and more human.",
    "NelyoHealth exists to make healthcare feel more connected, more transparent, and more human — for patients, families, healthcare professionals, and organisations across Nigeria."
  )
];
