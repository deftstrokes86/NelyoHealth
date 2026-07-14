import { Globe2, HeartHandshake } from "lucide-react";

export const FamilyDiasporaNarrative = () => (
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
      fill="var(--nh-marketing-illustration-tone-warm)"
    />
    <Globe2
      x={26}
      y={30}
      width={132}
      height={132}
      strokeWidth={1.4}
      color="var(--nh-color-teal-500)"
      opacity={0.35}
      fill="none"
    />
    <HeartHandshake
      x={92}
      y={60}
      width={116}
      height={116}
      strokeWidth={1.9}
      color="var(--nh-color-brand-700)"
      fill="var(--nh-color-surface-raised)"
    />
  </svg>
);
