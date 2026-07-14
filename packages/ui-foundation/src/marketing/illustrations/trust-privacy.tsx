import { Lock, ShieldCheck } from "lucide-react";

export const TrustPrivacy = () => (
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
    <ShieldCheck
      x={40}
      y={30}
      width={144}
      height={144}
      strokeWidth={1.4}
      color="var(--nh-color-teal-500)"
      opacity={0.35}
      fill="none"
    />
    <Lock
      x={78}
      y={58}
      width={88}
      height={88}
      strokeWidth={1.9}
      color="var(--nh-color-brand-700)"
      fill="var(--nh-color-surface-raised)"
    />
  </svg>
);
