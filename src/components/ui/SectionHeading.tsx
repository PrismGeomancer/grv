"use client";

import { useRef, type ReactNode } from "react";
import { cx } from "@/lib/format";
import { useRevealOnScroll } from "@/motion";

export interface SectionHeadingProps {
  id: string;
  title: string;
  sub?: string;
  /** Above the H2: a pill, a disclaimer. */
  eyebrow?: ReactNode;
  /** Decorative catalog stamp, top right ("GRV-002 · SIDE A"). */
  stamp?: string;
  /** Right-hand controls (pause button, hints). */
  aside?: ReactNode;
  className?: string;
}

/** Section H2 + sub. The H2 rises line by line when it scrolls in. */
export function SectionHeading({
  id,
  title,
  sub,
  eyebrow,
  stamp,
  aside,
  className,
}: SectionHeadingProps) {
  const root = useRef<HTMLElement>(null);
  const h2 = useRef<HTMLHeadingElement>(null);
  useRevealOnScroll(h2);

  return (
    <header ref={root} className={cx("relative", className)}>
      {stamp && (
        <p
          aria-hidden
          className="mono-label absolute top-0 right-0 hidden text-paper-dim/60 md:block"
        >
          {stamp}
        </p>
      )}
      {eyebrow && <div className="mb-5">{eyebrow}</div>}
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <div>
          <h2 id={id} ref={h2} className="font-expanded max-w-[16ch] text-h2">
            {title}
          </h2>
          {sub && <p className="mt-5 max-w-[46ch] text-lead text-paper-dim">{sub}</p>}
        </div>
        {aside}
      </div>
    </header>
  );
}
