"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/format";
import {
  gsap,
  marquee,
  ScrollTrigger,
  useGSAP,
  useInView,
  useReducedMotion,
  isReducedMotion,
} from "@/motion";

export interface MarqueeProps {
  items: ReactNode[];
  /** Accessible name for the region. */
  label: string;
  /** Seconds for one full loop at rest. */
  period?: number;
  reverse?: boolean;
  /** Externally paused (e.g. a section-level pause button). */
  paused?: boolean;
  className?: string;
  itemClassName?: string;
}

/**
 * Infinite ticker. Pauses on hover and on keyboard focus, speeds up slightly with scroll
 * velocity, and stops off-screen. Under reduced motion it's a plain horizontal scroller (CSS).
 */
export function Marquee({
  items,
  label,
  period = 50,
  reverse = false,
  paused = false,
  className,
  itemClassName,
}: MarqueeProps) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduced = useReducedMotion();
  const inView = useInView(root);

  useGSAP(
    () => {
      if (reduced || isReducedMotion()) return;
      // The loop needs the row twice. The second copy is cloned here rather than rendered,
      // so it never costs HTML, hydration or a reduced-motion user anything. Ids are
      // stripped (url(#…) references still resolve to the originals).
      const original = track.current!.firstElementChild as HTMLElement;
      const copy = original.cloneNode(true) as HTMLElement;
      copy.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
      copy.setAttribute("aria-hidden", "true");
      copy.inert = true;
      track.current!.appendChild(copy);

      tween.current = marquee(track.current, { period, reverse });
      tween.current.pause();
      let boost = 0;
      const st = ScrollTrigger.create({
        trigger: root.current,
        onUpdate: (self) => {
          boost = Math.min(Math.abs(self.getVelocity()) / 2500, 1.5);
        },
      });
      const tick = () => {
        boost *= 0.93;
        tween.current?.timeScale(1 + boost);
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        st.kill();
        copy.remove();
      };
    },
    { scope: root, dependencies: [reduced, period, reverse], revertOnUpdate: true },
  );

  useEffect(() => {
    const t = tween.current;
    if (!t) return;
    if (inView && !hovered && !focused && !paused) t.play();
    else t.pause();
  }, [inView, hovered, focused, paused, reduced]);

  // Same markup in every mode (hydration always matches); under reduced motion, CSS in
  // globals.css turns this into a plain keyboard-scrollable row.
  return (
    <div
      ref={root}
      role="region"
      aria-label={label}
      tabIndex={0}
      data-marquee
      data-lenis-prevent={reduced || undefined}
      className={cx("overflow-hidden", className)}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div ref={track} className="flex w-max will-change-transform">
        <ul className="flex shrink-0 items-stretch gap-4 pr-4">
          {items.map((item, i) => (
            <li key={i} className={cx("shrink-0", itemClassName)}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
