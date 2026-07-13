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
  e("hero.eyebrow", "Privacy overview", "What we collect and why."),
  e(
    "hero.headline",
    "Your data is used for your care — not marketed elsewhere.",
    "See the categories, purposes, and controls."
  ),
  e(
    "hero.body",
    "Privacy overview",
    "This page explains what personal and clinical data the platform processes, why, and the controls available to you."
  ),
  e(
    "section.categories",
    "Categories of data",
    "Account details, clinical records you share, payment metadata for orders, and audit logs of access."
  ),
  e(
    "section.purposes",
    "Purposes",
    "Delivering care coordination, honouring consent boundaries, meeting regulatory obligations, and maintaining the audit surface."
  ),
  e(
    "section.controls",
    "Controls",
    "Consent management, revocation, access requests, and account closure — each available from the account settings surface."
  ),
  e(
    "section.legal-basis",
    "Legal basis",
    "Consent for optional processing; legitimate interest and legal obligation for regulated activities such as clinical record retention."
  ),
  e(
    "note.caveat",
    "This overview is a draft.",
    "The final privacy notice is under privacy and legal review and is subject to change before production launch."
  ),
  e(
    "faq.marketing",
    "Do you share my data for marketing?",
    "No. Personal or clinical data is not sold or shared for third-party marketing. Anonymised platform metrics may be reported in aggregate."
  ),
  e(
    "cta.headline",
    "Read the full privacy notice.",
    "The draft privacy notice is linked from the site footer."
  )
];
