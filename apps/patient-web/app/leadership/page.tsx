import { CTASection, HeroBlock, LegalNoticeStrip } from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("leadership", "/leadership");

export default function LeadershipPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-footer-pages.leadership.eyebrow"
        headlineId="marketing-footer-pages.leadership.headline"
        bodyId="marketing-footer-pages.leadership.body"
        primaryCtaLabelId="marketing-footer-pages.leadership.cta"
        primaryCtaHref="/mission"
        illustrationId="neutral-placeholder"
      />
      <LegalNoticeStrip noticeId="marketing-footer-pages.leadership.caveat" approvalStatus="draft" />
      <CTASection
        headlineId="marketing-footer-pages.leadership.headline"
        bodyId="marketing-footer-pages.leadership.body"
        primaryCtaLabelId="marketing-footer-pages.leadership.cta"
        primaryCtaHref="/mission"
      />
    </>
  );
}
