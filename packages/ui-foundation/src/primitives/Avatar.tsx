import type { HTMLAttributes } from "react";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  size?: AvatarSize;
  src?: string;
  alt: string;
  initials?: string;
  presence?: "online" | "offline" | "busy" | "away";
}

const deriveInitials = (input: string): string =>
  input
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

export const Avatar = ({
  size = "md",
  src,
  alt,
  initials,
  presence,
  className = "",
  ...props
}: AvatarProps) => {
  const displayInitials = initials ?? deriveInitials(alt);
  return (
    <span
      className={
        `nh-avatar nh-avatar--${size}` + (className ? ` ${className}` : "")
      }
      data-size={size}
      {...props}
    >
      {src ? (
        <img className="nh-avatar__image" src={src} alt={alt} />
      ) : (
        <span
          className="nh-avatar__initials"
          aria-hidden={displayInitials ? "true" : undefined}
        >
          {displayInitials || null}
        </span>
      )}
      {!src ? <span className="nh-visually-hidden">{alt}</span> : null}
      {presence ? (
        <span
          className={`nh-avatar__presence nh-avatar__presence--${presence}`}
          aria-hidden="true"
          data-presence={presence}
        />
      ) : null}
    </span>
  );
};
