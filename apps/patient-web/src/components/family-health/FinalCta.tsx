"use client";

import { useContent } from "@nelyohealth/ui-foundation";
import { Reveal } from "./Reveal";

export const FinalCta = () => {
  const headline = useContent("marketing-family-health.final.headline");
  const body = useContent("marketing-family-health.final.body");
  const primary = useContent("marketing-family-health.final.cta.primary");
  const secondary = useContent("marketing-family-health.final.cta.secondary");
  return (
    <section className="nh-fh-final" aria-labelledby="nh-fh-final-heading">
      <div className="nh-fh-final__inner">
        <Reveal className="nh-fh-final__card" y={24}>
          <h2 id="nh-fh-final-heading" className="nh-fh-final__headline">
            {headline.title}
          </h2>
          <p className="nh-fh-final__body">{body.body}</p>
          <div className="nh-fh-final__ctas">
            <a className="nh-fh-btn nh-fh-btn--primary" href="/create-account">
              {primary.title}
            </a>
            <a className="nh-fh-btn nh-fh-btn--ghost-invert" href="#care-circle">
              {secondary.title}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
