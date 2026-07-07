import type { CSSProperties, HTMLAttributes } from "react";

export type SkeletonShape = "text" | "rect" | "circle";

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  shape?: SkeletonShape;
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const toDim = (value?: string | number): string | undefined =>
  typeof value === "number" ? `${value}px` : value;

export const Skeleton = ({
  shape = "text",
  width,
  height,
  lines = 1,
  className = "",
  style,
  ...props
}: SkeletonProps) => {
  if (shape === "text" && lines > 1) {
    return (
      <span
        className={`nh-skeleton nh-skeleton--text-block ${className}`.trim()}
        role="status"
        aria-label="Loading"
        aria-busy="true"
        {...props}
      >
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            className="nh-skeleton__line"
            aria-hidden="true"
            style={{
              width: i === lines - 1 ? "80%" : "100%"
            }}
          />
        ))}
      </span>
    );
  }
  const dimStyle: CSSProperties = {
    ...style,
    width: toDim(width),
    height: toDim(height)
  };
  return (
    <span
      className={`nh-skeleton nh-skeleton--${shape} ${className}`.trim()}
      role="status"
      aria-label="Loading"
      aria-busy="true"
      data-shape={shape}
      style={dimStyle}
      {...props}
    />
  );
};
