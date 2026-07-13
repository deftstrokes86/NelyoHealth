import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-trust-and-safety.${slug}`,
  family: "marketing-trust-and-safety",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const marketingTrustAndSafetyEntries: ContentEntry[] = [
  e(
    "hero.eyebrow",
    "Trust and safety",
    "How the platform earns your confidence."
  ),
  e(
    "hero.headline",
    "Trust is engineered, not claimed.",
    "See how consent, credentialing, and audit are wired in."
  ),
  e(
    "hero.body",
    "Trust engineered end-to-end",
    "Every claim on this page maps to a concrete platform behaviour — enforced in code, not policy prose alone."
  ),
  e(
    "principle.consent",
    "Consent enforced at every step",
    "Role permissions are checked at intake, consult, disclosure, and follow-up — not just at sign-in."
  ),
  e(
    "principle.identity",
    "One person, one longitudinal record",
    "A single patient identity carries across accounts, sponsors, and providers."
  ),
  e(
    "principle.disclosure",
    "Provider details revealed after payment",
    "Location and contact details for pharmacies and labs unlock only when the order is funded — and only for that order."
  ),
  e(
    "principle.emergency",
    "Emergency care is never blocked by payment",
    "Emergency guidance surfaces immediately, regardless of account state, plan authorisation, or payment status."
  ),
  e(
    "principle.amendments",
    "Signed records use amendments, not overwrites",
    "History is preserved. Corrections are added as amendments so the audit trail stays intact."
  ),
  e(
    "trust.audit",
    "Every access is logged",
    "The audit log records who saw what, when, and under which consent."
  ),
  e(
    "faq.what-if",
    "What if I revoke consent later?",
    "You can revoke consent at any time. The platform stops surfacing your data to the revoked role from that point forward. Prior authorised access remains audit-logged."
  ),
  e(
    "cta.headline",
    "Read the privacy overview.",
    "See what data is collected and why."
  )
];
