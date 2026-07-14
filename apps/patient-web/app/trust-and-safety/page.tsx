import {
  CTASection,
  FAQAccordion,
  HeroBlock,
  StorySection,
  TrustBar
} from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("trust-safety", "/trust-and-safety");

const shieldIcon = (
  <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
    <path d="M10 2 L16 5 v5 c0 4.5 -3 7 -6 8 c-3 -1 -6 -3.5 -6 -8 v-5 z" />
  </svg>
);

const checkIcon = (
  <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
    <path d="M4 11 l4 4 l8 -9 l-2 -2 l-6 7 l-2 -2 z" />
  </svg>
);

const networkIcon = (
  <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
    <circle cx="10" cy="10" r="3" />
    <circle cx="4" cy="4" r="2" />
    <circle cx="16" cy="4" r="2" />
    <circle cx="4" cy="16" r="2" />
    <circle cx="16" cy="16" r="2" />
  </svg>
);

export default function TrustAndSafetyPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-trust-and-safety.hero.eyebrow"
        headlineId="marketing-trust-and-safety.hero.headline"
        bodyId="marketing-trust-and-safety.hero.body"
        primaryCtaLabelId="marketing-cta.learn-more"
        primaryCtaHref="/privacy-overview"
        illustrationId="trust-privacy"
      />
      <TrustBar
        items={[
          { id: "marketing-trust-and-safety.principle.consent", icon: shieldIcon },
          { id: "marketing-trust-and-safety.principle.identity", icon: checkIcon },
          { id: "marketing-trust-and-safety.principle.disclosure", icon: networkIcon }
        ]}
      />
      <StorySection
        headlineId="marketing-trust-and-safety.principle.emergency"
        bodyId="marketing-trust-and-safety.principle.emergency"
        illustrationId="trust-coordination"
        align="right"
      />
      <StorySection
        headlineId="marketing-trust-and-safety.principle.amendments"
        bodyId="marketing-trust-and-safety.principle.amendments"
        illustrationId="workflow-followup"
        align="left"
      />
      <FAQAccordion
        headingId="marketing-faq.hero.headline"
        items={[{ id: "marketing-trust-and-safety.faq.what-if" }]}
      />
      <CTASection
        headlineId="marketing-trust-and-safety.cta.headline"
        bodyId="marketing-privacy-overview.hero.body"
        primaryCtaLabelId="marketing-cta.learn-more"
        primaryCtaHref="/privacy-overview"
      />
    </>
  );
}
