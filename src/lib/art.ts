import { r2, seeded } from "./random";

/*
 * Procedural duotone artwork, seeded by artist id + palette. No photos, no third-party
 * images. Portraits are abstract: a head, shoulders, a backdrop motif and an eye line
 * that is either open, heavy-lidded or barred: everyone here is up late.
 */

export type Backdrop = "rings" | "sun" | "stripes" | "grid";
export type EyeStyle = "open" | "lidded" | "bar";

export interface PortraitSpec {
  bg: string;
  fg: string;
  backdrop: Backdrop;
  backdropX: number;
  backdropY: number;
  backdropR: number;
  head: { cx: number; cy: number; rx: number; ry: number; tilt: number };
  shoulders: string; // path d
  eyes: { style: EyeStyle; y: number; spread: number; size: number };
  scan: number; // scanline spacing (0 = solid)
  grain: number; // turbulence seed
}

export function portraitSpec(id: string, palette: [string, string]): PortraitSpec {
  const rng = seeded(`${id}:portrait`);
  const head = {
    cx: r2(rng.range(44, 56)),
    cy: r2(rng.range(40, 47)),
    rx: r2(rng.range(15, 19)),
    ry: r2(rng.range(19, 23)),
    tilt: r2(rng.range(-9, 9)),
  };
  const sw = rng.range(34, 44); // shoulder half-width
  const top = head.cy + head.ry + rng.range(10, 15);
  const shoulders = `M${r2(head.cx - sw - 12)} 104 C${r2(head.cx - sw)} ${r2(top + 4)} ${r2(head.cx - 12)} ${r2(top - 4)} ${r2(head.cx)} ${r2(top - 4)} C${r2(head.cx + 12)} ${r2(top - 4)} ${r2(head.cx + sw)} ${r2(top + 4)} ${r2(head.cx + sw + 12)} 104 Z`;
  return {
    bg: palette[0],
    fg: palette[1],
    backdrop: rng.pick(["rings", "sun", "stripes", "grid"] as const),
    backdropX: r2(rng.range(20, 80)),
    backdropY: r2(rng.range(15, 45)),
    backdropR: r2(rng.range(22, 38)),
    head,
    shoulders,
    eyes: {
      style: rng.pick(["open", "lidded", "lidded", "bar"] as const),
      y: r2(head.cy - rng.range(0, 3)),
      spread: r2(rng.range(5.5, 7.5)),
      size: r2(rng.range(1.6, 2.4)),
    },
    scan: rng.chance(0.6) ? r2(rng.range(1.6, 2.6)) : 0,
    grain: rng.int(1, 999),
  };
}

export type CoverMotif = "horizon" | "arcs" | "dots" | "bands";

export interface CoverSpec {
  bg: string;
  fg: string;
  motif: CoverMotif;
  x: number;
  y: number;
  count: number;
  angle: number;
  seed: number;
}

/** Generative stills for record covers and 9:16 video thumbnails. */
export function coverSpec(id: string, palette: [string, string]): CoverSpec {
  const rng = seeded(`${id}:cover`);
  return {
    bg: palette[0],
    fg: palette[1],
    motif: rng.pick(["horizon", "arcs", "dots", "bands"] as const),
    x: r2(rng.range(0.2, 0.8)),
    y: r2(rng.range(0.25, 0.7)),
    count: rng.int(5, 11),
    angle: r2(rng.range(-25, 25)),
    seed: rng.int(1, 999),
  };
}
