import {
  CTASection,
  HeroBlock,
  LegalNoticeStrip,
  StorySection
} from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("for-home-care", "/home-care");

export default function HomeCarePage() {
  return (
    <>
      <HeroBlock
        variant="family-diaspora"
        eyebrowId="marketing-segment-home-care.hero.eyebrow"
        headlineId="marketing-segment-home-care.hero.headline"
        bodyId="marketing-segment-home-care.hero.body"
        primaryCtaLabelId="marketing-cta.contact"
        primaryCtaHref="/contact"
        secondaryCtaLabelId="marketing-cta.faq"
        secondaryCtaHref="/faq"
        illustrationId="hero-family-diaspora-bridge"
      />
      <LegalNoticeStrip noticeId="marketing-segment-home-care.scope.caveat" approvalStatus="draft" />
      <StorySection
        headlineId="marketing-segment-home-care.story.a.headline"
        bodyId="marketing-segment-home-care.story.a.body"
        illustrationId="family-diaspora-narrative"
        align="right"
      />
      <CTASection
        headlineId="marketing-segment-home-care.cta.headline"
        bodyId="marketing-segment-home-care.hero.body"
        primaryCtaLabelId="marketing-cta.contact"
        primaryCtaHref="/contact"
      />
    </>
  );
}
