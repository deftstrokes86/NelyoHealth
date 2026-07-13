export const approvedCtaIds = [
  "CTA-CREATE-ACCOUNT",
  "CTA-SIGN-IN",
  "CTA-CONTACT",
  "CTA-FAQ",
  "CTA-CALL-LOCAL-HELP",
  "CTA-CONTACT-SUPPORT",
  "CTA-BACK",
  "CTA-LEARN-MORE",
  "CTA-BOOK-WALKTHROUGH",
  "CTA-GET-STARTED",
  "CTA-VIEW-PRICING",
  "CTA-DOWNLOAD-APP"
] as const;
export type ApprovedCtaId = (typeof approvedCtaIds)[number];
export const isApprovedCtaId = (value: unknown): value is ApprovedCtaId =>
  typeof value === "string" &&
  (approvedCtaIds as readonly string[]).includes(value);
