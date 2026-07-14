import { Globe2, HeartHandshake, MessagesSquare } from "lucide-react";

export const HeroFamilyDiasporaBridge = () => (
  <svg
    viewBox="0 0 600 400"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-hidden="true"
    focusable="false"
  >
    <rect
      x={20}
      y={20}
      width={560}
      height={360}
      rx={32}
      fill="var(--nh-marketing-illustration-tone-warm)"
    />
    <path
      d="M100 300 C 220 140, 380 140, 500 300"
      stroke="var(--nh-color-accent-700)"
      strokeWidth={2.2}
      strokeDasharray="6 8"
      strokeLinecap="round"
      fill="none"
      opacity={0.45}
    />
    <Globe2
      x={60}
      y={172}
      width={148}
      height={148}
      strokeWidth={1.8}
      color="var(--nh-color-brand-700)"
      fill="var(--nh-color-surface-raised)"
    />
    <HeartHandshake
      x={222}
      y={116}
      width={168}
      height={168}
      strokeWidth={1.8}
      color="var(--nh-color-status-danger-fg)"
      fill="var(--nh-color-surface-raised)"
    />
    <MessagesSquare
      x={410}
      y={168}
      width={132}
      height={132}
      strokeWidth={1.8}
      color="var(--nh-color-teal-700)"
      fill="var(--nh-color-surface-raised)"
    />
  </svg>
);
