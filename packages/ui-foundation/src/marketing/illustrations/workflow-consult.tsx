import { Video, MessageCircle } from "lucide-react";

export const WorkflowConsult = () => (
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
    <MessageCircle
      x={32}
      y={38}
      width={96}
      height={96}
      strokeWidth={1.4}
      color="var(--nh-color-accent-700)"
      opacity={0.5}
      fill="none"
    />
    <Video
      x={92}
      y={60}
      width={112}
      height={112}
      strokeWidth={1.8}
      color="var(--nh-color-brand-700)"
      fill="var(--nh-color-surface-raised)"
    />
  </svg>
);
