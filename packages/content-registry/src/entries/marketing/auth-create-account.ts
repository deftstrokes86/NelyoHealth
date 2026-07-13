import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `auth-create-account.${slug}`,
  family: "auth-create-account",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const authCreateAccountEntries: ContentEntry[] = [
  e(
    "hero.headline",
    "Create your NelyoHealth account.",
    "Start with the essentials, then continue into role-specific onboarding."
  ),
  e(
    "hero.body",
    "Create account overview",
    "We collect the minimum first, then continue into onboarding tailored to your role — patient, family sponsor, provider, or organisation partner."
  ),
  e("field.name", "Full name", "Enter your legal or preferred name."),
  e("field.email", "Email address", "We use this to verify and secure your account."),
  e(
    "field.phone",
    "Phone number",
    "Optional. Used for account recovery and two-factor verification."
  ),
  e("field.password", "Password", "Choose a password you don't reuse elsewhere."),
  e(
    "note.privacy",
    "Consent boundaries are set during onboarding.",
    "You'll review and confirm consent and role permissions before continuing."
  )
];
