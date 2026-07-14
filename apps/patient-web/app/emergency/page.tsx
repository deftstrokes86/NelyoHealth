import {
  CTASection,
  HeroBlock,
  LegalNoticeStrip,
  StorySection
} from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("emergency", "/emergency");

export default function EmergencyPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-emergency.ribbon.action"
        headlineId="marketing-emergency.hero.headline"
        bodyId="marketing-emergency.hero.body"
        primaryCtaLabelId="marketing-cta.call-local-help"
        primaryCtaHref="tel:112"
        secondaryCtaLabelId="marketing-cta.contact-support"
        secondaryCtaHref="/contact"
        illustrationId="trust-privacy"
      />
      <StorySection
        headlineId="marketing-emergency.guidance.call"
        bodyId="marketing-emergency.guidance.call"
        illustrationId="trust-privacy"
        align="right"
      />
      <StorySection
        headlineId="marketing-emergency.guidance.stay"
        bodyId="marketing-emergency.guidance.stay"
        illustrationId="trust-coordination"
        align="left"
      />
      <StorySection
        headlineId="marketing-emergency.guidance.info"
        bodyId="marketing-emergency.guidance.info"
        illustrationId="workflow-intake"
        align="right"
      />
      <LegalNoticeStrip
        noticeId="marketing-emergency.note.platform"
        approvalStatus="approved"
      />
      <CTASection
        headlineId="marketing-emergency.hero.headline"
        bodyId="marketing-emergency.hero.body"
        primaryCtaLabelId="marketing-cta.call-local-help"
        primaryCtaHref="tel:112"
      />
    </>
  );
}
