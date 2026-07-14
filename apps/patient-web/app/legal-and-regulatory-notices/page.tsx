import {
  CTASection,
  HeroBlock,
  LegalNoticeStrip
} from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("legal", "/legal-and-regulatory-notices");

export default function LegalPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-legal.hero.eyebrow"
        headlineId="marketing-legal.hero.headline"
        bodyId="marketing-legal.hero.body"
        primaryCtaLabelId="marketing-cta.contact"
        primaryCtaHref="/contact"
        illustrationId="neutral-placeholder"
      />
      <LegalNoticeStrip noticeId="marketing-legal.notice.terms" approvalStatus="draft" />
      <LegalNoticeStrip
        noticeId="marketing-legal.notice.privacy"
        approvalStatus="draft"
      />
      <LegalNoticeStrip
        noticeId="marketing-legal.notice.clinical"
        approvalStatus="draft"
      />
      <LegalNoticeStrip
        noticeId="marketing-legal.notice.regulatory"
        approvalStatus="draft"
      />
      <LegalNoticeStrip
        noticeId="marketing-legal.note.pending"
        approvalStatus="draft"
      />
      <CTASection
        headlineId="marketing-legal.cta.headline"
        bodyId="marketing-legal.hero.body"
        primaryCtaLabelId="marketing-cta.contact"
        primaryCtaHref="/contact"
      />
    </>
  );
}
