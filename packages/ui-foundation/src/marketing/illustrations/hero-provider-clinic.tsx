import { Stethoscope, ClipboardList, MonitorSmartphone } from "lucide-react";

export const HeroProviderClinic = () => (
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
      fill="var(--nh-marketing-illustration-tone-cool)"
    />
    <Stethoscope
      x={64}
      y={98}
      width={196}
      height={196}
      strokeWidth={1.8}
      color="var(--nh-color-brand-700)"
      fill="var(--nh-color-surface-raised)"
    />
    <ClipboardList
      x={280}
      y={92}
      width={144}
      height={144}
      strokeWidth={1.8}
      color="var(--nh-color-teal-700)"
      fill="var(--nh-color-surface-raised)"
    />
    <MonitorSmartphone
      x={396}
      y={196}
      width={140}
      height={140}
      strokeWidth={1.8}
      color="var(--nh-color-accent-700)"
      fill="var(--nh-color-surface-raised)"
    />
  </svg>
);
