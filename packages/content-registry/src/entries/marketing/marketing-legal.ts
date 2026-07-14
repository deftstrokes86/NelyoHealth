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
  e(
    "hero.eyebrow",
    "Legal and regulatory notices",
    "Draft — under legal review, not yet effective."
  ),
  e(
    "hero.headline",
    "The legal shape of NelyoHealth — in progress.",
    "Every notice on this page is a draft. Wording, scope, and effective dates are still moving as owners record their approvals."
  ),
  e(
    "hero.body",
    "Legal notices overview",
    "This page is a scaffold, not a filing. Each notice is under legal, regulatory, or clinical review. Nothing here is production-approved — we're publishing it visible-in-draft so reviewers and future users can trace what's under consideration."
  ),
  e(
    "notice.terms",
    "Terms of service (draft)",
    "Terms describing platform use, user obligations, service scope, and dispute resolution. Under review with legal counsel."
  ),
  e(
    "notice.privacy",
    "Privacy notice (draft)",
    "Full privacy notice covering data categories, processing purposes, legal basis, retention, and user controls. Under review with the privacy owner and legal counsel."
  ),
  e(
    "notice.clinical",
    "Clinical scope statement (draft)",
    "The platform coordinates care. It does not diagnose or prescribe. Clinical decisions stay with qualified clinicians. Under review with the clinical safety owner."
  ),
  e(
    "notice.regulatory",
    "Regulatory scope (draft)",
    "The regulatory boundaries applicable to the pilot are under review with the relevant regulators. Full regulatory disclosure will follow those conversations."
  ),
  e(
    "note.pending",
    "Every notice on this page is DRAFT — PENDING APPROVAL",
    "Effective dates and final wording will replace the drafts once owners record their approvals. Until then, treat this page as a work-in-progress transparency surface."
  ),
  e(
    "cta.headline",
    "Questions about a specific notice?",
    "The contact page routes to the legal team."
  )
];
