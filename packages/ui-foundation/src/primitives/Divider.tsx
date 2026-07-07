import type { HTMLAttributes, ReactNode } from "react";

export type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: DividerOrientation;
  children?: ReactNode;
}

export const Divider = ({
  orientation = "horizontal",
  children,
  className = "",
  ...props
}: DividerProps) => {
  const decorative = !children;
  return (
    <div
      className={
        `nh-divider nh-divider--${orientation}` +
        (children ? " nh-divider--labeled" : "") +
        (className ? ` ${className}` : "")
      }
      data-orientation={orientation}
      role={decorative ? undefined : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      aria-hidden={decorative ? "true" : undefined}
      {...props}
    >
      {children ? (
        <>
          <span className="nh-divider__line" aria-hidden="true" />
          <span className="nh-divider__label">{children}</span>
          <span className="nh-divider__line" aria-hidden="true" />
        </>
      ) : null}
    </div>
  );
};
