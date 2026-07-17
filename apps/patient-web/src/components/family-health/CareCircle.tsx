"use client";

import { useMemo, useState } from "react";
import { useContent } from "@nelyohealth/ui-foundation";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import {
  careCircleCenter,
  careCircleNodes,
  type CareCircleNodeSpec
} from "./family-health-data";

const RADIUS = 41; // percent of the square stage

const pos = (angleDeg: number) => {
  const a = (angleDeg * Math.PI) / 180;
  return { x: 50 + RADIUS * Math.cos(a), y: 50 + RADIUS * Math.sin(a) };
};

interface ActiveDetail {
  roleId: string;
  permissionId: string;
  responsibilityId: string;
  exampleId: string;
}

const DetailPanel = ({ detail }: { detail: ActiveDetail | null }) => {
  const defaultTitle = useContent("marketing-family-health.circle.default.title");
  const defaultBody = useContent("marketing-family-health.circle.default.body");
  const labelPermission = useContent("marketing-family-health.circle.label.permission");
  const labelResponsibility = useContent(
    "marketing-family-health.circle.label.responsibility"
  );
  const labelExample = useContent("marketing-family-health.circle.label.example");

  // Hooks must run unconditionally; resolve detail fields with safe fallbacks.
  const role = useContent(detail?.roleId ?? "marketing-family-health.circle.default.title");
  const permission = useContent(
    detail?.permissionId ?? "marketing-family-health.circle.default.title"
  );
  const responsibility = useContent(
    detail?.responsibilityId ?? "marketing-family-health.circle.default.title"
  );
  const example = useContent(
    detail?.exampleId ?? "marketing-family-health.circle.default.title"
  );

  return (
    <div className="nh-fh-circle__panel" aria-live="polite">
      {detail ? (
        <>
          <h3 className="nh-fh-circle__panel-role">{role.title}</h3>
          <dl className="nh-fh-circle__panel-list">
            <div className="nh-fh-circle__panel-row">
              <dt>{labelPermission.title}</dt>
              <dd>{permission.title}</dd>
            </div>
            <div className="nh-fh-circle__panel-row">
              <dt>{labelResponsibility.title}</dt>
              <dd>{responsibility.title}</dd>
            </div>
            <div className="nh-fh-circle__panel-row">
              <dt>{labelExample.title}</dt>
              <dd>{example.title}</dd>
            </div>
          </dl>
        </>
      ) : (
        <>
          <h3 className="nh-fh-circle__panel-role">{defaultTitle.title}</h3>
          <p className="nh-fh-circle__panel-default">{defaultBody.body}</p>
        </>
      )}
    </div>
  );
};

const CircleNode = ({
  spec,
  active,
  onActivate
}: {
  spec: CareCircleNodeSpec;
  active: boolean;
  onActivate: (id: string) => void;
}) => {
  const role = useContent(spec.roleId);
  const Icon = spec.icon;
  const { x, y } = pos(spec.angle);
  return (
    <button
      type="button"
      className={`nh-fh-circle__node${active ? " nh-fh-circle__node--active" : ""}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-pressed={active}
      onMouseEnter={() => onActivate(spec.id)}
      onFocus={() => onActivate(spec.id)}
      onClick={() => onActivate(spec.id)}
    >
      <span className="nh-fh-circle__node-icon" aria-hidden>
        <Icon size={20} strokeWidth={1.8} />
      </span>
      <span className="nh-fh-circle__node-label">{role.title}</span>
    </button>
  );
};

export const CareCircle = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const centerRole = useContent(careCircleCenter.roleId);
  const CenterIcon = careCircleCenter.icon;

  const detail = useMemo<ActiveDetail | null>(() => {
    if (activeId === null) return null;
    if (activeId === "patient") return careCircleCenter;
    const found = careCircleNodes.find((n) => n.id === activeId);
    return found ?? null;
  }, [activeId]);

  const linePositions = useMemo(
    () => careCircleNodes.map((n) => ({ id: n.id, ...pos(n.angle) })),
    []
  );

  return (
    <section id="care-circle" className="nh-fh-circle" aria-labelledby="nh-fh-circle-heading">
      <div className="nh-fh-circle__inner">
        <SectionHeader
          eyebrowId="marketing-family-health.circle.eyebrow"
          headlineId="marketing-family-health.circle.headline"
          bodyId="marketing-family-health.circle.body"
          headingId="nh-fh-circle-heading"
        />
        <CircleHint />
        <Reveal className="nh-fh-circle__layout">
          <div
            className="nh-fh-circle__stage"
            role="group"
            aria-label={centerRole.title}
            onMouseLeave={() => setActiveId((prev) => prev)}
          >
            <svg
              className="nh-fh-circle__lines"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {linePositions.map((line) => (
                <line
                  key={line.id}
                  x1="50"
                  y1="50"
                  x2={line.x}
                  y2={line.y}
                  className={
                    "nh-fh-circle__line" +
                    (activeId === line.id ? " nh-fh-circle__line--active" : "")
                  }
                />
              ))}
            </svg>

            <button
              type="button"
              className={
                "nh-fh-circle__center" +
                (activeId === "patient" ? " nh-fh-circle__center--active" : "")
              }
              aria-pressed={activeId === "patient"}
              onMouseEnter={() => setActiveId("patient")}
              onFocus={() => setActiveId("patient")}
              onClick={() => setActiveId("patient")}
            >
              <span className="nh-fh-circle__center-icon" aria-hidden>
                <CenterIcon size={26} strokeWidth={1.8} />
              </span>
              <span className="nh-fh-circle__center-label">{centerRole.title}</span>
            </button>

            {careCircleNodes.map((spec) => (
              <CircleNode
                key={spec.id}
                spec={spec}
                active={activeId === spec.id}
                onActivate={setActiveId}
              />
            ))}
          </div>

          <DetailPanel detail={detail} />
        </Reveal>
      </div>
    </section>
  );
};

const CircleHint = () => {
  const hint = useContent("marketing-family-health.circle.hint");
  return <p className="nh-fh-circle__hint">{hint.title}</p>;
};
