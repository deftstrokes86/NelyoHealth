import type { ComponentType, SVGProps } from "react";
import {
  BriefcaseBusiness,
  FlaskConical,
  Hospital,
  Pill,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Users
} from "lucide-react";

type LucideIcon = ComponentType<SVGProps<SVGSVGElement>>;

interface NodeSpec {
  label: string;
  x: number;
  y: number;
  icon: LucideIcon;
  guardian?: boolean;
}

const nodes: NodeSpec[] = [
  { label: "Patient", x: 108, y: 92, icon: UserRound },
  { label: "Doctor", x: 246, y: 58, icon: Stethoscope },
  { label: "Pharmacy", x: 396, y: 122, icon: Pill },
  { label: "Laboratory", x: 430, y: 250, icon: FlaskConical },
  { label: "Hospital", x: 342, y: 366, icon: Hospital },
  { label: "Employer", x: 184, y: 394, icon: BriefcaseBusiness },
  { label: "Guardian", x: 74, y: 300, icon: UserRound, guardian: true },
  { label: "Family", x: 68, y: 182, icon: Users }
];

const ICON_SIZE = 22;

export const HeroConnectedCareEcosystem = () => (
  <svg
    className="nh-ecosystem-illustration"
    viewBox="0 0 500 460"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Connected care ecosystem linking patient, doctor, pharmacy, laboratory, hospital, employer, guardian, and family."
  >
    <defs>
      <linearGradient id="nh-ecosystem-core" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="var(--nh-color-brand-900)" />
        <stop offset="100%" stopColor="var(--nh-color-brand-700)" />
      </linearGradient>
      <linearGradient id="nh-ecosystem-line" x1="0" y1="0" x2="1" y2="0">
        <stop
          offset="0%"
          stopColor="var(--nh-color-teal-500)"
          stopOpacity="0.5"
        />
        <stop
          offset="100%"
          stopColor="var(--nh-color-accent-700)"
          stopOpacity="0.5"
        />
      </linearGradient>
      <radialGradient id="nh-ecosystem-signal" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="var(--nh-color-paper-000)" stopOpacity="0.95" />
        <stop offset="100%" stopColor="var(--nh-color-teal-500)" stopOpacity="0.9" />
      </radialGradient>
    </defs>

    <circle
      className="nh-ecosystem-ring nh-ecosystem-ring--outer"
      cx="250"
      cy="230"
      r="186"
    />
    <circle
      className="nh-ecosystem-ring nh-ecosystem-ring--inner"
      cx="250"
      cy="230"
      r="126"
    />

    {nodes.map((node, index) => {
      const connectorId = `nh-ecosystem-connector-${index}`;
      const packetDuration = `${3.8 + index * 0.45}s`;
      const Icon = node.icon;
      return (
        <g key={node.label} className="nh-ecosystem-node-group">
          <path
            id={connectorId}
            className="nh-ecosystem-link"
            d={`M250 230 L${node.x} ${node.y}`}
            stroke="url(#nh-ecosystem-line)"
            fill="none"
          />
          <circle
            className="nh-ecosystem-packet"
            r="4.5"
            fill="url(#nh-ecosystem-signal)"
          >
            <animateMotion dur={packetDuration} repeatCount="indefinite" rotate="auto">
              <mpath href={`#${connectorId}`} />
            </animateMotion>
          </circle>
          <circle
            className="nh-ecosystem-packet nh-ecosystem-packet--return"
            r="3.8"
            fill="url(#nh-ecosystem-signal)"
          >
            <animateMotion
              dur={packetDuration}
              repeatCount="indefinite"
              rotate="auto-reverse"
            >
              <mpath href={`#${connectorId}`} />
            </animateMotion>
          </circle>
          <g
            className="nh-ecosystem-node"
            transform={`translate(${node.x} ${node.y})`}
          >
            <circle className="nh-ecosystem-node__bubble" r="30" />
            <Icon
              x={-ICON_SIZE / 2}
              y={-ICON_SIZE / 2}
              width={ICON_SIZE}
              height={ICON_SIZE}
              strokeWidth={2.2}
              className="nh-ecosystem-node__icon"
              aria-hidden="true"
            />
            {node.guardian ? (
              <ShieldCheck
                x={6}
                y={4}
                width={12}
                height={12}
                strokeWidth={2.5}
                className="nh-ecosystem-node__badge"
                aria-hidden="true"
              />
            ) : null}
            <text
              className="nh-ecosystem-node__label"
              y="52"
              textAnchor="middle"
            >
              {node.label}
            </text>
          </g>
        </g>
      );
    })}

    <g className="nh-ecosystem-core" transform="translate(250 230)">
      <circle r="58" fill="url(#nh-ecosystem-core)" />
      <circle
        r="72"
        fill="none"
        stroke="url(#nh-ecosystem-line)"
        strokeWidth="2"
      />
      <circle
        r="88"
        fill="none"
        stroke="var(--nh-color-teal-500)"
        strokeOpacity="0.3"
        strokeWidth="1.6"
      >
        <animate attributeName="r" values="80;94;80" dur="4.8s" repeatCount="indefinite" />
        <animate
          attributeName="opacity"
          values="0.25;0.58;0.25"
          dur="4.8s"
          repeatCount="indefinite"
        />
      </circle>
      <text className="nh-ecosystem-core__title" textAnchor="middle" y="-4">
        Nelyo
      </text>
      <text className="nh-ecosystem-core__title" textAnchor="middle" y="18">
        Health
      </text>
    </g>
  </svg>
);
