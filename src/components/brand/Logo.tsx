import { cx } from "@/lib/format";
import { GrooveEye } from "./GrooveEye";
import { Wordmark } from "./Wordmark";

/** Eye + wordmark lockup, for the nav and footer. */
export function Logo({ className, eyeSize = 44 }: { className?: string; eyeSize?: number }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <GrooveEye size={eyeSize} period={10} />
      <Wordmark className="text-[1.05rem]" />
    </span>
  );
}
