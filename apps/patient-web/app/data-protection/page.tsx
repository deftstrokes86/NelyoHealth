import { CTASection, HeroBlock } from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("data-protection", "/data-protection");

export default function DataProtectionPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-footer-pages.data-protection.eyebrow"
        headlineId="marketing-footer-pages.data-protection.headline"
        bodyId="marketing-footer-pages.data-protection.body"
        primaryCtaLabelId="marketing-footer-pages.data-protection.cta"
        primaryCtaHref="/trust-and-safety"
        illustrationId="trust-privacy"
      />
      <CTASection
        headlineId="marketing-footer-pages.data-protection.headline"
        bodyId="marketing-footer-pages.data-protection.body"
        primaryCtaLabelId="marketing-footer-pages.data-protection.cta"
        primaryCtaHref="/trust-and-safety"
      />
    </>
  );
}
