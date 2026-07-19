import type { LucideIcon } from "lucide-react";

export interface TrustFeatureProps {
  icon: LucideIcon;
  title: string;
  body: string;
}

/** Icon in a soft circular badge + title + body — the established icon convention for this project. */
export function TrustFeature({ icon: Icon, title, body }: TrustFeatureProps) {
  return (
    <div className="flex items-start gap-3.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
        <Icon size={20} strokeWidth={1.9} aria-hidden />
      </span>
      <div className="flex flex-col gap-0.5">
        <p className="text-body-sm font-semibold text-white">{title}</p>
        <p className="text-body-sm text-white/75">{body}</p>
      </div>
    </div>
  );
}
