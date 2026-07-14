import { CTASection, HeroBlock, LegalNoticeStrip } from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("create-account", "/create-account");

export default function CreateAccountPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-microcopy.brand.name"
        headlineId="auth-create-account.hero.headline"
        bodyId="auth-create-account.hero.body"
        primaryCtaLabelId="marketing-cta.get-started"
        primaryCtaHref="#create-account"
        secondaryCtaLabelId="marketing-cta.sign-in"
        secondaryCtaHref="/sign-in"
        illustrationId="neutral-placeholder"
      />
      <LegalNoticeStrip
        noticeId="auth-create-account.note.privacy"
        approvalStatus="approved"
      />
      <CTASection
        headlineId="auth-create-account.hero.headline"
        bodyId="auth-create-account.hero.body"
        primaryCtaLabelId="marketing-cta.get-started"
        primaryCtaHref="#create-account"
        secondaryCtaLabelId="marketing-cta.back"
        secondaryCtaHref="/"
      />
    </>
  );
}
