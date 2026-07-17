"use client";

import { useContent } from "@nelyohealth/ui-foundation";
import { Reveal } from "./Reveal";

interface SectionHeaderProps {
  eyebrowId?: string;
  headlineId: string;
  bodyId?: string;
  headingId: string;
  align?: "left" | "center";
}

export const SectionHeader = ({
  eyebrowId,
  headlineId,
  bodyId,
  headingId,
  align = "center"
}: SectionHeaderProps) => {
  const eyebrow = eyebrowId ? useContent(eyebrowId) : null;
  const headline = useContent(headlineId);
  const body = bodyId ? useContent(bodyId) : null;
  return (
    <Reveal className={`nh-fh-header nh-fh-header--${align}`}>
      {eyebrow ? <p className="nh-fh-eyebrow">{eyebrow.title}</p> : null}
      <h2 id={headingId} className="nh-fh-heading">
        {headline.title}
      </h2>
      {body ? <p className="nh-fh-lead">{body.body}</p> : null}
    </Reveal>
  );
};
