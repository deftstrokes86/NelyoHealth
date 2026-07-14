import { Stethoscope, Route } from "lucide-react";

export const WorkflowTriage = () => (
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
    <Route
      x={30}
      y={40}
      width={120}
      height={120}
      strokeWidth={1.4}
      color="var(--nh-color-teal-500)"
      opacity={0.55}
      fill="none"
    />
    <Stethoscope
      x={96}
      y={58}
      width={104}
      height={104}
      strokeWidth={1.8}
      color="var(--nh-color-brand-700)"
      fill="none"
    />
  </svg>
);
