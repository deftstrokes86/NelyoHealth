import {
  CTASection,
  HeroBlock,
  LegalNoticeStrip,
  StorySection
} from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("for-employers", "/employers");

export default function EmployersPage() {
  return (
    <>
      <HeroBlock
        variant="organization"
        eyebrowId="marketing-segment-employers.hero.eyebrow"
        headlineId="marketing-segment-employers.hero.headline"
        bodyId="marketing-segment-employers.hero.body"
        primaryCtaLabelId="marketing-cta.contact"
        primaryCtaHref="/contact"
        secondaryCtaLabelId="marketing-cta.faq"
        secondaryCtaHref="/faq"
        illustrationId="hero-organization-partnership"
      />
      <LegalNoticeStrip noticeId="marketing-segment-employers.scope.caveat" approvalStatus="draft" />
      <StorySection
        headlineId="marketing-segment-employers.story.a.headline"
        bodyId="marketing-segment-employers.story.a.body"
        illustrationId="trust-verified"
        align="right"
      />
      <CTASection
        headlineId="marketing-segment-employers.cta.headline"
        bodyId="marketing-segment-employers.hero.body"
        primaryCtaLabelId="marketing-cta.contact"
        primaryCtaHref="/contact"
      />
    </>
  );
}
