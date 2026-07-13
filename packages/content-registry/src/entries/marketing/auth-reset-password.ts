import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `auth-reset-password.${slug}`,
  family: "auth-reset-password",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const authResetPasswordEntries: ContentEntry[] = [
  e(
    "hero.headline",
    "Set a new password.",
    "Choose a password you don't reuse elsewhere."
  ),
  e(
    "hero.body",
    "Reset password overview",
    "Set a new password to continue. Existing sessions will be signed out for safety."
  ),
  e("field.new", "New password", "At least 12 characters, mixing letters and numbers."),
  e("field.confirm", "Confirm password", "Enter the same password again."),
  e(
    "note.sessions",
    "All active sessions will end.",
    "You'll need to sign in again on your other devices after resetting."
  ),
  e(
    "note.support",
    "Reset link expired?",
    "Request a new reset link from the recover-access page."
  )
];
