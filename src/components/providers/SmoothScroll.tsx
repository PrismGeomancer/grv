"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, useReducedMotion } from "@/motion";

const LenisContext = createContext<Lenis | null>(null);

/** The Lenis instance, or null under reduced motion (native scrolling). */
export function useLenis() {
  return useContext(LenisContext);
}

/** Locks / unlocks page scroll whether or not Lenis is running (intro, modal). */
export function setScrollLocked(lenis: Lenis | null, locked: boolean) {
  document.documentElement.style.overflow = locked ? "hidden" : "";
  if (locked) lenis?.stop();
  else lenis?.start();
}

/**
 * Lenis driven by GSAP's ticker, so ScrollTrigger and smooth scroll share one clock.
 * GSAP's default lag smoothing stays on: with it off, a main-thread stall (hydration,
 * font load) would fast-forward timed sequences like the intro instead of pausing them.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;
    const instance = new Lenis({ lerp: 0.11, anchors: true, autoRaf: false });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    setLenis(instance);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
