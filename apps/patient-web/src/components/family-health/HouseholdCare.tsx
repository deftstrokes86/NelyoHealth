"use client";

import { useContent } from "@nelyohealth/ui-foundation";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import {
  householdMembers,
  householdTags,
  type HouseholdMemberSpec
} from "./family-health-data";

const MemberCard = ({ spec, index }: { spec: HouseholdMemberSpec; index: number }) => {
  const name = useContent(spec.nameId);
  const role = useContent(spec.roleId);
  const status = useContent(spec.statusId);
  const initial = name.title.charAt(0);
  return (
    <Reveal delay={index * 0.06}>
      <article className={`nh-fh-house__member nh-fh-house__member--${spec.tone}`}>
        <span className="nh-fh-house__avatar" aria-hidden>
          {initial}
        </span>
        <div className="nh-fh-house__member-copy">
          <p className="nh-fh-house__member-name">
            {name.title}
            <span className="nh-fh-house__member-role">{role.title}</span>
          </p>
          <p className="nh-fh-house__member-status">{status.title}</p>
        </div>
      </article>
    </Reveal>
  );
};

export const HouseholdCare = () => {
  const dashboardTitle = useContent("marketing-family-health.household.dashboard.title");
  const caption = useContent("marketing-family-health.household.dashboard.caption");
  const disclaimer = useContent("marketing-family-health.household.disclaimer");
  return (
    <section
      id="household-care"
      className="nh-fh-house"
      aria-labelledby="nh-fh-house-heading"
    >
      <div className="nh-fh-house__inner">
        <SectionHeader
          eyebrowId="marketing-family-health.household.eyebrow"
          headlineId="marketing-family-health.household.headline"
          bodyId="marketing-family-health.household.body"
          headingId="nh-fh-house-heading"
        />
        <Reveal className="nh-fh-house__dashboard" y={24}>
          <div className="nh-fh-house__dashboard-head">
            <p className="nh-fh-house__dashboard-title">{dashboardTitle.title}</p>
            <div className="nh-fh-house__tags">
              {householdTags.map((tag) => (
                <HouseholdTag key={tag.id} id={tag.id} icon={tag.icon} />
              ))}
            </div>
          </div>
          <div className="nh-fh-house__members">
            {householdMembers.map((spec, index) => (
              <MemberCard key={spec.id} spec={spec} index={index} />
            ))}
          </div>
          <p className="nh-fh-house__caption">{caption.title}</p>
        </Reveal>
        <p className="nh-fh-house__disclaimer">{disclaimer.title}</p>
      </div>
    </section>
  );
};

const HouseholdTag = ({
  id,
  icon: Icon
}: {
  id: string;
  icon: (typeof householdTags)[number]["icon"];
}) => {
  const label = useContent(id);
  return (
    <span className="nh-fh-house__tag">
      <Icon size={14} strokeWidth={1.9} aria-hidden />
      {label.title}
    </span>
  );
};
