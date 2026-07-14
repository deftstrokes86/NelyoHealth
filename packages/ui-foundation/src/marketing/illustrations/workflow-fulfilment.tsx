import { Pill, FlaskConical } from "lucide-react";

export const WorkflowFulfilment = () => (
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
      fill="var(--nh-marketing-illustration-tone-neutral)"
    />
    <Pill
      x={44}
      y={54}
      width={96}
      height={96}
      strokeWidth={1.8}
      color="var(--nh-color-brand-700)"
      fill="var(--nh-color-surface-raised)"
    />
    <FlaskConical
      x={112}
      y={70}
      width={92}
      height={92}
      strokeWidth={1.8}
      color="var(--nh-color-teal-500)"
      fill="var(--nh-color-surface-raised)"
    />
  </svg>
);
