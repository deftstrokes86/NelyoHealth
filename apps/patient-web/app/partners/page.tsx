import { CTASection, HeroBlock, SegmentGrid } from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("partners", "/partners");

export default function PartnersPage() {
  return (
    <>
      <HeroBlock
        variant="organization"
        eyebrowId="marketing-footer-pages.partners.eyebrow"
        headlineId="marketing-footer-pages.partners.headline"
        bodyId="marketing-footer-pages.partners.body"
        primaryCtaLabelId="marketing-footer-pages.partners.cta"
        primaryCtaHref="/contact"
        illustrationId="hero-organization-partnership"
      />
      <SegmentGrid
        headingId="marketing-footer-pages.partners.grid.heading"
        cards={[
          { id: "marketing-segment-hospitals.hero.headline", href: "/hospitals" },
          { id: "marketing-segment-hmos.hero.headline", href: "/hmos" },
          { id: "marketing-segment-employers.hero.headline", href: "/employers" },
          { id: "marketing-segment-pharmacies.hero.headline", href: "/pharmacies" },
          { id: "marketing-segment-laboratories.hero.headline", href: "/laboratories" }
        ]}
      />
      <CTASection
        headlineId="marketing-footer-pages.partners.headline"
        bodyId="marketing-footer-pages.partners.body"
        primaryCtaLabelId="marketing-footer-pages.partners.cta"
        primaryCtaHref="/contact"
      />
    </>
  );
}
