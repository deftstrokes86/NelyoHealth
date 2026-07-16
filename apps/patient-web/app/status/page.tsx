import { CTASection, HeroBlock } from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("status", "/status");

export default function StatusPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-footer-pages.status.eyebrow"
        headlineId="marketing-footer-pages.status.headline"
        bodyId="marketing-footer-pages.status.body"
        primaryCtaLabelId="marketing-footer-pages.status.cta"
        primaryCtaHref="/contact"
        illustrationId="neutral-placeholder"
      />
      <CTASection
        headlineId="marketing-footer-pages.status.headline"
        bodyId="marketing-footer-pages.status.body"
        primaryCtaLabelId="marketing-footer-pages.status.cta"
        primaryCtaHref="/contact"
      />
    </>
  );
}
