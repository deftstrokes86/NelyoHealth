import type { LucideIcon } from "lucide-react";

export interface SecurityBadgeProps {
  icon: LucideIcon;
  label: string;
}

export function SecurityBadge({ icon: Icon, label }: SecurityBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ds-brand-50 px-3 py-1.5 text-caption font-semibold text-ds-brand-700">
      <Icon size={14} strokeWidth={2} aria-hidden />
      {label}
    </span>
  );
}
