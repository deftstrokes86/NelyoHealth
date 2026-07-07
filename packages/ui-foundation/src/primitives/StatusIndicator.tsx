import type { HTMLAttributes, ReactNode } from "react";

export type StatusIndicatorTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "emergency";

export interface StatusIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: StatusIndicatorTone;
  pulse?: boolean;
  live?: "off" | "polite" | "assertive";
  children: ReactNode;
}

export const StatusIndicator = ({
  tone = "neutral",
  pulse = false,
  live = "polite",
  children,
  className = "",
  ...props
}: StatusIndicatorProps) => (
  <span
    className={
      `nh-status nh-status--${tone}` +
      (pulse ? " nh-status--pulse" : "") +
      (className ? ` ${className}` : "")
    }
    data-tone={tone}
    role="status"
    aria-live={live === "off" ? undefined : live}
    {...props}
  >
    <span className="nh-status__dot" aria-hidden="true" />
    <span className="nh-status__label">{children}</span>
  </span>
);
