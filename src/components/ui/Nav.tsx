"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Logo } from "@/components/brand";
import { setScrollLocked, useLenis } from "@/components/providers/SmoothScroll";
import { copy } from "@/data/copy";
import { SOCIAL } from "@/data/social";
import { gsap, ScrollTrigger, useGSAP, useReducedMotion, isReducedMotion } from "@/motion";
import { Button } from "./Button";
import { useWaitlist } from "./WaitlistModal";

const n = copy.nav;

/**
 * Transparent over the hero, a solid --ink bar once scrolled. Hides on the way down,
 * returns on the way up (and whenever it holds focus). Below lg: a full-screen drawer.
 */
export function Nav() {
  const header = useRef<HTMLElement>(null);
  const drawer = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const openWaitlist = useWaitlist();
  const lenis = useLenis();
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = header.current!;
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          el.dataset.scrolled = String(y > 24);
          el.dataset.hidden = String(!isReducedMotion() && self.direction === 1 && y > 240);
        },
      });
      return () => st.kill();
    },
    { dependencies: [reduced], revertOnUpdate: true },
  );

  const showDrawer = () => {
    drawer.current?.showModal();
    setOpen(true);
    setScrollLocked(lenis, true);
    if (!reduced) {
      gsap.fromTo(
        drawer.current!.querySelectorAll("[data-drawer-item]"),
        { y: 28, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.06, ease: "power3.out" },
      );
    }
  };

  const onDrawerClosed = () => {
    setOpen(false);
    setScrollLocked(lenis, false);
  };

  /** Close the drawer first, then scroll, so the scroll lock is already released. */
  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    drawer.current?.close();
    if (href === "#") return;
    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;
      if (lenis) lenis.scrollTo(target);
      else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    });
  };

  const linkClass =
    "relative font-mono text-[0.75rem] tracking-[0.1em] text-paper-dim uppercase transition-colors hover:text-paper " +
    "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-onair after:transition-transform after:duration-300 hover:after:scale-x-100";

  return (
    <>
      <header
        ref={header}
        data-scrolled="false"
        data-hidden="false"
        className="fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[transform,background-color,border-color] duration-500 ease-out focus-within:!translate-y-0 data-[hidden=true]:-translate-y-full data-[scrolled=true]:border-line data-[scrolled=true]:bg-ink"
      >
        <div className="container-groove flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
          <Link href="/" aria-label="Groove, home" className="rounded-md">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {n.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={linkClass}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={SOCIAL.x.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={SOCIAL.x.a11y}
              className="inline-flex h-11 items-center gap-1 rounded-full px-3 font-mono text-[0.8125rem] text-paper-dim transition-colors hover:text-paper"
            >
              {SOCIAL.x.label}
              <span aria-hidden className="text-[0.75em]">
                ↗
              </span>
            </a>
            <span className="hidden sm:block">
              <Button variant="secondary" onClick={openWaitlist}>
                {n.connect}
              </Button>
            </span>
            <button
              type="button"
              onClick={showDrawer}
              aria-expanded={open}
              aria-controls="nav-drawer"
              className="grid size-11 place-items-center rounded-full border border-line-strong lg:hidden"
            >
              <span className="sr-only">{n.menu}</span>
              <svg
                aria-hidden
                viewBox="0 0 20 20"
                className="size-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M3 7h14M3 13h14" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <dialog
        ref={drawer}
        id="nav-drawer"
        aria-label={n.menu}
        onClose={onDrawerClosed}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink p-0 text-paper backdrop:bg-ink"
        data-lenis-prevent
      >
        <div
          className="bg-grooves pointer-events-none absolute inset-0 [--groove-x:100%] [--groove-y:100%]"
          aria-hidden
        />
        <div className="container-groove relative flex h-full flex-col">
          <div className="flex h-16 items-center justify-between md:h-[4.5rem]">
            <Logo />
            <button
              type="button"
              onClick={() => drawer.current?.close()}
              className="grid size-11 place-items-center rounded-full border border-line-strong"
            >
              <span className="sr-only">{n.close}</span>
              <svg
                aria-hidden
                viewBox="0 0 12 12"
                className="size-3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              >
                <path d="M1 1l10 10M11 1L1 11" />
              </svg>
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-10 flex-1">
            <ul className="flex flex-col gap-2">
              {n.links.map((l, i) => (
                <li key={l.label} data-drawer-item>
                  <a
                    href={l.href}
                    onClick={(e) => goTo(e, l.href)}
                    className="flex items-baseline gap-4 py-2 font-expanded text-[clamp(2.25rem,8vw,3.5rem)] leading-none tracking-[-0.02em]"
                  >
                    <span className="font-mono text-[0.75rem] tracking-[0.1em] text-paper-dim">
                      0{i + 1}
                    </span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div data-drawer-item className="flex flex-col gap-6 pb-10">
            <Button
              size="lg"
              arrow
              onClick={() => {
                drawer.current?.close();
                openWaitlist();
              }}
            >
              {n.connect}
            </Button>
            <div className="flex items-center justify-between gap-4">
              <p className="mono-label text-paper-dim">{n.drawerFoot}</p>
              <a
                href={SOCIAL.x.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={SOCIAL.x.a11y}
                className="font-mono text-[0.8125rem] text-paper"
              >
                {SOCIAL.x.label} {SOCIAL.x.handle} <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
