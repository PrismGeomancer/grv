"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";
import { revealUp } from "./presets";
import { isReducedMotion, useReducedMotion } from "./reduced";

/**
 * revealUp for headings further down the page, done lazily: the line split (which forces
 * layout) only happens as the heading approaches the viewport, not at startup.
 * Until then the heading is opacity 0 (still in the accessibility tree).
 */
export function useRevealOnScroll(ref: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion();
  const { contextSafe } = useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced || isReducedMotion()) return;
      gsap.set(el, { opacity: 0 });
      const reveal = contextSafe(() => {
        gsap.set(el, { opacity: 1 });
        revealUp(el, { scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top bottom+=25%",
        once: true,
        onEnter: reveal,
      });
      return () => st.kill();
    },
    { dependencies: [reduced], revertOnUpdate: true },
  );
}
