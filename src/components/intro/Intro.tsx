"use client";

import { useEffect, useRef, useState } from "react";
import { GrooveEye, OnAirLight, type GrooveEyeHandle } from "@/components/brand";
import { setScrollLocked, useLenis } from "@/components/providers/SmoothScroll";
import { copy } from "@/data/copy";
import { cx } from "@/lib/format";
import {
  blinkResist,
  deleteLine,
  dispatchIntroHandoff,
  gsap,
  INTRO_SESSION_KEY,
  ScrollTrigger,
  typeLine,
  useGSAP,
} from "@/motion";
import { Flip } from "gsap/Flip";
import { IntroAudio } from "./introAudio";
import { INTRO_TIMING as T } from "./timing";

gsap.registerPlugin(Flip);

const t = copy.intro;

/*
 * Where each status line sits around the eye. Mobile: a terminal stack under the eye
 * (the clock and ON AIR own the space above). md+: scattered around it.
 */
const STATUS_POS = [
  "left-0 top-[calc(100%+0.75rem)] md:top-auto md:left-auto md:-top-2 md:right-[104%]",
  "left-0 top-[calc(100%+2rem)] md:left-[100%] md:top-[6%]",
  "left-0 top-[calc(100%+3.25rem)] md:top-auto md:left-auto md:bottom-[14%] md:right-[106%]",
  "left-0 top-[calc(100%+4.5rem)] md:top-auto md:left-[96%] md:bottom-[30%]",
];
const FANS_POS = "left-0 top-[calc(100%+5.75rem)] md:top-auto md:left-[86%] md:-bottom-6";

/**
 * The 6-second cinematic intro. One GSAP master timeline whose beats all come from
 * INTRO_TIMING. Rendered only when html[data-intro="play"] (see motion/boot.ts).
 */
export default function Intro() {
  const [done, setDone] = useState(false);
  const [onAir, setOnAir] = useState(false);
  const [sound, setSound] = useState(false);

  const root = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const caret = useRef<HTMLSpanElement>(null);
  const eyeWrap = useRef<HTMLDivElement>(null);
  const eye = useRef<GrooveEyeHandle>(null);
  const statuses = useRef<(HTMLSpanElement | null)[]>([]);
  const fans = useRef<HTMLSpanElement>(null);
  const chrome = useRef<HTMLDivElement>(null);
  const skipBtn = useRef<HTMLButtonElement>(null);

  const master = useRef<gsap.core.Timeline | null>(null);
  const flight = useRef<gsap.core.Timeline | null>(null);
  const finished = useRef(false);
  const handedOff = useRef(false);
  const audio = useRef<IntroAudio | null>(null);

  const lenis = useLenis();
  const lenisRef = useRef(lenis);

  // Lenis may arrive after we mount; keep it stopped until the intro ends.
  useEffect(() => {
    lenisRef.current = lenis;
    if (!finished.current) lenis?.stop();
  }, [lenis]);

  const handoff = (skipped: boolean) => {
    if (handedOff.current) return;
    handedOff.current = true;
    dispatchIntroHandoff({ skipped });
  };

  const finish = (skipped: boolean) => {
    if (finished.current) return;
    finished.current = true;
    master.current?.kill();
    flight.current?.kill();
    audio.current?.fadeOutAndClose(skipped ? 0.3 : 1.4);

    const html = document.documentElement;
    const hadFocus = root.current?.contains(document.activeElement);
    html.dataset.intro = "done";
    document.getElementById("site")?.removeAttribute("inert");
    setScrollLocked(lenisRef.current, false);
    handoff(skipped);
    ScrollTrigger.refresh();

    if (hadFocus) document.getElementById("main")?.focus({ preventScroll: true });

    if (skipped) {
      // Final state, no half-finished motion: everything on the curtain goes at once,
      // then only the bare black curtain lifts.
      const curtain = [bg.current, document.getElementById("intro-shell")];
      gsap.set(root.current!.querySelectorAll(":scope > :not(:first-child)"), { autoAlpha: 0 });
      gsap.to(curtain, {
        autoAlpha: 0,
        duration: 0.25,
        ease: "power2.out",
        onComplete: () => setDone(true),
      });
    } else {
      setDone(true);
    }
  };

  const skip = () => finish(true);

  useGSAP(
    () => {
      try {
        sessionStorage.setItem(INTRO_SESSION_KEY, "1");
      } catch {
        /* private mode: the intro may replay, which is fine */
      }
      window.scrollTo(0, 0);
      setScrollLocked(lenisRef.current, true);
      document.getElementById("site")?.setAttribute("inert", "");

      const handle = eye.current!;
      const lid = handle.lid;
      const textEl = line.current!;
      const statusEls = statuses.current.filter(Boolean) as HTMLSpanElement[];
      const fansEl = fans.current!;
      const fanState = { n: 1 };

      const setClock = (value: string, strong = false) => {
        const el = clock.current!;
        el.textContent = value;
        gsap.fromTo(
          el,
          { yPercent: 45, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.2, ease: "power3.out" },
        );
        if (strong) el.classList.replace("text-paper-dim", "text-paper");
      };

      const tl = gsap.timeline({
        paused: true,
        onStart: () => performance.mark("groove:intro-start"),
        onComplete: () => {
          performance.mark("groove:intro-end");
          finish(false);
        },
      });
      master.current = tl;

      // 0.0–1.0 · the clock
      tl.fromTo(clock.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, T.clockIn);
      T.clockTicks.forEach((at, i) => tl.call(setClock, [t.clock[i + 1]!], at));
      tl.to(skipBtn.current, { autoAlpha: 1, duration: 0.4 }, T.skipAt);

      // 1.0–1.8 · 03:00:00, ON AIR, "everyone's asleep."
      tl.call(setClock, [t.clock[3]!, true], T.three);
      tl.call(setOnAir, [true], T.three);
      tl.set(caret.current, { autoAlpha: 1 }, T.three);
      tl.add(typeLine(textEl, t.asleep, { cps: T.typeCps }), T.asleepAt);

      // 1.8–3.0 · "not everyone.", the eye opens and the record starts to turn
      tl.add(deleteLine(textEl, { cps: 70 }), T.wake);
      tl.add(typeLine(textEl, t.notEveryone, { cps: T.typeCps }), T.retypeAt);
      tl.fromTo(eyeWrap.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, T.eyeOpenAt);
      tl.to(
        lid,
        { open: 1, duration: T.eyeOpenDur, ease: "power2.inOut", onUpdate: handle.render },
        T.eyeOpenAt,
      );
      tl.call(() => handle.startSpin(), [], T.spinAt);

      // 3.0–4.4 · the agent wakes up
      tl.call(() => audio.current?.crackle(), [], T.agent);
      statusEls.forEach((el, i) => {
        const at = T.agent + i * T.statusGap;
        tl.set(el, { autoAlpha: 1 }, at);
        tl.add(typeLine(el, `› ${t.status[i]}`, { cps: T.statusCps }), at);
      });
      tl.set(fansEl, { autoAlpha: 1 }, T.fansAt);
      tl.to(
        fanState,
        {
          n: t.fansTarget,
          duration: T.resist - T.fansAt,
          ease: "expo.in", // the counter accelerates: 1 → 12 → 340
          onUpdate: () => {
            fansEl.textContent = `› ${t.fans(Math.max(1, Math.round(fanState.n)))}`;
          },
        },
        T.fansAt,
      );

      // 4.4–5.2 · it resists the blink; the status lines collapse into the iris
      const blink = blinkResist(lid, handle.render);
      tl.add(blink.timeScale(blink.duration() / T.resistDur), T.resist);
      tl.to(textEl, { autoAlpha: 0, duration: 0.25 }, T.resist);
      tl.to(
        [...statusEls, fansEl],
        {
          x: (_i: number, el: Element) => centreOffset(el, eyeWrap.current!).x,
          y: (_i: number, el: Element) => centreOffset(el, eyeWrap.current!).y,
          scale: 0.1,
          autoAlpha: 0,
          duration: 0.45,
          ease: "power3.in",
          stagger: 0.04,
        },
        T.collapseAt,
      );

      // 5.2–6.0 · the locked groove flares, the line is written, and we fall into the hero
      tl.call(() => audio.current?.thump(), [], T.lock);
      tl.add(handle.flare().timeScale(1.8), T.lock);
      tl.set(textEl, { autoAlpha: 1 }, T.lock);
      tl.add(typeLine(textEl, t.locked, { cps: T.lockedCps }), T.lock);
      tl.to(
        eyeWrap.current,
        { scale: 1.1, duration: T.handoff - T.lock, ease: "power2.in" },
        T.lock,
      );
      tl.call(fly, [], T.handoff);
      tl.call(handoff, [false], T.revealAt);
      tl.set({}, {}, T.end); // pins the total at exactly 6.0s

      // Start once fonts are in (the curtain is already up), never later than 600ms.
      let started = false;
      const go = () => {
        if (started || finished.current) return;
        started = true;
        requestAnimationFrame(() => tl.play(0));
      };
      document.fonts?.ready.then(go);
      const cap = window.setTimeout(go, 600);

      /** Zoom into the iris, which becomes the hero eye: one continuous Flip fit. */
      function fly() {
        const target = document.querySelector<HTMLElement>("[data-hero-eye]");
        const dur = T.end - T.handoff;
        const f = gsap.timeline();
        flight.current = f;
        if (target) {
          f.to(
            eyeWrap.current,
            {
              ...Flip.fit(eyeWrap.current, target, { getVars: true, scale: true }),
              duration: dur,
              ease: "power3.inOut",
            },
            0,
          );
        }
        f.to(
          [bg.current, document.getElementById("intro-shell")],
          { autoAlpha: 0, duration: dur * 0.8, ease: "power2.inOut" },
          0.05,
        );
        f.to(chrome.current, { autoAlpha: 0, duration: 0.25 }, 0);
      }

      return () => window.clearTimeout(cap);
    },
    { scope: root },
  );

  // Click, Esc, Enter or Space skip. Enter/Space on our own buttons keep their meaning.
  useEffect(() => {
    if (done) return;
    const onKey = (e: KeyboardEvent) => {
      const onButton = e.target instanceof HTMLElement && e.target.closest("button");
      if (e.key === "Escape" || ((e.key === "Enter" || e.key === " ") && !onButton)) {
        e.preventDefault();
        skip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const toggleSound = async () => {
    audio.current ??= new IntroAudio();
    if (sound) {
      audio.current.disable();
      setSound(false);
    } else {
      await audio.current.enable();
      setSound(true);
    }
  };

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[85] overflow-hidden"
      onClick={(e) => e.target === bg.current && skip()}
    >
      <div ref={bg} className="absolute inset-0 bg-ink" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6"
      >
        {/* Clock + ON AIR */}
        <div className="absolute top-[14vh] flex flex-col items-center gap-4 md:top-[12vh]">
          <span
            ref={clock}
            className="invisible font-mono text-[clamp(1.5rem,1.1rem+2vw,2.5rem)] tracking-[0.12em] text-paper-dim tabular-nums"
          >
            {t.clock[0]}
          </span>
          <OnAirLight on={onAir} size="sm" className={cx(!onAir && "opacity-0")} />
        </div>

        {/* The eye, with status lines around it */}
        <div className="relative w-[min(72vw,380px)]">
          <div ref={eyeWrap} className="invisible will-change-transform">
            <GrooveEye ref={eye} size="100%" lidOpen={0} spinning={false} blink="none" />
          </div>
          {t.status.map((_, i) => (
            <span
              key={i}
              ref={(el) => {
                statuses.current[i] = el;
              }}
              className={cx(
                "invisible absolute font-mono text-[0.65rem] whitespace-nowrap text-paper-dim md:text-[0.75rem] md:tracking-[0.06em]",
                STATUS_POS[i],
              )}
            />
          ))}
          <span
            ref={fans}
            className={cx(
              "invisible absolute font-mono text-[0.75rem] whitespace-nowrap text-onair tabular-nums",
              FANS_POS,
            )}
          />
        </div>

        {/* typeLine slot */}
        <p className="mt-40 h-6 font-mono text-[clamp(0.9375rem,0.85rem+0.4vw,1.125rem)] text-paper md:mt-14">
          <span ref={line} />
          <span ref={caret} className="caret invisible" />
        </p>
      </div>

      <div ref={chrome}>
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={sound}
          className="absolute top-5 right-5 grid size-10 place-items-center rounded-full border border-line text-paper-dim transition-colors hover:border-line-strong hover:text-paper"
        >
          <span className="sr-only">{sound ? t.soundOff : t.soundOn}</span>
          <SpeakerIcon on={sound} />
        </button>
        <button
          ref={skipBtn}
          type="button"
          onClick={skip}
          className="invisible absolute right-5 bottom-5 h-10 rounded-full px-4 font-mono text-[0.75rem] tracking-[0.1em] text-paper-dim uppercase transition-colors hover:text-paper md:right-8 md:bottom-8"
        >
          {t.skip} <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

function centreOffset(el: Element, to: Element) {
  const a = el.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  return {
    x: b.left + b.width / 2 - (a.left + a.width / 2),
    y: b.top + b.height / 2 - (a.top + a.height / 2),
  };
}

function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8h3l4-3.5v11L6 12H3z" fill="currentColor" stroke="none" />
      {on ? (
        <>
          <path d="M13 7.5a3.5 3.5 0 0 1 0 5" />
          <path d="M15.5 5a7 7 0 0 1 0 10" />
        </>
      ) : (
        <path d="M13.5 7.5l4 5M17.5 7.5l-4 5" />
      )}
    </svg>
  );
}
