import type { InputHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

export type InputVariant = "default" | "error" | "success";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  leading?: ReactNode;
  trailing?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { variant = "default", leading, trailing, className = "", disabled, ...props },
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
        <span className="nh-input__leading" aria-hidden="true">
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
        <span className="nh-input__trailing" aria-hidden="true">
          {trailing}
        </span>
      ) : null}
    </span>
  )
);

Input.displayName = "Input";
