import type { InputHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

export type InputVariant = "default" | "error" | "success";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  leading?: ReactNode;
  trailing?: ReactNode;
  /** Set false when `leading` contains an interactive control (default true: decorative). */
  leadingAriaHidden?: boolean;
  /** Set false when `trailing` contains an interactive control (default true: decorative). */
  trailingAriaHidden?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "default",
      leading,
      trailing,
      leadingAriaHidden = true,
      trailingAriaHidden = true,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => (
    <span
      className={
        `nh-input nh-input--${variant}` +
        (disabled ? " nh-input--disabled" : "") +
        (leading ? " nh-input--has-leading" : "") +
        (trailing ? " nh-input--has-trailing" : "") +
        (className ? ` ${className}` : "")
      }
      data-variant={variant}
    >
      {leading ? (
        <span className="nh-input__leading" aria-hidden={leadingAriaHidden || undefined}>
          {leading}
        </span>
      ) : null}
      <input
        ref={ref}
        className="nh-input__control"
        disabled={disabled}
        aria-invalid={variant === "error" ? true : undefined}
        {...props}
      />
      {trailing ? (
        <span className="nh-input__trailing" aria-hidden={trailingAriaHidden || undefined}>
          {trailing}
        </span>
      ) : null}
    </span>
  )
);

Input.displayName = "Input";
