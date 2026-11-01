"use client";

import { useRef } from "react";
import { SectionHeading } from "@/components/ui";
import { copy, stats } from "@/data";
import { gsap, needleDrop, useGSAPWhenNear } from "@/motion";

const t = copy.runLabel;

/** An original, hand-drawn-style signature (not anyone's real one). */
const SIGNATURE =
  "M8 54 C 18 22, 38 16, 36 42 S 26 72, 48 54 S 66 22, 76 40 S 82 64, 96 50 C 106 40, 110 30, 116 42 S 122 62, 134 48 S 148 28, 158 44 C 166 56, 174 52, 184 40 C 194 28, 204 34, 200 46 S 214 60, 252 32";
const FLOURISH = "M56 68 C 116 61, 178 63, 246 57";

/**
 * §8.7 Run the label. A contract sheet on warm paper (the one light surface on the page).
 * Clauses tick off as they scroll past; at the end a signature draws itself and the
 * SIGNED stamp lands. Renders in its final, signed state without JS / with reduced motion.
 */
export function RunTheLabel() {
  const sheet = useRef<HTMLDivElement>(null);

  useGSAPWhenNear(sheet, () => {
    const q = gsap.utils.selector(sheet);

    q("[data-clause]").forEach((clause) => {
      const tick = clause.querySelector("[data-tick]");
      const text = clause.querySelector("[data-clause-text]");
      gsap.set(tick, { drawSVG: "0%" });
      gsap.set(text, { autoAlpha: 0.45 });
      gsap
        .timeline({
          scrollTrigger: {
            trigger: clause,
            start: "top 68%",
            toggleActions: "play none none reverse",
          },
        })
        .to(tick, { drawSVG: "100%", duration: 0.35, ease: "power2.out" })
        .to(text, { autoAlpha: 1, duration: 0.4 }, 0);
    });

    gsap.set(q("[data-sign]"), { drawSVG: "0%" });
    const sign = gsap
      .timeline({
        scrollTrigger: { trigger: q("[data-signature]")[0], start: "top 78%", once: true },
      })
      .to(q("[data-sign]"), {
        drawSVG: "100%",
        duration: 1.3,
        ease: "power1.inOut",
        stagger: 0.9,
      });
    sign.add(needleDrop(q("[data-stamp]")), "-=0.2");
  }, []);

  return (
    <section
      id="run-the-label"
      aria-labelledby="run-title"
      className="relative border-t border-line py-24 md:py-36"
    >
      <div className="container-groove">
        <SectionHeading
          id="run-title"
          title={t.title}
          aside={
            <p className="font-mono text-[0.8125rem] tracking-[0.08em] text-paper-dim uppercase">
              <span aria-hidden className="live-dot mr-2.5 !size-1.5 align-middle" />
              {t.statLine(stats.artistsSigned, stats.onTour)}
            </p>
          }
        />

        <div
          ref={sheet}
          className="on-paper relative mx-auto mt-14 max-w-3xl rotate-[-0.6deg] rounded-[6px] bg-paper px-6 py-10 text-ink shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] sm:px-12 md:mt-20 md:py-14"
        >
          {/* Paper: a faint fold and edge wear. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,transparent_49.6%,rgb(0_0_0/0.05)_50%,transparent_50.6%),radial-gradient(120%_80%_at_50%_0%,transparent_60%,rgb(0_0_0/0.06))]"
          />

          <header className="relative flex flex-wrap items-baseline justify-between gap-3 border-b border-ink/20 pb-5">
            <p className="font-condensed text-[1.25rem] tracking-[0.18em] uppercase">
              {t.sheetHead}
            </p>
            <p className="font-mono text-[0.75rem] text-sheet-dim">{t.sheetMeta}</p>
          </header>

          <ol className="relative mt-4">
            {t.clauses.map((c, i) => (
              <li
                key={c.name}
                data-clause
                className="flex gap-4 border-b border-ink/10 py-6 sm:gap-6"
              >
                <span className="font-mono text-[0.8125rem] text-sheet-dim">§{i + 1}</span>
                <div data-clause-text className="flex-1">
                  <p className="font-expanded text-[1.25rem] leading-tight">{c.name}</p>
                  <p className="mt-1.5 text-sheet-dim">{c.body}</p>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  className="mt-0.5 size-6 shrink-0"
                  role="img"
                  aria-label={t.done}
                >
                  <rect
                    x="1.5"
                    y="1.5"
                    width="21"
                    height="21"
                    rx="3"
                    fill="none"
                    stroke="var(--ink)"
                    strokeOpacity="0.5"
                  />
                  <path
                    data-tick
                    d="M6 12.5 l4 4 L18.5 7"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </li>
            ))}
          </ol>

          <div
            data-signature
            className="relative mt-10 flex flex-wrap items-end justify-between gap-8"
          >
            <div className="w-full max-w-[18rem]">
              <svg viewBox="0 0 260 80" className="h-auto w-full" aria-hidden>
                <path
                  data-sign
                  d={SIGNATURE}
                  fill="none"
                  stroke="var(--ink)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  data-sign
                  d={FLOURISH}
                  fill="none"
                  stroke="var(--ink)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <p className="mt-1 border-t border-ink/40 pt-2 font-mono text-[0.75rem] text-sheet-dim">
                {t.signedBy}
              </p>
            </div>
            <p
              data-stamp
              className="font-condensed mr-2 mb-2 rotate-[-9deg] rounded-[6px] border-[3px] border-stamp px-4 py-1.5 text-[2rem] leading-none tracking-[0.22em] text-stamp uppercase opacity-90 mix-blend-multiply"
            >
              {t.stamp}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
