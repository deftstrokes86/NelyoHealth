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
    "Start with the essentials. Role-specific onboarding continues on the next screen."
  ),
  e(
    "hero.body",
    "Create account overview",
    "We ask for the minimum first — enough to get you into the right onboarding path. Consent and role decisions come next, and you can walk them back at any time from your account settings."
  ),
  e("field.name", "Full name", "Your legal or preferred name."),
  e(
    "field.email",
    "Email address",
    "We use this to verify and secure your account."
  ),
  e(
    "field.phone",
    "Phone number",
    "Optional. Used for account recovery and two-factor verification only."
  ),
  e(
    "field.password",
    "Password",
    "Choose a password you don't reuse elsewhere."
  ),
  e(
    "note.privacy",
    "Consent decisions are made on the next screen — not buried in the T&Cs.",
    "You'll explicitly confirm what data is collected and who can see what before continuing."
  )
];
