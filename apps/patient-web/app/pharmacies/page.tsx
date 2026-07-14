import {
  CTASection,
  FAQAccordion,
  HeroBlock,
  StorySection
} from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("for-pharmacies", "/pharmacies");

export default function PharmaciesPage() {
  return (
    <>
      <HeroBlock
        variant="organization"
        eyebrowId="marketing-segment-pharmacies.hero.eyebrow"
        headlineId="marketing-segment-pharmacies.hero.headline"
        bodyId="marketing-segment-pharmacies.hero.body"
        primaryCtaLabelId="marketing-cta.contact"
        primaryCtaHref="/contact"
        secondaryCtaLabelId="marketing-cta.faq"
        secondaryCtaHref="/faq"
        illustrationId="hero-organization-partnership"
      />
      <StorySection
        headlineId="marketing-segment-pharmacies.story.a.headline"
        bodyId="marketing-segment-pharmacies.story.a.body"
        illustrationId="workflow-fulfilment"
        align="right"
      />
      <StorySection
        headlineId="marketing-segment-pharmacies.story.b.headline"
        bodyId="marketing-segment-pharmacies.story.b.body"
        illustrationId="trust-privacy"
        align="left"
      />
      <FAQAccordion
        headingId="marketing-faq.hero.headline"
        items={[{ id: "marketing-segment-pharmacies.faq.partner" }]}
      />
      <CTASection
        headlineId="marketing-segment-pharmacies.cta.headline"
        bodyId="marketing-segment-pharmacies.hero.body"
        primaryCtaLabelId="marketing-cta.contact"
        primaryCtaHref="/contact"
      />
    </>
  );
}
