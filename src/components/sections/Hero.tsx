"use client";

import { useRef } from "react";
import { Button, StatCounter, useWaitlist } from "@/components/ui";
import { copy, stats } from "@/data";
import {
  gsap,
  introWillPlay,
  onIntroHandoff,
  revealUp,
  useGSAP,
  useReducedMotion,
  isReducedMotion,
} from "@/motion";
import { HeroVisual } from "./HeroVisual";

const h = copy.hero;

/**
 * §8.1 Hero. Server-rendered and complete from the first frame (SEO, LCP). When the intro
 * plays on top, the H1 and supporting lines wait behind it and reveal at the handoff.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const openWaitlist = useWaitlist();
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || isReducedMotion() || !introWillPlay() || !title.current) return;
      const reveal = revealUp(title.current, { paused: true, stagger: 0.09 });
      const fades = gsap.from("[data-hero-fade]", {
        autoAlpha: 0,
        y: 18,
        duration: 0.8,
        stagger: 0.07,
        ease: "power3.out",
        paused: true,
      });
      return onIntroHandoff(({ skipped }) => {
        if (skipped) {
          reveal.finish();
          fades.progress(1);
        } else {
          reveal.play();
          fades.delay(0.45).play();
        }
      });
    },
    { scope: section, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section
      ref={section}
      id="top"
      aria-labelledby="hero-title"
      className="relative overflow-clip pt-20 pb-10 [--groove-x:78%] [--groove-y:62%] md:pt-32"
    >
      <div aria-hidden className="bg-grooves pointer-events-none absolute inset-0" />
      <div className="container-groove relative grid gap-y-8 [grid-template-areas:'eyebrow'_'visual'_'title'_'body'] lg:grid-cols-2 lg:gap-x-10 lg:[grid-template-areas:'eyebrow_eyebrow'_'title_title'_'body_visual']">
        <div data-hero-fade className="flex items-center justify-between gap-4 [grid-area:eyebrow]">
          <p className="mono-label text-paper-dim">{h.eyebrow}</p>
          <p aria-hidden className="mono-label hidden text-paper-dim/70 md:block">
            {h.catalogStamp}
          </p>
        </div>

        <h1
          id="hero-title"
          ref={title}
          // Below sm: one word per line (min-content), so the line count can't change
          // when Archivo Expanded replaces its narrower fallback (that swap caused CLS).
          className="font-expanded text-hero [grid-area:title] max-sm:w-min lg:-mt-2"
        >
          {h.titleLines.map((l, i) => (
            <span key={l}>
              {l}
              {i < h.titleLines.length - 1 && (
                <>
                  {" "}
                  <br />
                </>
              )}
            </span>
          ))}
        </h1>

        <div className="mx-auto -my-2 w-[min(76vw,30rem)] [grid-area:visual] md:my-0 lg:mx-0 lg:-mt-[calc(var(--step-hero)*1.55)] lg:w-full lg:max-w-[40rem] lg:justify-self-end">
          <HeroVisual sectionRef={section} />
        </div>

        <div className="flex flex-col gap-8 [grid-area:body]">
          <p data-hero-fade className="max-w-[46ch] text-lead text-paper/90">
            {h.sub}
          </p>
          <div data-hero-fade className="flex flex-wrap gap-3">
            <Button arrow size="lg" onClick={openWaitlist}>
              {h.primaryCta}
            </Button>
            <Button href="#roster" variant="secondary" size="lg">
              {h.secondaryCta}
            </Button>
          </div>
          <p data-hero-fade className="font-mono text-[0.75rem] tracking-[0.08em] text-paper-dim">
            <span className="mr-3">{h.platformLead}</span>
            <span className="text-paper">{h.platforms}</span>
          </p>
        </div>
      </div>

      <div className="container-groove relative mt-14 md:mt-20">
        <dl data-hero-fade className="grid gap-6 border-t border-line pt-6 sm:grid-cols-3">
          <StatCounter label={h.stats.signed} value={stats.artistsSigned} />
          <StatCounter
            label={h.stats.contracts}
            value={h.stats.contractsValue}
            format="percent"
            suffix={h.stats.contractsSuffix}
          />
          <div>
            <dt className="mono-label text-paper-dim">{h.stats.territories}</dt>
            <dd className="mt-1 font-mono text-lg text-paper">{stats.chains.join(" · ")}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
