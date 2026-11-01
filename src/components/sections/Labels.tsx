"use client";

import type { Flip as FlipPlugin } from "gsap/Flip";
import { useLayoutEffect, useRef, useState } from "react";
import { ArtistAvatar } from "@/components/art/ArtistAvatar";
import { LabelSticker } from "@/components/brand";
import { Pill, SectionHeading } from "@/components/ui";
import { copy, getArtist, labels, labelStats, type Label } from "@/data";
import { cx, monthYear, usdCompact } from "@/lib/format";
import {
  loadFlip,
  useGSAPWhenNear,
  gsap,
  ScrollTrigger,
  spin,
  useGSAP,
  useReducedMotion,
  isReducedMotion,
} from "@/motion";

const t = copy.labels;

/**
 * §8.4 Labels on Groove. Each label is a sticker; clicking one expands it in place (Flip)
 * into a mini label page. Esc or the close button folds it back and returns focus.
 */
export function Labels() {
  const list = useRef<HTMLUListElement>(null);
  const flipState = useRef<ReturnType<typeof FlipPlugin.getState> | null>(null);
  // Flip is loaded on demand as the section approaches; a click before it arrives just
  // expands without the animation.
  const flip = useRef<typeof FlipPlugin | null>(null);
  useGSAPWhenNear(list, () => {
    void loadFlip().then((F) => (flip.current = F));
  });
  const [openId, setOpenId] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const toggle = (id: string | null) => {
    if (!reduced && !isReducedMotion() && list.current && flip.current)
      flipState.current = flip.current!.getState(list.current.querySelectorAll("[data-flip-id]"));
    setOpenId(id);
  };

  const close = () => {
    const id = openId;
    toggle(null);
    if (id)
      requestAnimationFrame(() =>
        document.getElementById(`label-btn-${id}`)?.focus({ preventScroll: true }),
      );
  };

  // Play the Flip after React has committed the new layout.
  useLayoutEffect(() => {
    const state = flipState.current;
    flipState.current = null;
    if (!state) return; // first mount: nothing moved, no refresh needed
    flip.current?.from(state, {
      duration: 0.75,
      ease: "power3.inOut",
      nested: true,
      onComplete: () => ScrollTrigger.refresh(),
    });
    const panel = openId ? document.getElementById(`label-panel-${openId}`) : null;
    if (panel)
      gsap.fromTo(
        panel,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.35, ease: "power3.out" },
      );
  }, [openId]);

  return (
    <section
      id="labels"
      aria-labelledby="labels-title"
      className="relative scroll-mt-16 border-t border-line py-24 md:py-36"
    >
      <div className="container-groove">
        <SectionHeading
          id="labels-title"
          title={t.title}
          sub={t.sub}
          stamp={t.stamp}
          eyebrow={<p className="mono-label text-paper-dim">{t.disclaimer}</p>}
        />
        <ul
          ref={list}
          onKeyDown={(e) => {
            if (e.key === "Escape" && openId) {
              e.stopPropagation();
              close();
            }
          }}
          className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 md:gap-x-8 lg:grid-cols-4"
        >
          {labels.map((label) => (
            <LabelItem
              key={label.id}
              label={label}
              open={openId === label.id}
              onToggle={() => (openId === label.id ? close() : toggle(label.id))}
              onClose={close}
              reduced={reduced}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function LabelItem({
  label,
  open,
  onToggle,
  onClose,
  reduced,
}: {
  label: Label;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  reduced: boolean;
}) {
  const disc = useRef<SVGGElement>(null);
  const ctrl = useRef<ReturnType<typeof spin> | null>(null);
  const roster = label.artistIds.map(getArtist);
  const s = labelStats(label.id);

  // Hovering turns the sticker slowly, then lets it coast to a stop. The tween is created
  // on first hover (an SVG transform measures its element; no need to pay that on load).
  const { contextSafe } = useGSAP(
    () => {
      ctrl.current = null;
    },
    { dependencies: [reduced], revertOnUpdate: true },
  );
  const scratch = contextSafe(() => {
    if (reduced || isReducedMotion()) return;
    ctrl.current ??= spin(disc.current, { period: 26, restSpeed: 0, scratchSpeed: 1 });
    ctrl.current.scratch();
  });

  return (
    <li
      data-flip-id={label.id}
      className={cx("relative", open && "col-span-full")}
      onPointerEnter={scratch}
      onPointerLeave={() => ctrl.current?.coast()}
    >
      <div
        className={cx(
          open
            ? "grid items-start gap-8 rounded-[calc(var(--radius)*1.5)] border border-line-strong bg-ink-2 p-5 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-12 md:p-10"
            : "",
        )}
      >
        <div
          data-flip-id={`${label.id}-disc`}
          className={cx("mx-auto w-full", open ? "max-w-[18rem]" : "max-w-[16rem]")}
        >
          <LabelSticker
            label={label}
            discRef={disc}
            className="drop-shadow-[0_18px_30px_rgb(0_0_0/0.55)]"
          />
        </div>

        <div className={cx(!open && "mt-5")}>
          <h3
            className={cx(
              "font-expanded leading-tight tracking-[-0.01em]",
              open ? "text-h3" : "text-[1.0625rem] md:text-[1.25rem]",
            )}
          >
            <button
              id={`label-btn-${label.id}`}
              type="button"
              aria-expanded={open}
              aria-controls={`label-panel-${label.id}`}
              onClick={onToggle}
              className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-[var(--radius)] focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-paper"
            >
              {label.name}
            </button>
          </h3>
          <p className="mt-1.5 font-mono text-[0.75rem] text-paper-dim">
            {label.prefix} · {label.handle}
          </p>
          {!open && (
            <p className="mt-0.5 font-mono text-[0.75rem] text-paper-dim">
              {t.founded} {monthYear(label.foundedAt)}
            </p>
          )}
          {!open && <p className="sr-only">{label.ethos}</p>}
          {!open && (
            <div className="mt-3 flex items-center">
              {roster.map((a, i) => (
                <ArtistAvatar
                  key={a.id}
                  artist={a}
                  size={28}
                  className={cx("ring-2 ring-ink", i > 0 && "-ml-2")}
                />
              ))}
              <span className="ml-2.5 font-mono text-[0.6875rem] text-paper-dim">
                {roster.length}
              </span>
            </div>
          )}

          {open && (
            <div
              id={`label-panel-${label.id}`}
              role="region"
              aria-labelledby={`label-btn-${label.id}`}
              className="relative z-10"
            >
              <p className="mt-5 max-w-[40ch] text-lead text-paper/90">{label.ethos}</p>
              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 font-mono sm:grid-cols-4">
                {[
                  [t.founded, monthYear(label.foundedAt)],
                  [t.signed, String(s.signed)],
                  [t.onTour, String(s.onTour)],
                  [t.royalties, usdCompact(s.royaltiesPaid)],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[0.625rem] tracking-[0.1em] text-paper-dim uppercase">
                      {k}
                    </dt>
                    <dd className="mt-1 text-lg tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
              <h4 className="mono-label mt-8 text-paper-dim">{t.roster}</h4>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {roster.map((a) => (
                  <li key={a.id} className="flex items-center gap-3 py-3">
                    <ArtistAvatar artist={a} size={40} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{a.name}</p>
                      <p className="truncate text-[0.8125rem] text-paper-dim">{a.genre}</p>
                    </div>
                    <span className="hidden font-mono text-[0.75rem] text-paper-dim sm:inline">
                      {a.catalogNo}
                    </span>
                    <span className="font-mono text-[0.8125rem]">{a.ticker}</span>
                    <Pill
                      tone={a.status === "on-tour" ? "live" : "off"}
                      className="hidden sm:inline-flex"
                    >
                      {a.status === "on-tour" ? copy.roster.onTour : copy.roster.offTour}
                    </Pill>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 font-mono text-[0.6875rem] tracking-[0.1em] text-paper-dim uppercase hover:text-paper"
              >
                {t.close} <span aria-hidden>· Esc</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
