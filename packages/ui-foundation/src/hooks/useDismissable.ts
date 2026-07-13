import type { RefObject } from "react";
import { useEffect } from "react";

export interface UseDismissableOptions {
  active: boolean;
  onDismiss: () => void;
  ref: RefObject<HTMLElement | null>;
  dismissOnEscape?: boolean;
  dismissOnOutsideClick?: boolean;
}

export const useDismissable = ({
  active,
  onDismiss,
  ref,
  dismissOnEscape = true,
  dismissOnOutsideClick = true
}: UseDismissableOptions) => {
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (dismissOnEscape && event.key === "Escape") {
        onDismiss();
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (!dismissOnOutsideClick) return;
      const target = event.target as Node | null;
      if (target && ref.current && !ref.current.contains(target)) {
        onDismiss();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [active, onDismiss, ref, dismissOnEscape, dismissOnOutsideClick]);
};
