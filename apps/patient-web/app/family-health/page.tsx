import "../../src/components/family-health/family-health.css";
import { FamilyHealthHero } from "../../src/components/family-health/FamilyHealthHero";
import { ChooseJourney } from "../../src/components/family-health/ChooseJourney";
import { CareCircle } from "../../src/components/family-health/CareCircle";
import { PermissionsSection } from "../../src/components/family-health/PermissionsSection";
import { HouseholdCare } from "../../src/components/family-health/HouseholdCare";
import { DiasporaCare } from "../../src/components/family-health/DiasporaCare";
import { WhyFamilies } from "../../src/components/family-health/WhyFamilies";
import { PrivacyConsent } from "../../src/components/family-health/PrivacyConsent";
import { Testimonials } from "../../src/components/family-health/Testimonials";
import { FamilyHealthFaq } from "../../src/components/family-health/FamilyHealthFaq";
import { FinalCta } from "../../src/components/family-health/FinalCta";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("family-health", "/family-health");

export default function FamilyHealthPage() {
  return (
    <div className="nh-fh">
      <FamilyHealthHero />
      <ChooseJourney />
      <CareCircle />
      <PermissionsSection />
      <HouseholdCare />
      <DiasporaCare />
      <WhyFamilies />
      <PrivacyConsent />
      <Testimonials />
      <FamilyHealthFaq />
      <FinalCta />
    </div>
  );
}
