import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-legal.${slug}`,
  family: "marketing-legal",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const marketingLegalEntries: ContentEntry[] = [
  e("hero.eyebrow", "Legal and regulatory notices", "Draft — pending legal approval."),
  e(
    "hero.headline",
    "Legal notices and regulatory scope.",
    "This page is a placeholder while legal owners finalise the language."
  ),
  e(
    "hero.body",
    "Legal notices overview",
    "Every notice below is a draft under legal and regulatory review. Nothing here is production-approved."
  ),
  e(
    "notice.terms",
    "Terms of service (draft)",
    "Terms describing the platform, user obligations, and dispute resolution. Under legal review."
  ),
  e(
    "notice.privacy",
    "Privacy notice (draft)",
    "Full privacy notice covering categories, purposes, legal basis, and controls. Under privacy and legal review."
  ),
  e(
    "notice.clinical",
    "Clinical scope statement (draft)",
    "The platform coordinates care. It does not diagnose or prescribe. Clinical decisions remain with qualified clinicians."
  ),
  e(
    "notice.regulatory",
    "Regulatory scope (draft)",
    "Regulatory boundaries for the pilot are under review with the relevant regulators. Full regulatory disclosure follows approval."
  ),
  e(
    "note.pending",
    "Every notice on this page is DRAFT — PENDING APPROVAL.",
    "Effective dates and final wording will replace the drafts once owners record their approvals."
  ),
  e(
    "cta.headline",
    "Questions about a specific notice?",
    "Reach the legal team through the contact page."
  )
];
