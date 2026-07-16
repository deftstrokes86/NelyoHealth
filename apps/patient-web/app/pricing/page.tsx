import { CTASection, HeroBlock } from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("pricing", "/pricing");

export default function PricingPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-footer-pages.pricing.eyebrow"
        headlineId="marketing-footer-pages.pricing.headline"
        bodyId="marketing-footer-pages.pricing.body"
        primaryCtaLabelId="marketing-footer-pages.pricing.cta"
        primaryCtaHref="/create-account"
        secondaryCtaLabelId="marketing-cta.faq"
        secondaryCtaHref="/faq"
        illustrationId="neutral-placeholder"
      />
      <CTASection
        headlineId="marketing-footer-pages.pricing.headline"
        bodyId="marketing-footer-pages.pricing.body"
        primaryCtaLabelId="marketing-footer-pages.pricing.cta"
        primaryCtaHref="/create-account"
      />
    </>
  );
}
