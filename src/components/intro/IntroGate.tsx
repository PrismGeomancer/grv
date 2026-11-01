"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { introWillPlay } from "@/motion/intro";

// The intro ships as its own chunk; the page never waits for it.
const Intro = dynamic(() => import("./Intro"), { ssr: false });

/** Mounts the intro only when the boot script decided it should play. */
export function IntroGate() {
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (introWillPlay()) setPlay(true);
  }, []);
  return play ? <Intro /> : null;
}

/** Server-rendered black curtain, shown by CSS before any JS runs (see globals.css). */
export function IntroShell() {
  return <div id="intro-shell" className="intro-shell" aria-hidden />;
}
