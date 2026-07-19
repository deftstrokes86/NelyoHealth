import type { ReactNode } from "react";

export interface SocialAuthButtonProps {
  icon: ReactNode;
  label: string;
  comingSoonLabel: string;
}

/**
 * No OAuth provider is wired anywhere in this platform yet (no client id/
 * secret config, no callback route) — rendered as a disabled, clearly
 * labeled affordance rather than a button that would silently fail.
 */
export function SocialAuthButton({ icon, label, comingSoonLabel }: SocialAuthButtonProps) {
  return (
    <button
      type="button"
      disabled
      aria-label={`${label} (${comingSoonLabel})`}
      title={comingSoonLabel}
      className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-card px-4 py-2.5 text-body-sm font-medium text-muted-foreground opacity-60"
    >
      {icon}
      {label}
    </button>
  );
}
