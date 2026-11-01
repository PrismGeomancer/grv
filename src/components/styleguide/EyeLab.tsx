"use client";

import { useRef, useState } from "react";
import { GrooveEye, type BlinkMode, type GrooveEyeHandle } from "@/components/brand";
import { Button } from "@/components/ui";
import { cx } from "@/lib/format";
import { useReducedMotion } from "@/motion";

/** Live controls for every prop and imperative action of the Groove eye. */
export function EyeLab() {
  const eye = useRef<GrooveEyeHandle>(null);
  const [spinning, setSpinning] = useState(true);
  const [blink, setBlink] = useState<BlinkMode>("resist");
  const [lid, setLid] = useState(1);
  const reduced = useReducedMotion();

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="bg-grooves grid min-h-[22rem] place-items-center rounded-[var(--radius)] border border-line bg-ink-2 p-8">
        <GrooveEye
          ref={eye}
          size="min(100%, 520px)"
          spinning={spinning}
          blink={blink}
          lidOpen={lid}
          title="Groove eye, live demo"
        />
      </div>
      <div className="flex flex-col gap-6 rounded-[var(--radius)] border border-line bg-ink-2 p-6">
        <fieldset>
          <legend className="mono-label text-paper-dim">blink</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["resist", "full", "none"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={blink === m}
                onClick={() => setBlink(m)}
                className={cx(
                  "h-8 rounded-full border px-3.5 font-mono text-[0.6875rem] tracking-[0.1em] uppercase",
                  blink === m
                    ? "border-paper bg-paper text-ink"
                    : "border-line-strong text-paper-dim hover:text-paper",
                )}
              >
                {m}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-paper-dim">
            resist: droops every 6–9s and snaps open. full: one slow blink on first sight, then
            resist.
          </p>
        </fieldset>

        <label className="flex items-center justify-between gap-4">
          <span className="mono-label text-paper-dim">spinning</span>
          <input
            type="checkbox"
            checked={spinning}
            onChange={(e) => setSpinning(e.target.checked)}
            className="size-5 accent-[var(--onair)]"
          />
        </label>

        <label className="block">
          <span className="mono-label flex justify-between text-paper-dim">
            <span>lidOpen</span>
            <span className="text-paper tabular-nums">{lid.toFixed(2)}</span>
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={lid}
            onChange={(e) => setLid(Number(e.target.value))}
            className="mt-3 w-full accent-[var(--onair)]"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => eye.current?.blinkResist()} disabled={reduced}>
            blinkResist
          </Button>
          <Button variant="secondary" onClick={() => eye.current?.blinkFull()} disabled={reduced}>
            blinkFull
          </Button>
          <Button variant="secondary" onClick={() => eye.current?.flare()} disabled={reduced}>
            Flare locked groove
          </Button>
        </div>
        {reduced && (
          <p className="text-sm text-sodium">Reduced motion is on: no spin, no blinking.</p>
        )}
      </div>
    </div>
  );
}
