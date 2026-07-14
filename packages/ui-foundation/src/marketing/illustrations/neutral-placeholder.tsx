import { Sparkles } from "lucide-react";

export const NeutralPlaceholder = () => (
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
    <rect
      x={12}
      y={12}
      width={216}
      height={176}
      rx={22}
      fill="none"
      stroke="var(--nh-color-border)"
      strokeDasharray="6 6"
    />
    <Sparkles
      x={80}
      y={60}
      width={80}
      height={80}
      strokeWidth={1.5}
      color="var(--nh-color-text-muted)"
      fill="none"
    />
  </svg>
);
