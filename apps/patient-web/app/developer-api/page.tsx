import { CTASection, HeroBlock, LegalNoticeStrip } from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("developer-api", "/developer-api");

export default function DeveloperApiPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-footer-pages.developer-api.eyebrow"
        headlineId="marketing-footer-pages.developer-api.headline"
        bodyId="marketing-footer-pages.developer-api.body"
        primaryCtaLabelId="marketing-footer-pages.developer-api.cta"
        primaryCtaHref="/contact"
        illustrationId="neutral-placeholder"
      />
      <LegalNoticeStrip noticeId="marketing-footer-pages.developer-api.caveat" approvalStatus="draft" />
      <CTASection
        headlineId="marketing-footer-pages.developer-api.headline"
        bodyId="marketing-footer-pages.developer-api.body"
        primaryCtaLabelId="marketing-footer-pages.developer-api.cta"
        primaryCtaHref="/contact"
      />
    </>
  );
}
