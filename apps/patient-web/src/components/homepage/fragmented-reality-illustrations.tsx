import type { ReactElement } from "react";

const strokeProps = {
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.4
};

const accentStrokeProps = {
  ...strokeProps,
  stroke: "var(--nh-color-brand-700)"
};

const softStrokeProps = {
  ...strokeProps,
  stroke: "var(--nh-color-border-strong)"
};

const dashedStrokeProps = {
  ...softStrokeProps,
  strokeDasharray: "3 5"
};

export const RecordCarrierIllustration = (): ReactElement => (
  <svg
    viewBox="0 0 128 84"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-hidden="true"
    focusable="false"
    className="nh-reality-card__glyph"
  >
    <g className="nh-reality-card__glyph-figure">
      <circle cx="26" cy="22" r="8" {...accentStrokeProps} />
      <path
        d="M14 66 C14 50 38 50 38 66"
        {...accentStrokeProps}
      />
      <rect
        x="16"
        y="38"
        width="20"
        height="14"
        rx="2"
        {...accentStrokeProps}
      />
      <path d="M20 44 h12 M20 48 h8" {...accentStrokeProps} />
    </g>
    <g className="nh-reality-card__glyph-flow">
      <path d="M42 46 h10" {...dashedStrokeProps} />
      <path d="M64 32 h10" {...dashedStrokeProps} />
      <path d="M64 46 h10" {...dashedStrokeProps} />
      <path d="M64 60 h10" {...dashedStrokeProps} />
    </g>
    <g className="nh-reality-card__glyph-records">
      <rect
        x="80"
        y="24"
        width="34"
        height="16"
        rx="3"
        {...softStrokeProps}
      />
      <path d="M85 30 h20 M85 34 h14" {...softStrokeProps} />
      <rect
        x="80"
        y="42"
        width="34"
        height="16"
        rx="3"
        {...softStrokeProps}
      />
      <path d="M85 48 h20 M85 52 h14" {...softStrokeProps} />
      <rect
        x="80"
        y="60"
        width="34"
        height="16"
        rx="3"
        {...softStrokeProps}
      />
      <path d="M85 66 h20 M85 70 h14" {...softStrokeProps} />
    </g>
  </svg>
);

export const RepeatLoopIllustration = (): ReactElement => (
  <svg
    viewBox="0 0 128 84"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-hidden="true"
    focusable="false"
    className="nh-reality-card__glyph"
  >
    <g className="nh-reality-card__glyph-loop">
      <path
        d="M64 14 C 92 14 100 34 100 42 C 100 62 84 70 64 70 C 44 70 28 62 28 42 C 28 34 36 14 64 14 Z"
        {...dashedStrokeProps}
      />
      <path d="M90 20 l4 6 l-6 2" {...softStrokeProps} />
    </g>
    <g className="nh-reality-card__glyph-bubbles">
      <path
        d="M40 24 h20 a6 6 0 0 1 6 6 v6 a6 6 0 0 1 -6 6 H50 l-6 5 v-5 h-4 a6 6 0 0 1 -6 -6 v-6 a6 6 0 0 1 6 -6 Z"
        {...accentStrokeProps}
      />
      <path d="M44 32 h12 M44 36 h8" {...accentStrokeProps} />

      <path
        d="M68 40 h20 a6 6 0 0 1 6 6 v6 a6 6 0 0 1 -6 6 H78 l-6 5 v-5 h-4 a6 6 0 0 1 -6 -6 v-6 a6 6 0 0 1 6 -6 Z"
        {...accentStrokeProps}
      />
      <path d="M72 48 h12 M72 52 h8" {...accentStrokeProps} />
    </g>
  </svg>
);

export const DisconnectedNodesIllustration = (): ReactElement => (
  <svg
    viewBox="0 0 128 84"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-hidden="true"
    focusable="false"
    className="nh-reality-card__glyph"
  >
    <g className="nh-reality-card__glyph-broken">
      <path d="M34 24 L58 40" {...dashedStrokeProps} />
      <path d="M64 40 L88 24" {...dashedStrokeProps} />
      <path d="M34 60 L58 44" {...dashedStrokeProps} />
      <path d="M64 44 L88 60" {...dashedStrokeProps} />
    </g>
    <g className="nh-reality-card__glyph-nodes">
      <circle cx="26" cy="20" r="10" {...accentStrokeProps} />
      <circle cx="96" cy="20" r="10" {...accentStrokeProps} />
      <circle cx="26" cy="64" r="10" {...accentStrokeProps} />
      <circle cx="96" cy="64" r="10" {...accentStrokeProps} />
    </g>
  </svg>
);

export const MemoryToPathwayIllustration = (): ReactElement => (
  <svg
    viewBox="0 0 128 84"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-hidden="true"
    focusable="false"
    className="nh-reality-card__glyph"
  >
    <g className="nh-reality-card__glyph-paper" opacity="0.62">
      <rect
        x="16"
        y="20"
        width="26"
        height="34"
        rx="2"
        {...softStrokeProps}
      />
      <path
        d="M22 28 h16 M22 34 h14 M22 40 h16 M22 46 h10"
        {...softStrokeProps}
      />
      <rect
        x="26"
        y="30"
        width="26"
        height="34"
        rx="2"
        {...softStrokeProps}
      />
      <path
        d="M32 38 h16 M32 44 h14 M32 50 h16 M32 56 h10"
        {...softStrokeProps}
      />
    </g>
    <g className="nh-reality-card__glyph-bridge">
      <path d="M58 42 C 68 42 68 34 78 34" {...dashedStrokeProps} />
      <path d="M58 42 C 68 42 68 50 78 50" {...dashedStrokeProps} />
      <path d="M58 42 h4" {...accentStrokeProps} />
    </g>
    <g className="nh-reality-card__glyph-pathway">
      <circle cx="82" cy="34" r="4" {...accentStrokeProps} />
      <circle cx="102" cy="24" r="4" {...accentStrokeProps} />
      <circle cx="102" cy="44" r="4" {...accentStrokeProps} />
      <circle cx="82" cy="50" r="4" {...accentStrokeProps} />
      <circle cx="102" cy="64" r="4" {...accentStrokeProps} />
      <path d="M86 34 L98 26" {...accentStrokeProps} />
      <path d="M86 34 L98 42" {...accentStrokeProps} />
      <path d="M86 50 L98 44" {...accentStrokeProps} />
      <path d="M86 50 L98 62" {...accentStrokeProps} />
    </g>
  </svg>
);
