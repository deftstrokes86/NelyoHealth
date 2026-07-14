import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-privacy-overview.${slug}`,
  family: "marketing-privacy-overview",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const marketingPrivacyOverviewEntries: ContentEntry[] = [
  e(
    "hero.eyebrow",
    "Privacy overview",
    "What we collect, why, and the controls you actually have."
  ),
  e(
    "hero.headline",
    "Your data supports your care. It doesn't get sold elsewhere.",
    "The short version — with the categories, purposes, and controls you can act on today."
  ),
  e(
    "hero.body",
    "Privacy overview",
    "The full privacy notice is under legal and privacy review. This overview is the plain-language summary — what we hold, why we hold it, and what you can do about it today."
  ),
  e(
    "section.categories",
    "Categories we process",
    "Account details (name, email, phone). Clinical records you or your clinician add. Payment metadata for orders you place. Consent decisions. Audit logs of who accessed what."
  ),
  e(
    "section.purposes",
    "What we use it for",
    "Delivering the care coordination you signed up for. Honouring consent boundaries. Meeting regulatory obligations. Maintaining an audit trail you can review. Nothing else."
  ),
  e(
    "section.controls",
    "Controls you have today",
    "Manage consent from your account settings. Revoke any role's access. Request an export. Close the account and take your data with you. You don't have to email support to exercise any of these."
  ),
  e(
    "section.legal-basis",
    "Legal basis",
    "Consent for optional processing (like sharing your record with a sponsor). Legitimate interest and legal obligation for regulated activities — clinical record retention, audit logging, safeguarding requirements."
  ),
  e(
    "note.caveat",
    "This overview is a draft",
    "The final privacy notice is under privacy and legal review. Wording, scope, and effective date will settle once owners record their approvals."
  ),
  e(
    "faq.marketing",
    "Do you share my data for marketing?",
    "No. Personal and clinical data is not sold or shared for third-party marketing. Anonymised, aggregated platform metrics may be reported publicly (e.g., \"consults completed last quarter\") but never in a form that ties back to you."
  ),
  e(
    "cta.headline",
    "Read the full privacy notice",
    "The draft is linked in the site footer."
  )
];
