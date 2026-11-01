"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  GrooveEye,
  OnAirLight,
  Record,
  type GrooveEyeHandle,
  type RecordHandle,
} from "@/components/brand";
import { Marquee, Pill } from "@/components/ui";
import { artists, posts } from "@/data";
import {
  countUp,
  deleteLine,
  gsap,
  needleDrop,
  revealUp,
  typeLine,
  useGSAP,
  useReducedMotion,
  isReducedMotion,
} from "@/motion";

/** A demo tile with a Replay button that remounts its child (so mount-time motion replays). */
function Demo({
  name,
  desc,
  children,
}: {
  name: string;
  desc: string;
  children: (key: number) => ReactNode;
}) {
  const [k, setK] = useState(0);
  return (
    <figure className="flex flex-col rounded-[var(--radius)] border border-line bg-ink-2">
      <div className="grid min-h-48 flex-1 place-items-center overflow-hidden p-6">
        {children(k)}
      </div>
      <figcaption className="flex items-start justify-between gap-4 border-t border-line p-4">
        <span>
          <code className="font-mono text-sm text-paper">{name}</code>
          <span className="mt-1 block text-sm text-paper-dim">{desc}</span>
        </span>
        <button
          type="button"
          onClick={() => setK((n) => n + 1)}
          className="h-8 shrink-0 rounded-full border border-line-strong px-3 font-mono text-[0.6875rem] tracking-[0.1em] text-paper-dim uppercase hover:text-paper"
        >
          Replay
        </button>
      </figcaption>
    </figure>
  );
}

function RevealUpDemo() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      if (!reduced && !isReducedMotion() && ref.current) revealUp(ref.current, { delay: 0.2 });
    },
    { dependencies: [reduced], revertOnUpdate: true },
  );
  return (
    <p
      ref={ref}
      className="font-expanded max-w-[14ch] text-center text-[2rem] leading-[0.95] tracking-[-0.02em]"
    >
      Sign talent that never sleeps.
    </p>
  );
}

function NeedleDropDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      if (!reduced) needleDrop(ref.current, { delay: 0.2 });
    },
    { dependencies: [reduced], revertOnUpdate: true },
  );
  return (
    <div
      ref={ref}
      className="font-condensed rotate-[-6deg] rounded-[6px] border-2 border-onair px-4 py-1.5 text-2xl tracking-[0.2em] text-onair uppercase"
    >
      Signed
    </div>
  );
}

function SpinDemo() {
  const rec = useRef<RecordHandle>(null);
  return (
    <button
      type="button"
      className="rounded-full"
      onPointerEnter={() => rec.current?.scratch()}
      onPointerLeave={() => rec.current?.coast()}
      onFocus={() => rec.current?.scratch()}
      onBlur={() => rec.current?.coast()}
    >
      <span className="sr-only">Hover or focus to scratch the record</span>
      <Record
        ref={rec}
        size={150}
        catalogNo="GRV-001"
        mode="always"
        labelColors={["#FF6A3D", "#07070A"]}
      />
    </button>
  );
}

function BlinkDemo({ mode }: { mode: "resist" | "full" }) {
  const eye = useRef<GrooveEyeHandle>(null);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      if (reduced || isReducedMotion()) return;
      gsap.delayedCall(0.4, () =>
        mode === "full" ? eye.current?.blinkFull() : eye.current?.blinkResist(),
      );
    },
    { dependencies: [reduced], revertOnUpdate: true },
  );
  return <GrooveEye ref={eye} size={220} blink="none" />;
}

function CountUpDemo() {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      if (!reduced && !isReducedMotion() && ref.current)
        countUp(ref.current, artists.length, { duration: 1.6 });
    },
    { dependencies: [reduced], revertOnUpdate: true },
  );
  return (
    <div className="text-center">
      <span className="mono-label block text-paper-dim">Artists signed</span>
      <span ref={ref} className="font-mono text-5xl tabular-nums">
        {artists.length}
      </span>
    </div>
  );
}

function TypeLineDemo() {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      if (reduced || isReducedMotion() || !ref.current) return;
      gsap
        .timeline({ delay: 0.3 })
        .add(typeLine(ref.current, "everyone's asleep."))
        .add(deleteLine(ref.current), "+=0.7")
        .add(typeLine(ref.current, "not everyone."), "+=0.2");
    },
    { dependencies: [reduced], revertOnUpdate: true },
  );
  return (
    <p className="font-mono text-lg text-paper">
      <span ref={ref}>not everyone.</span>
      <span aria-hidden className="caret" />
    </p>
  );
}

function MarqueeDemo() {
  const items = posts.slice(0, 6).map((p) => {
    const a = artists.find((x) => x.id === p.artistId);
    return (
      <span
        key={p.id}
        className="flex h-12 items-center gap-3 rounded-full border border-line bg-ink-3 px-4 font-mono text-sm whitespace-nowrap"
      >
        <span className="live-dot" aria-hidden />
        {a?.name} <span className="text-paper-dim">{a?.ticker}</span> <Pill>by agent</Pill>
      </span>
    );
  });
  return (
    <div className="w-full space-y-3">
      <Marquee items={items} label="Marquee demo, row one" period={30} />
      <Marquee items={items} label="Marquee demo, row two" period={34} reverse />
    </div>
  );
}

export function MotionDemos() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Demo name="revealUp" desc="SplitText by line; lines rise out of a mask with a stagger.">
        {(k) => <RevealUpDemo key={k} />}
      </Demo>
      <Demo name="needleDrop" desc="Drops in with a small overshoot, then settles.">
        {(k) => <NeedleDropDemo key={k} />}
      </Demo>
      <Demo name="spin" desc="Hover or focus: speeds up, then coasts back with momentum.">
        {(k) => <SpinDemo key={k} />}
      </Demo>
      <Demo name="blinkResist" desc="Lid droops 40–60%, holds, snaps open.">
        {(k) => <BlinkDemo key={k} mode="resist" />}
      </Demo>
      <Demo name="blinkFull" desc="One slow, complete blink. Closing CTA only.">
        {(k) => <BlinkDemo key={k} mode="full" />}
      </Demo>
      <Demo name="onairFlicker" desc="Two irregular flickers, then a steady glow.">
        {(k) => <OnAirLight key={k} size="lg" />}
      </Demo>
      <Demo name="countUp" desc="Mono numbers tick up on reveal. Value from src/data.">
        {(k) => <CountUpDemo key={k} />}
      </Demo>
      <Demo name="typeLine" desc="Mono text types out with a blinking caret (and deletes).">
        {(k) => <TypeLineDemo key={k} />}
      </Demo>
      <Demo name="marquee" desc="Pauses on hover and focus; nudged by scroll velocity.">
        {(k) => <MarqueeDemo key={k} />}
      </Demo>
    </div>
  );
}
