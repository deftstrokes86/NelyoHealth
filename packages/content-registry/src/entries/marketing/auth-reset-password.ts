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
    "Choose something you don't reuse. Existing sessions will end for safety."
  ),
  e(
    "hero.body",
    "Reset password overview",
    "Once you set the new password, all active sessions on your account end and you'll need to sign in again on your other devices. It's a safety default — better a small inconvenience now than an old session persisting after a compromise."
  ),
  e(
    "field.new",
    "New password",
    "At least 12 characters. Mix letters, numbers, and a symbol."
  ),
  e(
    "field.confirm",
    "Confirm password",
    "Enter the same password again to catch typos."
  ),
  e(
    "note.sessions",
    "All active sessions will end.",
    "You'll need to sign in again on your other devices after resetting. This is intentional."
  ),
  e(
    "note.support",
    "Reset link expired?",
    "Request a new one from the recover-access page. Links expire quickly on purpose — it limits the window if a link ever leaks."
  )
];
