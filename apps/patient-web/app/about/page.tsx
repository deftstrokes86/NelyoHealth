import { CTASection, HeroBlock, LegalNoticeStrip } from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("about", "/about");

export default function AboutPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-footer-pages.about.eyebrow"
        headlineId="marketing-footer-pages.about.headline"
        bodyId="marketing-footer-pages.about.body"
        primaryCtaLabelId="marketing-footer-pages.about.cta"
        primaryCtaHref="/mission"
        illustrationId="neutral-placeholder"
      />
      <LegalNoticeStrip noticeId="marketing-footer-pages.about.caveat" approvalStatus="draft" />
      <CTASection
        headlineId="marketing-footer-pages.about.headline"
        bodyId="marketing-footer-pages.about.body"
        primaryCtaLabelId="marketing-footer-pages.about.cta"
        primaryCtaHref="/mission"
      />
    </>
  );
}
