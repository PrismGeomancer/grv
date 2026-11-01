/*
 * Groove eye geometry, shared by the React component, the favicon and the OG image.
 * viewBox 0 0 240 160, centred on (120, 80). Lids are cubic curves between the two
 * corners; the upper lid's control height is interpolated by `open` (0 = slit, 1 = open,
 * >1 = wide, used for the snap-back overshoot).
 */

export const EYE = {
  w: 240,
  h: 160,
  cx: 120,
  cy: 80,
  left: 10,
  right: 230,
  ctrlInset: 64, // control points sit this far in from each corner
  lowerC: 147,
  upperOpenC: 2,
  upperClosedC: 143,
  irisR: 57,
  stickerR: 17,
  lockedR: 21,
} as const;

/** A dark "track gap" groove reads the rotation; the rest are faint light lines. */
export type Groove = { r: number; o: number; w: number; gap?: boolean };

/** Grooves between the locked groove and the rim. Fixed, so SSR and client match. */
export const GROOVES: Groove[] = Array.from({ length: 14 }, (_, i) => {
  const r = 25 + i * 2.35;
  // A wider, darker "track gap" every few grooves so the rotation reads.
  const gap = i === 4 || i === 9;
  return {
    r: Math.round(r * 100) / 100,
    o: gap ? 0.7 : 0.1 + ((i * 7) % 5) * 0.03,
    w: gap ? 1.6 : 0.55,
    gap,
  };
});

/** Small-size variant: three bold grooves. */
export const SIMPLE_GROOVES: Groove[] = [
  { r: 33, o: 0.35, w: 4 },
  { r: 46, o: 0.25, w: 4 },
];

function upperC(open: number) {
  return EYE.upperClosedC + (EYE.upperOpenC - EYE.upperClosedC) * open;
}

const f = (n: number) => Math.round(n * 100) / 100;

export function upperLidPath(open: number): string {
  const c = f(upperC(open));
  const { left, right, cy, ctrlInset } = EYE;
  return `M${left} ${cy} C${left + ctrlInset} ${c} ${right - ctrlInset} ${c} ${right} ${cy}`;
}

export function lowerLidPath(): string {
  const { left, right, cy, ctrlInset, lowerC } = EYE;
  return `M${left} ${cy} C${left + ctrlInset} ${lowerC} ${right - ctrlInset} ${lowerC} ${right} ${cy}`;
}

/** Closed almond used as the iris clip. */
export function eyeClipPath(open: number): string {
  const c = f(upperC(open));
  const { left, right, cy, ctrlInset, lowerC } = EYE;
  return `M${left} ${cy} C${left + ctrlInset} ${c} ${right - ctrlInset} ${c} ${right} ${cy} C${right - ctrlInset} ${lowerC} ${left + ctrlInset} ${lowerC} ${left} ${cy} Z`;
}

/** Vinyl sheen: two opposing soft wedges. They stay still while the record turns. */
export function sheenWedge(angleDeg: number, spreadDeg: number, r: number): string {
  const a0 = ((angleDeg - spreadDeg) * Math.PI) / 180;
  const a1 = ((angleDeg + spreadDeg) * Math.PI) / 180;
  const { cx, cy } = EYE;
  return `M${cx} ${cy} L${f(cx + r * Math.cos(a0))} ${f(cy + r * Math.sin(a0))} A${r} ${r} 0 0 1 ${f(cx + r * Math.cos(a1))} ${f(cy + r * Math.sin(a1))} Z`;
}

/**
 * Static SVG markup of the open eye, for favicons and the OG image (no CSS variables,
 * no motion). `simple` drops the fine grooves so it survives 16–32px.
 */
export function eyeSvgMarkup({
  simple = false,
  bg,
}: { simple?: boolean; bg?: string } = {}): string {
  const { cx, cy, irisR, stickerR, lockedR } = EYE;
  const grooves = (simple ? [30, 40, 50] : GROOVES.map((g) => g.r))
    .map(
      (r) =>
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#EDE8DD" stroke-opacity="${simple ? 0.3 : 0.16}" stroke-width="${simple ? 2.4 : 0.6}"/>`,
    )
    .join("");
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${EYE.w} ${EYE.h}">`,
    bg
      ? `<rect x="-${EYE.w}" y="-${EYE.h}" width="${EYE.w * 3}" height="${EYE.h * 3}" fill="${bg}"/>`
      : "",
    `<defs><clipPath id="c"><path d="${eyeClipPath(1)}"/></clipPath></defs>`,
    `<g clip-path="url(#c)">`,
    `<rect width="${EYE.w}" height="${EYE.h}" fill="#0E0E12"/>`,
    `<circle cx="${cx}" cy="${cy}" r="${irisR}" fill="#0A0A0D"/>`,
    grooves,
    `<circle cx="${cx}" cy="${cy}" r="${lockedR}" fill="none" stroke="#FF3B2F" stroke-width="${simple ? 6 : 2.4}"/>`,
    `<circle cx="${cx}" cy="${cy}" r="${stickerR - (simple ? 1 : 0)}" fill="#16161C"/>`,
    `<ellipse cx="${cx - 17}" cy="${cy - 19}" rx="${simple ? 8 : 5.5}" ry="${simple ? 5.5 : 3.6}" fill="#EDE8DD" fill-opacity="0.85" transform="rotate(-30 ${cx - 17} ${cy - 19})"/>`,
    `</g>`,
    `<path d="${lowerLidPath()}" fill="none" stroke="#EDE8DD" stroke-width="${simple ? 9 : 2.6}" stroke-linecap="round"/>`,
    `<path d="${upperLidPath(1)}" fill="none" stroke="#EDE8DD" stroke-width="${simple ? 13 : 5}" stroke-linecap="round"/>`,
    `</svg>`,
  ].join("");
}
