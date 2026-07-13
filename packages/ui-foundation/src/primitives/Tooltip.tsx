import type { ReactElement, ReactNode } from "react";
import { cloneElement, useId, useState } from "react";

export type TooltipPlacement = "top" | "right" | "bottom" | "left";

export interface TooltipProps {
  content: ReactNode;
  placement?: TooltipPlacement;
  children: ReactElement<{
    "aria-describedby"?: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
  }>;
  id?: string;
  className?: string;
}

export const Tooltip = ({
  content,
  placement = "top",
  children,
  id,
  className = ""
}: TooltipProps) => {
  const autoId = useId();
  const tooltipId = id ?? `${autoId}-tooltip`;
  const [visible, setVisible] = useState(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  const originalProps = children.props;

  const trigger = cloneElement(children, {
    "aria-describedby": visible
      ? [originalProps["aria-describedby"], tooltipId].filter(Boolean).join(" ")
      : originalProps["aria-describedby"],
    onMouseEnter: () => {
      show();
      originalProps.onMouseEnter?.();
    },
    onMouseLeave: () => {
      hide();
      originalProps.onMouseLeave?.();
    },
    onFocus: () => {
      show();
      originalProps.onFocus?.();
    },
    onBlur: () => {
      hide();
      originalProps.onBlur?.();
    }
  });

  return (
    <span className={`nh-tooltip-wrapper ${className}`.trim()}>
      {trigger}
      {visible ? (
        <span
          id={tooltipId}
          role="tooltip"
          className={`nh-tooltip nh-tooltip--${placement}`}
          data-placement={placement}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
};
