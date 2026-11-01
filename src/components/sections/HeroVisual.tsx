"use client";

import { useRef } from "react";
import { GrooveEye, Tonearm, TONEARM_PIVOT } from "@/components/brand";
import {
  gsap,
  introWillPlay,
  onIntroHandoff,
  useGSAP,
  useReducedMotion,
  isReducedMotion,
} from "@/motion";

/*
 * Tonearm placement, derived from the eye geometry (viewBox 240×160) and the tonearm's
 * (130×280, stylus tip ≈ (41, 277)). The stylus lands on the iris grooves at (162, 95).
 * Percentages are of the eye box so it holds at every size.
 */
const ARM = { left: "58.4%", top: "-32.5%", height: "93%", origin: "70.8% 12.1%" };

/**
 * The hero centerpiece: the Groove eye with a tonearm resting on its vinyl iris.
 * Desktop: tilts toward the cursor. On scroll: the arm lifts and the record drifts up.
 * `data-hero-eye` is the Flip target the intro flies into.
 */
export function HeroVisual({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const drift = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const armWrap = useRef<HTMLDivElement>(null);
  const arm = useRef<SVGGElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || isReducedMotion()) return;

      // Scroll: lift the arm off the record, let the record drift up.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        })
        .to(
          arm.current,
          {
            rotation: -20,
            svgOrigin: `${TONEARM_PIVOT.x} ${TONEARM_PIVOT.y}`,
            ease: "power2.out",
            duration: 0.35,
          },
          0,
        )
        .to(drift.current, { yPercent: -16, ease: "none", duration: 1 }, 0);

      const cleanups: (() => void)[] = [];

      // The needle drops once the intro has landed the eye.
      if (introWillPlay()) {
        gsap.set(armWrap.current, { rotation: -32, transformOrigin: ARM.origin });
        cleanups.push(
          onIntroHandoff(({ skipped }) => {
            gsap.set(armWrap.current, { visibility: "visible" });
            if (skipped) gsap.set(armWrap.current, { rotation: 0 });
            else
              gsap.to(armWrap.current, {
                rotation: 0,
                duration: 1.1,
                delay: 0.45,
                ease: "power3.inOut",
              });
          }),
        );
      }

      // Desktop only: a slight 3D tilt toward the cursor.
      const section = sectionRef.current;
      if (section && matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const rx = gsap.quickTo(tilt.current, "rotationX", { duration: 0.8, ease: "power3.out" });
        const ry = gsap.quickTo(tilt.current, "rotationY", { duration: 0.8, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = section.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 12);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 9);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        section.addEventListener("pointermove", move);
        section.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          section.removeEventListener("pointermove", move);
          section.removeEventListener("pointerleave", leave);
        });
      }

      return () => cleanups.forEach((fn) => fn());
    },
    { dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <div ref={drift} className="[perspective:1400px]">
      <div ref={tilt} className="relative pt-[22%] [transform-style:preserve-3d]">
        <div className="relative">
          <div data-hero-eye className="relative">
            <GrooveEye
              size="100%"
              title="The Groove eye: a record for an iris, spinning, never closing"
            />
          </div>
          <div
            ref={armWrap}
            data-hero-arm
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              left: ARM.left,
              top: ARM.top,
              height: ARM.height,
              transformOrigin: ARM.origin,
            }}
          >
            <Tonearm height="100%" armRef={arm} />
          </div>
        </div>
      </div>
    </div>
  );
}
