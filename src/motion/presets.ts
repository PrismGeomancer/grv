"use client";

import { DUR, EASE, STAGGER } from "./eases";
import { gsap, SplitText } from "./gsap";

/*
 * The nine motion presets from the brief. Each returns its tween/timeline (or a small
 * controller) so callers can compose them into larger timelines. Call them inside a
 * useGSAP scope so everything reverts on unmount. Callers check reduced motion first.
 */

type Target = gsap.TweenTarget;
type ScrollOpt = { scrollTrigger?: ScrollTrigger.Vars };

/**
 * Lines rise and unmask with a stagger. Split by line, never by letter. `paused` holds the
 * lines hidden until `play()` (the hero waits for the intro handoff). Re-splits on resize.
 */
export function revealUp(
  target: Element | string,
  {
    delay = 0,
    stagger = STAGGER.base,
    scrollTrigger,
    paused = false,
  }: { delay?: number; stagger?: number; paused?: boolean } & ScrollOpt = {},
) {
  let anim: gsap.core.Tween | undefined;
  let started = !paused;
  const split = SplitText.create(target, {
    type: "lines",
    mask: "lines",
    linesClass: "reveal-line",
    autoSplit: true,
    onSplit: (self) => {
      anim = gsap.from(self.lines, {
        yPercent: 110,
        duration: DUR.lg,
        ease: EASE.out,
        stagger,
        delay,
        scrollTrigger,
        paused: !started,
      });
      return anim;
    },
  });
  return {
    split,
    play() {
      started = true;
      anim?.play();
    },
    finish() {
      started = true;
      anim?.progress(1);
    },
  };
}

/** Drops in with a small overshoot, then settles. */
export function needleDrop(
  target: Target,
  { delay = 0, scrollTrigger }: { delay?: number } & ScrollOpt = {},
) {
  return gsap.from(target, {
    y: -36,
    scale: 1.06,
    autoAlpha: 0,
    duration: DUR.md,
    ease: EASE.overshoot,
    delay,
    scrollTrigger,
  });
}

/**
 * Continuous rotation. `scratch()` speeds it up (hover); `coast()` lets it run back down
 * to `restSpeed` with momentum. restSpeed 0 = the record only turns while touched.
 */
export function spin(
  target: Target,
  {
    period = 9,
    restSpeed = 1,
    scratchSpeed = 5,
  }: { period?: number; restSpeed?: number; scratchSpeed?: number } = {},
) {
  const tween = gsap.to(target, {
    rotation: "+=360",
    duration: period,
    ease: EASE.linear,
    repeat: -1,
    transformOrigin: "50% 50%",
  });
  tween.timeScale(restSpeed);
  if (restSpeed === 0) tween.pause();
  return {
    tween,
    scratch() {
      tween.play();
      gsap.to(tween, {
        timeScale: scratchSpeed,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
    },
    coast() {
      gsap.to(tween, {
        timeScale: restSpeed,
        duration: 1.8,
        ease: "power2.out",
        overwrite: true,
        onComplete: () => {
          if (restSpeed === 0) tween.pause();
        },
      });
    },
  };
}

/** Anything with a 0–1 `open` value and a render callback (the Groove eye's lid). */
export type Lid = { open: number };

/** The lid droops 40–60%, hangs there, then snaps open. It never sleeps. */
export function blinkResist(lid: Lid, render: () => void) {
  const droop = gsap.utils.random(0.4, 0.6);
  return gsap
    .timeline({ onUpdate: render })
    .to(lid, { open: 1 - droop, duration: 0.6, ease: EASE.sine })
    .to(lid, { open: 1 - droop - 0.05, duration: gsap.utils.random(0.25, 0.5), ease: EASE.linear })
    .to(lid, { open: 1.07, duration: 0.11, ease: EASE.snap })
    .to(lid, { open: 1, duration: 0.35, ease: "power2.out" });
}

/** One slow, complete blink. Used once on the whole site: the closing CTA. */
export function blinkFull(lid: Lid, render: () => void) {
  return gsap
    .timeline({ onUpdate: render })
    .to(lid, { open: 0, duration: 1, ease: EASE.sine })
    .to(lid, { open: 0, duration: 0.45 })
    .to(lid, { open: 1.08, duration: 0.13, ease: EASE.snap })
    .to(lid, { open: 1, duration: 0.4, ease: "power2.out" });
}

/** Two irregular flickers, then a steady glow. Target is the lit layer. */
export function onairFlicker(target: Target) {
  return gsap
    .timeline()
    .set(target, { autoAlpha: 0 })
    .to(target, { autoAlpha: 0.9, duration: 0.04, ease: EASE.linear })
    .to(target, { autoAlpha: 0.1, duration: 0.07, ease: EASE.linear }, "+=0.05")
    .to(target, { autoAlpha: 0.75, duration: 0.03, ease: EASE.linear }, "+=0.09")
    .to(target, { autoAlpha: 0, duration: 0.05, ease: EASE.linear }, "+=0.04")
    .to(target, { autoAlpha: 1, duration: 0.3, ease: "power2.out" }, "+=0.12");
}

/** Mono numbers tick up. `format` turns the running value into display text. */
export function countUp(
  el: Element,
  to: number,
  {
    from = 0,
    duration = DUR.lg * 1.4,
    format = (n: number) => Math.round(n).toLocaleString("en-US"),
    scrollTrigger,
  }: { from?: number; duration?: number; format?: (n: number) => string } & ScrollOpt = {},
) {
  const state = { n: from };
  el.textContent = format(from);
  return gsap.to(state, {
    n: to,
    duration,
    ease: "power2.out",
    scrollTrigger,
    onUpdate: () => {
      el.textContent = format(state.n);
    },
  });
}

/** Infinite horizontal ticker. The track must contain its content twice. */
export function marquee(
  track: Target,
  { period = 40, reverse = false }: { period?: number; reverse?: boolean } = {},
) {
  return gsap.fromTo(
    track,
    { xPercent: reverse ? -50 : 0 },
    { xPercent: reverse ? 0 : -50, duration: period, ease: EASE.linear, repeat: -1 },
  );
}

/** Monospace text types out. Pair with a `.caret` element for the blinking cursor. */
export function typeLine(el: Element, text: string, { cps = 22 }: { cps?: number } = {}) {
  const state = { n: 0 };
  return gsap.to(state, {
    n: text.length,
    duration: text.length / cps,
    ease: EASE.linear,
    onStart: () => {
      el.textContent = "";
    },
    onUpdate: () => {
      el.textContent = text.slice(0, Math.round(state.n));
    },
  });
}

/** Backspaces whatever is in `el`. */
export function deleteLine(el: Element, { cps = 40 }: { cps?: number } = {}) {
  const state = { n: 0, text: "" };
  const tween: gsap.core.Tween = gsap.to(state, {
    n: 1,
    duration: 0.5,
    ease: EASE.linear,
    onStart: () => {
      state.text = el.textContent ?? "";
      tween.duration(Math.max(state.text.length / cps, 0.05));
    },
    onUpdate: () => {
      el.textContent = state.text.slice(0, Math.round(state.text.length * (1 - state.n)));
    },
  });
  return tween;
}
