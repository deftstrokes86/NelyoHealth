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
    "Short tagline for hero areas and metadata."
  ),
  e(
    "footer.legal",
    "© NelyoHealth. Draft site — production launch not yet approved.",
    "Draft footer legal line. Effective wording will replace this after Content Owner approval."
  ),
  e(
    "footer.description",
    "Care coordination that respects clinicians, patients, and payers.",
    "One-line brand descriptor for the footer."
  ),
  e(
    "footer.group.platform",
    "Platform",
    "Footer link group heading for platform-oriented links."
  ),
  e(
    "footer.group.company",
    "Company",
    "Footer link group heading for company-oriented links."
  ),
  e(
    "footer.group.trust",
    "Trust and safety",
    "Footer link group heading for trust, privacy, and legal links."
  ),
  e(
    "loading",
    "Loading",
    "Generic loading label used inside marketing-facing skeletons and busy states."
  ),
  e(
    "empty",
    "Nothing to show yet",
    "Generic empty state label used when a marketing surface has no items to render."
  ),
  e(
    "back",
    "Back",
    "Generic label for a back-navigation control."
  )
];
