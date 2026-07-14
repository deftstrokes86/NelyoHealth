import { HeroBlock, StorySection, CTASection } from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("for-family-diaspora", "/diaspora");

export default function DiasporaPage() {
  return (
    <>
      <HeroBlock
        variant="family-diaspora"
        eyebrowId="marketing-segment-family-diaspora.hero.eyebrow"
        headlineId="marketing-segment-family-diaspora.hero.headline"
        bodyId="marketing-segment-family-diaspora.hero.body"
        primaryCtaLabelId="marketing-cta.create-account"
        primaryCtaHref="/create-account"
        secondaryCtaLabelId="marketing-cta.book-walkthrough"
        secondaryCtaHref="/contact"
        illustrationId="hero-family-diaspora-bridge"
      />
      <StorySection
        headlineId="marketing-segment-family-diaspora.story.a.headline"
        bodyId="marketing-segment-family-diaspora.story.a.body"
        illustrationId="family-diaspora-narrative"
        align="right"
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
