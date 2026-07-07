import type { HTMLAttributes } from "react";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  label?: string;
}

export const Spinner = ({
  size = "md",
  label = "Loading",
  className = "",
  ...props
}: SpinnerProps) => (
  <span
    className={`nh-spinner nh-spinner--${size} ${className}`.trim()}
    data-size={size}
    role="status"
    aria-label={label}
    aria-live="polite"
    aria-busy="true"
    {...props}
  >
    <span className="nh-spinner__ring" aria-hidden="true" />
  </span>
);
