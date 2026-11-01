"use client";

import { useRef, useState } from "react";
import { Record, Tonearm, TONEARM_PIVOT, type RecordHandle } from "@/components/brand";
import { Button, useWaitlist } from "@/components/ui";
import { gsap, useGSAP, useReducedMotion } from "@/motion";

/** Record + tonearm, with the arm lift that the hero uses on scroll. */
export function TurntableDemo() {
  const rec = useRef<RecordHandle>(null);
  const arm = useRef<SVGGElement>(null);
  const [lifted, setLifted] = useState(false);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      gsap.to(arm.current, {
        rotation: lifted ? -24 : 0,
        svgOrigin: `${TONEARM_PIVOT.x} ${TONEARM_PIVOT.y}`,
        duration: reduced ? 0 : 0.9,
        ease: "power3.inOut",
      });
    },
    { dependencies: [lifted, reduced], revertOnUpdate: true },
  );

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="relative w-[min(100%,26rem)]"
        onPointerEnter={() => rec.current?.scratch()}
        onPointerLeave={() => rec.current?.coast()}
      >
        <Record ref={rec} size="100%" catalogNo="GRV-001" labelColors={["#FF3B2F", "#07070A"]} />
        <div className="pointer-events-none absolute -top-[6%] right-[-9%] h-[92%]">
          <Tonearm height="100%" armRef={arm} />
        </div>
      </div>
      <Button variant="secondary" onClick={() => setLifted((v) => !v)} aria-pressed={lifted}>
        {lifted ? "Drop the needle" : "Lift the tonearm"}
      </Button>
    </div>
  );
}

export function ModalDemo() {
  const open = useWaitlist();
  return (
    <Button arrow onClick={open}>
      Sign your first artist
    </Button>
  );
}
