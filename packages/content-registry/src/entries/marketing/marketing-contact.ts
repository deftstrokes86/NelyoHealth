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
  e("hero.eyebrow", "Contact", "How to reach us."),
  e(
    "hero.headline",
    "Reach the team that fits your question.",
    "Choose the channel that matches what you need."
  ),
  e(
    "hero.body",
    "Contact overview",
    "Whether you're a patient, a family sponsor, a provider, or an organisation partner — start with the channel that matches your role."
  ),
  e(
    "route.patients",
    "For patients and families",
    "Reach support through the in-app help centre once you have an account."
  ),
  e(
    "route.partners",
    "For provider and organisation partners",
    "Use the partner enquiry form to start onboarding conversations."
  ),
  e(
    "route.press",
    "For press and community enquiries",
    "Use the general contact form. Please include the outlet or community you represent."
  ),
  e(
    "note.emergency",
    "This channel is not for emergencies.",
    "For emergencies, call your local emergency service. This platform is not a substitute for emergency care."
  ),
  e(
    "cta.headline",
    "Send us a message.",
    "Use the contact form to reach the right team."
  )
];
