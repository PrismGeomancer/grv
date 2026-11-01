"use client";

import { useRef } from "react";
import { cx } from "@/lib/format";
import { onairFlicker, useGSAP, useReducedMotion } from "@/motion";

export interface OnAirLightProps {
  on?: boolean;
  /** Flicker twice before holding when it switches on. */
  flicker?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "px-2 py-1 text-[0.6875rem] rounded-[4px]",
  md: "px-3 py-1.5 text-sm rounded-[6px]",
  lg: "px-5 py-2.5 text-xl rounded-[8px]",
} as const;

/** The studio's ON AIR sign. A dark unlit box with a lit layer on top that flickers on. */
export function OnAirLight({ on = true, flicker = true, size = "md", className }: OnAirLightProps) {
  const root = useRef<HTMLSpanElement>(null);
  const lit = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!on) return;
      if (flicker && !reduced) onairFlicker(lit.current);
    },
    { scope: root, dependencies: [on, flicker, reduced], revertOnUpdate: true },
  );

  const label = "font-condensed uppercase tracking-[0.18em] leading-none";

  return (
    <span
      ref={root}
      role="img"
      aria-label={on ? "On air" : "Off air"}
      className={cx("relative inline-grid select-none", className)}
    >
      {/* Unlit */}
      <span
        className={cx(
          SIZES[size],
          label,
          "col-start-1 row-start-1 border border-[#ff3b2f40] bg-[#1a0b0a] text-[#ff3b2f59]",
        )}
      >
        On Air
      </span>
      {/* Lit */}
      <span
        ref={lit}
        aria-hidden
        className={cx(
          SIZES[size],
          label,
          "col-start-1 row-start-1 border border-onair bg-onair text-ink shadow-[0_0_24px_2px_rgb(255_59_47/0.45),0_0_64px_8px_rgb(255_59_47/0.18)]",
          !on && "invisible opacity-0",
        )}
      >
        On Air
      </span>
    </span>
  );
}
