import { CTASection, HeroBlock, LegalNoticeStrip } from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("health-library", "/health-library");

export default function HealthLibraryPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-footer-pages.health-library.eyebrow"
        headlineId="marketing-footer-pages.health-library.headline"
        bodyId="marketing-footer-pages.health-library.body"
        primaryCtaLabelId="marketing-footer-pages.health-library.cta"
        primaryCtaHref="/doctors"
        illustrationId="neutral-placeholder"
      />
      <LegalNoticeStrip noticeId="marketing-footer-pages.health-library.caveat" approvalStatus="draft" />
      <CTASection
        headlineId="marketing-footer-pages.health-library.headline"
        bodyId="marketing-footer-pages.health-library.body"
        primaryCtaLabelId="marketing-footer-pages.health-library.cta"
        primaryCtaHref="/doctors"
      />
    </>
  );
}
