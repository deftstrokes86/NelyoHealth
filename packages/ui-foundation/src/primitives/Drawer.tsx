import type { ReactNode } from "react";
import { useRef } from "react";
import { useDismissable } from "../hooks/useDismissable.js";
import { useFocusTrap } from "../hooks/useFocusTrap.js";

export type DrawerSide = "left" | "right" | "top" | "bottom";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  title: string;
  children: ReactNode;
  className?: string;
  dismissOnBackdropClick?: boolean;
}

export const Drawer = ({
  open,
  onClose,
  side = "right",
  title,
  children,
  className = "",
  dismissOnBackdropClick = true
}: DrawerProps) => {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useFocusTrap(panelRef, open);
  useDismissable({
    active: open,
    ref: panelRef,
    onDismiss: onClose,
    dismissOnOutsideClick: dismissOnBackdropClick
  });

  if (!open) return null;

  return (
    <div className={`nh-drawer-root ${className}`.trim()} data-open="true">
      <div className="nh-drawer__backdrop" aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`nh-drawer nh-drawer--${side}`}
        data-side={side}
      >
        {children}
      </div>
    </div>
  );
};
