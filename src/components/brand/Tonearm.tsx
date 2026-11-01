import type { Ref } from "react";

/** Pivot in viewBox units, for svgOrigin when rotating the arm. */
export const TONEARM_PIVOT = { x: 92, y: 34 } as const;

export interface TonearmProps {
  /** Rotation around the pivot in degrees. 0 = resting on the record, negative = lifted away. */
  angle?: number;
  height?: number | string;
  className?: string;
  /** Ref to the arm group, so GSAP can lift it. */
  armRef?: Ref<SVGGElement>;
}

/** An S-less straight arm with headshell, counterweight and pivot base. Decorative. */
export function Tonearm({ angle = 0, height = 260, className, armRef }: TonearmProps) {
  const h = typeof height === "number" ? `${height}px` : height;
  const { x, y } = TONEARM_PIVOT;
  return (
    <svg
      viewBox="0 0 130 280"
      className={className}
      style={{ height: h, width: "auto", aspectRatio: "130 / 280", overflow: "visible" }}
      aria-hidden
      focusable="false"
    >
      {/* Base plate */}
      <circle cx={x} cy={y} r="24" fill="var(--ink-3)" stroke="var(--line-strong)" />
      <circle cx={x} cy={y} r="15" fill="none" stroke="var(--paper)" strokeOpacity="0.18" />
      <g ref={armRef} transform={`rotate(${angle} ${x} ${y})`}>
        {/* Counterweight */}
        <rect x={x - 9} y={y - 34} width="18" height="20" rx="3" fill="var(--paper-dim)" />
        <rect x={x - 9} y={y - 27} width="18" height="2" fill="var(--ink)" fillOpacity="0.4" />
        {/* Arm tube */}
        <path
          d={`M${x} ${y - 14} L${x} ${y + 150} L${x - 34} ${y + 214}`}
          fill="none"
          stroke="var(--paper)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Headshell + cartridge */}
        <g transform={`rotate(28 ${x - 34} ${y + 214})`}>
          <rect x={x - 46} y={y + 210} width="24" height="30" rx="3" fill="var(--paper)" />
          <rect x={x - 41} y={y + 232} width="14" height="12" rx="1.5" fill="var(--ink-3)" />
          <rect x={x - 35} y={y + 243} width="2" height="5" fill="var(--onair)" />
        </g>
        {/* Pivot cap */}
        <circle cx={x} cy={y} r="8" fill="var(--paper)" />
        <circle cx={x} cy={y} r="3" fill="var(--ink)" />
      </g>
    </svg>
  );
}
