import type { ContentEntry } from "../../schema.js";

const seo = (
  slug: string,
  title: string,
  description: string,
  ogImageId: string
): ContentEntry[] => [
  {
    id: `marketing-seo.${slug}.title`,
    family: "marketing-seo",
    status: "draft",
    contentClass: "public",
    surface: "public-site",
    title,
    body: title,
    evidence: ["DEC-P05-MKT-008"],
    syntheticOnly: true
  },
  {
    id: `marketing-seo.${slug}.description`,
    family: "marketing-seo",
    status: "draft",
    contentClass: "public",
    surface: "public-site",
    title,
    body: description,
    evidence: ["DEC-P05-MKT-008"],
    syntheticOnly: true
  },
  {
    id: `marketing-seo.${slug}.og-image-id`,
    family: "marketing-seo",
    status: "draft",
    contentClass: "public",
    surface: "public-site",
    title: ogImageId,
    body: `Illustration ID for Open Graph preview: ${ogImageId}`,
    evidence: ["DEC-P05-MKT-008"],
    syntheticOnly: true
  }
];

export const marketingSeoEntries: ContentEntry[] = [
  ...seo(
    "home",
    "NelyoHealth — Care that keeps up with your life.",
    "Coordinated care from intake to follow-up on one connected record. For patients, families, clinicians, and organisations in Nigeria and the diaspora.",
    "hero-connected-care-ecosystem"
  ),
  ...seo(
    "how-it-works",
    "How NelyoHealth works — five stages, one record.",
    "Intake, triage, consult, fulfilment, follow-up. See exactly how a patient moves through the platform without re-explaining their history.",
    "hero-universal-network"
  ),
  ...seo(
    "for-patients",
    "For patients — NelyoHealth.",
    "Book consults, own your record, and keep the people you trust in the loop. Consent that you can actually see and change.",
    "hero-patient-journey"
  ),
  ...seo(
    "for-family-diaspora",
    "For families and the diaspora — NelyoHealth.",
    "Sponsor care for family in Nigeria without seeing what you shouldn't. Payment never unlocks the clinical record.",
    "hero-family-diaspora-bridge"
  ),
  ...seo(
    "for-doctors",
    "For doctors and clinics — NelyoHealth.",
    "One patient view, one workflow, fewer hand-offs to the void. Clinical decisions stay with you.",
    "hero-provider-clinic"
  ),
  ...seo(
    "for-pharmacies",
    "For pharmacies — NelyoHealth.",
    "Signed prescriptions with clinical context attached. Provider details unlock to patients only after payment.",
    "hero-organization-partnership"
  ),
  ...seo(
    "for-laboratories",
    "For laboratories — NelyoHealth.",
    "Diagnostic orders arrive with indication, consent, and history attached. Results return to the ordering clinician.",
    "hero-organization-partnership"
  ),
  ...seo(
    "trust-safety",
    "Trust and safety — NelyoHealth.",
    "Trust is engineered, not claimed. Each principle on this page maps to a specific platform behaviour.",
    "trust-privacy"
  ),
  ...seo(
    "privacy-overview",
    "Privacy overview — NelyoHealth.",
    "What we collect, why, and the controls you can act on today. Data supports your care — not third-party marketing.",
    "trust-privacy"
  ),
  ...seo(
    "accessibility",
    "Accessibility — NelyoHealth.",
    "WCAG 2.2 AA target, reduced-motion respected, keyboard-first, contrast tested in both themes.",
    "trust-coordination"
  ),
  ...seo(
    "faq",
    "Frequently asked questions — NelyoHealth.",
    "Straight answers to what people actually ask before signing up — records, payment, family, emergencies, provider details.",
    "trust-coordination"
  ),
  ...seo(
    "contact",
    "Contact NelyoHealth.",
    "Get to the right team on the first try — patients, family sponsors, partners, or press. Not for emergencies.",
    "neutral-placeholder"
  ),
  ...seo(
    "legal",
    "Legal and regulatory notices — NelyoHealth.",
    "Draft legal notices under review. Terms, privacy, clinical scope, and regulatory disclosure — all pending owner approval.",
    "neutral-placeholder"
  ),
  ...seo(
    "emergency",
    "Emergency guidance — NelyoHealth.",
    "If care can't wait, call your local emergency service. NelyoHealth does not dispatch emergency response.",
    "trust-privacy"
  ),
  ...seo(
    "for-employers",
    "For employers — NelyoHealth (early access).",
    "Sponsor workforce care without touching the clinical record. The employer surface is designed and scoping for enablement.",
    "hero-organization-partnership"
  ),
  ...seo(
    "for-hmos",
    "For HMOs — NelyoHealth (early access).",
    "Coordinate covered care with clinicians in the loop. Authorisations respect clinical judgment.",
    "hero-organization-partnership"
  ),
  ...seo(
    "for-hospitals",
    "For hospitals and referrals — NelyoHealth (early access).",
    "Receive referrals with the whole story attached — intake, triage, and consent travel with the patient.",
    "hero-organization-partnership"
  ),
  ...seo(
    "for-home-care",
    "For home care — NelyoHealth (early access).",
    "Home visits, clinic visits, one longitudinal chart. Coordinated care shouldn't stop at the clinic door.",
    "family-diaspora-narrative"
  ),
  ...seo(
    "for-medical-records",
    "For medical records — NelyoHealth (early access).",
    "One authoritative chart, versioned amendments, and access every patient can audit.",
    "trust-privacy"
  ),
  ...seo(
    "signin",
    "Sign in — NelyoHealth.",
    "Continue where you left off on the connected care record.",
    "neutral-placeholder"
  ),
  ...seo(
    "create-account",
    "Create your NelyoHealth account.",
    "Start with the essentials. Role-specific onboarding continues on the next screen.",
    "neutral-placeholder"
  ),
  ...seo(
    "forgot-password",
    "Recover access — NelyoHealth.",
    "Reset your password. We won't confirm whether an email is registered.",
    "neutral-placeholder"
  ),
  ...seo(
    "reset-password",
    "Set a new password — NelyoHealth.",
    "Set a new password. Existing sessions will end for safety.",
    "neutral-placeholder"
  )
];
