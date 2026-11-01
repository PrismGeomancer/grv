"use client";

import { useRef } from "react";
import { Record } from "@/components/brand";
import { Button, Pill, SectionHeading, useWaitlist } from "@/components/ui";
import { copy, STORES } from "@/data";
import { gsap, ScrollTrigger, useGSAPWhenNear } from "@/motion";

const t = copy.distribution;

/**
 * §8.5 From the studio to the stores. COMING SOON everywhere: a record is pressed, then
 * travels along the store tiles; each glows sodium as it passes and reads "soon".
 * No tile is ever shown as live. Animates transform/opacity only.
 */
export function Distribution() {
  const openWaitlist = useWaitlist();

  return (
    <section
      id="distribution"
      aria-labelledby="distribution-title"
      className="relative scroll-mt-16 border-t border-line py-24 md:py-36"
    >
      <div
        aria-hidden
        className="bg-grooves pointer-events-none absolute inset-0 [--groove-x:90%] [--groove-y:20%]"
      />
      <div className="container-groove relative">
        <SectionHeading
          id="distribution-title"
          title={t.title}
          sub={t.sub}
          eyebrow={<Pill tone="soon">{t.tag}</Pill>}
        />

        <PressLine />

        <ol className="mt-14 grid gap-6 border-t border-line pt-8 md:grid-cols-3 md:gap-10">
          {t.steps.map((s) => (
            <li key={s.no} className="font-mono">
              <p className="text-[0.75rem] tracking-[0.12em] text-paper">
                <span className="text-sodium">{s.no}</span> {s.name}
              </p>
              <p className="mt-2 font-sans text-paper-dim">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col items-start gap-6">
          <Button arrow size="lg" onClick={openWaitlist}>
            {t.cta}
          </Button>
          <p className="max-w-[62ch] text-[0.8125rem] text-paper-dim italic">{t.footnote}</p>
        </div>
      </div>
    </section>
  );
}

function PressLine() {
  const stage = useRef<HTMLDivElement>(null);
  const plate = useRef<SVGGElement>(null);
  const rec = useRef<HTMLDivElement>(null);

  useGSAPWhenNear(stage, () => {
    const root = stage.current!;
    const press = root.querySelector<HTMLElement>("[data-press]")!;
    const tiles = gsap.utils.toArray<HTMLElement>("[data-store]", root);

    // Positions are measured, so the path follows whatever layout the breakpoint gives.
    const at = (el: HTMLElement) => {
      const s = root.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const size = rec.current!.offsetWidth;
      return {
        x: r.left - s.left + r.width / 2 - size / 2,
        y: r.top - s.top + r.height * 0.38 - size / 2,
      };
    };

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8, paused: true });
    tl.set(rec.current, { x: () => at(press).x, y: () => at(press).y, scale: 0.6, autoAlpha: 0 })
      // Press
      .to(plate.current, { y: 14, duration: 0.35, ease: "power3.in" })
      .to(rec.current, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "back.out(2)" }, "<0.3")
      .to(plate.current, { y: 0, duration: 0.5, ease: "power3.out" }, "<");

    // Along the stores
    tiles.forEach((tile) => {
      const glow = tile.querySelector("[data-glow]");
      const soon = tile.querySelector("[data-soon]");
      tl.to(rec.current, {
        x: () => at(tile).x,
        y: () => at(tile).y,
        duration: 0.55,
        ease: "power2.inOut",
      })
        .to([glow, soon], { autoAlpha: 1, duration: 0.25, ease: "power2.out" }, "-=0.15")
        .to(glow, { autoAlpha: 0.25, duration: 1.2, ease: "power2.inOut" }, "+=0.15")
        .to(soon, { autoAlpha: 0.6, duration: 1.2, ease: "power2.inOut" }, "<");
    });
    tl.to(rec.current, { autoAlpha: 0, scale: 0.7, duration: 0.4 }, "+=0.2").to(
      tiles.flatMap((tile) => [
        tile.querySelector("[data-glow]"),
        tile.querySelector("[data-soon]"),
      ]),
      { autoAlpha: 0, duration: 0.6 },
      "<",
    );

    const st = ScrollTrigger.create({
      trigger: root,
      start: "top 80%",
      end: "bottom 10%",
      onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      onRefresh: () => tl.invalidate(),
    });
    return () => st.kill();
  }, []);

  return (
    <div ref={stage} className="relative mt-14">
      <ul
        aria-label={t.storesLabel}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-[minmax(9rem,1.1fr)_repeat(6,minmax(0,1fr))]"
      >
        <li
          data-press
          aria-hidden
          className="col-span-2 grid h-36 place-items-center rounded-[var(--radius)] border border-dashed border-line-strong sm:col-span-3 lg:col-span-1 lg:h-44"
        >
          <svg viewBox="0 0 120 90" className="h-24 w-auto lg:h-28">
            <rect
              x="8"
              y="78"
              width="104"
              height="6"
              rx="2"
              fill="var(--ink-3)"
              stroke="var(--line-strong)"
            />
            <rect
              x="20"
              y="70"
              width="80"
              height="8"
              rx="2"
              fill="var(--paper-dim)"
              fillOpacity="0.35"
            />
            <g ref={plate}>
              <rect x="56" y="0" width="8" height="22" fill="var(--paper-dim)" fillOpacity="0.5" />
              <rect
                x="20"
                y="22"
                width="80"
                height="10"
                rx="2"
                fill="var(--paper-dim)"
                fillOpacity="0.6"
              />
            </g>
            <text
              x="60"
              y="56"
              textAnchor="middle"
              fill="var(--paper-dim)"
              fontFamily="var(--font-mono)"
              fontSize="7"
              letterSpacing="1.4"
            >
              {t.pressing.toUpperCase()}
            </text>
          </svg>
        </li>
        {STORES.map((store) => (
          <li
            key={store}
            data-store
            className="relative flex h-28 flex-col justify-between overflow-hidden rounded-[var(--radius)] border border-line bg-ink-2 p-3.5 lg:h-44"
          >
            <span
              data-glow
              aria-hidden
              className="invisible absolute inset-0 rounded-[inherit] border border-sodium/70 opacity-0 shadow-[inset_0_0_24px_rgb(255_181_71/0.16),0_0_28px_rgb(255_181_71/0.12)]"
            />
            <span className="relative text-[0.9375rem] leading-tight font-medium text-paper">
              {store}
            </span>
            <span className="relative font-mono text-[0.6875rem] tracking-[0.12em] uppercase">
              <span className="text-sodium/70">{t.soon}</span>
              <span
                data-soon
                aria-hidden
                className="invisible absolute inset-0 text-sodium opacity-0"
              >
                {t.soon}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <div
        ref={rec}
        aria-hidden
        className="pointer-events-none invisible absolute top-0 left-0 size-14 opacity-0 lg:size-16"
      >
        <Record
          size="100%"
          period={1.4}
          catalogNo="GRV-B01"
          side="B"
          labelColors={["#FFB547", "#07070A"]}
        />
      </div>
    </div>
  );
}
