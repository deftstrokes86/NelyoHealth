import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { forwardRef, useCallback } from "react";

export type CheckboxVariant = "default" | "error";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  variant?: CheckboxVariant;
  indeterminate?: boolean;
  children?: ReactNode;
}

const assignRef = (
  ref: Ref<HTMLInputElement> | undefined,
  node: HTMLInputElement | null
) => {
  if (!ref) return;
  if (typeof ref === "function") ref(node);
  else (ref as { current: HTMLInputElement | null }).current = node;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      variant = "default",
      indeterminate = false,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const setRef = useCallback(
      (node: HTMLInputElement | null) => {
        if (node) node.indeterminate = indeterminate;
        assignRef(ref, node);
      },
      [ref, indeterminate]
    );

    return (
      <label
        className={
          `nh-checkbox nh-checkbox--${variant}` +
          (disabled ? " nh-checkbox--disabled" : "") +
          (className ? ` ${className}` : "")
        }
        data-variant={variant}
      >
        <input
          ref={setRef}
          type="checkbox"
          className="nh-checkbox__input"
          disabled={disabled}
          aria-invalid={variant === "error" ? true : undefined}
          {...props}
        />
        <span className="nh-checkbox__indicator" aria-hidden="true" />
        {children ? <span className="nh-checkbox__label">{children}</span> : null}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
