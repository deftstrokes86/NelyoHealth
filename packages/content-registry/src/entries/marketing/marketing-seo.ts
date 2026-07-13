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
    "NelyoHealth — Coordinated care that follows the patient.",
    "Coordinated care from intake to follow-up on one secure surface. For patients, families, providers, and organisations in Nigeria and the diaspora.",
    "hero-universal-network"
  ),
  ...seo(
    "how-it-works",
    "How NelyoHealth works — intake to follow-up.",
    "Five clear steps: intake, triage, consult, fulfilment, follow-up. See how care flows through the platform.",
    "hero-universal-network"
  ),
  ...seo(
    "for-patients",
    "For patients — NelyoHealth.",
    "One account for booking, records, prescriptions, and family updates — with consent boundaries that hold.",
    "hero-patient-journey"
  ),
  ...seo(
    "for-family-diaspora",
    "For families and the diaspora — NelyoHealth.",
    "Support family in Nigeria without losing track. Sponsor care within explicit consent boundaries.",
    "hero-family-diaspora-bridge"
  ),
  ...seo(
    "for-doctors",
    "For doctors and clinics — NelyoHealth.",
    "One patient view, one workflow, fewer handoffs. Practice in a connected surface built for clinical judgment.",
    "hero-provider-clinic"
  ),
  ...seo(
    "for-pharmacies",
    "For pharmacies — NelyoHealth.",
    "Receive approved prescriptions with clinical context. Provider details are revealed to patients only after payment.",
    "hero-organization-partnership"
  ),
  ...seo(
    "for-laboratories",
    "For laboratories — NelyoHealth.",
    "Receive diagnostic orders with clinical context. Results return to the ordering clinician on the same connected record.",
    "hero-organization-partnership"
  ),
  ...seo(
    "trust-safety",
    "Trust and safety — NelyoHealth.",
    "See how consent, credentialing, and audit are wired into the platform. Trust is engineered, not claimed.",
    "trust-privacy"
  ),
  ...seo(
    "privacy-overview",
    "Privacy overview — NelyoHealth.",
    "What we collect, why, and the controls you have. Your data supports your care — not marketed elsewhere.",
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
    "Common questions about coverage, records access, payment, emergencies, and family sponsorship — answered honestly.",
    "trust-coordination"
  ),
  ...seo(
    "contact",
    "Contact NelyoHealth.",
    "Reach the team that fits your question — patients, family sponsors, partners, or press. Not for emergencies.",
    "neutral-placeholder"
  ),
  ...seo(
    "legal",
    "Legal and regulatory notices — NelyoHealth.",
    "Draft legal notices for review. Terms, privacy, clinical scope, and regulatory disclosure — all pending owner approval.",
    "neutral-placeholder"
  ),
  ...seo(
    "emergency",
    "Emergency guidance — NelyoHealth.",
    "For emergencies, call your local emergency service. This platform is not a substitute for emergency care.",
    "trust-privacy"
  ),
  ...seo(
    "for-employers",
    "For employers — NelyoHealth (early access).",
    "The employer surface is designed and being scoped for enablement. Coordinate workforce care without touching clinical records.",
    "hero-organization-partnership"
  ),
  ...seo(
    "for-hmos",
    "For HMOs — NelyoHealth (early access).",
    "The HMO surface is designed and being scoped for enablement. Authorisations don't override clinicians.",
    "hero-organization-partnership"
  ),
  ...seo(
    "for-hospitals",
    "For hospitals and referrals — NelyoHealth (early access).",
    "The hospital referral surface is designed and being scoped for enablement. Referrals carry clinical context and consent.",
    "hero-organization-partnership"
  ),
  ...seo(
    "for-home-care",
    "For home care — NelyoHealth (early access).",
    "The home-care surface is designed and being scoped for enablement. One record follows the patient — clinic or home.",
    "family-diaspora-narrative"
  ),
  ...seo(
    "signin",
    "Sign in — NelyoHealth.",
    "Sign in to continue to your coordinated care surface.",
    "neutral-placeholder"
  ),
  ...seo(
    "create-account",
    "Create your NelyoHealth account.",
    "Start with the essentials, then continue into role-specific onboarding.",
    "neutral-placeholder"
  ),
  ...seo(
    "forgot-password",
    "Recover access — NelyoHealth.",
    "Reset your password. We won't reveal whether an email is registered.",
    "neutral-placeholder"
  ),
  ...seo(
    "reset-password",
    "Set a new password — NelyoHealth.",
    "Set a new password. Existing sessions will be signed out.",
    "neutral-placeholder"
  )
];
