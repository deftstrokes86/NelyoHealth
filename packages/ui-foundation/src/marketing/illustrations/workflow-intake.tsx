import { ClipboardList, ScrollText } from "lucide-react";

export const WorkflowIntake = () => (
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
    <ScrollText
      x={40}
      y={40}
      width={110}
      height={110}
      strokeWidth={1.4}
      color="var(--nh-color-teal-500)"
      opacity={0.55}
      fill="none"
    />
    <ClipboardList
      x={92}
      y={62}
      width={96}
      height={96}
      strokeWidth={1.8}
      color="var(--nh-color-brand-700)"
      fill="var(--nh-color-surface-raised)"
    />
  </svg>
);
