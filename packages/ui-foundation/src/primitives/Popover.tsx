"use client";

import type { ReactNode } from "react";
import { useCallback, useId, useRef, useState } from "react";
import { useDismissable } from "../hooks/useDismissable.js";

export type PopoverPlacement = "top" | "right" | "bottom" | "left";

export interface PopoverProps {
  trigger: (props: {
    onClick: () => void;
    "aria-expanded": boolean;
    "aria-controls": string;
  }) => ReactNode;
  children: ReactNode;
  placement?: PopoverPlacement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  id?: string;
  className?: string;
}

export const Popover = ({
  trigger,
  children,
  placement = "bottom",
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  id,
  className = ""
}: PopoverProps) => {
  const autoId = useId();
  const panelId = id ?? `${autoId}-panel`;
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const panelRef = useRef<HTMLDivElement | null>(null);

  useDismissable({
    active: open,
    ref: panelRef,
    onDismiss: () => setOpen(false)
  });

  return (
    <span className={`nh-popover-wrapper ${className}`.trim()}>
      {trigger({
        onClick: () => setOpen(!open),
        "aria-expanded": open,
        "aria-controls": panelId
      })}
      {open ? (
        <div
          id={panelId}
          ref={panelRef}
          role="dialog"
          className={`nh-popover nh-popover--${placement}`}
          data-placement={placement}
        >
          {children}
        </div>
      ) : null}
    </span>
  );
};
