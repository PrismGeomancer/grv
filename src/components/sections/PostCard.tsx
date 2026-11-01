import { ArtistAvatar } from "@/components/art/ArtistAvatar";
import { CoverArt } from "@/components/art/CoverArt";
import { Pill } from "@/components/ui";
import { copy, getArtist, type Post } from "@/data";
import { duration, timeAgo } from "@/lib/format";

const t = copy.onTour;

/** One On Tour post: text (~60%) or a 9:16 vertical video still (~40%). */
export function PostCard({ post }: { post: Post }) {
  const artist = getArtist(post.artistId);
  const isVideo = post.kind === "video";

  return (
    <article
      aria-label={`${artist.name}, ${t.postedTo(post.platform, timeAgo(post.postedAt))}`}
      className={`flex h-[15rem] gap-4 rounded-[var(--radius)] border border-line bg-ink-2 p-4 ${isVideo ? "w-[25rem] max-sm:w-[21rem]" : "w-[21rem] max-sm:w-[18rem]"}`}
    >
      {isVideo && (
        <div className="relative aspect-[9/16] h-full shrink-0 overflow-hidden rounded-[8px] border border-line">
          <CoverArt artist={artist} aspect="portrait" variant={post.id} />
          <span className="absolute top-2 left-2 font-mono text-[0.625rem] tracking-[0.06em] text-paper">
            {post.platform}
          </span>
          <span aria-hidden className="absolute inset-0 grid place-items-center">
            <span className="grid size-10 place-items-center rounded-full bg-ink/60 ring-1 ring-paper/40 backdrop-blur-[2px]">
              <svg viewBox="0 0 12 12" className="ml-0.5 size-3.5" fill="var(--paper)">
                <path d="M2 1.2v9.6L10.5 6z" />
              </svg>
            </span>
          </span>
          <span className="absolute bottom-2 left-2 rounded-[3px] bg-ink/70 px-1 font-mono text-[0.6875rem] text-paper tabular-nums">
            <span className="sr-only">{t.clip}, </span>
            {duration(post.durationSec ?? 0)}
          </span>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2.5">
          <ArtistAvatar artist={artist} size={34} />
          <div className="min-w-0">
            <p className="truncate text-[0.9375rem] font-semibold leading-tight">{artist.name}</p>
            <p className="font-mono text-[0.75rem] text-paper-dim">{artist.ticker}</p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[0.625rem] tracking-[0.12em] text-paper uppercase">
            <span aria-hidden className="live-dot !size-1.5" />
            {t.live}
          </span>
        </div>

        <p
          className={`mt-3 flex-1 overflow-hidden text-paper/90 ${isVideo ? "line-clamp-5 text-[0.875rem] leading-snug" : "line-clamp-6 text-[0.9375rem] leading-[1.5]"}`}
        >
          {post.body}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-3">
          <p className="min-w-0 font-mono text-[0.6875rem] leading-tight text-paper-dim">
            {t.postedTo(post.platform, timeAgo(post.postedAt))}
          </p>
          <Pill className="!h-5 shrink-0 !px-2 !text-[0.625rem]">{t.byAgent}</Pill>
        </div>
      </div>
    </article>
  );
}
