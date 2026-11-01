"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { setScrollLocked, useLenis } from "@/components/providers/SmoothScroll";
import { cx } from "@/lib/format";
import { gsap, isReducedMotion } from "@/motion";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Native <dialog> (background is inert, Esc closes), plus an explicit Tab trap and
 * focus return to whatever opened it.
 */
export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const lenis = useLenis();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnTo.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      setScrollLocked(lenis, true);
      if (!isReducedMotion()) {
        gsap.fromTo(
          panel.current,
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
        );
      }
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, lenis]);

  const handleClose = () => {
    setScrollLocked(lenis, false);
    onClose();
    returnTo.current?.focus();
  };

  const trapTab = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const items = Array.from(ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={handleClose}
      onKeyDown={trapTab}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(32rem,calc(100vw-2rem))] overflow-visible bg-transparent p-0 text-paper backdrop:bg-ink/80 backdrop:backdrop-blur-[2px]"
      data-lenis-prevent
    >
      <div
        ref={panel}
        className={cx(
          "relative rounded-[calc(var(--radius)*1.5)] border border-line-strong bg-ink-2 p-7 sm:p-9",
          className,
        )}
      >
        <button
          type="button"
          onClick={() => ref.current?.close()}
          className="absolute top-4 right-4 grid size-9 place-items-center rounded-full border border-line text-paper-dim transition-colors hover:border-line-strong hover:text-paper"
        >
          <span className="sr-only">Close</span>
          <svg aria-hidden viewBox="0 0 12 12" className="size-3">
            <path
              d="M1 1l10 10M11 1L1 11"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <h2
          id={titleId}
          className="font-expanded pr-10 text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-[0.95] tracking-[-0.02em]"
        >
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </div>
    </dialog>
  );
}
