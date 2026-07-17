"use client";

import { ShieldCheck } from "lucide-react";
import { useContent } from "@nelyohealth/ui-foundation";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { privacyBadges, privacyPoints, type PrivacyPointSpec } from "./family-health-data";

const PrivacyPoint = ({ spec, index }: { spec: PrivacyPointSpec; index: number }) => {
  const title = useContent(spec.titleId);
  const body = useContent(spec.bodyId);
  const Icon = spec.icon;
  return (
    <Reveal delay={index * 0.05}>
      <article className="nh-fh-privacy__point">
        <span className="nh-fh-privacy__point-icon" aria-hidden>
          <Icon size={20} strokeWidth={1.8} />
        </span>
        <div>
          <h3 className="nh-fh-privacy__point-title">{title.title}</h3>
          <p className="nh-fh-privacy__point-body">{body.title}</p>
        </div>
      </article>
    </Reveal>
  );
};

const PrivacyBadge = ({ id }: { id: string }) => {
  const badge = useContent(id);
  return (
    <span className="nh-fh-privacy__badge">
      <ShieldCheck size={14} strokeWidth={2.2} aria-hidden />
      {badge.title}
    </span>
  );
};

export const PrivacyConsent = () => (
  <section className="nh-fh-privacy" aria-labelledby="nh-fh-privacy-heading">
    <div className="nh-fh-privacy__inner">
      <SectionHeader
        eyebrowId="marketing-family-health.privacy.eyebrow"
        headlineId="marketing-family-health.privacy.headline"
        bodyId="marketing-family-health.privacy.body"
        headingId="nh-fh-privacy-heading"
      />
      <div className="nh-fh-privacy__grid">
        {privacyPoints.map((spec, index) => (
          <PrivacyPoint key={spec.id} spec={spec} index={index} />
        ))}
      </div>
      <Reveal className="nh-fh-privacy__badges">
        {privacyBadges.map((id) => (
          <PrivacyBadge key={id} id={id} />
        ))}
      </Reveal>
    </div>
  </section>
);
