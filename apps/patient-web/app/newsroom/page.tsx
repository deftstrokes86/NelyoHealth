import { CTASection, HeroBlock, LegalNoticeStrip } from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("newsroom", "/newsroom");

export default function NewsroomPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-footer-pages.newsroom.eyebrow"
        headlineId="marketing-footer-pages.newsroom.headline"
        bodyId="marketing-footer-pages.newsroom.body"
        primaryCtaLabelId="marketing-footer-pages.newsroom.cta"
        primaryCtaHref="/contact"
        illustrationId="neutral-placeholder"
      />
      <LegalNoticeStrip noticeId="marketing-footer-pages.newsroom.caveat" approvalStatus="draft" />
      <CTASection
        headlineId="marketing-footer-pages.newsroom.headline"
        bodyId="marketing-footer-pages.newsroom.body"
        primaryCtaLabelId="marketing-footer-pages.newsroom.cta"
        primaryCtaHref="/contact"
      />
    </>
  );
}
