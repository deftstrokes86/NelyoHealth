import {
  CTASection,
  HeroBlock,
  LegalNoticeStrip,
  StorySection
} from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("for-hmos", "/hmos");

export default function HmosPage() {
  return (
    <>
      <HeroBlock
        variant="organization"
        eyebrowId="marketing-segment-hmos.hero.eyebrow"
        headlineId="marketing-segment-hmos.hero.headline"
        bodyId="marketing-segment-hmos.hero.body"
        primaryCtaLabelId="marketing-cta.contact"
        primaryCtaHref="/contact"
        secondaryCtaLabelId="marketing-cta.faq"
        secondaryCtaHref="/faq"
        illustrationId="hero-organization-partnership"
      />
      <LegalNoticeStrip noticeId="marketing-segment-hmos.scope.caveat" approvalStatus="draft" />
      <StorySection
        headlineId="marketing-segment-hmos.story.a.headline"
        bodyId="marketing-segment-hmos.story.a.body"
        illustrationId="trust-coordination"
        align="right"
      />
      <CTASection
        headlineId="marketing-segment-hmos.cta.headline"
        bodyId="marketing-segment-hmos.hero.body"
        primaryCtaLabelId="marketing-cta.contact"
        primaryCtaHref="/contact"
      />
    </>
  );
}
