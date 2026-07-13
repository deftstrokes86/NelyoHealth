import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-cookie-consent.${slug}`,
  family: "marketing-cookie-consent",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-008"],
  syntheticOnly: true
});

export const marketingCookieConsentEntries: ContentEntry[] = [
  e(
    "banner.headline",
    "Cookie preferences",
    "We only use cookies that keep this site running."
  ),
  e(
    "banner.body",
    "Cookie banner body",
    "This site uses essential cookies for security and session handling. We do not use analytics or advertising cookies. This banner appears only when the cookie-consent feature is enabled."
  ),
  e(
    "banner.action.accept",
    "OK",
    "Acknowledge the essential-cookie notice and close the banner."
  ),
  e(
    "banner.action.details",
    "See details",
    "Open the cookie details panel."
  ),
  e(
    "details.essential",
    "Essential cookies",
    "Used to keep you signed in, protect against session fixation, and maintain security. Cannot be disabled."
  )
];
