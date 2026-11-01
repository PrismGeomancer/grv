"use client";

import { useEffect, useId, useImperativeHandle, useRef, type Ref } from "react";
import { ringsPath } from "@/lib/svg";
import { spin, useGSAP, useInView, useReducedMotion } from "@/motion";

export interface RecordHandle {
  root: SVGSVGElement | null;
  /** Speed up (hover/focus). */
  scratch: () => void;
  /** Coast back down to rest speed with momentum. */
  coast: () => void;
}

export interface RecordProps {
  size?: number | string;
  /** "always" turns slowly and scratches on demand; "hover" only turns while scratched. */
  mode?: "always" | "hover" | "none";
  /** [label base, label ink] */
  labelColors?: [string, string];
  catalogNo?: string;
  side?: "A" | "B";
  /** Seconds per revolution at rest speed. */
  period?: number;
  className?: string;
  ref?: Ref<RecordHandle>;
}

const R = 98;
const GROOVE_RADII = Array.from({ length: 22 }, (_, i) => 40 + i * 2.6);
// Every 7th groove is a dark track gap; the rest cycle through three faint opacities.
const LIGHT_GROOVES = [0, 1, 2].map((k) =>
  ringsPath(
    100,
    100,
    GROOVE_RADII.filter((_, i) => i % 7 !== 6 && i % 3 === k),
  ),
);
const GAP_GROOVES = ringsPath(
  100,
  100,
  GROOVE_RADII.filter((_, i) => i % 7 === 6),
);

/** A 12" record. The label carries the catalog number. Decorative. */
export function Record({
  size = 240,
  mode = "always",
  labelColors = ["#EDE8DD", "#07070A"],
  catalogNo = "GRV-000",
  side = "A",
  period = 6,
  className,
  ref,
}: RecordProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const discRef = useRef<SVGGElement>(null);
  const ctrl = useRef<ReturnType<typeof spin> | null>(null);
  const reduced = useReducedMotion();
  const inView = useInView(svgRef);

  // The spin tween is created on first use (visible + allowed, or a scratch), not on mount:
  // setting up an SVG transform measures the element, and most records start off-screen.
  const { contextSafe } = useGSAP(
    () => {
      ctrl.current = null;
    },
    { scope: svgRef, dependencies: [mode, period], revertOnUpdate: true },
  );
  const ensure = contextSafe(() => {
    if (!ctrl.current && mode !== "none") {
      ctrl.current = spin(discRef.current, { period, restSpeed: mode === "always" ? 1 : 0 });
      ctrl.current.tween.pause();
    }
    return ctrl.current;
  });

  useEffect(() => {
    if (!inView || reduced) ctrl.current?.tween.pause();
    else if (mode === "always") ensure()?.tween.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, mode]);

  useImperativeHandle(ref, () => ({
    get root() {
      return svgRef.current;
    },
    scratch: () => {
      if (!reduced) ensure()?.scratch();
    },
    coast: () => {
      if (!reduced) ctrl.current?.coast();
    },
  }));

  const width = typeof size === "number" ? `${size}px` : size;
  const [base, ink] = labelColors;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 200"
      className={className}
      style={{ width, height: "auto", aspectRatio: "1" }}
      aria-hidden
      focusable="false"
    >
      <defs>
        <path id={`lbl-${uid}`} d="M100 100 m-27 0 a27 27 0 1 1 54 0 a27 27 0 1 1 -54 0" />
        <radialGradient id={`sheen-${uid}`} cx="100" cy="100" r={R} gradientUnits="userSpaceOnUse">
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.8" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.03" />
        </radialGradient>
      </defs>
      <g ref={discRef}>
        <circle cx="100" cy="100" r={R} fill="#0b0b0e" />
        {/* Grooves, grouped by style: one path each instead of a circle per groove. */}
        <path
          d={LIGHT_GROOVES[0]}
          fill="none"
          stroke="#fff"
          strokeOpacity="0.05"
          strokeWidth="0.5"
        />
        <path
          d={LIGHT_GROOVES[1]}
          fill="none"
          stroke="#fff"
          strokeOpacity="0.075"
          strokeWidth="0.5"
        />
        <path
          d={LIGHT_GROOVES[2]}
          fill="none"
          stroke="#fff"
          strokeOpacity="0.1"
          strokeWidth="0.5"
        />
        <path d={GAP_GROOVES} fill="none" stroke="#000" strokeOpacity="0.8" strokeWidth="1.8" />
        <circle cx="100" cy="100" r={R - 0.5} fill="none" stroke="#fff" strokeOpacity="0.16" />
        <circle cx="100" cy="100" r="34" fill={base} />
        <circle
          cx="100"
          cy="100"
          r="31.5"
          fill="none"
          stroke={ink}
          strokeOpacity="0.35"
          strokeWidth="0.5"
        />
        <text fill={ink} fontFamily="var(--font-mono)" fontSize="5.4" letterSpacing="0.9">
          <textPath
            href={`#lbl-${uid}`}
          >{`${catalogNo} · SIDE ${side} · 33⅓ · GROOVE · `}</textPath>
        </text>
        <text
          x="100"
          y="112"
          textAnchor="middle"
          fill={ink}
          fontFamily="var(--font-display)"
          fontWeight="900"
          fontSize="7"
          style={{ fontStretch: "125%" }}
        >
          {side}
        </text>
        <circle cx="100" cy="100" r="2.6" fill="#07070a" />
      </g>
      {/* Sheen stays still while the disc turns. */}
      <path d="M100 100 L28 34 A98 98 0 0 1 50 16 Z" fill={`url(#sheen-${uid})`} />
      <path d="M100 100 L172 166 A98 98 0 0 1 150 184 Z" fill={`url(#sheen-${uid})`} />
    </svg>
  );
}
