import type { InputHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

export type RadioVariant = "default" | "error";

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  variant?: RadioVariant;
  children?: ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ variant = "default", children, className = "", disabled, ...props }, ref) => (
    <label
      className={
        `nh-radio nh-radio--${variant}` +
        (disabled ? " nh-radio--disabled" : "") +
        (className ? ` ${className}` : "")
      }
      data-variant={variant}
    >
      <input
        ref={ref}
        type="radio"
        className="nh-radio__input"
        disabled={disabled}
        aria-invalid={variant === "error" ? true : undefined}
        {...props}
      />
      <span className="nh-radio__indicator" aria-hidden="true" />
      {children ? <span className="nh-radio__label">{children}</span> : null}
    </label>
  )
);

Radio.displayName = "Radio";
