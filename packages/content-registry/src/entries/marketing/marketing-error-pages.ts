import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-error-pages.${slug}`,
  family: "marketing-error-pages",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-008"],
  syntheticOnly: true
});

export const marketingErrorPagesEntries: ContentEntry[] = [
  e(
    "not-found.headline",
    "That page isn't here.",
    "Try the home page, or use the site header to find what you were looking for."
  ),
  e(
    "not-found.body",
    "404 body",
    "The link you followed may be out of date, or the page may have moved. Try again from the home page or contact support if the issue persists."
  ),
  e(
    "not-found.cta",
    "Return home",
    "Go to the NelyoHealth home page."
  ),
  e(
    "server-error.headline",
    "Something went wrong.",
    "Try again in a moment, or contact support if the issue persists."
  ),
  e(
    "server-error.body",
    "500 body",
    "An unexpected error interrupted your request. Try refreshing the page. If the issue persists, contact support with the details of what you were doing."
  ),
  e(
    "server-error.cta",
    "Refresh the page",
    "Reload the current page."
  ),
  e(
    "global-error.headline",
    "The site couldn't recover.",
    "Please refresh, or contact support if the problem continues."
  ),
  e(
    "global-error.body",
    "Global error body",
    "The site hit a top-level error and couldn't recover. Refresh the page. If refreshing doesn't help, contact support."
  ),
  e(
    "global-error.cta",
    "Refresh the page",
    "Reload the current page."
  ),
  e(
    "emergency-note",
    "In an emergency, call your local emergency service.",
    "This platform is not a substitute for emergency medical care — even during outages."
  )
];
