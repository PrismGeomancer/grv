import { useId } from "react";
import { portraitSpec } from "@/lib/art";
import { cx } from "@/lib/format";
import type { Artist } from "@/data";

export interface ArtistAvatarProps {
  artist: Pick<Artist, "id" | "name" | "palette">;
  size?: number | string;
  shape?: "circle" | "square";
  /** Decorative by default (the name is usually printed next to it). */
  labelled?: boolean;
  className?: string;
}

/** Duotone abstract portrait, generated from the artist's id and palette. */
export function ArtistAvatar({
  artist,
  size = 48,
  shape = "circle",
  labelled = false,
  className,
}: ArtistAvatarProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const s = portraitSpec(artist.id, artist.palette);
  const { head, eyes } = s;
  const width = typeof size === "number" ? `${size}px` : size;
  const figureFill = s.scan ? `url(#scan-${uid})` : s.fg;

  return (
    <svg
      viewBox="0 0 100 100"
      className={cx(shape === "circle" ? "rounded-full" : "rounded-[4px]", "shrink-0", className)}
      style={{ width, height: "auto", aspectRatio: "1" }}
      {...(labelled
        ? { role: "img", "aria-label": `${artist.name}, generated portrait` }
        : { "aria-hidden": true })}
      focusable="false"
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={s.bg} />
          <stop offset="1" stopColor="#050506" />
        </linearGradient>
        {s.backdrop === "grid" && (
          <pattern id={`dots-${uid}`} width="17" height="11" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="6" r="1.1" fill={s.fg} />
          </pattern>
        )}
        {s.scan > 0 && (
          <pattern id={`scan-${uid}`} width="100" height={s.scan} patternUnits="userSpaceOnUse">
            <rect width="100" height={s.scan * 0.62} fill={s.fg} />
          </pattern>
        )}
      </defs>

      <rect width="100" height="100" fill={`url(#bg-${uid})`} />

      <g fill="none" stroke={s.fg} opacity="0.32">
        {s.backdrop === "rings" &&
          [0.35, 0.55, 0.75, 0.95].map((k) => (
            <circle
              key={k}
              cx={s.backdropX}
              cy={s.backdropY}
              r={s.backdropR * k * 1.4}
              strokeWidth="1.2"
            />
          ))}
        {s.backdrop === "sun" && (
          <circle
            cx={s.backdropX}
            cy={s.backdropY}
            r={s.backdropR}
            fill={s.fg}
            stroke="none"
            opacity="0.6"
          />
        )}
        {s.backdrop === "stripes" &&
          Array.from({ length: 9 }, (_, i) => (
            <line
              key={i}
              x1="0"
              x2="100"
              y1={8 + i * 7}
              y2={8 + i * 7}
              strokeWidth={0.6 + (i % 3) * 0.5}
            />
          ))}
        {s.backdrop === "grid" && (
          <rect width="100" height="100" fill={`url(#dots-${uid})`} stroke="none" />
        )}
      </g>

      <g fill={figureFill}>
        <path d={s.shoulders} />
        <rect x={head.cx - 6} y={head.cy + head.ry - 6} width="12" height="16" />
        <ellipse
          cx={head.cx}
          cy={head.cy}
          rx={head.rx}
          ry={head.ry}
          transform={`rotate(${head.tilt} ${head.cx} ${head.cy})`}
        />
      </g>

      {/* The eye line, cut out in the background colour. */}
      <g transform={`rotate(${head.tilt} ${head.cx} ${head.cy})`} fill={s.bg} stroke={s.bg}>
        {eyes.style === "open" && (
          <>
            <circle cx={head.cx - eyes.spread} cy={eyes.y} r={eyes.size} stroke="none" />
            <circle cx={head.cx + eyes.spread} cy={eyes.y} r={eyes.size} stroke="none" />
          </>
        )}
        {eyes.style === "lidded" &&
          [-1, 1].map((d) => (
            <path
              key={d}
              d={`M${head.cx + d * eyes.spread - eyes.size * 1.5} ${eyes.y} a${eyes.size * 1.5} ${eyes.size} 0 0 0 ${eyes.size * 3} 0 Z`}
              stroke="none"
            />
          ))}
        {eyes.style === "bar" && (
          <rect
            x={head.cx - eyes.spread - 6}
            y={eyes.y - 2}
            width={eyes.spread * 2 + 12}
            height="4"
            stroke="none"
          />
        )}
      </g>

      <rect
        width="100"
        height="100"
        filter="url(#groove-grain)"
        opacity="0.35"
        style={{ mixBlendMode: "overlay" }}
      />
    </svg>
  );
}
