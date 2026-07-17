"use client";

import { useContent } from "@nelyohealth/ui-foundation";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { whyItems, type WhySpec } from "./family-health-data";

const WhyCard = ({ spec, index }: { spec: WhySpec; index: number }) => {
  const title = useContent(spec.titleId);
  const body = useContent(spec.bodyId);
  const Icon = spec.icon;
  return (
    <Reveal delay={(index % 3) * 0.06}>
      <article className="nh-fh-why__card">
        <span className="nh-fh-why__icon" aria-hidden>
          <Icon size={22} strokeWidth={1.7} />
        </span>
        <h3 className="nh-fh-why__title">{title.title}</h3>
        <p className="nh-fh-why__body">{body.title}</p>
      </article>
    </Reveal>
  );
};

export const WhyFamilies = () => (
  <section className="nh-fh-why" aria-labelledby="nh-fh-why-heading">
    <div className="nh-fh-why__inner">
      <SectionHeader
        eyebrowId="marketing-family-health.why.eyebrow"
        headlineId="marketing-family-health.why.headline"
        headingId="nh-fh-why-heading"
      />
      <div className="nh-fh-why__grid">
        {whyItems.map((spec, index) => (
          <WhyCard key={spec.id} spec={spec} index={index} />
        ))}
      </div>
    </div>
  </section>
);
