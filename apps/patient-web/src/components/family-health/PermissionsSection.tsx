"use client";

import { useContent } from "@nelyohealth/ui-foundation";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { permissionItems, type PermissionSpec } from "./family-health-data";

const PermissionChip = ({ spec, index }: { spec: PermissionSpec; index: number }) => {
  const label = useContent(spec.id);
  const Icon = spec.icon;
  return (
    <Reveal as="li" className="nh-fh-perms__chip" delay={index * 0.04}>
      <span className="nh-fh-perms__chip-icon" aria-hidden>
        <Icon size={18} strokeWidth={1.9} />
      </span>
      {label.title}
    </Reveal>
  );
};

export const PermissionsSection = () => {
  const footnote = useContent("marketing-family-health.perms.footnote");
  return (
    <section className="nh-fh-perms" aria-labelledby="nh-fh-perms-heading">
      <div className="nh-fh-perms__inner">
        <SectionHeader
          eyebrowId="marketing-family-health.perms.eyebrow"
          headlineId="marketing-family-health.perms.headline"
          bodyId="marketing-family-health.perms.body"
          headingId="nh-fh-perms-heading"
        />
        <ul className="nh-fh-perms__grid">
          {permissionItems.map((spec, index) => (
            <PermissionChip key={spec.id} spec={spec} index={index} />
          ))}
        </ul>
        <Reveal>
          <p className="nh-fh-perms__footnote">{footnote.title}</p>
        </Reveal>
      </div>
    </section>
  );
};
