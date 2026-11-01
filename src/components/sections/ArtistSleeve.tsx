"use client";

import { useRef } from "react";
import { CoverArt } from "@/components/art/CoverArt";
import { Record, type RecordHandle } from "@/components/brand";
import { Card, Pill, useWaitlist } from "@/components/ui";
import { copy, PLATFORM_SHORT, type Artist } from "@/data";
import { cx, timeAgo, usdCompact } from "@/lib/format";

const t = copy.roster;

/**
 * A roster card designed as a record sleeve. On hover or focus (tap on touch) the vinyl
 * slides halfway out and starts spinning; it coasts to a stop when you leave.
 * Slide direction comes from --slide (set per grid position in globals.css).
 * The whole card is one button (stretched over the card) that opens the waitlist.
 */
export function ArtistSleeve({ artist, index }: { artist: Artist; index: number }) {
  const rec = useRef<RecordHandle>(null);
  const titleId = `artist-${artist.id}`;
  const onTour = artist.status === "on-tour";
  const openWaitlist = useWaitlist();

  return (
    <article
      aria-label={artist.name}
      onPointerEnter={(e) => e.pointerType === "mouse" && rec.current?.scratch()}
      onPointerLeave={(e) => e.pointerType === "mouse" && rec.current?.coast()}
      onFocus={() => rec.current?.scratch()}
      onBlur={() => rec.current?.coast()}
      className="group/sleeve relative cursor-pointer rounded-[var(--radius)] hover:z-10 focus-within:z-10"
    >
      <div className="relative aspect-square">
        {/* The record, behind the sleeve. */}
        <div
          aria-hidden
          className="absolute inset-[4%] transition-transform duration-700 ease-[var(--ease-out)] group-hover/sleeve:translate-x-[var(--slide)] group-focus-within/sleeve:translate-x-[var(--slide)]"
        >
          <Record
            ref={rec}
            mode="hover"
            size="100%"
            period={1.8}
            catalogNo={artist.catalogNo}
            labelColors={[artist.palette[1], artist.palette[0]]}
          />
        </div>

        {/* The sleeve. */}
        <Card
          wear
          wearSeed={index + 2}
          className="absolute inset-0 overflow-hidden shadow-[0_24px_40px_-24px_rgb(0_0_0/0.9)]"
        >
          <CoverArt artist={artist} />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <span className="rounded-[4px] bg-ink/75 px-1.5 py-0.5 font-mono text-[0.6875rem] tracking-[0.06em] text-paper">
              {artist.catalogNo}
            </span>
            <Pill tone="agent" className="!h-5 !px-2 !text-[0.625rem]">
              {t.agentPill}
            </Pill>
          </div>
          <p
            aria-hidden
            className="font-condensed absolute bottom-3 left-3 text-[0.8125rem] tracking-[0.2em] text-paper/80 uppercase mix-blend-screen"
          >
            {artist.genre}
          </p>
          <span
            aria-hidden
            className="absolute right-3 bottom-3 translate-y-1 rounded-full bg-onair px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.1em] text-ink uppercase opacity-0 transition-[opacity,translate] duration-300 group-focus-within/sleeve:translate-y-0 group-focus-within/sleeve:opacity-100 group-hover/sleeve:translate-y-0 group-hover/sleeve:opacity-100"
          >
            {t.cta} →
          </span>
        </Card>
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3
            id={titleId}
            className="font-expanded truncate text-[1.25rem] leading-tight tracking-[-0.01em]"
          >
            <button
              type="button"
              onClick={openWaitlist}
              aria-label={t.ctaA11y(artist.name)}
              className="text-left after:absolute after:inset-0 after:z-20 after:rounded-[var(--radius)] after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-8 focus-visible:after:outline-paper"
            >
              {artist.name}
            </button>
          </h3>
          <span className="shrink-0 font-mono text-[0.8125rem] text-paper-dim">
            {artist.ticker}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 min-h-[2.6em] text-[0.875rem] leading-snug text-paper-dim">
          {artist.persona}
        </p>

        <div className="mt-3">
          <Pill tone={onTour ? "live" : "off"}>{onTour ? t.onTour : t.offTour}</Pill>
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-3 font-mono">
          <div>
            <dt className="text-[0.625rem] tracking-[0.1em] text-paper-dim uppercase">
              {t.market}
            </dt>
            <dd className="mt-0.5 text-[0.875rem] tabular-nums">{usdCompact(artist.market)}</dd>
          </div>
          <div>
            <dt className="text-[0.625rem] tracking-[0.1em] text-paper-dim uppercase">
              {t.royalties}
            </dt>
            <dd className="mt-0.5 text-[0.875rem] tabular-nums">
              {usdCompact(artist.royaltiesPaid)}
            </dd>
          </div>
          <div>
            <dt className="text-[0.625rem] tracking-[0.1em] text-paper-dim uppercase">
              {t.signed}
            </dt>
            <dd className="mt-0.5 text-[0.875rem] tabular-nums">{timeAgo(artist.signedAt)}</dd>
          </div>
        </dl>

        <p className="mt-3 font-mono text-[0.75rem] text-paper-dim">
          {t.engine}:{" "}
          <span className={cx(artist.engine ? "text-paper" : "text-sodium italic")}>
            {artist.engine ?? t.unsignedVoice}
          </span>
        </p>
        <p className="mt-1 font-mono text-[0.75rem] text-paper-dim">
          {artist.platforms.map((p) => PLATFORM_SHORT[p]).join(" · ")}
        </p>
      </div>
    </article>
  );
}
