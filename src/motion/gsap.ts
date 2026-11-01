"use client";

import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { DUR, EASE } from "./eases";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP);
  gsap.defaults({ ease: EASE.out, duration: DUR.md });
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP };

/**
 * Flip is only needed by the intro (its own chunk) and the Labels expansion, so it's
 * loaded on demand instead of shipping in the main bundle.
 */
export async function loadFlip() {
  const { Flip } = await import("gsap/Flip");
  gsap.registerPlugin(Flip);
  return Flip;
}
