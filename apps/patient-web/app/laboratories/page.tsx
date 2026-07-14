import {
  CTASection,
  FAQAccordion,
  HeroBlock,
  StorySection
} from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("for-laboratories", "/laboratories");

export default function LaboratoriesPage() {
  return (
    <>
      <HeroBlock
        variant="organization"
        eyebrowId="marketing-segment-laboratories.hero.eyebrow"
        headlineId="marketing-segment-laboratories.hero.headline"
        bodyId="marketing-segment-laboratories.hero.body"
        primaryCtaLabelId="marketing-cta.contact"
        primaryCtaHref="/contact"
        secondaryCtaLabelId="marketing-cta.faq"
        secondaryCtaHref="/faq"
        illustrationId="hero-organization-partnership"
      />
      <StorySection
        headlineId="marketing-segment-laboratories.story.a.headline"
        bodyId="marketing-segment-laboratories.story.a.body"
        illustrationId="workflow-fulfilment"
        align="right"
      />
      <StorySection
        headlineId="marketing-segment-laboratories.story.b.headline"
        bodyId="marketing-segment-laboratories.story.b.body"
        illustrationId="trust-privacy"
        align="left"
      />
      <FAQAccordion
        headingId="marketing-faq.hero.headline"
        items={[{ id: "marketing-segment-laboratories.faq.integration" }]}
      />
      <CTASection
        headlineId="marketing-segment-laboratories.cta.headline"
        bodyId="marketing-segment-laboratories.hero.body"
        primaryCtaLabelId="marketing-cta.contact"
        primaryCtaHref="/contact"
      />
    </>
  );
}
