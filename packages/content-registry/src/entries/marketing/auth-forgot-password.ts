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
    "Enter your email; we'll send a reset link."
  ),
  e(
    "hero.body",
    "Recover access",
    "We won't reveal whether an account exists. If the address is registered, you'll receive a reset link within a few minutes."
  ),
  e(
    "field.email",
    "Email address",
    "Enter the email you used to sign up."
  ),
  e(
    "note.privacy",
    "We don't confirm whether an email is registered.",
    "This protects account privacy against enumeration."
  ),
  e(
    "note.support",
    "Still locked out?",
    "Contact support with the account email and a description of what went wrong."
  )
];
