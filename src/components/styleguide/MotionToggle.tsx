"use client";

import { useState } from "react";
import {
  getMotionOverride,
  setMotionOverride,
  useReducedMotion,
  type MotionPref,
} from "@/motion/reduced";
import { cx } from "@/lib/format";

const OPTIONS: { value: MotionPref | null; label: string }[] = [
  { value: null, label: "System" },
  { value: "full", label: "Full" },
  { value: "reduce", label: "Reduced" },
];

/** Simulates prefers-reduced-motion across the whole page (this tab only). */
export function MotionToggle() {
  const reduced = useReducedMotion();
  const [pref, setPref] = useState<MotionPref | null>(() => getMotionOverride());
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span id="motion-toggle-label" className="mono-label text-paper-dim">
        Motion
      </span>
      <div
        role="radiogroup"
        aria-labelledby="motion-toggle-label"
        className="inline-flex rounded-full border border-line-strong p-1"
      >
        {OPTIONS.map((o) => (
          <button
            key={o.label}
            type="button"
            role="radio"
            aria-checked={pref === o.value}
            onClick={() => {
              setPref(o.value);
              setMotionOverride(o.value);
            }}
            className={cx(
              "h-8 rounded-full px-3.5 font-mono text-[0.6875rem] tracking-[0.1em] uppercase transition-colors",
              pref === o.value ? "bg-paper text-ink" : "text-paper-dim hover:text-paper",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      <span
        className="font-mono text-[0.6875rem] tracking-[0.1em] text-paper-dim uppercase"
        aria-live="polite"
      >
        Now: {reduced ? "reduced" : "full"}
      </span>
    </div>
  );
}
