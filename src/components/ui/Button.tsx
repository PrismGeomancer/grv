import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/lib/format";

type Variant = "primary" | "secondary";
type Size = "md" | "lg";

interface Common {
  variant?: Variant;
  size?: Size;
  /** Show the arrow slot (an arrow that turns into a spinning record on hover). */
  arrow?: boolean;
  children: ReactNode;
  className?: string;
}

type AsButton = Common &
  Omit<ComponentPropsWithoutRef<"button">, keyof Common> & { href?: undefined };
type AsLink = Common & Omit<ComponentPropsWithoutRef<"a">, keyof Common> & { href: string };

const BASE =
  "group/btn relative inline-flex items-center justify-center gap-3 rounded-full font-mono uppercase tracking-[0.08em] whitespace-nowrap " +
  "transition-[transform,background-color,border-color,color,box-shadow] duration-300 ease-out " +
  "hover:-translate-y-0.5 active:translate-y-0 motion-reduce:hover:translate-y-0 disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-onair text-ink hover:shadow-[0_10px_30px_-10px_rgb(255_59_47/0.7)]",
  secondary: "border border-line-strong text-paper hover:border-paper/60 hover:bg-white/[0.03]",
};

const SIZES: Record<Size, string> = {
  md: "h-11 px-5 text-[0.75rem]",
  lg: "h-14 px-7 text-[0.8125rem]",
};

function ArrowSlot() {
  return (
    <span aria-hidden className="relative inline-block size-4 overflow-hidden">
      <span className="absolute inset-0 grid place-items-center text-[1.05em] transition-transform duration-300 ease-out group-hover/btn:translate-x-full group-focus-visible/btn:translate-x-full">
        →
      </span>
      <span className="absolute inset-0 -translate-x-full transition-transform duration-300 ease-out group-hover/btn:translate-x-0 group-focus-visible/btn:translate-x-0">
        <svg viewBox="0 0 16 16" className="css-spin size-4">
          <circle cx="8" cy="8" r="7.5" fill="currentColor" />
          <circle
            cx="8"
            cy="8"
            r="5.2"
            fill="none"
            stroke="var(--ink-3)"
            strokeOpacity="0.5"
            strokeWidth="0.6"
          />
          <circle cx="8" cy="8" r="2.6" fill="var(--paper)" opacity="0.9" />
          <rect x="8" y="6.2" width="2.2" height="0.9" fill="currentColor" />
          <circle cx="8" cy="8" r="0.8" fill="currentColor" />
        </svg>
      </span>
    </span>
  );
}

/** Primary (`--onair` / `--ink` text) or secondary (outline). Renders a link when given `href`. */
export function Button(props: AsButton | AsLink) {
  const { variant = "primary", size = "md", arrow = false, children, className, ...rest } = props;
  const classes = cx(BASE, VARIANTS[variant], SIZES[size], className);
  const inner = (
    <>
      <span>{children}</span>
      {arrow && <ArrowSlot />}
    </>
  );

  if (typeof rest.href === "string") {
    const { href, ...anchor } = rest as Omit<AsLink, keyof Common>;
    const internal = href.startsWith("/") && !href.startsWith("//");
    return internal ? (
      <Link href={href} className={classes} {...anchor}>
        {inner}
      </Link>
    ) : (
      <a href={href} className={classes} {...anchor}>
        {inner}
      </a>
    );
  }

  const { type = "button", ...button } = rest as Omit<AsButton, keyof Common>;
  return (
    <button type={type} className={classes} {...button}>
      {inner}
    </button>
  );
}
