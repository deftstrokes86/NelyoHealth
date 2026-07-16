import { CTASection, HeroBlock, LegalNoticeStrip } from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("careers", "/careers");

export default function CareersPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-footer-pages.careers.eyebrow"
        headlineId="marketing-footer-pages.careers.headline"
        bodyId="marketing-footer-pages.careers.body"
        primaryCtaLabelId="marketing-footer-pages.careers.cta"
        primaryCtaHref="/contact"
        illustrationId="neutral-placeholder"
      />
      <LegalNoticeStrip noticeId="marketing-footer-pages.careers.caveat" approvalStatus="draft" />
      <CTASection
        headlineId="marketing-footer-pages.careers.headline"
        bodyId="marketing-footer-pages.careers.body"
        primaryCtaLabelId="marketing-footer-pages.careers.cta"
        primaryCtaHref="/contact"
      />
    </>
  );
}
