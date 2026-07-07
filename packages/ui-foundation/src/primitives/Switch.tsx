import type { InputHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

export type SwitchVariant = "default" | "error";

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "role"> {
  variant?: SwitchVariant;
  children?: ReactNode;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ variant = "default", children, className = "", disabled, ...props }, ref) => (
    <label
      className={
        `nh-switch nh-switch--${variant}` +
        (disabled ? " nh-switch--disabled" : "") +
        (className ? ` ${className}` : "")
      }
      data-variant={variant}
    >
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        className="nh-switch__input"
        disabled={disabled}
        aria-invalid={variant === "error" ? true : undefined}
        {...props}
      />
      <span className="nh-switch__track" aria-hidden="true">
        <span className="nh-switch__thumb" />
      </span>
      {children ? <span className="nh-switch__label">{children}</span> : null}
    </label>
  )
);

Switch.displayName = "Switch";
