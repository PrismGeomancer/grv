"use client";

import { useEffect, useState } from "react";

/**
 * Reduced-motion preference: the OS setting, optionally overridden (the /styleguide
 * toggle). The resolved value is mirrored to html[data-motion] so CSS can follow it.
 */

export type MotionPref = "reduce" | "full";

import { REDUCED_QUERY as QUERY } from "./boot";
let override: MotionPref | null = null;
const listeners = new Set<() => void>();

function systemPrefersReduced(): boolean {
  return typeof window !== "undefined" && window.matchMedia(QUERY).matches;
}

export function isReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return override ? override === "reduce" : systemPrefersReduced();
}

function sync() {
  document.documentElement.dataset.motion = isReducedMotion() ? "reduce" : "full";
  listeners.forEach((fn) => fn());
}

export function setMotionOverride(pref: MotionPref | null) {
  override = pref;
  sync();
}

export function getMotionOverride(): MotionPref | null {
  return override;
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", sync);
  return () => {
    listeners.delete(fn);
    mq.removeEventListener("change", sync);
  };
}

/**
 * Hydration-safe: "full" on the server and in the hydrating render (so markup that branches
 * on it, like the Marquee, always matches the HTML), the real value from mount on.
 * Deliberately not useSyncExternalStore: when its client snapshot differs from the server
 * snapshot during hydration, React's consistency check forces a client re-render and a
 * hydration error. GSAP setups also check isReducedMotion() so nothing animates in that frame.
 */
export function useReducedMotion(): boolean {
  const [value, setValue] = useState(false);
  useEffect(() => {
    const update = () => setValue(isReducedMotion());
    update();
    return subscribe(update);
  }, []);
  return value;
}
