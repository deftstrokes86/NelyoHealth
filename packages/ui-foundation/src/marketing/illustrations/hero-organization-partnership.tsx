import { Building2, Handshake, Users } from "lucide-react";

export const HeroOrganizationPartnership = () => (
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
      fill="var(--nh-marketing-illustration-tone-neutral)"
    />
    <Building2
      x={64}
      y={104}
      width={172}
      height={172}
      strokeWidth={1.8}
      color="var(--nh-color-brand-700)"
      fill="var(--nh-color-surface-raised)"
    />
    <Handshake
      x={224}
      y={132}
      width={172}
      height={172}
      strokeWidth={1.8}
      color="var(--nh-color-teal-700)"
      fill="var(--nh-color-surface-raised)"
    />
    <Users
      x={392}
      y={132}
      width={148}
      height={148}
      strokeWidth={1.8}
      color="var(--nh-color-accent-700)"
      fill="var(--nh-color-surface-raised)"
    />
  </svg>
);
