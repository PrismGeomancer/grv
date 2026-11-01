import { cx } from "@/lib/format";

/** "GROOVE" in Archivo Expanded Black, with slightly widened tracking. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cx("font-expanded tracking-[0.07em] leading-none uppercase", className)}>
      Groove
    </span>
  );
}
