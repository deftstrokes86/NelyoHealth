import type { LabelHTMLAttributes, ReactNode } from "react";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  required?: boolean;
  requiredMarker?: string;
}

export const Label = ({
  children,
  required = false,
  requiredMarker = "*",
  className = "",
  ...props
}: LabelProps) => (
  <label className={`nh-label ${className}`.trim()} {...props}>
    <span className="nh-label__text">{children}</span>
    {required ? (
      <>
        <span className="nh-label__required" aria-hidden="true">
          {requiredMarker}
        </span>
        <span className="nh-visually-hidden"> (required)</span>
      </>
    ) : null}
  </label>
);
