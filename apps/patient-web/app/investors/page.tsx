import { CTASection, HeroBlock, LegalNoticeStrip } from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("investors", "/investors");

export default function InvestorsPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-footer-pages.investors.eyebrow"
        headlineId="marketing-footer-pages.investors.headline"
        bodyId="marketing-footer-pages.investors.body"
        primaryCtaLabelId="marketing-footer-pages.investors.cta"
        primaryCtaHref="/contact"
        illustrationId="neutral-placeholder"
      />
      <LegalNoticeStrip noticeId="marketing-footer-pages.investors.caveat" approvalStatus="draft" />
      <CTASection
        headlineId="marketing-footer-pages.investors.headline"
        bodyId="marketing-footer-pages.investors.body"
        primaryCtaLabelId="marketing-footer-pages.investors.cta"
        primaryCtaHref="/contact"
      />
    </>
  );
}
