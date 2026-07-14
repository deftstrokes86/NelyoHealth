import type { ContentEntry } from "../../schema.js";

const cta = (slug: string, title: string, body: string, ctaId: string): ContentEntry => ({
  id: `marketing-cta.${slug}`,
  family: "marketing-cta",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  cta: ctaId,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const marketingCtaEntries: ContentEntry[] = [
  cta(
    "create-account",
    "Create an account",
    "Two minutes to set up. Guided onboarding for your role afterwards.",
    "CTA-CREATE-ACCOUNT"
  ),
  cta(
    "sign-in",
    "Sign in",
    "Continue where you left off.",
    "CTA-SIGN-IN"
  ),
  cta(
    "contact",
    "Contact us",
    "Reach a named person on our team.",
    "CTA-CONTACT"
  ),
  cta(
    "faq",
    "See the FAQ",
    "Straight answers to the things we get asked most.",
    "CTA-FAQ"
  ),
  cta(
    "call-local-help",
    "Call your local emergency service",
    "Emergency care is not handled by this platform.",
    "CTA-CALL-LOCAL-HELP"
  ),
  cta(
    "contact-support",
    "Contact support",
    "Get help on something specific — a real person will pick it up.",
    "CTA-CONTACT-SUPPORT"
  ),
  cta("back", "Back", "Return to the previous page.", "CTA-BACK"),
  cta(
    "learn-more",
    "Learn more",
    "See the detail behind this section.",
    "CTA-LEARN-MORE"
  ),
  cta(
    "book-walkthrough",
    "Book a walkthrough",
    "A tour tailored to how you'll actually use the platform. No card required.",
    "CTA-BOOK-WALKTHROUGH"
  ),
  cta(
    "get-started",
    "Get started",
    "Begin the guided flow for your role.",
    "CTA-GET-STARTED"
  ),
  cta(
    "view-pricing",
    "See pricing",
    "Draft pricing for the pilot — subject to finance approval.",
    "CTA-VIEW-PRICING"
  ),
  cta(
    "download-app",
    "Get the mobile app",
    "Open the store listing for iOS or Android.",
    "CTA-DOWNLOAD-APP"
  )
];
