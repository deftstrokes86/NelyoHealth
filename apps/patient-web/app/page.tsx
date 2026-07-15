import { HeroBlock } from "@nelyohealth/ui-foundation";
import { AiHumanCareSection } from "../src/components/homepage/AiHumanCareSection";
import { CareJourneySection } from "../src/components/homepage/CareJourneySection";
import { EcosystemNetwork } from "../src/components/homepage/EcosystemNetwork";
import { FamilyAbroadSection } from "../src/components/homepage/FamilyAbroadSection";
import { FragmentedRealitySection } from "../src/components/homepage/FragmentedRealitySection";
import { SolutionsSection } from "../src/components/homepage/SolutionsSection";
import { marketingMetadata } from "../src/lib/seo";

export const metadata = marketingMetadata("home", "/");

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
      <CareJourneySection />
      <AiHumanCareSection />
      <SolutionsSection />
      <FamilyAbroadSection />
    </>
  );
}
