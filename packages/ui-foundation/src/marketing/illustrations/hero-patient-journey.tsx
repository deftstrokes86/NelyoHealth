export const HeroPatientJourney = () => (
  <svg
    viewBox="0 0 600 400"
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
      x={20}
      y={20}
      width={560}
      height={360}
      rx={32}
      fill="var(--nh-marketing-illustration-tone-warm)"
      stroke="none"
    />
    <path
      d="M60 260 C 180 180, 260 320, 380 220 S 540 160, 560 160"
      strokeDasharray="1 6"
    />
    <circle cx={130} cy={240} r={22} fill="var(--nh-marketing-illustration-tone-cool)" />
    <circle cx={130} cy={240} r={22} />
    <circle cx={260} cy={272} r={22} fill="var(--nh-marketing-illustration-tone-accent)" />
    <circle cx={260} cy={272} r={22} />
    <circle cx={400} cy={216} r={22} fill="var(--nh-marketing-illustration-tone-neutral)" />
    <circle cx={400} cy={216} r={22} />
    <circle cx={520} cy={160} r={22} fill="var(--nh-marketing-illustration-tone-cool)" />
    <circle cx={520} cy={160} r={22} />
    <path d="M124 234 h12 M130 228 v12" />
    <path d="M255 265 h10 v10 M260 265 v10" />
    <path d="M394 210 v12 h12" />
    <path d="M512 152 l16 16 M528 152 l-16 16" />
    <path d="M300 90 h180 v50 h-180 z" />
    <path d="M320 108 h140 M320 122 h100" />
  </svg>
);
