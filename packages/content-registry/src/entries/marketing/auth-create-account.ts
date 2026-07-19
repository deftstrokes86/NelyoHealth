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
    "Let's get you started.",
    "Create your NelyoHealth account to begin your care journey. Consent and role setup come next."
  ),
  e(
    "trust.essentials",
    "Start with the essentials.",
    "We only ask for your name, email, and a password to begin."
  ),
  e(
    "trust.control",
    "You're in control.",
    "Consent and role decisions happen on the next screen, and you can revisit them any time."
  ),
  e(
    "trust.every-role",
    "Built for every role.",
    "Patients, family sponsors, clinicians, and organisation partners all start the same secure way."
  ),
  e("card.title", "Create your account", "Start your care journey with NelyoHealth."),
  e("field.name", "Full name", "Your legal or preferred name."),
  e("field.email", "Email address", "We use this to verify and secure your account."),
  e(
    "field.phone",
    "Phone number",
    "Optional. Used for account recovery and two-factor verification only."
  ),
  e("field.password", "Password", "Choose a password you don't reuse elsewhere."),
  e("field.confirm-password", "Confirm password", "Re-enter your password to confirm it."),
  e(
    "note.privacy",
    "We ask for the minimum first. You'll confirm consent and role details on the next screen.",
    "Consent decisions are made on the next screen — not buried in the Terms & Conditions."
  ),
  e(
    "terms.agreement",
    "I agree to the Terms of Use and Privacy Policy.",
    "Required to create an account."
  ),
  e("link.terms", "Terms of Use", "Terms of Use link."),
  e("link.privacy", "Privacy Policy", "Privacy Policy link."),
  e("cta.create-account", "Create account", "Primary create-account action."),
  e("cta.creating-account", "Creating account…", "Create-account action while submitting."),
  e("footer.have-account", "Already have an account?", "Prompt before the sign-in link."),
  e("footer.sign-in", "Sign in", "Sign-in link label."),
  e("badge.ndpr", "NDPR compliant", "Compliant with the Nigeria Data Protection Regulation."),
  e(
    "note.consent-settings",
    "You can change your consent settings at any time from your account settings.",
    "Reassurance note shown near the consent notice."
  ),
  e(
    "success.check-email",
    "Check your email to verify your account.",
    "We've started your registration — verification and next steps continue on the next screen."
  ),
  e(
    "error.invalid-full-name",
    "Please enter your full name.",
    "Validation error: full name too short."
  ),
  e("error.invalid-email", "Please enter a valid email address.", "Validation error: bad email."),
  e(
    "error.weak-password",
    "Password must be at least 8 characters.",
    "Validation error: password too short."
  ),
  e(
    "error.passwords-must-match",
    "Passwords don't match.",
    "Validation error: confirm-password mismatch."
  ),
  e(
    "error.terms-required",
    "You must agree to the Terms of Use and Privacy Policy.",
    "Validation error: terms checkbox not checked."
  ),
  e(
    "error.generic",
    "We couldn't create your account. Please try again.",
    "Fallback create-account error for unexpected failures."
  )
];
