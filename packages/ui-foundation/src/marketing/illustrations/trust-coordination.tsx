import { Network, HeartPulse } from "lucide-react";

export const TrustCoordination = () => (
  <svg
    viewBox="0 0 240 200"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-hidden="true"
    focusable="false"
  >
    <rect
      x={12}
      y={12}
      width={216}
      height={176}
      rx={22}
      fill="var(--nh-marketing-illustration-tone-cool)"
    />
    <HeartPulse
      x={26}
      y={44}
      width={112}
      height={112}
      strokeWidth={1.4}
      color="var(--nh-color-status-danger-fg)"
      opacity={0.35}
      fill="none"
    />
    <Network
      x={90}
      y={54}
      width={112}
      height={112}
      strokeWidth={1.9}
      color="var(--nh-color-brand-700)"
      fill="var(--nh-color-surface-raised)"
    />
  </svg>
);
