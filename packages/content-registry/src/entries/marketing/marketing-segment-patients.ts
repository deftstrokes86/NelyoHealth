import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-segment-patients.${slug}`,
  family: "marketing-segment-patients",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const marketingSegmentPatientsEntries: ContentEntry[] = [
  e(
    "hero.eyebrow",
    "For patients and families",
    "Care that respects your time — and your record."
  ),
  e(
    "hero.headline",
    "Book a consult. See real results. Keep the people you trust in the loop.",
    "One account. Every follow-up in one place. Consent that you can actually see and change."
  ),
  e(
    "hero.body",
    "Care that follows you",
    "Consults, prescriptions, lab results, and family updates all live under one account. You choose who sees what — and you can change your mind any time. No more calling three clinics to piece your own history together."
  ),
  e(
    "story.a.headline",
    "Your record is yours. Actually.",
    "Not \"yours\" as in a portal you can barely log into. Yours — with the controls to prove it."
  ),
  e(
    "story.a.body",
    "Your record stays with you",
    "You see what's in your chart. You decide who else can. Family members see the exact slices you approve — usually appointment status and receipts, never the full clinical history unless you specifically share it."
  ),
  e(
    "story.b.headline",
    "Honest availability. No fake urgency.",
    "See the next real slot from a clinician who's actually available."
  ),
  e(
    "story.b.body",
    "Simple booking, honest waits",
    "The platform shows genuine availability windows — not \"limited slots left\" scarcity theatre. If a clinician is booked out, we say so, and offer the next reasonable option."
  ),
  e(
    "trust.privacy",
    "You control the access — and can revoke it",
    "Every consent decision is visible and reversible from your account settings."
  ),
  e(
    "faq.access",
    "Can family members see my clinical records?",
    "Only if you've approved that specific access, and only for the records you named. You can revoke it at any point, and the platform stops surfacing your data to that role from then on. Prior access stays audit-logged."
  ),
  e(
    "cta.headline",
    "Ready to book your first consult?",
    "Create an account and get started in under two minutes."
  )
];
