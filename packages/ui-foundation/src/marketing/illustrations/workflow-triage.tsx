export const WorkflowTriage = () => (
  <svg
    viewBox="0 0 240 200"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-hidden="true"
    focusable="false"
    stroke="currentColor"
    fill="none"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect
      x={12}
      y={12}
      width={216}
      height={176}
      rx={20}
      fill="var(--nh-marketing-illustration-tone-cool)"
      stroke="none"
    />
    <path d="M120 40 v120 M60 100 h120" />
    <circle cx={120} cy={40} r={12} fill="var(--nh-color-status-danger-fg)" stroke="none" />
    <circle cx={180} cy={100} r={12} fill="var(--nh-color-status-warning-fg)" stroke="none" />
    <circle cx={120} cy={160} r={12} fill="var(--nh-color-status-success-fg)" stroke="none" />
    <circle
      cx={60}
      cy={100}
      r={12}
      fill="var(--nh-marketing-illustration-tone-neutral)"
    />
    <circle cx={60} cy={100} r={12} />
    <path d="M60 90 h0 v10 h10" />
    <text
      x={120}
      y={112}
      textAnchor="middle"
      fontSize={10}
      fontFamily="var(--nh-typography-family-body)"
      fill="currentColor"
      stroke="none"
    >
      Triage
    </text>
  </svg>
);
