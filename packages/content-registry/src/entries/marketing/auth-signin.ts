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
  e(
    "hero.headline",
    "Sign in to NelyoHealth.",
    "Continue where you left off — on the same connected record."
  ),
  e(
    "hero.body",
    "Sign in overview",
    "Signing in continues you into the surface for your role — patient, family sponsor, clinician, or organisation partner. Session handling is role-aware and enforces the same consent boundaries as the rest of the platform."
  ),
  e("field.email", "Email address", "The email tied to your account."),
  e("field.password", "Password", "Your account password."),
  e(
    "note.recovery",
    "Trouble signing in?",
    "Use recover access to reset your password. If your account is locked out, contact support and we'll unblock it after identity verification."
  ),
  e(
    "note.privacy",
    "We don't confirm whether an email is registered",
    "Sign-in prompts stay generic on purpose — it's a small privacy detail that prevents account enumeration attacks."
  )
];
