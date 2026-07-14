import {
  CTASection,
  FAQAccordion,
  HeroBlock,
  StorySection,
  TrustBar
} from "@nelyohealth/ui-foundation";
import { Fingerprint, Lock, ScanEye } from "lucide-react";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("trust-safety", "/trust-and-safety");

const shieldIcon = <Lock size={20} strokeWidth={1.9} aria-hidden />;
const checkIcon = <Fingerprint size={20} strokeWidth={1.9} aria-hidden />;
const networkIcon = <ScanEye size={20} strokeWidth={1.9} aria-hidden />;

export default function TrustAndSafetyPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-trust-and-safety.hero.eyebrow"
        headlineId="marketing-trust-and-safety.hero.headline"
        bodyId="marketing-trust-and-safety.hero.body"
        primaryCtaLabelId="marketing-cta.learn-more"
        primaryCtaHref="/privacy-overview"
        illustrationId="trust-privacy"
      />
      <TrustBar
        items={[
          { id: "marketing-trust-and-safety.principle.consent", icon: shieldIcon },
          { id: "marketing-trust-and-safety.principle.identity", icon: checkIcon },
          { id: "marketing-trust-and-safety.principle.disclosure", icon: networkIcon }
        ]}
      />
      <StorySection
        headlineId="marketing-trust-and-safety.principle.emergency"
        bodyId="marketing-trust-and-safety.principle.emergency"
        illustrationId="trust-coordination"
        align="right"
      />
      <StorySection
        headlineId="marketing-trust-and-safety.principle.amendments"
        bodyId="marketing-trust-and-safety.principle.amendments"
        illustrationId="workflow-followup"
        align="left"
      />
      <FAQAccordion
        headingId="marketing-faq.hero.headline"
        items={[{ id: "marketing-trust-and-safety.faq.what-if" }]}
      />
      <CTASection
        headlineId="marketing-trust-and-safety.cta.headline"
        bodyId="marketing-privacy-overview.hero.body"
        primaryCtaLabelId="marketing-cta.learn-more"
        primaryCtaHref="/privacy-overview"
      />
    </>
  );
}
