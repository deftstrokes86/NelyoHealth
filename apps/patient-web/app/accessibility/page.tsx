import {
  CTASection,
  FAQAccordion,
  HeroBlock,
  TrustBar
} from "@nelyohealth/ui-foundation";
import { Accessibility, Contrast, Keyboard, Sparkles } from "lucide-react";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("accessibility", "/accessibility");

const wcagIcon = <Accessibility size={20} strokeWidth={1.9} aria-hidden />;
const motionIcon = <Sparkles size={20} strokeWidth={1.9} aria-hidden />;
const keyboardIcon = <Keyboard size={20} strokeWidth={1.9} aria-hidden />;
const contrastIcon = <Contrast size={20} strokeWidth={1.9} aria-hidden />;

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
          { id: "marketing-accessibility.commitment.wcag", icon: wcagIcon },
          { id: "marketing-accessibility.commitment.motion", icon: motionIcon },
          { id: "marketing-accessibility.commitment.keyboard", icon: keyboardIcon },
          { id: "marketing-accessibility.commitment.contrast", icon: contrastIcon }
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
