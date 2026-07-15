import {
  CTASection,
  FAQAccordion,
  HeroBlock,
  ProofStrip,
  SegmentGrid,
  StorySection,
  TrustBar,
  WorkflowStepper
} from "@nelyohealth/ui-foundation";
import { BadgeCheck, Network, ShieldCheck } from "lucide-react";
import { EcosystemNetwork } from "../src/components/homepage/EcosystemNetwork";
import { FragmentedRealitySection } from "../src/components/homepage/FragmentedRealitySection";
import { marketingMetadata } from "../src/lib/seo";

export const metadata = marketingMetadata("home", "/");

const trustIcon = <ShieldCheck size={20} strokeWidth={1.9} aria-hidden />;
const verifiedIcon = <BadgeCheck size={20} strokeWidth={1.9} aria-hidden />;
const coordinationIcon = <Network size={20} strokeWidth={1.9} aria-hidden />;

export default function HomePage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-home.hero.eyebrow"
        headlineId="marketing-home.hero.headline"
        bodyId="marketing-home.hero.body"
        primaryCtaLabelId="marketing-cta.create-account"
        primaryCtaHref="/create-account"
        secondaryCtaLabelId="marketing-cta.sign-in"
        secondaryCtaHref="/sign-in"
        illustrationId="hero-connected-care-ecosystem"
      />
      <FragmentedRealitySection />
      <EcosystemNetwork />
      <TrustBar
        items={[
          { id: "marketing-home.trust.privacy", icon: trustIcon },
          { id: "marketing-home.trust.verified", icon: verifiedIcon },
          { id: "marketing-home.trust.coordination", icon: coordinationIcon }
        ]}
      />
      <StorySection
        headlineId="marketing-home.story.a.headline"
        bodyId="marketing-home.story.a.body"
        illustrationId="trust-coordination"
        align="right"
      />
      <WorkflowStepper
        headingId="marketing-how-it-works.hero.headline"
        steps={[
          {
            id: "marketing-how-it-works.step.intake",
            illustrationId: "workflow-intake"
          },
          {
            id: "marketing-how-it-works.step.triage",
            illustrationId: "workflow-triage"
          },
          {
            id: "marketing-how-it-works.step.consult",
            illustrationId: "workflow-consult"
          },
          {
            id: "marketing-how-it-works.step.fulfilment",
            illustrationId: "workflow-fulfilment"
          },
          {
            id: "marketing-how-it-works.step.followup",
            illustrationId: "workflow-followup"
          }
        ]}
      />
      <StorySection
        headlineId="marketing-home.story.b.headline"
        bodyId="marketing-home.story.b.body"
        illustrationId="family-diaspora-narrative"
        align="left"
      />
      <SegmentGrid
        headingId="marketing-home.cta.headline"
        cards={[
          { id: "marketing-segment-patients.hero.headline", href: "/patients" },
          {
            id: "marketing-segment-family-diaspora.hero.headline",
            href: "/diaspora"
          },
          { id: "marketing-segment-doctors.hero.headline", href: "/doctors" },
          {
            id: "marketing-segment-pharmacies.hero.headline",
            href: "/pharmacies"
          },
          {
            id: "marketing-segment-laboratories.hero.headline",
            href: "/laboratories"
          }
        ]}
      />
      <ProofStrip
        items={[
          { id: "marketing-home.trust.privacy", value: "By design" },
          { id: "marketing-home.trust.verified", value: "Credentialed" },
          { id: "marketing-home.trust.coordination", value: "End-to-end" }
        ]}
      />
      <FAQAccordion
        headingId="marketing-faq.hero.headline"
        items={[{ id: "marketing-home.faq.who" }, { id: "marketing-home.faq.data" }]}
      />
      <CTASection
        headlineId="marketing-home.cta.headline"
        bodyId="marketing-home.cta.body"
        primaryCtaLabelId="marketing-cta.create-account"
        primaryCtaHref="/create-account"
        secondaryCtaLabelId="marketing-cta.book-walkthrough"
        secondaryCtaHref="/contact"
      />
    </>
  );
}
