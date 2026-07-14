import { Stethoscope, ClipboardList } from "lucide-react";

export const ProviderNarrative = () => (
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
    <ClipboardList
      x={30}
      y={38}
      width={104}
      height={104}
      strokeWidth={1.4}
      color="var(--nh-color-teal-500)"
      opacity={0.4}
      fill="none"
    />
    <Stethoscope
      x={98}
      y={60}
      width={112}
      height={112}
      strokeWidth={1.9}
      color="var(--nh-color-brand-700)"
      fill="var(--nh-color-surface-raised)"
    />
  </svg>
);
