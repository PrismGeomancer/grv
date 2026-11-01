"use client";

import { useRef } from "react";
import { GrooveEye } from "@/components/brand";
import { Button, useWaitlist } from "@/components/ui";
import { copy } from "@/data";
import { useRevealOnScroll } from "@/motion";

const t = copy.closing;

/**
 * §8.9 Closing CTA. The eye returns, smaller, and performs blinkFull: one slow, complete
 * blink, the only time it ever closes on the site. Then it snaps open again.
 */
export function ClosingCta() {
  const line = useRef<HTMLHeadingElement>(null);
  const openWaitlist = useWaitlist();
  useRevealOnScroll(line);

  return (
    <section
      aria-labelledby="closing-title"
      className="relative overflow-clip border-t border-line py-28 md:py-44"
    >
      <div aria-hidden className="bg-grooves pointer-events-none absolute inset-0" />
      <div className="container-groove relative flex flex-col items-center text-center">
        <GrooveEye size="min(46vw, 260px)" blink="full" title="The Groove eye" />
        <h2
          id="closing-title"
          ref={line}
          className="font-expanded mt-12 max-w-[14ch] text-[clamp(2.75rem,1.4rem+6vw,8rem)] leading-[0.9] tracking-[-0.03em]"
        >
          {t.line}
        </h2>
        <Button arrow size="lg" onClick={openWaitlist} className="mt-12">
          {t.cta}
        </Button>
      </div>
    </section>
  );
}
