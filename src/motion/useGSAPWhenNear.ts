"use client";

import { useRef, type DependencyList, type RefObject } from "react";
import { useGSAP } from "./gsap";
import { isReducedMotion, useReducedMotion } from "./reduced";

/**
 * Like useGSAP, but the setup runs only when `ref` comes within half a viewport of the
 * screen. Setting up SVG tweens and ScrollTriggers forces layout (getBBox, measuring);
 * doing it for every section at startup was the biggest main-thread cost on load.
 * Uses IntersectionObserver, which never forces layout itself. Skipped under reduced motion.
 * The setup may return a cleanup; everything it creates is reverted on unmount.
 */
export function useGSAPWhenNear(
  ref: RefObject<Element | null>,
  setup: () => void | (() => void),
  deps: DependencyList = [],
) {
  const reduced = useReducedMotion();
  const cleanup = useRef<void | (() => void)>(undefined);
  const { contextSafe } = useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced || isReducedMotion()) return;
      const run = contextSafe(() => {
        cleanup.current = setup();
      });
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io.disconnect();
            run();
          }
        },
        { rootMargin: "50% 0px 50% 0px" },
      );
      io.observe(el);
      return () => {
        io.disconnect();
        cleanup.current?.();
        cleanup.current = undefined;
      };
    },
    { dependencies: [reduced, ...deps], revertOnUpdate: true },
  );
}
