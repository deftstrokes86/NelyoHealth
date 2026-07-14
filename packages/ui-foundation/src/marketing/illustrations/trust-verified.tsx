import { BadgeCheck, Stethoscope } from "lucide-react";

export const TrustVerified = () => (
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
      fill="var(--nh-marketing-illustration-tone-accent)"
    />
    <Stethoscope
      x={30}
      y={40}
      width={112}
      height={112}
      strokeWidth={1.4}
      color="var(--nh-color-teal-500)"
      opacity={0.35}
      fill="none"
    />
    <BadgeCheck
      x={92}
      y={60}
      width={112}
      height={112}
      strokeWidth={1.9}
      color="var(--nh-color-brand-700)"
      fill="var(--nh-color-surface-raised)"
    />
  </svg>
);
