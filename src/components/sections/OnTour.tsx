"use client";

import { useState } from "react";
import { Marquee, SectionHeading } from "@/components/ui";
import { copy, PLATFORM_LINE, posts } from "@/data";
import { PostCard } from "./PostCard";

const t = copy.onTour;

// Two rows, alternating posts, so each row mixes text and video.
const rowA = posts.filter((_, i) => i % 2 === 0);
const rowB = posts.filter((_, i) => i % 2 === 1);

/** §8.2 On Tour: the live feed, two rows moving in opposite directions. */
export function OnTour() {
  const [paused, setPaused] = useState(false);

  return (
    <section
      id="on-tour"
      aria-labelledby="on-tour-title"
      className="relative border-t border-line py-24 md:py-36"
    >
      <div className="container-groove">
        <SectionHeading
          id="on-tour-title"
          title={t.title}
          sub={t.sub}
          stamp={t.stamp}
          aside={
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              className="inline-flex h-10 items-center gap-2.5 rounded-full border border-line-strong px-4 font-mono text-[0.6875rem] tracking-[0.1em] text-paper-dim uppercase transition-colors hover:text-paper"
            >
              <svg aria-hidden viewBox="0 0 12 12" className="size-3" fill="currentColor">
                {paused ? (
                  <path d="M2.5 1.5v9l8-4.5z" />
                ) : (
                  <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" />
                )}
              </svg>
              {paused ? t.play : t.pause}
            </button>
          }
        />
        <p className="mt-8 font-mono text-[0.75rem] tracking-[0.08em] text-paper-dim">
          <span aria-hidden className="live-dot mr-2.5 !size-1.5 align-middle" />
          {t.agentLine} {t.platformLead} <span className="text-paper">{PLATFORM_LINE}</span>
        </p>
      </div>

      <div className="mt-12 space-y-4 [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
        <Marquee
          items={rowA.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
          label={t.rowA}
          period={70}
          paused={paused}
        />
        <Marquee
          items={rowB.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
          label={t.rowB}
          period={78}
          reverse
          paused={paused}
        />
      </div>
    </section>
  );
}
