import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-segment-doctors.${slug}`,
  family: "marketing-segment-doctors",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const marketingSegmentDoctorsEntries: ContentEntry[] = [
  e(
    "hero.eyebrow",
    "For doctors and clinics",
    "Practise medicine. Skip the paperwork tax."
  ),
  e(
    "hero.headline",
    "One patient view. One workflow. Fewer hand-offs to the void.",
    "Intake, prescribing, referrals, and follow-up on the same connected record — with the clinical decisions squarely where they belong."
  ),
  e(
    "hero.body",
    "Practise in a connected workflow",
    "Structured intake arrives before the consult. Referrals move with clinical context attached. Prescriptions and lab orders route to credentialed partners on your signature. The platform handles the routing so you can focus on the patient in front of you."
  ),
  e(
    "story.a.headline",
    "Clinical decisions stay with you.",
    "The platform routes and records. It doesn't diagnose."
  ),
  e(
    "story.a.body",
    "Clinical decisions stay with clinicians",
    "Diagnostic reasoning, prescribing decisions, and referral choices all remain with a qualified clinician. Nothing on this platform second-guesses you or replaces your judgment — it just makes sure the audit trail and the follow-up are ready."
  ),
  e(
    "story.b.headline",
    "Sign records. Add amendments. Keep the audit clean.",
    "Finalised clinical records use versioned amendments — never silent overwrites."
  ),
  e(
    "story.b.body",
    "Amendments over overwrite",
    "Once you've signed a record, corrections happen as amendments so history is preserved. If you ever need to explain a decision months later, the timeline still makes sense."
  ),
  e(
    "trust.audit",
    "Audit-ready by default",
    "Every access, every routing, every signature — logged, traceable, and yours to review."
  ),
  e(
    "faq.autonomy",
    "Does the platform second-guess my clinical decisions?",
    "No. Diagnostic and prescribing decisions stay with qualified clinicians. The platform coordinates hand-offs, keeps the record consistent, and reminds patients about follow-ups. It never overrides you or acts on your behalf."
  ),
  e(
    "cta.headline",
    "See how it fits your practice",
    "Book a walkthrough tailored to how your clinic actually runs."
  )
];
