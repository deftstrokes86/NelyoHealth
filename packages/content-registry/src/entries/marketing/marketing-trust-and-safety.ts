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
    "Claims that map to platform behaviour, not policy prose."
  ),
  e(
    "hero.headline",
    "Trust is engineered — not claimed on a landing page.",
    "Each claim on this page corresponds to a specific behaviour enforced in code."
  ),
  e(
    "hero.body",
    "Trust engineered end-to-end",
    "Healthcare marketing is full of trust theatre. This page skips the theatre. Every principle below maps to a real mechanism we've built — not a promise we made in a brand guideline."
  ),
  e(
    "principle.consent",
    "Consent is checked at every step",
    "Role permissions run at intake, at triage, at disclosure, and at follow-up — not just at sign-in. Access is scoped to the exact records you approved, for the exact roles you approved them for."
  ),
  e(
    "principle.identity",
    "One person, one longitudinal record",
    "Your identity persists across accounts, sponsors, and providers. A guardian for your kid, a diaspora sponsor, and a specialist all see slices of the same authoritative chart — never conflicting copies."
  ),
  e(
    "principle.disclosure",
    "Pharmacies and labs unlock post-payment",
    "Before payment, patient-facing views expose only an approved provider display name and non-identifying commercial info. Location, contact, and pickup details unlock after payment — for that specific order only."
  ),
  e(
    "principle.emergency",
    "Emergency care is never blocked by payment",
    "Emergency guidance surfaces immediately, regardless of your account state, plan authorisation, or payment history. It's a locked invariant, not a policy note."
  ),
  e(
    "principle.amendments",
    "Signed records amend — they don't overwrite",
    "Once a record is signed, corrections are added as versioned amendments. History stays legible. Nothing gets silently rewritten."
  ),
  e(
    "trust.audit",
    "Every access is logged",
    "The audit log records who saw what, when, and under which consent — for both patients and clinical teams."
  ),
  e(
    "faq.what-if",
    "What happens if I revoke consent later?",
    "You can revoke consent at any time. From that moment, the platform stops surfacing your data to the revoked role. Prior authorised access stays audit-logged so you can see exactly what was seen and when."
  ),
  e(
    "cta.headline",
    "Read the privacy overview",
    "See exactly what data we collect and why."
  )
];
