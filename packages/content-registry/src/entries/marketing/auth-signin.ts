import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `auth-signin.${slug}`,
  family: "auth-signin",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const authSigninEntries: ContentEntry[] = [
  e("hero.headline", "Sign in to NelyoHealth.", "Continue to your coordinated care surface."),
  e(
    "hero.body",
    "Sign in overview",
    "Sign in continues you into the surface for your role — patient, family sponsor, provider, or organisation partner."
  ),
  e("field.email", "Email address", "Enter the email tied to your account."),
  e("field.password", "Password", "Enter your account password."),
  e(
    "note.recovery",
    "Trouble signing in?",
    "Use recover access to reset your password. Contact support if the account is locked."
  ),
  e(
    "note.privacy",
    "Sessions are secured by role.",
    "Role-aware routing takes you to the right surface after a successful sign-in."
  )
];
