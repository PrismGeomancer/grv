import { useId } from "react";
import { coverSpec } from "@/lib/art";
import { cx } from "@/lib/format";
import type { Artist } from "@/data";

export interface CoverArtProps {
  artist: Pick<Artist, "id" | "palette">;
  /** "portrait" = 9:16 video still, "square" = sleeve. */
  aspect?: "portrait" | "square";
  /** Extra seed so one artist can have several stills (e.g. per post). */
  variant?: string;
  className?: string;
}

/** Generative still for sleeves and vertical video thumbnails. Always decorative. */
export function CoverArt({ artist, aspect = "square", variant = "", className }: CoverArtProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const s = coverSpec(artist.id + variant, artist.palette);
  const W = aspect === "portrait" ? 90 : 100;
  const H = aspect === "portrait" ? 160 : 100;
  const px = s.x * W;
  const py = s.y * H;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={cx("h-full w-full", className)}
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id={`cbg-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={s.bg} />
          <stop offset="1" stopColor="#050506" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#cbg-${uid})`} />

      {s.motif === "horizon" && (
        <g>
          <circle cx={px} cy={py} r={W * 0.22} fill={s.fg} opacity="0.85" />
          <rect x="0" y={py + W * 0.08} width={W} height={H} fill={s.bg} />
          {Array.from({ length: s.count }, (_, i) => {
            const y = py + W * 0.1 + Math.pow(i + 1, 1.45) * 2.2;
            return y < H ? (
              <line
                key={i}
                x1="0"
                x2={W}
                y1={y}
                y2={y}
                stroke={s.fg}
                strokeOpacity={0.55 - i * 0.03}
                strokeWidth="0.7"
              />
            ) : null;
          })}
        </g>
      )}
      {s.motif === "arcs" && (
        <g fill="none" stroke={s.fg}>
          {Array.from({ length: s.count }, (_, i) => (
            <circle
              key={i}
              cx={px < W / 2 ? 0 : W}
              cy={H}
              r={12 + i * (H / s.count) * 0.9}
              strokeWidth={1 + (i % 3)}
              strokeOpacity={0.75 - i * 0.05}
            />
          ))}
        </g>
      )}
      {s.motif === "dots" && (
        // Halftone as ONE path: every dot is a sub-path, so it costs a single element.
        <path fill={s.fg} d={halftone(W, H, px, py)} />
      )}
      {s.motif === "bands" && (
        <g transform={`rotate(${s.angle} ${W / 2} ${H / 2})`} fill={s.fg}>
          {Array.from({ length: s.count }, (_, i) => (
            <rect
              key={i}
              x={-W}
              y={py - 30 + i * 9}
              width={W * 3}
              height={2 + (i % 4) * 1.6}
              opacity={0.85 - i * 0.06}
            />
          ))}
        </g>
      )}

      <rect
        width={W}
        height={H}
        filter="url(#groove-grain)"
        opacity="0.4"
        style={{ mixBlendMode: "overlay" }}
      />
    </svg>
  );
}

/** Halftone dots that shrink away from (px, py), as a single path. */
function halftone(W: number, H: number, px: number, py: number): string {
  let d = "";
  for (let y = 4; y < H; y += 8) {
    for (let x = 4; x < W; x += 7.6) {
      const r = Math.max(0, 2.6 - Math.hypot(x - px, y - py) / (W * 0.24));
      if (r <= 0.15) continue;
      const f = (n: number) => Math.round(n * 100) / 100;
      d += `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(r * 2)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-r * 2)} 0`;
    }
  }
  return d;
}
