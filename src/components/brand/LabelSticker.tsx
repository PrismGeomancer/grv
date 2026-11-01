import { useId, type Ref } from "react";
import type { Label } from "@/data";

/** Greedy word wrap for SVG text (no native wrapping in SVG). */
function wrap(text: string, max: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    if (line && (line + " " + word).length > max) {
      lines.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines;
}

const RING_R = 86;
const RING_LEN = 2 * Math.PI * RING_R;

/**
 * A record label sticker: the label's name runs around the edge, the catalog prefix sits
 * above the spindle hole, the ethos below it. Decorative (the same text is on the page).
 */
export function LabelSticker({
  label,
  discRef,
  className,
}: {
  label: Label;
  discRef?: Ref<SVGGElement>;
  className?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [disc, ink] = label.sticker;
  const ethos = wrap(label.ethos, 22);
  const ring = `${label.name} · ${label.prefix} · ${label.name} · ${label.prefix} · `.toUpperCase();

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden
      focusable="false"
      style={{ width: "100%", height: "auto", aspectRatio: "1" }}
    >
      <defs>
        <path
          id={`ring-${uid}`}
          d={`M100 100 m-${RING_R} 0 a${RING_R} ${RING_R} 0 1 1 ${RING_R * 2} 0 a${RING_R} ${RING_R} 0 1 1 -${RING_R * 2} 0`}
        />
        <radialGradient id={`sheen-${uid}`} cx="70" cy="60" r="140" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g ref={discRef}>
        <circle cx="100" cy="100" r="99" fill={disc} />
        <circle
          cx="100"
          cy="100"
          r="76"
          fill="none"
          stroke={ink}
          strokeOpacity="0.45"
          strokeWidth="0.8"
        />
        <circle
          cx="100"
          cy="100"
          r="96"
          fill="none"
          stroke={ink}
          strokeOpacity="0.25"
          strokeWidth="0.6"
        />
        <text
          fill={ink}
          fontFamily="var(--font-display)"
          fontWeight="700"
          fontSize="10.5"
          style={{ fontStretch: "75%" }}
        >
          <textPath href={`#ring-${uid}`} textLength={RING_LEN - 4} lengthAdjust="spacing">
            {ring}
          </textPath>
        </text>
        <text
          x="100"
          y="84"
          textAnchor="middle"
          fill={ink}
          fontFamily="var(--font-display)"
          fontWeight="900"
          fontSize="30"
          style={{ fontStretch: "125%" }}
        >
          {label.prefix}
        </text>
        <circle cx="100" cy="100" r="4.2" fill="var(--ink)" />
        {ethos.map((l, i) => (
          <text
            key={i}
            x="100"
            y={121 + i * 10}
            textAnchor="middle"
            fill={ink}
            fillOpacity="0.85"
            fontFamily="var(--font-inter)"
            fontSize="8"
          >
            {l}
          </text>
        ))}
      </g>
      <circle cx="100" cy="100" r="99" fill={`url(#sheen-${uid})`} />
    </svg>
  );
}
