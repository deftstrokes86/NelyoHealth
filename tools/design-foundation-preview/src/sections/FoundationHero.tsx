import { MotionReveal, Surface, Button } from "@nelyohealth/ui-foundation";
import { visualDirection } from "@nelyohealth/design-tokens";
import { useId } from "react";
import {
  BriefcaseBusiness,
  FlaskConical,
  Hospital,
  Pill,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Users,
  type LucideIcon
} from "lucide-react";

const ecosystemNodes = [
  { label: "Patient", x: 108, y: 92, icon: UserRound },
  { label: "Doctor", x: 246, y: 58, icon: Stethoscope },
  { label: "Pharmacy", x: 396, y: 122, icon: Pill },
  { label: "Laboratory", x: 430, y: 250, icon: FlaskConical },
  { label: "Hospital", x: 342, y: 366, icon: Hospital },
  { label: "Employer", x: 184, y: 394, icon: BriefcaseBusiness },
  { label: "Guardian", x: 74, y: 300, icon: UserRound },
  { label: "Family", x: 68, y: 182, icon: Users }
] as const;

const NodeIcon = ({ icon: Icon, label }: { icon: LucideIcon; label: string }) => (
  <div xmlns="http://www.w3.org/1999/xhtml" className="ecosystem-node__icon-host">
    <Icon size={18} strokeWidth={2.2} className="ecosystem-node__icon-lucide" />
    {label === "Guardian" ? (
      <ShieldCheck size={11} strokeWidth={2.5} className="ecosystem-node__icon-badge" />
    ) : null}
  </div>
);

export const FoundationHero = () => {
  const uid = useId().replace(/:/g, "");
  const coreGradientId = `ecosystemCore-${uid}`;
  const lineGradientId = `ecosystemLine-${uid}`;
  const signalGradientId = `careSignal-${uid}`;

  return (
    <MotionReveal className="hero" profile="STANDARD">
      <div className="hero__content">
        <p className="eyebrow">SYNTHETIC / NONPRODUCTION / CONNECTED CARE PREVIEW</p>
        <h1>Everything about healthcare is connected.</h1>
        <p className="hero__copy">
          One premium care ecosystem connecting patients, doctors, pharmacy, laboratory, hospital,
          employer, guardians, and family without fragmented experiences.
        </p>
        <div className="hero__actions">
          <Button>Explore care ecosystem</Button>
          <Button variant="secondary">Inspect foundation tokens</Button>
        </div>
        <Surface tone="emphasis" className="hero__note">
          Trusted by clinical and operations teams for connected pathways, privacy-safe boundaries,
          and WCAG-minded design foundations.
        </Surface>
      </div>

      <div className="hero__visual">
        <svg
          className="ecosystem-illustration"
          viewBox="0 0 500 460"
          role="img"
          aria-label="Connected care ecosystem linking Patient, Doctor, Pharmacy, Laboratory, Hospital, Employer, Guardian, and Family"
        >
          <defs>
            <linearGradient id={coreGradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0D474B" />
              <stop offset="100%" stopColor="#0D474B" />
            </linearGradient>
            <linearGradient id={lineGradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(31,127,140,0.25)" />
              <stop offset="100%" stopColor="rgba(31,79,184,0.26)" />
            </linearGradient>
            <radialGradient id={signalGradientId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
              <stop offset="100%" stopColor="rgba(31,127,140,0.85)" />
            </radialGradient>
          </defs>

          <circle className="ecosystem-ring ecosystem-ring--outer" cx="250" cy="230" r="186" />
          <circle className="ecosystem-ring ecosystem-ring--inner" cx="250" cy="230" r="126" />

          {ecosystemNodes.map((node, index) => {
            const connectorId = `connector-${uid}-${index}`;
            const packetDuration = `${3.8 + index * 0.45}s`;

            return (
              <g key={node.label} className="ecosystem-node-wrap">
                <path
                  id={connectorId}
                  className="ecosystem-link"
                  d={`M250 230 L${node.x} ${node.y}`}
                  stroke={`url(#${lineGradientId})`}
                />
                <circle className="ecosystem-packet" r="4.5" fill={`url(#${signalGradientId})`}>
                  <animateMotion dur={packetDuration} repeatCount="indefinite" rotate="auto">
                    <mpath href={`#${connectorId}`} />
                  </animateMotion>
                </circle>
                <circle
                  className="ecosystem-packet ecosystem-packet--return"
                  r="3.8"
                  fill={`url(#${signalGradientId})`}
                >
                  <animateMotion
                    dur={packetDuration}
                    repeatCount="indefinite"
                    rotate="auto-reverse"
                  >
                    <mpath href={`#${connectorId}`} />
                  </animateMotion>
                </circle>
                <g className="ecosystem-node" transform={`translate(${node.x} ${node.y})`}>
                  <circle className="ecosystem-node__bubble" r="34" />
                  <foreignObject
                    x={-12}
                    y={-12}
                    width={24}
                    height={24}
                    className="ecosystem-node__icon-fo"
                  >
                    <NodeIcon icon={node.icon} label={node.label} />
                  </foreignObject>
                  <text className="ecosystem-node__label" y="56" textAnchor="middle">
                    {node.label}
                  </text>
                </g>
              </g>
            );
          })}

          <g className="ecosystem-core" transform="translate(250 230)">
            <circle r="58" fill={`url(#${coreGradientId})`} />
            <circle r="72" fill="none" stroke={`url(#${lineGradientId})`} strokeWidth="2" />
            <circle r="88" fill="none" stroke="rgba(31,127,140,0.26)" strokeWidth="1.6">
              <animate attributeName="r" values="80;94;80" dur="4.8s" repeatCount="indefinite" />
              <animate
                attributeName="opacity"
                values="0.25;0.58;0.25"
                dur="4.8s"
                repeatCount="indefinite"
              />
            </circle>
            <text className="ecosystem-core__title" textAnchor="middle" y="-4">
              Nelyo
            </text>
            <text className="ecosystem-core__title" textAnchor="middle" y="18">
              Health
            </text>
          </g>
        </svg>
        <p className="hero__caption">
          Each moving dot is a care signal traveling between one participant and the shared care
          hub.
        </p>
      </div>
    </MotionReveal>
  );
};
