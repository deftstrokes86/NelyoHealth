import {
  CTASection,
  FAQAccordion,
  HeroBlock,
  LegalNoticeStrip,
  StorySection
} from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("privacy-overview", "/privacy-overview");

export default function PrivacyOverviewPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-privacy-overview.hero.eyebrow"
        headlineId="marketing-privacy-overview.hero.headline"
        bodyId="marketing-privacy-overview.hero.body"
        primaryCtaLabelId="marketing-cta.learn-more"
        primaryCtaHref="/legal-and-regulatory-notices"
        illustrationId="trust-privacy"
      />
      <StorySection
        headlineId="marketing-privacy-overview.section.categories"
        bodyId="marketing-privacy-overview.section.categories"
        illustrationId="trust-coordination"
        align="right"
      />
      <StorySection
        headlineId="marketing-privacy-overview.section.purposes"
        bodyId="marketing-privacy-overview.section.purposes"
        illustrationId="workflow-intake"
        align="left"
      />
      <StorySection
        headlineId="marketing-privacy-overview.section.controls"
        bodyId="marketing-privacy-overview.section.controls"
        illustrationId="trust-privacy"
        align="right"
      />
      <LegalNoticeStrip
        noticeId="marketing-privacy-overview.note.caveat"
        approvalStatus="draft"
      />
      <FAQAccordion
        headingId="marketing-faq.hero.headline"
        items={[{ id: "marketing-privacy-overview.faq.marketing" }]}
      />
      <CTASection
        headlineId="marketing-privacy-overview.cta.headline"
        bodyId="marketing-privacy-overview.hero.body"
        primaryCtaLabelId="marketing-cta.learn-more"
        primaryCtaHref="/legal-and-regulatory-notices"
      />
    </>
  );
}
