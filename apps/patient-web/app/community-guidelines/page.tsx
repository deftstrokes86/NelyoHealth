import { CTASection, HeroBlock, LegalNoticeStrip } from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("community-guidelines", "/community-guidelines");

export default function CommunityGuidelinesPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-footer-pages.community-guidelines.eyebrow"
        headlineId="marketing-footer-pages.community-guidelines.headline"
        bodyId="marketing-footer-pages.community-guidelines.body"
        primaryCtaLabelId="marketing-footer-pages.community-guidelines.cta"
        primaryCtaHref="/contact"
        illustrationId="neutral-placeholder"
      />
      <LegalNoticeStrip noticeId="marketing-footer-pages.community-guidelines.caveat" approvalStatus="draft" />
      <CTASection
        headlineId="marketing-footer-pages.community-guidelines.headline"
        bodyId="marketing-footer-pages.community-guidelines.body"
        primaryCtaLabelId="marketing-footer-pages.community-guidelines.cta"
        primaryCtaHref="/contact"
      />
    </>
  );
}
