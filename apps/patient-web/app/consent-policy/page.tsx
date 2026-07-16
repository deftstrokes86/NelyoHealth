import { CTASection, HeroBlock } from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("consent-policy", "/consent-policy");

export default function ConsentPolicyPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-footer-pages.consent-policy.eyebrow"
        headlineId="marketing-footer-pages.consent-policy.headline"
        bodyId="marketing-footer-pages.consent-policy.body"
        primaryCtaLabelId="marketing-footer-pages.consent-policy.cta"
        primaryCtaHref="/privacy-overview"
        illustrationId="trust-privacy"
      />
      <CTASection
        headlineId="marketing-footer-pages.consent-policy.headline"
        bodyId="marketing-footer-pages.consent-policy.body"
        primaryCtaLabelId="marketing-footer-pages.consent-policy.cta"
        primaryCtaHref="/privacy-overview"
      />
    </>
  );
}
