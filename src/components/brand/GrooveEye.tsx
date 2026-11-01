"use client";

import { useEffect, useId, useImperativeHandle, useRef, type Ref } from "react";
import { groupBy, ringsPath } from "@/lib/svg";
import {
  blinkFull,
  blinkResist,
  gsap,
  useGSAP,
  useInView,
  useReducedMotion,
  type Lid,
} from "@/motion";
import {
  EYE,
  GROOVES,
  SIMPLE_GROOVES,
  eyeClipPath,
  lowerLidPath,
  sheenWedge,
  upperLidPath,
} from "./eyeGeometry";

export type BlinkMode = "resist" | "full" | "none";

export interface GrooveEyeHandle {
  /** The whole svg, for Flip / zoom transitions. */
  root: SVGSVGElement | null;
  /** The rotating record group. */
  iris: SVGGElement | null;
  /** Sets the lid immediately (0 = slit, 1 = open). */
  setLid: (open: number) => void;
  /** Returns the lid proxy so external timelines (the intro) can tween it. */
  lid: Lid;
  render: () => void;
  blinkResist: () => gsap.core.Timeline;
  blinkFull: () => gsap.core.Timeline;
  /** The locked groove flares bright red for a moment. */
  flare: () => gsap.core.Timeline;
  startSpin: () => void;
  stopSpin: () => void;
}

export interface GrooveEyeProps {
  /** Width in px (number) or any CSS length. Height follows the 3:2 viewBox. */
  size?: number | string;
  spinning?: boolean;
  blink?: BlinkMode;
  /** Initial / controlled lid opening, 0–1. */
  lidOpen?: number;
  /** Seconds per revolution. */
  period?: number;
  /**
   * "simple" drops fine grooves and thickens the lids so the mark survives small sizes
   * (nav, 16–64px). "auto" picks simple below 100px.
   */
  detail?: "auto" | "full" | "simple";
  /** When set, the mark is announced with this label; otherwise it's decorative. */
  title?: string;
  className?: string;
  ref?: Ref<GrooveEyeHandle>;
}

export function GrooveEye({
  size = 240,
  spinning = true,
  blink = "resist",
  lidOpen = 1,
  period = 14,
  detail = "auto",
  title,
  className,
  ref,
}: GrooveEyeProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ids = {
    clip: `eye-clip-${uid}`,
    glow: `eye-glow-${uid}`,
    sheen: `eye-sheen-${uid}`,
    fade: `eye-fade-${uid}`,
  };

  const svgRef = useRef<SVGSVGElement>(null);
  const irisRef = useRef<SVGGElement>(null);
  const lockRef = useRef<SVGGElement>(null);
  const flareRef = useRef<SVGCircleElement>(null);
  const clipRef = useRef<SVGPathElement>(null);
  const upperRef = useRef<SVGPathElement>(null);
  const lid = useRef<Lid>({ open: lidOpen }).current;
  const spinTween = useRef<gsap.core.Tween | null>(null);
  const loopTween = useRef<gsap.core.Tween | null>(null);

  const reduced = useReducedMotion();
  const inView = useInView(svgRef);

  const render = () => {
    clipRef.current?.setAttribute("d", eyeClipPath(lid.open));
    upperRef.current?.setAttribute("d", upperLidPath(lid.open));
  };

  // Controlled lid (styleguide slider, intro start state).
  useEffect(() => {
    lid.open = lidOpen;
    render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lidOpen]);

  // Tweens are created on first use, not on mount: an SVG transform measures its element,
  // and several eyes (footer, closing CTA) start far off-screen.
  const { contextSafe } = useGSAP(
    () => {
      spinTween.current = null;
      loopTween.current = null;
    },
    { scope: svgRef, dependencies: [period], revertOnUpdate: true },
  );
  const ensureTweens = contextSafe(() => {
    spinTween.current ??= gsap.to(irisRef.current, {
      rotation: "+=360",
      svgOrigin: `${EYE.cx} ${EYE.cy}`,
      duration: period,
      ease: "none",
      repeat: -1,
      paused: true,
    });
    // The locked groove circles endlessly, on its own clock.
    loopTween.current ??= gsap.to(lockRef.current, {
      rotation: "+=360",
      svgOrigin: `${EYE.cx} ${EYE.cy}`,
      duration: 2.4,
      ease: "none",
      repeat: -1,
      paused: true,
    });
  });

  // Spin only while visible and allowed.
  useEffect(() => {
    const active = inView && !reduced;
    if (active) ensureTweens();
    if (active && spinning) spinTween.current?.play();
    else spinTween.current?.pause();
    if (active) loopTween.current?.play();
    else loopTween.current?.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, spinning]);

  // Blink scheduling: resist every 6–9s; "full" blinks once on first sight, then resists.
  const playedFull = useRef(false);
  useEffect(() => {
    if (reduced || blink === "none" || !inView) return;
    let call: gsap.core.Tween | null = null;
    let tl: gsap.core.Timeline | null = null;
    const schedule = () => {
      call = gsap.delayedCall(gsap.utils.random(6, 9), () => {
        tl = blinkResist(lid, render);
        tl.eventCallback("onComplete", schedule);
      });
    };
    if (blink === "full" && !playedFull.current) {
      playedFull.current = true;
      call = gsap.delayedCall(0.6, () => {
        tl = blinkFull(lid, render);
        tl.eventCallback("onComplete", schedule);
      });
    } else {
      schedule();
    }
    return () => {
      call?.kill();
      tl?.kill();
      lid.open = Math.max(lid.open, lidOpen);
      render();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blink, reduced, inView]);

  useImperativeHandle(ref, () => ({
    get root() {
      return svgRef.current;
    },
    get iris() {
      return irisRef.current;
    },
    lid,
    render,
    setLid: (open: number) => {
      lid.open = open;
      render();
    },
    blinkResist: contextSafe(() => blinkResist(lid, render)) as () => gsap.core.Timeline,
    blinkFull: contextSafe(() => blinkFull(lid, render)) as () => gsap.core.Timeline,
    flare: contextSafe(() =>
      gsap
        .timeline()
        .fromTo(
          flareRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.18, ease: "power2.out" },
        )
        .to(flareRef.current, { opacity: 0, duration: 0.9, ease: "power2.inOut" }, "+=0.15"),
    ) as () => gsap.core.Timeline,
    startSpin: () => {
      ensureTweens();
      spinTween.current?.play();
    },
    stopSpin: () => spinTween.current?.pause(),
  }));

  const width = typeof size === "number" ? `${size}px` : size;
  const simple =
    detail === "simple" || (detail === "auto" && typeof size === "number" && size < 100);
  const grooves = simple ? SIMPLE_GROOVES : GROOVES;
  const a11y = title
    ? { role: "img" as const, "aria-label": title }
    : { "aria-hidden": true as const };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${EYE.w} ${EYE.h}`}
      className={className}
      style={{ width, height: "auto", aspectRatio: `${EYE.w} / ${EYE.h}`, overflow: "visible" }}
      focusable="false"
      {...a11y}
    >
      <defs>
        <clipPath id={ids.clip}>
          <path ref={clipRef} d={eyeClipPath(lidOpen)} />
        </clipPath>
        <filter id={ids.glow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient
          id={ids.sheen}
          cx={EYE.cx}
          cy={EYE.cy}
          r={EYE.irisR}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.3" stopColor="var(--paper)" stopOpacity="0" />
          <stop offset="0.75" stopColor="var(--paper)" stopOpacity="0.09" />
          <stop offset="1" stopColor="var(--paper)" stopOpacity="0.02" />
        </radialGradient>
        <radialGradient
          id={ids.fade}
          cx={EYE.cx}
          cy={EYE.cy}
          r={EYE.irisR + 6}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.85" stopColor="var(--ink)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--ink)" stopOpacity="0.85" />
        </radialGradient>
      </defs>

      {/* Crease above the lid: quiet, fixed. Only at sizes where it reads as anatomy. */}
      {!simple && (
        <path
          d="M44 52 C92 -10 148 -10 196 52"
          fill="none"
          stroke="var(--paper)"
          strokeOpacity="0.1"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      )}

      <g clipPath={`url(#${ids.clip})`}>
        {/* Sclera: almost black, so the vinyl reads as the iris. */}
        <rect x="0" y="0" width={EYE.w} height={EYE.h} fill="var(--ink-2)" />

        {/* The record. Everything in this group turns. */}
        <g ref={irisRef}>
          <circle cx={EYE.cx} cy={EYE.cy} r={EYE.irisR} fill="#0a0a0d" />
          {groupBy(grooves, (g) => `${g.gap ? 1 : 0}|${g.o}|${g.w}`).map(([key, group]) => {
            const g = group[0]!;
            return (
              <path
                key={key}
                d={ringsPath(
                  EYE.cx,
                  EYE.cy,
                  group.map((x) => x.r),
                )}
                fill="none"
                stroke={g.gap ? "#000" : "var(--paper)"}
                strokeOpacity={g.o}
                strokeWidth={g.w}
              />
            );
          })}
          <circle
            cx={EYE.cx}
            cy={EYE.cy}
            r={EYE.irisR - 0.5}
            fill="none"
            stroke="var(--paper)"
            strokeOpacity="0.28"
            strokeWidth="1"
          />
          {/* Label sticker = pupil. The printed marks make the rotation visible. */}
          <circle cx={EYE.cx} cy={EYE.cy} r={EYE.stickerR} fill="var(--ink-3)" />
          <circle
            cx={EYE.cx}
            cy={EYE.cy}
            r={EYE.stickerR - 1.5}
            fill="none"
            stroke="var(--paper)"
            strokeOpacity="0.35"
            strokeWidth="0.6"
          />
          <path
            d={`M${EYE.cx - 11} ${EYE.cy - 4} A12 12 0 0 1 ${EYE.cx + 4} ${EYE.cy - 11.3}`}
            fill="none"
            stroke="var(--paper)"
            strokeOpacity="0.55"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <rect
            x={EYE.cx + 6}
            y={EYE.cy + 5}
            width="5"
            height="1.6"
            rx="0.8"
            fill="var(--paper)"
            fillOpacity="0.45"
          />
          <circle cx={EYE.cx} cy={EYE.cy} r="2.2" fill="#000" />
        </g>

        {/* The locked groove: a faint red ring with a bright pulse that never stops. */}
        <circle
          cx={EYE.cx}
          cy={EYE.cy}
          r={EYE.lockedR}
          fill="none"
          stroke="var(--onair)"
          strokeOpacity={simple ? 1 : 0.35}
          strokeWidth={simple ? 6 : 0.9}
        />
        <g ref={lockRef} filter={`url(#${ids.glow})`}>
          <circle
            cx={EYE.cx}
            cy={EYE.cy}
            r={EYE.lockedR}
            fill="none"
            stroke="var(--onair)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray={`${(2 * Math.PI * EYE.lockedR * 0.16).toFixed(2)} 999`}
          />
        </g>
        <circle
          ref={flareRef}
          cx={EYE.cx}
          cy={EYE.cy}
          r={EYE.lockedR}
          fill="none"
          stroke="var(--onair)"
          strokeWidth="3.2"
          opacity="0"
          filter={`url(#${ids.glow})`}
        />

        {/* Fixed vinyl sheen + rim falloff. */}
        {!simple && (
          <>
            <path d={sheenWedge(-140, 13, EYE.irisR)} fill={`url(#${ids.sheen})`} />
            <path d={sheenWedge(40, 13, EYE.irisR)} fill={`url(#${ids.sheen})`} />
          </>
        )}
        <circle cx={EYE.cx} cy={EYE.cy} r={EYE.irisR + 6} fill={`url(#${ids.fade})`} />
        {/* Catchlight: the thing that makes it an eye. */}
        <ellipse
          cx={EYE.cx - 17}
          cy={EYE.cy - 19}
          rx={simple ? 9 : 5.5}
          ry={simple ? 6 : 3.6}
          fill="var(--paper)"
          fillOpacity="0.8"
          transform={`rotate(-30 ${EYE.cx - 17} ${EYE.cy - 19})`}
        />
      </g>

      {/* Lids. The upper line is heavier: a lash line. */}
      <path
        d={lowerLidPath()}
        fill="none"
        stroke="var(--paper)"
        strokeWidth={simple ? 10 : 2.6}
        strokeLinecap="round"
      />
      <path
        ref={upperRef}
        d={upperLidPath(lidOpen)}
        fill="none"
        stroke="var(--paper)"
        strokeWidth={simple ? 14 : 5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
