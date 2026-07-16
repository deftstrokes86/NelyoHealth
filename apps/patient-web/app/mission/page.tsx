import { CTASection, HeroBlock } from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("mission", "/mission");

export default function MissionPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-footer-pages.mission.eyebrow"
        headlineId="marketing-footer-pages.mission.headline"
        bodyId="marketing-footer-pages.mission.body"
        primaryCtaLabelId="marketing-footer-pages.mission.cta"
        primaryCtaHref="/how-it-works"
        secondaryCtaLabelId="marketing-cta.create-account"
        secondaryCtaHref="/create-account"
        illustrationId="hero-connected-care-ecosystem"
      />
      <CTASection
        headlineId="marketing-footer-pages.mission.headline"
        bodyId="marketing-footer-pages.mission.body"
        primaryCtaLabelId="marketing-footer-pages.mission.cta"
        primaryCtaHref="/how-it-works"
      />
    </>
  );
}
