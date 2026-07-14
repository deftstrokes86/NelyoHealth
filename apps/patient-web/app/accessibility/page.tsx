import {
  CTASection,
  FAQAccordion,
  HeroBlock,
  TrustBar
} from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("accessibility", "/accessibility");

const iconA = (
  <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
    <path d="M4 11 l4 4 l8 -9 l-2 -2 l-6 7 l-2 -2 z" />
  </svg>
);

export default function AccessibilityPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-accessibility.hero.eyebrow"
        headlineId="marketing-accessibility.hero.headline"
        bodyId="marketing-accessibility.hero.body"
        primaryCtaLabelId="marketing-cta.contact"
        primaryCtaHref="/contact"
        illustrationId="trust-coordination"
      />
      <TrustBar
        items={[
          { id: "marketing-accessibility.commitment.wcag", icon: iconA },
          { id: "marketing-accessibility.commitment.motion", icon: iconA },
          { id: "marketing-accessibility.commitment.keyboard", icon: iconA },
          { id: "marketing-accessibility.commitment.contrast", icon: iconA }
        ]}
      />
      <FAQAccordion
        headingId="marketing-faq.hero.headline"
        items={[{ id: "marketing-accessibility.faq.report" }]}
      />
      <CTASection
        headlineId="marketing-accessibility.cta.headline"
        bodyId="marketing-accessibility.hero.body"
        primaryCtaLabelId="marketing-cta.contact"
        primaryCtaHref="/contact"
      />
    </>
  );
}
