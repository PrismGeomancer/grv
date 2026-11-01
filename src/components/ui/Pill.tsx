import type { ReactNode } from "react";
import { cx } from "@/lib/format";

export type PillTone = "default" | "agent" | "live" | "soon" | "off";

const TONES: Record<PillTone, string> = {
  default: "border-line-strong text-paper-dim",
  agent: "border-paper/40 bg-paper text-ink",
  live: "border-onair/50 text-paper",
  soon: "border-sodium/60 text-sodium sodium-pulse",
  off: "border-line text-paper-dim",
};

/** Small mono tag. `live` shows the pulsing on-air dot; `off` a hollow one. */
export function Pill({
  tone = "default",
  children,
  className,
}: {
  tone?: PillTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 font-mono text-[0.6875rem] leading-none tracking-[0.1em] uppercase whitespace-nowrap",
        TONES[tone],
        className,
      )}
    >
      {tone === "live" && <span aria-hidden className="live-dot !size-1.5" />}
      {tone === "off" && (
        <span aria-hidden className="size-1.5 rounded-full border border-paper-dim" />
      )}
      {children}
    </span>
  );
}
