import {
  CTASection,
  FAQAccordion,
  HeroBlock,
  StorySection
} from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("for-doctors", "/doctors");

export default function DoctorsPage() {
  return (
    <>
      <HeroBlock
        variant="provider"
        eyebrowId="marketing-segment-doctors.hero.eyebrow"
        headlineId="marketing-segment-doctors.hero.headline"
        bodyId="marketing-segment-doctors.hero.body"
        primaryCtaLabelId="marketing-cta.book-walkthrough"
        primaryCtaHref="/contact"
        secondaryCtaLabelId="marketing-cta.faq"
        secondaryCtaHref="/faq"
        illustrationId="hero-provider-clinic"
      />
      <StorySection
        headlineId="marketing-segment-doctors.story.a.headline"
        bodyId="marketing-segment-doctors.story.a.body"
        illustrationId="provider-narrative"
        align="right"
      />
      <StorySection
        headlineId="marketing-segment-doctors.story.b.headline"
        bodyId="marketing-segment-doctors.story.b.body"
        illustrationId="workflow-consult"
        align="left"
      />
      <FAQAccordion
        headingId="marketing-faq.hero.headline"
        items={[{ id: "marketing-segment-doctors.faq.autonomy" }]}
      />
      <CTASection
        headlineId="marketing-segment-doctors.cta.headline"
        bodyId="marketing-segment-doctors.hero.body"
        primaryCtaLabelId="marketing-cta.book-walkthrough"
        primaryCtaHref="/contact"
      />
    </>
  );
}
