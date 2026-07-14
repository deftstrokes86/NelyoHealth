import { CalendarClock, BellRing } from "lucide-react";

export const WorkflowFollowup = () => (
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
    <CalendarClock
      x={40}
      y={44}
      width={104}
      height={104}
      strokeWidth={1.8}
      color="var(--nh-color-brand-700)"
      fill="var(--nh-color-surface-raised)"
    />
    <BellRing
      x={128}
      y={82}
      width={72}
      height={72}
      strokeWidth={1.8}
      color="var(--nh-color-status-warning-fg)"
      fill="var(--nh-color-surface-raised)"
    />
  </svg>
);
