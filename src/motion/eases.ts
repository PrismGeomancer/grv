/** Shared motion vocabulary. Keep in sync with the CSS mirrors in styles/tokens.css. */

export const EASE = {
  out: "power3.out",
  inOut: "power3.inOut",
  in: "power3.in",
  snap: "power4.out",
  overshoot: "back.out(1.7)",
  sine: "sine.inOut",
  linear: "none",
} as const;

export const DUR = {
  sm: 0.4,
  md: 0.7,
  lg: 1.1,
} as const;

export const STAGGER = {
  tight: 0.06,
  base: 0.08,
  loose: 0.1,
} as const;
