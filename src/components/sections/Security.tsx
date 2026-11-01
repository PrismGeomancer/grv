"use client";

import { useRef } from "react";
import { SectionHeading } from "@/components/ui";
import { copy } from "@/data";
import { seeded } from "@/lib/random";
import { gsap, useGSAPWhenNear } from "@/motion";

const t = copy.security;

/** Irregular wax blob around (cx, cy): seeded, so it's identical on server and client. */
function waxPath(cx: number, cy: number, r: number) {
  const rng = seeded("groove-wax");
  const pts = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    const rr = r * (0.9 + rng.next() * 0.18);
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr] as const;
  });
  const mid = (a: readonly [number, number], b: readonly [number, number]) =>
    [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] as const;
  const f = (n: number) => n.toFixed(1);
  let d = "";
  pts.forEach((p, i) => {
    const next = pts[(i + 1) % pts.length]!;
    const m = mid(p, next);
    d +=
      i === 0
        ? `M${f(mid(pts[pts.length - 1]!, p)[0])} ${f(mid(pts[pts.length - 1]!, p)[1])} `
        : "";
    d += `Q${f(p[0])} ${f(p[1])} ${f(m[0])} ${f(m[1])} `;
  });
  return d + "Z";
}

const SEAL = { x: 160, y: 126 };
const WAX = waxPath(SEAL.x, SEAL.y, 31);

/**
 * §8.8 Security. A sealed envelope; the red wax seal presses in as you scroll.
 * Final (sealed) state without JS / with reduced motion.
 */
export function Security() {
  const art = useRef<SVGSVGElement>(null);

  useGSAPWhenNear(art, () => {
    const q = gsap.utils.selector(art);
    gsap
      .timeline({
        scrollTrigger: { trigger: art.current, start: "top 85%", end: "center 55%", scrub: 0.6 },
      })
      .fromTo(
        q("[data-seal]"),
        { scale: 1.45, y: -46, rotation: -14, svgOrigin: `${SEAL.x} ${SEAL.y}` },
        {
          scale: 1,
          y: 0,
          rotation: 0,
          svgOrigin: `${SEAL.x} ${SEAL.y}`,
          ease: "power2.in",
          duration: 1,
        },
      )
      .fromTo(
        q("[data-seal-shadow]"),
        { scale: 1.7, autoAlpha: 0.15, svgOrigin: `${SEAL.x} ${SEAL.y + 6}` },
        { scale: 1, autoAlpha: 0.5, ease: "power2.in", duration: 1 },
        0,
      )
      // The press: a short squash as the wax meets the paper.
      .to(q("[data-seal]"), {
        scaleX: 1.06,
        scaleY: 0.95,
        duration: 0.12,
        svgOrigin: `${SEAL.x} ${SEAL.y}`,
      })
      .to(q("[data-seal]"), {
        scaleX: 1,
        scaleY: 1,
        duration: 0.18,
        svgOrigin: `${SEAL.x} ${SEAL.y}`,
      });
  }, []);

  return (
    <section
      id="security"
      aria-labelledby="security-title"
      className="relative border-t border-line py-24 md:py-36"
    >
      <div className="container-groove grid items-center gap-14 md:grid-cols-2 md:gap-10">
        <div>
          <SectionHeading id="security-title" title={t.title} />
          <p className="mt-6 max-w-[46ch] text-lead text-paper-dim">{t.body}</p>
          <a
            href="#"
            className="group mt-8 inline-flex items-center gap-2 font-mono text-[0.8125rem] tracking-[0.1em] text-paper uppercase underline decoration-onair decoration-1 underline-offset-[6px] hover:decoration-2"
          >
            {t.link}{" "}
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>

        <svg
          ref={art}
          viewBox="0 0 320 230"
          className="mx-auto h-auto w-full max-w-[30rem]"
          role="img"
          aria-label={t.sealLabel}
        >
          <ellipse cx="160" cy="214" rx="140" ry="9" fill="#000" opacity="0.5" />
          {/* Envelope body and back folds */}
          <rect x="10" y="30" width="300" height="172" rx="6" fill="var(--paper)" />
          <path
            d="M10 202 L160 120 L310 202"
            fill="none"
            stroke="var(--ink)"
            strokeOpacity="0.14"
            strokeWidth="1.2"
          />
          {/* Flap */}
          <path
            d="M10 36 Q10 30 16 30 L304 30 Q310 30 310 36 L166 124 Q160 128 154 124 Z"
            fill="#E2DBCD"
            stroke="var(--ink)"
            strokeOpacity="0.12"
          />
          {/* Catalog stamp, top right */}
          <g transform="translate(252 44)">
            <rect
              width="44"
              height="22"
              rx="2"
              fill="none"
              stroke="var(--ink)"
              strokeOpacity="0.35"
              strokeDasharray="2 2"
            />
            <text
              x="22"
              y="14.5"
              textAnchor="middle"
              fill="var(--ink)"
              fillOpacity="0.55"
              fontFamily="var(--font-mono)"
              fontSize="7"
            >
              GRV-005
            </text>
          </g>
          {/* Wax seal */}
          <ellipse
            data-seal-shadow
            cx={SEAL.x}
            cy={SEAL.y + 6}
            rx="30"
            ry="9"
            fill="#000"
            opacity="0.5"
          />
          <g data-seal>
            <path d={WAX} fill="var(--onair)" />
            <circle cx={SEAL.x} cy={SEAL.y} r="21" fill="none" stroke="#B3180F" strokeWidth="2" />
            {/* Embossed mark: the eye, simplified */}
            <path
              d={`M${SEAL.x - 14} ${SEAL.y} Q${SEAL.x} ${SEAL.y - 13} ${SEAL.x + 14} ${SEAL.y} Q${SEAL.x} ${SEAL.y + 11} ${SEAL.x - 14} ${SEAL.y} Z`}
              fill="none"
              stroke="#B3180F"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx={SEAL.x} cy={SEAL.y} r="4.5" fill="#B3180F" />
            <path
              d={`M${SEAL.x - 20} ${SEAL.y - 16} Q${SEAL.x - 6} ${SEAL.y - 27} ${SEAL.x + 10} ${SEAL.y - 24}`}
              fill="none"
              stroke="#fff"
              strokeOpacity="0.35"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
    </section>
  );
}
