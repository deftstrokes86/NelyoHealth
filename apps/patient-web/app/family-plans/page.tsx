import {
  CTASection,
  FAQAccordion,
  HeroBlock,
  StorySection
} from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("for-family-diaspora", "/family-plans");

export default function FamilyPlansPage() {
  return (
    <>
      <HeroBlock
        variant="family-diaspora"
        eyebrowId="marketing-segment-family-diaspora.hero.eyebrow"
        headlineId="marketing-segment-family-diaspora.hero.headline"
        bodyId="marketing-segment-family-diaspora.hero.body"
        primaryCtaLabelId="marketing-cta.create-account"
        primaryCtaHref="/create-account"
        secondaryCtaLabelId="marketing-cta.faq"
        secondaryCtaHref="/faq"
        illustrationId="hero-family-diaspora-bridge"
      />
      <StorySection
        headlineId="marketing-segment-family-diaspora.story.a.headline"
        bodyId="marketing-segment-family-diaspora.story.a.body"
        illustrationId="family-diaspora-narrative"
        align="right"
      />
      <StorySection
        headlineId="marketing-segment-family-diaspora.story.b.headline"
        bodyId="marketing-segment-family-diaspora.story.b.body"
        illustrationId="trust-privacy"
        align="left"
      />
      <FAQAccordion
        headingId="marketing-faq.hero.headline"
        items={[{ id: "marketing-segment-family-diaspora.faq.records" }]}
      />
      <CTASection
        headlineId="marketing-segment-family-diaspora.cta.headline"
        bodyId="marketing-segment-family-diaspora.hero.body"
        primaryCtaLabelId="marketing-cta.create-account"
        primaryCtaHref="/create-account"
      />
    </>
  );
}
