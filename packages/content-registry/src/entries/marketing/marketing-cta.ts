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
    "Start the guided onboarding for your role.",
    "CTA-CREATE-ACCOUNT"
  ),
  cta("sign-in", "Sign in", "Return to your coordinated care surface.", "CTA-SIGN-IN"),
  cta(
    "contact",
    "Contact us",
    "Reach the team that matches your question.",
    "CTA-CONTACT"
  ),
  cta("faq", "Read the FAQ", "See common questions and honest answers.", "CTA-FAQ"),
  cta(
    "call-local-help",
    "Call your local emergency service",
    "Emergency care is not handled by this platform.",
    "CTA-CALL-LOCAL-HELP"
  ),
  cta(
    "contact-support",
    "Contact support",
    "Reach the support team for issue-specific help.",
    "CTA-CONTACT-SUPPORT"
  ),
  cta("back", "Back", "Return to the previous page.", "CTA-BACK"),
  cta(
    "learn-more",
    "Learn more",
    "See more detail about the surface described.",
    "CTA-LEARN-MORE"
  ),
  cta(
    "book-walkthrough",
    "Book a walkthrough",
    "See a tour tailored to your role.",
    "CTA-BOOK-WALKTHROUGH"
  ),
  cta(
    "get-started",
    "Get started",
    "Start the guided flow for your role.",
    "CTA-GET-STARTED"
  ),
  cta(
    "view-pricing",
    "See pricing",
    "See draft pricing for the pilot.",
    "CTA-VIEW-PRICING"
  ),
  cta(
    "download-app",
    "Download the app",
    "Open the store listing for the mobile app.",
    "CTA-DOWNLOAD-APP"
  )
];
