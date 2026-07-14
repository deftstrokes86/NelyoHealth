import {
  CTASection,
  FAQAccordion,
  HeroBlock,
  StorySection,
  TrustBar
} from "@nelyohealth/ui-foundation";
import { ShieldCheck } from "lucide-react";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("for-patients", "/patients");

const privacyIcon = <ShieldCheck size={20} strokeWidth={1.9} aria-hidden />;

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
