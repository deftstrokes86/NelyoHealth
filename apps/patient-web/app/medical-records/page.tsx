import {
  CTASection,
  HeroBlock,
  LegalNoticeStrip,
  StorySection
} from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("for-medical-records", "/medical-records");

export default function MedicalRecordsPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-segment-medical-records.hero.eyebrow"
        headlineId="marketing-segment-medical-records.hero.headline"
        bodyId="marketing-segment-medical-records.hero.body"
        primaryCtaLabelId="marketing-cta.contact"
        primaryCtaHref="/contact"
        secondaryCtaLabelId="marketing-cta.faq"
        secondaryCtaHref="/faq"
        illustrationId="hero-universal-network"
      />
      <LegalNoticeStrip noticeId="marketing-segment-medical-records.scope.caveat" approvalStatus="draft" />
      <StorySection
        headlineId="marketing-segment-medical-records.story.a.headline"
        bodyId="marketing-segment-medical-records.story.a.body"
        illustrationId="trust-privacy"
        align="right"
      />
      <CTASection
        headlineId="marketing-segment-medical-records.cta.headline"
        bodyId="marketing-segment-medical-records.hero.body"
        primaryCtaLabelId="marketing-cta.contact"
        primaryCtaHref="/contact"
      />
    </>
  );
}
