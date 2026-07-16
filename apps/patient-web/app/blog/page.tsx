import { CTASection, HeroBlock, LegalNoticeStrip } from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("blog", "/blog");

export default function BlogPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-footer-pages.blog.eyebrow"
        headlineId="marketing-footer-pages.blog.headline"
        bodyId="marketing-footer-pages.blog.body"
        primaryCtaLabelId="marketing-footer-pages.blog.cta"
        primaryCtaHref="/how-it-works"
        illustrationId="neutral-placeholder"
      />
      <LegalNoticeStrip noticeId="marketing-footer-pages.blog.caveat" approvalStatus="draft" />
      <CTASection
        headlineId="marketing-footer-pages.blog.headline"
        bodyId="marketing-footer-pages.blog.body"
        primaryCtaLabelId="marketing-footer-pages.blog.cta"
        primaryCtaHref="/how-it-works"
      />
    </>
  );
}
