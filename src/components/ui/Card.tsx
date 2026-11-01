import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cx } from "@/lib/format";

type CardProps<T extends ElementType> = {
  as?: T;
  /** Sleeve wear: a ring mark and soft edge scuffs. */
  wear?: boolean;
  /** Seed for where the ring mark sits, so each sleeve is worn differently. */
  wearSeed?: number;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

/** Surface on --ink-2 with a hairline border. */
export function Card<T extends ElementType = "div">({
  as,
  wear = false,
  wearSeed = 0,
  children,
  className,
  style,
  ...rest
}: CardProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const wearVars = wear
    ? {
        "--wear-x": `${30 + ((wearSeed * 37) % 40)}%`,
        "--wear-y": `${28 + ((wearSeed * 53) % 36)}%`,
      }
    : {};
  return (
    <Tag
      className={cx(
        "relative rounded-[var(--radius)] border border-line bg-ink-2",
        wear && "sleeve-wear",
        className,
      )}
      style={{ ...wearVars, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
