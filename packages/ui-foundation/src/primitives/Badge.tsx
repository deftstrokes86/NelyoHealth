import type { HTMLAttributes, ReactNode } from "react";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: BadgeSize;
  leadingIcon?: ReactNode;
  children: ReactNode;
}

export const Badge = ({
  tone = "neutral",
  size = "md",
  leadingIcon,
  children,
  className = "",
  ...props
}: BadgeProps) => (
  <span
    className={
      `nh-badge nh-badge--${tone} nh-badge--${size}` +
      (className ? ` ${className}` : "")
    }
    data-tone={tone}
    data-size={size}
    {...props}
  >
    {leadingIcon ? (
      <span className="nh-badge__icon" aria-hidden="true">
        {leadingIcon}
      </span>
    ) : null}
    <span className="nh-badge__label">{children}</span>
  </span>
);
