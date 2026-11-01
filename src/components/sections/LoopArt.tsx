"use client";

import { useEffect, useRef } from "react";
import { PLATFORM_SHORT, PLATFORMS } from "@/data";
import { gsap, useInView, useReducedMotion, useGSAPWhenNear } from "@/motion";

export type LoopKind = "listen" | "write" | "release" | "tour";

const W = 200;
const H = 140;

/**
 * Small looping illustrations for the four steps of the artist's loop. Each loop only
 * runs while on screen; under reduced motion they're still frames.
 */
export function LoopArt({ kind }: { kind: LoopKind }) {
  const root = useRef<SVGSVGElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const reduced = useReducedMotion();
  const inView = useInView(root);

  useGSAPWhenNear(root, () => {
    const q = gsap.utils.selector(root);
    const t = gsap.timeline({ repeat: -1, paused: true });

    if (kind === "listen") {
      t.fromTo(
        q("[data-bar]"),
        { scaleY: 0.15 },
        {
          scaleY: (i: number) => 0.35 + 0.65 * Math.abs(Math.sin(i * 1.7)),
          transformOrigin: "50% 50%",
          duration: 0.45,
          ease: "sine.inOut",
          stagger: { each: 0.035, from: "center", yoyo: true, repeat: 3 },
        },
      );
    }
    if (kind === "write") {
      t.set(q("[data-line]"), { drawSVG: "0%" })
        .to(q("[data-line]"), {
          drawSVG: "100%",
          duration: 0.55,
          ease: "power1.inOut",
          stagger: 0.45,
        })
        .to(q("[data-line]"), { autoAlpha: 0, duration: 0.4 }, "+=0.8")
        .set(q("[data-line]"), { autoAlpha: 1 });
    }
    if (kind === "release") {
      q("[data-post]").forEach((el, i) => {
        t.fromTo(
          el,
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
          i * 0.9,
        )
          .to(q("[data-chip]")[i] ?? null, { autoAlpha: 1, duration: 0.2 }, i * 0.9 + 0.3)
          .to(q("[data-chip]")[i] ?? null, { autoAlpha: 0.25, duration: 0.5 }, i * 0.9 + 0.9);
      });
      t.to(q("[data-post]"), { y: -20, autoAlpha: 0, duration: 0.4, stagger: 0.05 }, "+=0.4");
    }
    if (kind === "tour") {
      t.fromTo(
        q("[data-fan]"),
        { scale: 0, transformOrigin: "50% 50%" },
        {
          scale: 1,
          duration: 0.3,
          ease: "back.out(3)",
          stagger: { each: 0.04, from: "center", grid: "auto" },
        },
      )
        .to(q("[data-fan]"), { autoAlpha: 0, duration: 0.5 }, "+=0.8")
        .set(q("[data-fan]"), { autoAlpha: 1 });
    }
    tl.current = t;
  }, [kind]);

  useEffect(() => {
    if (inView && !reduced) tl.current?.play();
    else tl.current?.pause();
  }, [inView, reduced]);

  return (
    <svg
      ref={root}
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      aria-hidden
      focusable="false"
    >
      {kind === "listen" && (
        <g>
          <path
            d="M14 112 C 50 104, 70 118, 100 100 S 160 96, 186 84"
            fill="none"
            stroke="var(--line-strong)"
            strokeDasharray="2 4"
          />
          {Array.from({ length: 23 }, (_, i) => {
            const h = 18 + 70 * Math.abs(Math.sin(i * 0.9) * Math.cos(i * 0.31));
            return (
              <rect
                data-bar
                key={i}
                x={16 + i * 7.6}
                y={66 - h / 2}
                width="3.4"
                height={h}
                rx="1.7"
                fill={i === 11 ? "var(--onair)" : "var(--paper)"}
                fillOpacity={i === 11 ? 1 : 0.75}
              />
            );
          })}
        </g>
      )}
      {kind === "write" && (
        <g>
          <rect
            x="44"
            y="14"
            width="112"
            height="116"
            rx="6"
            fill="var(--ink-3)"
            stroke="var(--line-strong)"
          />
          <line x1="58" y1="14" x2="58" y2="130" stroke="var(--onair)" strokeOpacity="0.5" />
          {[34, 50, 66, 82, 98, 114].map((y, i) => (
            <path
              data-line
              key={y}
              d={`M66 ${y} C ${84 + i * 3} ${y - 3}, ${104 - i * 2} ${y + 3}, ${120 + ((i * 13) % 24)} ${y}`}
              fill="none"
              stroke="var(--paper)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}
        </g>
      )}
      {kind === "release" && (
        <g>
          <rect
            x="66"
            y="8"
            width="68"
            height="124"
            rx="12"
            fill="var(--ink-3)"
            stroke="var(--paper)"
            strokeOpacity="0.6"
          />
          <rect x="88" y="14" width="24" height="4" rx="2" fill="var(--paper)" fillOpacity="0.3" />
          {[0, 1, 2, 3].map((i) => (
            <g data-post key={i}>
              <rect
                x="74"
                y={28 + i * 25}
                width="52"
                height="20"
                rx="4"
                fill="var(--ink-2)"
                stroke="var(--line-strong)"
              />
              <circle
                cx="82"
                cy={38 + i * 25}
                r="4"
                fill={i === 2 ? "var(--onair)" : "var(--paper-dim)"}
              />
              <rect
                x="90"
                y={34 + i * 25}
                width="30"
                height="3"
                rx="1.5"
                fill="var(--paper)"
                fillOpacity="0.6"
              />
              <rect
                x="90"
                y={40 + i * 25}
                width="20"
                height="3"
                rx="1.5"
                fill="var(--paper)"
                fillOpacity="0.3"
              />
            </g>
          ))}
          {PLATFORMS.map((p, i) => (
            <text
              data-chip
              key={p}
              x={i % 2 === 0 ? 58 : 142}
              y={40 + i * 26}
              textAnchor={i % 2 === 0 ? "end" : "start"}
              fill="var(--paper)"
              fillOpacity="0.25"
              fontFamily="var(--font-mono)"
              fontSize="10"
            >
              {PLATFORM_SHORT[p]}
            </text>
          ))}
        </g>
      )}
      {kind === "tour" && (
        <g>
          {Array.from({ length: 13 * 7 }, (_, i) => {
            const c = i % 13;
            const r = Math.floor(i / 13);
            const centre = c === 6 && r === 3;
            return (
              <circle
                data-fan
                key={i}
                cx={22 + c * 13}
                cy={28 + r * 14}
                r={centre ? 5 : 3}
                fill={centre ? "var(--onair)" : "var(--paper)"}
                fillOpacity={centre ? 1 : 0.25 + ((c * 7 + r * 3) % 10) / 16}
              />
            );
          })}
        </g>
      )}
    </svg>
  );
}
