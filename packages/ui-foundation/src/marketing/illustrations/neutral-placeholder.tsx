export const NeutralPlaceholder = () => (
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
      fill="var(--nh-marketing-illustration-tone-neutral)"
      stroke="none"
    />
    <rect x={12} y={12} width={216} height={176} rx={20} strokeDasharray="4 6" />
    <path d="M60 100 h120 M120 60 v80" strokeDasharray="3 5" />
    <circle cx={120} cy={100} r={30} strokeDasharray="3 5" />
  </svg>
);
