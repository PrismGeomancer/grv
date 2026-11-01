"use client";

import { useRef } from "react";
import { Record, Tonearm, TONEARM_PIVOT } from "@/components/brand";
import { SectionHeading } from "@/components/ui";
import { copy } from "@/data";
import { gsap, isReducedMotion, ScrollTrigger, useGSAP, useReducedMotion } from "@/motion";
import { LoopArt, type LoopKind } from "./LoopArt";

const t = copy.howItWorks;
const KINDS: LoopKind[] = ["listen", "write", "release", "tour"];

/**
 * §8.6 How it works: the artist's loop. Desktop with motion: the section pins and the four
 * panels scroll sideways while a tonearm tracks across a record as the progress indicator.
 * Below 1024px, under reduced motion, or without JS: a plain grid (see .loop-track in CSS).
 */
export function HowItWorks() {
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const arm = useRef<SVGGElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || isReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const el = track.current!;
        // How far the row must travel so its last panel ends at the right gutter. Measured
        // from the (untransformed) container, so it's stable across refreshes.
        const distance = () => {
          const box = el.parentElement!;
          const start =
            box.getBoundingClientRect().left +
            parseFloat(getComputedStyle(box).paddingLeft) -
            pin.current!.getBoundingClientRect().left;
          return Math.max(0, start + el.scrollWidth - pin.current!.clientWidth);
        };
        const setArm = (p: number) =>
          gsap.set(arm.current, {
            rotation: 4 + p * 20,
            svgOrigin: `${TONEARM_PIVOT.x} ${TONEARM_PIVOT.y}`,
          });
        setArm(0);
        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            // Sections hydrate independently; the pin must measure before the triggers below it.
            refreshPriority: 1,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => setArm(self.progress),
          },
        });
        ScrollTrigger.sort();
      });
      return () => mm.revert();
    },
    { dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-title"
      className="relative scroll-mt-16 border-t border-line"
    >
      <div ref={pin} className="loop-pin overflow-hidden py-24 md:py-32">
        <div className="container-groove">
          <div className="flex items-end justify-between gap-8">
            <SectionHeading id="how-title" title={t.title} className="flex-1" />
            {/* Progress: the arm tracks in from the edge of the record as you scroll. */}
            <div aria-hidden className="loop-progress relative hidden w-36 shrink-0 xl:w-44">
              <Record
                size="100%"
                mode="none"
                catalogNo="GRV-004"
                side="B"
                labelColors={["#EDE8DD", "#07070A"]}
              />
              <div className="absolute -top-[22%] -right-[24%] h-[100%]">
                <Tonearm height="100%" armRef={arm} />
              </div>
            </div>
          </div>
        </div>

        <div className="loop-viewport container-groove mt-12 md:mt-16">
          <ol ref={track} className="loop-track">
            {t.steps.map((s, i) => (
              <li
                key={s.no}
                className="loop-panel flex flex-col rounded-[calc(var(--radius)*1.5)] border border-line bg-ink-2 p-6 md:p-8"
              >
                <div className="loop-art grid place-items-center rounded-[var(--radius)] border border-line bg-ink p-4">
                  <LoopArt kind={KINDS[i]!} />
                </div>
                <p className="mt-6 font-mono text-[0.75rem] tracking-[0.12em] text-paper-dim">
                  {s.no} / 04
                </p>
                <h3 className="font-expanded mt-2 text-h3">{s.name}</h3>
                <p className="mt-3 max-w-[38ch] text-lead text-paper-dim">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
