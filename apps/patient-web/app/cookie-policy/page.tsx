import { CTASection, HeroBlock, LegalNoticeStrip } from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("cookie-policy", "/cookie-policy");

export default function CookiePolicyPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-footer-pages.cookie-policy.eyebrow"
        headlineId="marketing-footer-pages.cookie-policy.headline"
        bodyId="marketing-footer-pages.cookie-policy.body"
        primaryCtaLabelId="marketing-footer-pages.cookie-policy.cta"
        primaryCtaHref="/legal-and-regulatory-notices"
        illustrationId="neutral-placeholder"
      />
      <LegalNoticeStrip
        noticeId="marketing-cookie-consent.details.essential"
        approvalStatus="draft"
      />
      <CTASection
        headlineId="marketing-footer-pages.cookie-policy.headline"
        bodyId="marketing-footer-pages.cookie-policy.body"
        primaryCtaLabelId="marketing-footer-pages.cookie-policy.cta"
        primaryCtaHref="/legal-and-regulatory-notices"
      />
    </>
  );
}
