import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

export type TimeInputVariant = "default" | "error" | "success";

export interface TimeInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  variant?: TimeInputVariant;
}

export const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
  ({ variant = "default", className = "", disabled, ...props }, ref) => (
    <span
      className={
        `nh-input nh-input--${variant}` +
        (disabled ? " nh-input--disabled" : "") +
        (className ? ` ${className}` : "")
      }
      data-variant={variant}
      data-primitive="time"
    >
      <input
        ref={ref}
        type="time"
        className="nh-input__control"
        disabled={disabled}
        aria-invalid={variant === "error" ? true : undefined}
        {...props}
      />
    </span>
  )
);

TimeInput.displayName = "TimeInput";
