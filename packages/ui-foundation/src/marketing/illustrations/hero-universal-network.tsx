import { HeartPulse, Network, Users } from "lucide-react";

export const HeroUniversalNetwork = () => (
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
    <HeartPulse
      x={64}
      y={64}
      width={200}
      height={200}
      strokeWidth={1.2}
      color="var(--nh-color-status-danger-fg)"
      opacity={0.35}
      fill="none"
    />
    <Network
      x={200}
      y={80}
      width={220}
      height={220}
      strokeWidth={1.8}
      color="var(--nh-color-brand-700)"
      fill="var(--nh-color-surface-raised)"
    />
    <Users
      x={380}
      y={188}
      width={148}
      height={148}
      strokeWidth={1.8}
      color="var(--nh-color-teal-700)"
      fill="var(--nh-color-surface-raised)"
    />
  </svg>
);
