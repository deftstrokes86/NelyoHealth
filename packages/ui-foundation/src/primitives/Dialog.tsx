import type { ReactNode } from "react";
import { MotionPresence } from "../motion/MotionPresence.js";
export interface DialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
}
export const Dialog = ({ open, title, children }: DialogProps) => (
  <MotionPresence present={open} profile="SAFETY-IMMEDIATE">
    <div className="nh-dialog" role="dialog" aria-modal="true" aria-label={title}>
      <div className="nh-dialog__panel">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  </MotionPresence>
);
