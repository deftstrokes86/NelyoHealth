"use client";

import "./ecosystem-network.css";
import { useContent } from "@nelyohealth/ui-foundation";
import { orbitNodes, type EcosystemNodeSpec } from "./ecosystem-nodes";

interface RoleCardProps {
  spec: EcosystemNodeSpec;
}

const RoleCard = ({ spec }: RoleCardProps) => {
  const title = useContent(`${spec.contentPrefix}.title`);
  const detail = useContent(`${spec.contentPrefix}.body`);
  const Icon = spec.icon;
  return (
    <a className="nh-ecosystem__card" href={spec.href}>
      <header className="nh-ecosystem__card-head">
        <span className="nh-ecosystem__card-icon" aria-hidden>
          <Icon size={22} strokeWidth={1.9} />
        </span>
        <div>
          <p className="nh-ecosystem__card-eyebrow">{detail.title}</p>
          <h3 className="nh-ecosystem__card-title">{title.title}</h3>
        </div>
      </header>
      <p className="nh-ecosystem__card-lead">{title.body}</p>
      <p className="nh-ecosystem__card-body">{detail.body}</p>
    </a>
  );
};

export const EcosystemNetwork = () => {
  const eyebrow = useContent("marketing-home.ecosystem.eyebrow");
  const headline = useContent("marketing-home.ecosystem.headline");
  const subheadline = useContent("marketing-home.ecosystem.subheadline");
  const hint = useContent("marketing-home.ecosystem.hint");
  const cta = useContent("marketing-home.ecosystem.cta");

  return (
    <section className="nh-ecosystem" aria-labelledby="nh-ecosystem-heading">
      <div className="nh-ecosystem__inner">
        <header className="nh-ecosystem__header">
          <p className="nh-ecosystem__eyebrow">{eyebrow.title}</p>
          <h2 id="nh-ecosystem-heading" className="nh-ecosystem__headline">
            {headline.title}
          </h2>
          <p className="nh-ecosystem__subheadline">{subheadline.body}</p>
        </header>

        <p className="nh-ecosystem__hint">{hint.title}</p>

        <div className="nh-ecosystem__cards" role="list">
          {orbitNodes.map((spec) => (
            <div key={spec.id} role="listitem" className="nh-ecosystem__card-slot">
              <RoleCard spec={spec} />
            </div>
          ))}
        </div>

        <div className="nh-ecosystem__cta">
          <a className="nh-ecosystem__cta-primary" href="/contact">
            {cta.title}
          </a>
        </div>
      </div>
    </section>
  );
};
