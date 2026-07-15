import {
  CTASection,
  HeroBlock,
  LegalNoticeStrip,
  StorySection
} from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("for-hospitals", "/hospitals");

export default function HospitalsPage() {
  return (
    <>
      <HeroBlock
        variant="organization"
        eyebrowId="marketing-segment-hospitals.hero.eyebrow"
        headlineId="marketing-segment-hospitals.hero.headline"
        bodyId="marketing-segment-hospitals.hero.body"
        primaryCtaLabelId="marketing-cta.contact"
        primaryCtaHref="/contact"
        secondaryCtaLabelId="marketing-cta.faq"
        secondaryCtaHref="/faq"
        illustrationId="hero-organization-partnership"
      />
      <LegalNoticeStrip noticeId="marketing-segment-hospitals.scope.caveat" approvalStatus="draft" />
      <StorySection
        headlineId="marketing-segment-hospitals.story.a.headline"
        bodyId="marketing-segment-hospitals.story.a.body"
        illustrationId="workflow-triage"
        align="right"
      />
      <CTASection
        headlineId="marketing-segment-hospitals.cta.headline"
        bodyId="marketing-segment-hospitals.hero.body"
        primaryCtaLabelId="marketing-cta.contact"
        primaryCtaHref="/contact"
      />
    </>
  );
}
