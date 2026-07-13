import { createElement } from "react";
import {
  illustrationIds,
  illustrationRegistry,
  resolveIllustration,
  type IllustrationId
} from "./illustrations/index.js";

export type IllustrationSlotAlign = "left" | "right" | "center";
export type IllustrationSlotTone = "warm" | "cool" | "neutral" | "accent";

export interface IllustrationSlotProps {
  illustrationId: string;
  align?: IllustrationSlotAlign;
  tone?: IllustrationSlotTone;
  label?: string;
  className?: string;
}

const isKnown = (id: string): id is IllustrationId =>
  Object.prototype.hasOwnProperty.call(illustrationRegistry, id);

export const IllustrationSlot = ({
  illustrationId,
  align = "center",
  tone = "warm",
  label,
  className = ""
}: IllustrationSlotProps) => {
  const Illustration = resolveIllustration(illustrationId);
  const known = isKnown(illustrationId);
  return (
    <div
      className={`nh-illustration-slot ${className}`.trim()}
      data-align={align}
      data-tone={tone}
      data-illustration={known ? illustrationId : "neutral-placeholder"}
      data-fallback={!known ? "true" : undefined}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {createElement(Illustration)}
    </div>
  );
};

export { illustrationIds };
export type { IllustrationId };
