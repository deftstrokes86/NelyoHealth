import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-microcopy.${slug}`,
  family: "marketing-microcopy",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const marketingMicrocopyEntries: ContentEntry[] = [
  e(
    "brand.name",
    "NelyoHealth",
    "Coordinated care for Nigeria and the diaspora."
  ),
  e(
    "brand.tagline",
    "Care that follows the patient.",
    "Short brand tagline used in hero areas and metadata."
  ),
  e(
    "footer.legal",
    "Legal notice",
    "© NelyoHealth. Draft site — production launch not yet approved. Effective wording replaces this after Content Owner approval."
  ),
  e(
    "footer.description",
    "Brand descriptor",
    "Care coordination that respects clinicians, patients, and payers — with the boundaries between them enforced in code."
  ),
  e(
    "loading",
    "Loading",
    "Generic loading label used inside marketing-facing skeletons and busy states."
  ),
  e(
    "empty",
    "Nothing here yet",
    "Generic empty state label used when a marketing surface has no items to render."
  ),
  e(
    "back",
    "Back",
    "Generic label for a back-navigation control."
  ),
  e("nav.home", "Home", "SiteHeader nav label for the home page."),
  e(
    "nav.how-it-works",
    "How it works",
    "SiteHeader nav label for the how-it-works page."
  ),
  e(
    "nav.patients",
    "For patients",
    "SiteHeader nav label for the patients segment page."
  ),
  e(
    "nav.doctors",
    "For doctors",
    "SiteHeader nav label for the doctors segment page."
  ),
  e(
    "nav.pharmacies",
    "For pharmacies",
    "SiteHeader nav label for the pharmacies segment page."
  ),
  e(
    "nav.laboratories",
    "For laboratories",
    "SiteHeader nav label for the laboratories segment page."
  ),
  e(
    "nav.trust-and-safety",
    "Trust and safety",
    "SiteHeader nav label for the trust-and-safety page."
  ),
  e("nav.emergency", "Emergency", "SiteHeader nav label for the emergency page."),
  e(
    "footer.link.home",
    "Home",
    "SiteFooter link label for the home page."
  ),
  e(
    "footer.link.how-it-works",
    "How it works",
    "SiteFooter link label for the how-it-works page."
  ),
  e("footer.link.patients", "Patients", "SiteFooter link label."),
  e("footer.link.family-plans", "Family plans", "SiteFooter link label."),
  e("footer.link.diaspora", "Diaspora", "SiteFooter link label."),
  e("footer.link.doctors", "Doctors", "SiteFooter link label."),
  e("footer.link.pharmacies", "Pharmacies", "SiteFooter link label."),
  e("footer.link.laboratories", "Laboratories", "SiteFooter link label."),
  e(
    "footer.link.trust-and-safety",
    "Trust and safety",
    "SiteFooter link label."
  ),
  e(
    "footer.link.privacy-overview",
    "Privacy overview",
    "SiteFooter link label."
  ),
  e("footer.link.accessibility", "Accessibility", "SiteFooter link label."),
  e("footer.link.faq", "FAQ", "SiteFooter link label."),
  e("footer.link.contact", "Contact", "SiteFooter link label."),
  e(
    "footer.link.legal",
    "Legal notices",
    "SiteFooter link label."
  ),
  e("footer.link.emergency", "Emergency", "SiteFooter link label.")
];
