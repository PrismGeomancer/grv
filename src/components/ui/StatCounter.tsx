"use client";

import { useRef } from "react";
import { usdCompact } from "@/lib/format";
import { countUp, introWillPlay, onIntroHandoff, useGSAP, useReducedMotion } from "@/motion";

const FORMATS = {
  int: (n: number) => Math.round(n).toLocaleString("en-US"),
  usd: (n: number) => usdCompact(n),
  percent: (n: number) => `${Math.round(n)}%`,
} as const;

export interface StatCounterProps {
  label: string;
  value: number;
  format?: keyof typeof FORMATS;
  /** Text after the number, e.g. " on-chain". */
  suffix?: string;
  className?: string;
}

/**
 * A mono stat that ticks up when it scrolls into view. The server renders the final
 * value; screen readers always get the final value, never the ticking one.
 */
export function StatCounter({
  label,
  value,
  format = "int",
  suffix = "",
  className,
}: StatCounterProps) {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const fmt = FORMATS[format];

  const { contextSafe } = useGSAP(
    () => {
      if (reduced || !num.current) return;
      const el = num.current;
      const start = contextSafe(() => {
        countUp(el, value, {
          format: fmt,
          scrollTrigger: { trigger: root.current, start: "top 92%", once: true },
        });
      });
      // Behind the intro, hold the count until the hero is handed over.
      if (introWillPlay()) {
        el.textContent = fmt(0);
        return onIntroHandoff(() => start());
      }
      start();
    },
    { scope: root, dependencies: [reduced, value], revertOnUpdate: true },
  );

  return (
    <div ref={root} className={className}>
      <dt className="mono-label text-paper-dim">{label}</dt>
      <dd className="mt-1 font-mono text-lg text-paper tabular-nums">
        <span aria-hidden ref={num}>
          {fmt(value)}
        </span>
        <span aria-hidden>{suffix}</span>
        <span className="sr-only">
          {fmt(value)}
          {suffix}
        </span>
      </dd>
    </div>
  );
}
