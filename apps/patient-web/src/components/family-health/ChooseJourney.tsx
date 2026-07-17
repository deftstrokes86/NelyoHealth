"use client";

import { Check } from "lucide-react";
import { useContent } from "@nelyohealth/ui-foundation";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { journeyCards, type JourneyCardSpec } from "./family-health-data";

const JourneyPoint = ({ id }: { id: string }) => {
  const point = useContent(id);
  return (
    <li className="nh-fh-journey__point">
      <span className="nh-fh-journey__point-icon" aria-hidden>
        <Check size={15} strokeWidth={2.6} />
      </span>
      {point.title}
    </li>
  );
};

const JourneyCard = ({ spec, index }: { spec: JourneyCardSpec; index: number }) => {
  const headline = useContent(spec.headlineId);
  const body = useContent(spec.bodyId);
  const cta = useContent(spec.ctaId);
  const Icon = spec.icon;
  return (
    <Reveal delay={index * 0.08}>
      <article className={`nh-fh-journey__card nh-fh-journey__card--${spec.tone}`}>
        <span className="nh-fh-journey__icon" aria-hidden>
          <Icon size={26} strokeWidth={1.7} />
        </span>
        <h3 className="nh-fh-journey__headline">{headline.title}</h3>
        <p className="nh-fh-journey__body">{body.body}</p>
        <ul className="nh-fh-journey__points">
          {spec.pointIds.map((id) => (
            <JourneyPoint key={id} id={id} />
          ))}
        </ul>
        <a className="nh-fh-journey__cta" href={spec.href}>
          {cta.title}
          <span aria-hidden> →</span>
        </a>
      </article>
    </Reveal>
  );
};

export const ChooseJourney = () => (
  <section
    id="choose-journey"
    className="nh-fh-journey"
    aria-labelledby="nh-fh-journey-heading"
  >
    <div className="nh-fh-journey__inner">
      <SectionHeader
        eyebrowId="marketing-family-health.journey.eyebrow"
        headlineId="marketing-family-health.journey.headline"
        bodyId="marketing-family-health.journey.body"
        headingId="nh-fh-journey-heading"
      />
      <div className="nh-fh-journey__grid">
        {journeyCards.map((spec, index) => (
          <JourneyCard key={spec.id} spec={spec} index={index} />
        ))}
      </div>
    </div>
  </section>
);
