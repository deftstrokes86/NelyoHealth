import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-contact.${slug}`,
  family: "marketing-contact",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const marketingContactEntries: ContentEntry[] = [
  e(
    "hero.eyebrow",
    "Contact",
    "Get to the right team on the first try."
  ),
  e(
    "hero.headline",
    "Talk to a person — the person who can actually help.",
    "Pick the channel that matches your role and we'll route you correctly the first time."
  ),
  e(
    "hero.body",
    "Contact overview",
    "This page isn't for emergencies. For those, call your local emergency service. For everything else — patients, family sponsors, clinician partners, organisation partners, press — pick the channel below and we'll route you to a person who understands the context."
  ),
  e(
    "route.patients",
    "Patients and families",
    "Once you have an account, in-app help routes you to the support team who can see your context. Faster than restating it here."
  ),
  e(
    "route.partners",
    "Clinician and organisation partners",
    "Use the partner enquiry form for pharmacy, laboratory, clinic, employer, HMO, or hospital onboarding conversations. A named person on our operations team will reply."
  ),
  e(
    "route.press",
    "Press and community",
    "Use the general contact form. Please tell us the outlet or community you represent so we can route you to the right voice."
  ),
  e(
    "note.emergency",
    "This channel is not for emergencies",
    "In an emergency, call your local emergency service directly. NelyoHealth does not dispatch emergency response."
  ),
  e(
    "cta.headline",
    "Send us a message",
    "The contact form routes to the right team based on what you pick above."
  )
];
