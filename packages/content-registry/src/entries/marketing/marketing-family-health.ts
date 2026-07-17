import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-family-health.${slug}`,
  family: "marketing-family-health",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const marketingFamilyHealthEntries: ContentEntry[] = [
  // ---------- Hero ----------
  e("hero.eyebrow", "Family Health", "Family Health hero eyebrow."),
  e(
    "hero.headline",
    "Healthcare works better when families care together.",
    "Family Health hero headline."
  ),
  e(
    "hero.body",
    "Family Health hero supporting copy",
    "Whether you're raising children under one roof or supporting ageing parents from another country, NelyoHealth keeps everyone connected through one secure healthcare journey."
  ),
  e("hero.cta.primary", "Explore Family Health", "Hero primary CTA label."),
  e("hero.cta.secondary", "How Care Circles Work", "Hero secondary CTA label."),

  // ---------- Section 2 — Choose your family journey ----------
  e("journey.eyebrow", "Choose your family journey", "Journey section eyebrow."),
  e(
    "journey.headline",
    "Two families. Two journeys.",
    "Journey section headline."
  ),
  e(
    "journey.body",
    "Journey section supporting copy",
    "Living together or living apart, the way a family coordinates care is different. Start where your family actually is."
  ),
  e(
    "journey.household.headline",
    "Our family lives together",
    "Household journey card headline."
  ),
  e(
    "journey.household.body",
    "Household journey card supporting copy",
    "Manage healthcare for everyone in your household from one secure account."
  ),
  e("journey.household.point1", "Book appointments", "Household card point."),
  e("journey.household.point2", "Track vaccinations", "Household card point."),
  e("journey.household.point3", "Manage medications", "Household card point."),
  e("journey.household.point4", "Receive reminders", "Household card point."),
  e(
    "journey.household.point5",
    "Coordinate care for every family member",
    "Household card point."
  ),
  e("journey.household.cta", "Explore Household Care", "Household card CTA label."),
  e(
    "journey.diaspora.headline",
    "I support family from abroad",
    "Diaspora journey card headline."
  ),
  e(
    "journey.diaspora.body",
    "Diaspora journey card supporting copy",
    "Support parents and loved ones in Nigeria with secure updates, appointment coordination, medication tracking and shared healthcare visibility."
  ),
  e("journey.diaspora.point1", "Coordinate appointments", "Diaspora card point."),
  e("journey.diaspora.point2", "Track medications", "Diaspora card point."),
  e("journey.diaspora.point3", "Pay from anywhere", "Diaspora card point."),
  e("journey.diaspora.point4", "See every update", "Diaspora card point."),
  e("journey.diaspora.cta", "Explore Diaspora Care", "Diaspora card CTA label."),

  // ---------- Section 3 — Care Circles ----------
  e("circle.eyebrow", "Care Circles", "Care Circle section eyebrow."),
  e("circle.headline", "Meet your Care Circle.", "Care Circle section headline."),
  e(
    "circle.body",
    "Care Circle section supporting copy",
    "Healthcare isn't managed by one person. Every patient is surrounded by people who help them stay healthy — and NelyoHealth brings them together securely."
  ),
  e(
    "circle.hint",
    "Hover or tap a role to see what they do.",
    "Care Circle interaction hint."
  ),
  e(
    "circle.default.title",
    "The patient is at the centre.",
    "Care Circle default panel title, shown before a role is selected."
  ),
  e(
    "circle.default.body",
    "Care Circle default panel body",
    "Everyone in the circle connects back to one person — the patient, who owns the record and controls every permission. Select a role to see how they help."
  ),
  // Care Circle nodes: each has role, permission, responsibility, example
  e("circle.node.patient.role", "Patient", "Care Circle node role."),
  e(
    "circle.node.patient.permission",
    "Owns the record and every permission",
    "Care Circle node permission."
  ),
  e(
    "circle.node.patient.responsibility",
    "Decides who joins the circle and what they can see",
    "Care Circle node responsibility."
  ),
  e(
    "circle.node.patient.example",
    "Grants a daughter access to book appointments.",
    "Care Circle node example interaction."
  ),
  e("circle.node.parent.role", "Parent", "Care Circle node role."),
  e(
    "circle.node.parent.permission",
    "Manages a child's care",
    "Care Circle node permission."
  ),
  e(
    "circle.node.parent.responsibility",
    "Books appointments and approves treatment for minors",
    "Care Circle node responsibility."
  ),
  e(
    "circle.node.parent.example",
    "Books a child's vaccination and gets the reminder.",
    "Care Circle node example interaction."
  ),
  e("circle.node.guardian.role", "Guardian", "Care Circle node role."),
  e(
    "circle.node.guardian.permission",
    "Legal decision-making for a dependent",
    "Care Circle node permission."
  ),
  e(
    "circle.node.guardian.responsibility",
    "Consents to care on behalf of a dependent",
    "Care Circle node responsibility."
  ),
  e(
    "circle.node.guardian.example",
    "Approves a procedure for an elderly parent.",
    "Care Circle node example interaction."
  ),
  e("circle.node.adult-child.role", "Adult Child", "Care Circle node role."),
  e(
    "circle.node.adult-child.permission",
    "Coordinates and pays — clinical notes only if shared",
    "Care Circle node permission."
  ),
  e(
    "circle.node.adult-child.responsibility",
    "Books, pays and follows up from anywhere",
    "Care Circle node responsibility."
  ),
  e(
    "circle.node.adult-child.example",
    "Pays a mother's consultation from abroad.",
    "Care Circle node example interaction."
  ),
  e("circle.node.caregiver.role", "Caregiver", "Care Circle node role."),
  e(
    "circle.node.caregiver.permission",
    "Day-to-day support access",
    "Care Circle node permission."
  ),
  e(
    "circle.node.caregiver.responsibility",
    "Manages medication schedules and reminders",
    "Care Circle node responsibility."
  ),
  e(
    "circle.node.caregiver.example",
    "Receives a reminder to give evening medication.",
    "Care Circle node example interaction."
  ),
  e("circle.node.doctor.role", "Doctor", "Care Circle node role."),
  e(
    "circle.node.doctor.permission",
    "Clinical access to the patient's record",
    "Care Circle node permission."
  ),
  e(
    "circle.node.doctor.responsibility",
    "Updates diagnosis, treatment and referrals",
    "Care Circle node responsibility."
  ),
  e(
    "circle.node.doctor.example",
    "Updates the treatment plan after a consult.",
    "Care Circle node example interaction."
  ),
  e("circle.node.hospital.role", "Hospital", "Care Circle node role."),
  e(
    "circle.node.hospital.permission",
    "Inpatient coordination access",
    "Care Circle node permission."
  ),
  e(
    "circle.node.hospital.responsibility",
    "Coordinates admission and discharge",
    "Care Circle node responsibility."
  ),
  e(
    "circle.node.hospital.example",
    "Coordinates inpatient care and shares the discharge summary.",
    "Care Circle node example interaction."
  ),
  e("circle.node.laboratory.role", "Laboratory", "Care Circle node role."),
  e(
    "circle.node.laboratory.permission",
    "Receives orders, returns results",
    "Care Circle node permission."
  ),
  e(
    "circle.node.laboratory.responsibility",
    "Runs tests and shares results securely",
    "Care Circle node responsibility."
  ),
  e(
    "circle.node.laboratory.example",
    "Shares blood results straight to the record.",
    "Care Circle node example interaction."
  ),
  e("circle.node.pharmacy.role", "Pharmacy", "Care Circle node role."),
  e(
    "circle.node.pharmacy.permission",
    "Receives prescriptions",
    "Care Circle node permission."
  ),
  e(
    "circle.node.pharmacy.responsibility",
    "Fulfils and dispenses medication",
    "Care Circle node responsibility."
  ),
  e(
    "circle.node.pharmacy.example",
    "Receives the prescription and prepares the medication.",
    "Care Circle node example interaction."
  ),
  e("circle.label.permission", "Permission", "Care Circle detail-panel label."),
  e("circle.label.responsibility", "Responsibility", "Care Circle detail-panel label."),
  e("circle.label.example", "In practice", "Care Circle detail-panel label."),

  // ---------- Section 4 — Role-based permissions ----------
  e("perms.eyebrow", "Permissions", "Permissions section eyebrow."),
  e(
    "perms.headline",
    "Everyone stays informed. Everyone sees only what they should.",
    "Permissions section headline."
  ),
  e(
    "perms.body",
    "Permissions section supporting copy",
    "Every Care Circle member has permissions you configure. Grant exactly what each person needs — nothing more."
  ),
  e("perms.item.appointments", "View appointments", "Permission item."),
  e("perms.item.book", "Book consultations", "Permission item."),
  e("perms.item.reminders", "Receive medication reminders", "Permission item."),
  e("perms.item.pay", "Pay medical bills", "Permission item."),
  e("perms.item.join", "Join consultations", "Permission item."),
  e("perms.item.labs", "View laboratory results", "Permission item."),
  e("perms.item.prescriptions", "Access prescriptions", "Permission item."),
  e("perms.item.emergency", "Emergency access", "Permission item."),
  e(
    "perms.footnote",
    "Permissions are controlled entirely by the patient — or their legal guardian — and can be changed or revoked at any time.",
    "Permissions section footnote."
  ),

  // ---------- Section 5 — Household Care ----------
  e("household.eyebrow", "Household Care", "Household section eyebrow."),
  e(
    "household.headline",
    "One account for the whole household.",
    "Household section headline."
  ),
  e(
    "household.body",
    "Household section supporting copy",
    "Every family member gets a profile. One shared calendar keeps appointments, medications and vaccinations in view — so nothing slips through."
  ),
  e("household.dashboard.title", "The Okonkwo family", "Household dashboard title."),
  e(
    "household.dashboard.caption",
    "One shared family calendar. One secure account.",
    "Household dashboard caption."
  ),
  e("household.member.stephen.name", "Stephen", "Household member name."),
  e("household.member.stephen.role", "You", "Household member relation."),
  e(
    "household.member.stephen.status",
    "Upcoming: GP review, 12 Aug",
    "Household member status line."
  ),
  e("household.member.sarah.name", "Sarah", "Household member name."),
  e("household.member.sarah.role", "Partner", "Household member relation."),
  e(
    "household.member.sarah.status",
    "Medication reminder set — 8:00 PM",
    "Household member status line."
  ),
  e("household.member.daniel.name", "Daniel", "Household member name."),
  e("household.member.daniel.role", "Son, 7", "Household member relation."),
  e(
    "household.member.daniel.status",
    "Vaccinations up to date",
    "Household member status line."
  ),
  e("household.member.grace.name", "Grace", "Household member name."),
  e("household.member.grace.role", "Mother", "Household member relation."),
  e(
    "household.member.grace.status",
    "Health alert: blood-pressure check due",
    "Household member status line."
  ),
  e("household.tag.appointments", "Upcoming appointments", "Household dashboard tag."),
  e("household.tag.medications", "Medication reminders", "Household dashboard tag."),
  e("household.tag.vaccinations", "Vaccination status", "Household dashboard tag."),
  e("household.tag.alerts", "Health alerts", "Household dashboard tag."),
  e(
    "household.disclaimer",
    "Illustrative example. Names and details shown for demonstration only.",
    "Honesty caveat: the household dashboard is a mockup, not real patient data."
  ),

  // ---------- Section 6 — Diaspora Care ----------
  e("diaspora.eyebrow", "Diaspora Care", "Diaspora section eyebrow."),
  e(
    "diaspora.headline",
    "Enugu and London, on the same page.",
    "Diaspora section headline."
  ),
  e(
    "diaspora.body",
    "Diaspora section supporting copy",
    "An adult daughter in London. Her mother in Enugu. A doctor, a laboratory and a pharmacy — all coordinated through NelyoHealth, so distance never means being left in the dark."
  ),
  e("diaspora.step1.title", "Appointment booked", "Diaspora timeline step."),
  e(
    "diaspora.step1.body",
    "Her daughter books the consultation from London.",
    "Diaspora timeline step detail."
  ),
  e("diaspora.step2.title", "Doctor consultation", "Diaspora timeline step."),
  e(
    "diaspora.step2.body",
    "The doctor in Enugu sees her mother.",
    "Diaspora timeline step detail."
  ),
  e("diaspora.step3.title", "Lab ordered", "Diaspora timeline step."),
  e(
    "diaspora.step3.body",
    "Tests are ordered and routed to a nearby laboratory.",
    "Diaspora timeline step detail."
  ),
  e("diaspora.step4.title", "Results shared", "Diaspora timeline step."),
  e(
    "diaspora.step4.body",
    "Results return securely to the record.",
    "Diaspora timeline step detail."
  ),
  e("diaspora.step5.title", "Prescription issued", "Diaspora timeline step."),
  e(
    "diaspora.step5.body",
    "The doctor issues a prescription.",
    "Diaspora timeline step detail."
  ),
  e("diaspora.step6.title", "Medication collected", "Diaspora timeline step."),
  e(
    "diaspora.step6.body",
    "The pharmacy fulfils it close to home.",
    "Diaspora timeline step detail."
  ),
  e("diaspora.step7.title", "Recovery updates", "Diaspora timeline step."),
  e(
    "diaspora.step7.body",
    "Progress is tracked and updated.",
    "Diaspora timeline step detail."
  ),
  e("diaspora.step8.title", "Family notified", "Diaspora timeline step."),
  e(
    "diaspora.step8.body",
    "Her daughter sees every step, as it happens.",
    "Diaspora timeline step detail."
  ),
  e("diaspora.value.continuity", "Continuity", "Diaspora value pill."),
  e("diaspora.value.transparency", "Transparency", "Diaspora value pill."),
  e("diaspora.value.peace", "Peace of mind", "Diaspora value pill."),

  // ---------- Section 7 — Why families choose NelyoHealth ----------
  e("why.eyebrow", "Why families choose NelyoHealth", "Why section eyebrow."),
  e(
    "why.headline",
    "Built for how families actually care.",
    "Why section headline."
  ),
  e("why.item.account.title", "One account, many members", "Why feature title."),
  e(
    "why.item.account.body",
    "Every family member on a single secure account.",
    "Why feature body."
  ),
  e("why.item.permissions.title", "Secure permissions", "Why feature title."),
  e(
    "why.item.permissions.body",
    "Grant exactly the access each person needs.",
    "Why feature body."
  ),
  e("why.item.circle.title", "Care Circle collaboration", "Why feature title."),
  e(
    "why.item.circle.body",
    "Everyone who helps, working from the same place.",
    "Why feature body."
  ),
  e("why.item.reminders.title", "Medication reminders", "Why feature title."),
  e(
    "why.item.reminders.body",
    "Timely nudges so doses aren't missed.",
    "Why feature body."
  ),
  e("why.item.vaccinations.title", "Vaccination tracking", "Why feature title."),
  e(
    "why.item.vaccinations.body",
    "Know what's due and what's done.",
    "Why feature body."
  ),
  e("why.item.appointments.title", "Shared appointments", "Why feature title."),
  e(
    "why.item.appointments.body",
    "Book, view and coordinate together.",
    "Why feature body."
  ),
  e("why.item.emergency.title", "Emergency contacts", "Why feature title."),
  e(
    "why.item.emergency.body",
    "The right people reachable when it matters.",
    "Why feature body."
  ),
  e("why.item.history.title", "Medical history", "Why feature title."),
  e(
    "why.item.history.body",
    "One record that follows the patient.",
    "Why feature body."
  ),
  e("why.item.coordination.title", "Provider coordination", "Why feature title."),
  e(
    "why.item.coordination.body",
    "Doctors, labs and pharmacies in sync.",
    "Why feature body."
  ),

  // ---------- Section 8 — Privacy & consent ----------
  e("privacy.eyebrow", "Privacy & consent", "Privacy section eyebrow."),
  e(
    "privacy.headline",
    "Consent is the foundation, not the fine print.",
    "Privacy section headline."
  ),
  e(
    "privacy.body",
    "Privacy section supporting copy",
    "Family coordination only works when trust is built in. Access is granted by people, verified by role, and reversible at any moment."
  ),
  e(
    "privacy.point.children.title",
    "Children require guardian consent",
    "Privacy point title."
  ),
  e(
    "privacy.point.children.body",
    "Care for a minor runs through a verified parent or guardian.",
    "Privacy point body."
  ),
  e(
    "privacy.point.adults.title",
    "Adults control their own permissions",
    "Privacy point title."
  ),
  e(
    "privacy.point.adults.body",
    "Every adult decides who sees what — and nobody is added without their say-so.",
    "Privacy point body."
  ),
  e(
    "privacy.point.elders.title",
    "Older adults invite trusted family",
    "Privacy point title."
  ),
  e(
    "privacy.point.elders.body",
    "Ageing relatives choose who they bring in, and can step back at any time.",
    "Privacy point body."
  ),
  e(
    "privacy.point.change.title",
    "Change permissions anytime",
    "Privacy point title."
  ),
  e(
    "privacy.point.change.body",
    "Grant, adjust or revoke access in a tap — no reason required.",
    "Privacy point body."
  ),
  e("privacy.badge.ndpr", "NDPR-aligned", "Privacy badge."),
  e("privacy.badge.encrypted", "Encrypted end to end", "Privacy badge."),
  e("privacy.badge.auditable", "Every access logged", "Privacy badge."),

  // ---------- Section 9 — Testimonials ----------
  e("testimonials.eyebrow", "Families on NelyoHealth", "Testimonials eyebrow."),
  e(
    "testimonials.headline",
    "Coordination people can feel.",
    "Testimonials headline."
  ),
  e(
    "testimonials.caveat",
    "Illustrative examples for preview only. Not statements from real patients or clinicians.",
    "Honesty caveat: testimonials are synthetic."
  ),
  e(
    "testimonials.parent.quote",
    "The whole family is finally on one calendar. I can see Grace's blood-pressure checks and the kids' vaccinations without chasing anyone.",
    "Testimonial quote (illustrative parent persona)."
  ),
  e("testimonials.parent.name", "A parent", "Testimonial attribution."),
  e(
    "testimonials.parent.role",
    "Coordinating a household, Lagos",
    "Testimonial attribution detail."
  ),
  e(
    "testimonials.diaspora.quote",
    "I pay for my mother's consultations and see every result from Houston. For the first time, distance doesn't mean guessing.",
    "Testimonial quote (illustrative diaspora persona)."
  ),
  e("testimonials.diaspora.name", "An adult son", "Testimonial attribution."),
  e(
    "testimonials.diaspora.role",
    "Supporting his mother from abroad",
    "Testimonial attribution detail."
  ),
  e(
    "testimonials.caregiver.quote",
    "The medication reminders land on my phone. I know exactly what to give and when — nothing is left to memory.",
    "Testimonial quote (illustrative caregiver persona)."
  ),
  e("testimonials.caregiver.name", "A caregiver", "Testimonial attribution."),
  e(
    "testimonials.caregiver.role",
    "Supporting an elderly relative, Abuja",
    "Testimonial attribution detail."
  ),
  e(
    "testimonials.doctor.quote",
    "When a patient arrives, the referral, consent and prior notes are already there. I coordinate with the lab and pharmacy without a single phone call.",
    "Testimonial quote (illustrative clinician persona)."
  ),
  e("testimonials.doctor.name", "A doctor", "Testimonial attribution."),
  e(
    "testimonials.doctor.role",
    "General practitioner, Enugu",
    "Testimonial attribution detail."
  ),

  // ---------- Section 10 — FAQ ----------
  e("faq.eyebrow", "Family Health FAQ", "FAQ section eyebrow."),
  e("faq.headline", "Family Health questions, answered.", "FAQ section headline."),
  e(
    "faq.children",
    "Can I manage healthcare for my children?",
    "As a verified parent or guardian you manage a minor's appointments, records and care decisions — until they're old enough to manage their own."
  ),
  e(
    "faq.sister",
    "Can my sister help care for our mum?",
    "Yes. Your mother can invite your sister into her Care Circle and choose exactly what she can do — from booking appointments to receiving reminders."
  ),
  e(
    "faq.father-remove",
    "Can my father remove my access?",
    "Always. Any adult controls their own Care Circle and can adjust or revoke a member's access at any time, without needing a reason."
  ),
  e(
    "faq.who-sees",
    "Who can see medical records?",
    "Only the people the patient explicitly approves. Coordinating care — booking or paying — never requires access to clinical notes unless the patient shares them."
  ),
  e(
    "faq.specialist",
    "Can my doctor invite another specialist?",
    "A doctor can refer to a specialist through the platform. The patient approves the referral, and the specialist sees only what's relevant to that care."
  ),
  e(
    "faq.how",
    "How do Care Circles work?",
    "A Care Circle is the group of people around a patient — family, caregivers and providers — each with permissions the patient sets. Everyone works from the same record, seeing only their slice."
  ),

  // ---------- Final CTA ----------
  e(
    "final.headline",
    "Bring your family's healthcare together.",
    "Final CTA headline."
  ),
  e(
    "final.body",
    "Final CTA supporting copy",
    "Whether your family lives together or across continents, NelyoHealth helps everyone stay connected through one secure Care Circle."
  ),
  e("final.cta.primary", "Create Your Family Account", "Final CTA primary label."),
  e(
    "final.cta.secondary",
    "See Care Circles in Action",
    "Final CTA secondary label."
  )
];
