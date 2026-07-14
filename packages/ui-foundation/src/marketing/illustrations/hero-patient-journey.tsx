import { UserRound, Heart, CalendarCheck } from "lucide-react";

export const HeroPatientJourney = () => (
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
      d="M120 260 C 220 180, 320 280, 460 200"
      stroke="var(--nh-color-teal-500)"
      strokeWidth={2}
      strokeDasharray="4 8"
      strokeLinecap="round"
      fill="none"
      opacity={0.5}
    />
    <UserRound
      x={72}
      y={192}
      width={132}
      height={132}
      strokeWidth={1.8}
      color="var(--nh-color-brand-700)"
      fill="var(--nh-color-surface-raised)"
    />
    <Heart
      x={228}
      y={132}
      width={132}
      height={132}
      strokeWidth={1.8}
      color="var(--nh-color-status-danger-fg)"
      fill="var(--nh-color-surface-raised)"
    />
    <CalendarCheck
      x={392}
      y={128}
      width={132}
      height={132}
      strokeWidth={1.8}
      color="var(--nh-color-teal-700)"
      fill="var(--nh-color-surface-raised)"
    />
  </svg>
);
