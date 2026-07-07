import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

export type DateInputVariant = "default" | "error" | "success";

export interface DateInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  variant?: DateInputVariant;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ variant = "default", className = "", disabled, ...props }, ref) => (
    <span
      className={
        `nh-input nh-input--${variant}` +
        (disabled ? " nh-input--disabled" : "") +
        (className ? ` ${className}` : "")
      }
      data-variant={variant}
      data-primitive="date"
    >
      <input
        ref={ref}
        type="date"
        className="nh-input__control"
        disabled={disabled}
        aria-invalid={variant === "error" ? true : undefined}
        {...props}
      />
    </span>
  )
);

DateInput.displayName = "DateInput";
