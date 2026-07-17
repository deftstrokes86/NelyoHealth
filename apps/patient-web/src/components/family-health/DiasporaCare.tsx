"use client";

import { useContent } from "@nelyohealth/ui-foundation";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { diasporaSteps, diasporaValues } from "./family-health-data";

const TimelineStep = ({
  titleId,
  bodyId,
  index
}: {
  titleId: string;
  bodyId: string;
  index: number;
}) => {
  const title = useContent(titleId);
  const body = useContent(bodyId);
  return (
    <Reveal as="li" className="nh-fh-diaspora__step" delay={index * 0.05}>
      <span className="nh-fh-diaspora__step-marker" aria-hidden>
        {index + 1}
      </span>
      <div className="nh-fh-diaspora__step-copy">
        <p className="nh-fh-diaspora__step-title">{title.title}</p>
        <p className="nh-fh-diaspora__step-body">{body.title}</p>
      </div>
    </Reveal>
  );
};

const ValuePill = ({ id }: { id: string }) => {
  const value = useContent(id);
  return <span className="nh-fh-diaspora__pill">{value.title}</span>;
};

export const DiasporaCare = () => (
  <section
    id="diaspora-care"
    className="nh-fh-diaspora"
    aria-labelledby="nh-fh-diaspora-heading"
  >
    <div className="nh-fh-diaspora__inner">
      <SectionHeader
        eyebrowId="marketing-family-health.diaspora.eyebrow"
        headlineId="marketing-family-health.diaspora.headline"
        bodyId="marketing-family-health.diaspora.body"
        headingId="nh-fh-diaspora-heading"
      />
      <ol className="nh-fh-diaspora__timeline">
        {diasporaSteps.map((step, index) => (
          <TimelineStep
            key={step.titleId}
            titleId={step.titleId}
            bodyId={step.bodyId}
            index={index}
          />
        ))}
      </ol>
      <Reveal className="nh-fh-diaspora__values">
        {diasporaValues.map((id) => (
          <ValuePill key={id} id={id} />
        ))}
      </Reveal>
    </div>
  </section>
);
