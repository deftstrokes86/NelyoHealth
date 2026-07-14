import {
  CTASection,
  FAQAccordion,
  HeroBlock,
  StorySection,
  TrustBar
} from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("for-patients", "/patients");

const privacyIcon = (
  <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
    <path d="M10 2 L16 5 v5 c0 4.5 -3 7 -6 8 c-3 -1 -6 -3.5 -6 -8 v-5 z" />
  </svg>
);

export default function PatientsPage() {
  return (
    <>
      <HeroBlock
        variant="patient"
        eyebrowId="marketing-segment-patients.hero.eyebrow"
        headlineId="marketing-segment-patients.hero.headline"
        bodyId="marketing-segment-patients.hero.body"
        primaryCtaLabelId="marketing-cta.create-account"
        primaryCtaHref="/create-account"
        secondaryCtaLabelId="marketing-cta.faq"
        secondaryCtaHref="/faq"
        illustrationId="hero-patient-journey"
      />
      <StorySection
        headlineId="marketing-segment-patients.story.a.headline"
        bodyId="marketing-segment-patients.story.a.body"
        illustrationId="trust-privacy"
        align="right"
      />
      <StorySection
        headlineId="marketing-segment-patients.story.b.headline"
        bodyId="marketing-segment-patients.story.b.body"
        illustrationId="workflow-intake"
        align="left"
      />
      <TrustBar
        items={[{ id: "marketing-segment-patients.trust.privacy", icon: privacyIcon }]}
      />
      <FAQAccordion
        headingId="marketing-faq.hero.headline"
        items={[{ id: "marketing-segment-patients.faq.access" }]}
      />
      <CTASection
        headlineId="marketing-segment-patients.cta.headline"
        bodyId="marketing-segment-patients.hero.body"
        primaryCtaLabelId="marketing-cta.create-account"
        primaryCtaHref="/create-account"
      />
    </>
  );
}
