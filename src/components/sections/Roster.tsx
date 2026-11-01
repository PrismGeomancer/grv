"use client";

import { useRef } from "react";
import { SectionHeading } from "@/components/ui";
import { artists, copy } from "@/data";
import { gsap, useGSAPWhenNear } from "@/motion";
import { ArtistSleeve } from "./ArtistSleeve";

const t = copy.roster;

/** §8.3 The Roster: 8 record sleeves. 4 columns / 2 on tablet / snap-scroll crates on mobile. */
export function Roster() {
  const grid = useRef<HTMLUListElement>(null);

  useGSAPWhenNear(grid, () => {
    gsap.from(grid.current!.children, {
      y: 48,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.07,
      ease: "power3.out",
      // Leftover transforms would trap each sleeve's z-index (the record must overlap neighbours).
      clearProps: "transform,opacity,visibility",
      scrollTrigger: { trigger: grid.current, start: "top 85%", once: true },
    });
  }, []);

  return (
    <section
      id="roster"
      aria-labelledby="roster-title"
      className="relative scroll-mt-16 border-t border-line py-24 md:py-36"
    >
      <div
        aria-hidden
        className="bg-grooves pointer-events-none absolute inset-0 [--groove-x:10%] [--groove-y:30%]"
      />
      <div className="container-groove relative">
        <SectionHeading
          id="roster-title"
          title={t.title}
          sub={t.sub}
          stamp={t.stamp}
          aside={<p className="mono-label text-paper-dim md:hidden">{t.scrollHint} →</p>}
        />
        <ul
          ref={grid}
          className="roster-grid mt-14 -mx-[var(--gutter)] flex snap-x snap-mandatory gap-6 overflow-x-auto px-[var(--gutter)] pt-2 pb-6 [scroll-padding-inline:var(--gutter)] [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-16 md:overflow-visible md:px-0 lg:grid-cols-4"
        >
          {artists.map((a, i) => (
            <li
              key={a.id}
              className="relative w-[min(78vw,20rem)] shrink-0 snap-start has-[:focus]:z-10 has-[:hover]:z-10 md:w-auto"
            >
              <ArtistSleeve artist={a} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
