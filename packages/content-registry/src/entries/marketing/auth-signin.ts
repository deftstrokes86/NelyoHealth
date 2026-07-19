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
    "Welcome back to better care.",
    "Securely access your health, your family's health, or your organisation's care network — all in one place."
  ),
  e(
    "trust.control",
    "Your data. Your control.",
    "You decide who sees what, and you can change it at any time."
  ),
  e(
    "trust.role-aware",
    "Role-aware access.",
    "Your session adapts to whether you're signing in as a patient, family sponsor, clinician, or organisation partner."
  ),
  e(
    "trust.secure",
    "Secure & compliant.",
    "Every session is encrypted and enforces the same consent boundaries as the rest of the platform."
  ),
  e("card.title", "Sign in", "Enter your details to access your NelyoHealth account."),
  e("field.email", "Email address", "The email tied to your account."),
  e("field.password", "Password", "Your account password."),
  e("field.remember-me", "Remember me", "Keep me signed in on this device."),
  e("link.forgot-password", "Forgot password?", "Reset your password."),
  e("cta.sign-in", "Sign in", "Primary sign-in action."),
  e("cta.signing-in", "Signing in…", "Sign-in action while submitting."),
  e("divider.or-continue-with", "or continue with", "Social sign-in divider."),
  e("social.google", "Continue with Google", "Social sign-in with Google."),
  e("social.apple", "Continue with Apple", "Social sign-in with Apple."),
  e("social.microsoft", "Continue with Microsoft", "Social sign-in with Microsoft."),
  e("social.coming-soon", "Coming soon", "Social sign-in is not yet available."),
  e("footer.no-account", "Don't have an account?", "Prompt before the create-account link."),
  e("footer.create-account", "Create one", "Create-account link label."),
  e(
    "note.privacy",
    "We don't confirm whether an email is registered.",
    "Sign-in prompts stay generic on purpose — this helps protect your privacy."
  ),
  e("badge.encrypted", "Encrypted & secure", "This connection and your session are encrypted."),
  e(
    "note.recovery",
    "Trouble signing in?",
    "Contact support and we'll help you get back into your account."
  ),
  e("link.contact-support", "Contact support", "Sign-in trouble link."),
  e(
    "error.credentials-invalid",
    "That email or password doesn't match our records.",
    "Generic sign-in error — never reveals which field was wrong."
  ),
  e(
    "error.rate-limit-exceeded",
    "Too many attempts. Please wait a few minutes and try again.",
    "Sign-in rate-limit error."
  ),
  e(
    "error.generic",
    "We couldn't sign you in. Please try again.",
    "Fallback sign-in error for unexpected failures."
  )
];
