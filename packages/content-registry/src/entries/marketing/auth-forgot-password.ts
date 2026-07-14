import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `auth-forgot-password.${slug}`,
  family: "auth-forgot-password",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const authForgotPasswordEntries: ContentEntry[] = [
  e(
    "hero.headline",
    "Recover access to your account.",
    "Enter the email you registered with. We'll send a reset link if we find a match."
  ),
  e(
    "hero.body",
    "Recover access",
    "The reset link arrives within a few minutes if the address is registered. We won't confirm whether it exists — that small detail keeps your account safer from enumeration attacks."
  ),
  e(
    "field.email",
    "Email address",
    "The email you used when you signed up."
  ),
  e(
    "note.privacy",
    "We don't confirm whether an email is registered.",
    "A generic response protects account privacy. If you don't receive a link, try a different email — the one you signed up with may be different from the one you use daily."
  ),
  e(
    "note.support",
    "Still locked out?",
    "Contact support with the account email and a short description of what went wrong. We'll verify identity and get you back in."
  )
];
