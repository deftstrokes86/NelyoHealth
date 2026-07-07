import type { HTMLAttributes } from "react";

export type ProgressTone = "default" | "success" | "warning" | "danger";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  tone?: ProgressTone;
  label?: string;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const Progress = ({
  value,
  max = 100,
  tone = "default",
  label = "Progress",
  className = "",
  ...props
}: ProgressProps) => {
  const indeterminate = value == null;
  const clamped = indeterminate ? 0 : clamp(value, 0, max);
  const percent = indeterminate ? 0 : (clamped / max) * 100;
  return (
    <div
      className={
        `nh-progress nh-progress--${tone}` +
        (indeterminate ? " nh-progress--indeterminate" : "") +
        (className ? ` ${className}` : "")
      }
      data-tone={tone}
      role="progressbar"
      aria-label={label}
      aria-valuemin={indeterminate ? undefined : 0}
      aria-valuemax={indeterminate ? undefined : max}
      aria-valuenow={indeterminate ? undefined : clamped}
      {...props}
    >
      <span
        className="nh-progress__bar"
        aria-hidden="true"
        style={
          indeterminate ? undefined : { transform: `scaleX(${percent / 100})` }
        }
      />
    </div>
  );
};
