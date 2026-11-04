// Dot Pattern from Magic UI (21st.dev: @dillionverma/dot-pattern), MIT.
// Adapted: typed props, no `cn`/Tailwind default fill — colour comes from the
// caller's CSS `fill`. Static SVG: no animation or glow.

import { useId, type SVGProps } from 'react';

interface DotPatternProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'x' | 'y'> {
  /** Pattern cell size in px. */
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  /** Dot radius in px. */
  cr?: number;
}

export default function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  ...props
}: DotPatternProps) {
  const id = useId();

  return (
    <svg aria-hidden="true" className={className} {...props}>
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <circle cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  );
}
