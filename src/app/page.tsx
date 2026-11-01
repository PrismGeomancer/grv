import { Suspense } from "react";
import { IntroGate, IntroShell } from "@/components/intro/IntroGate";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Distribution } from "@/components/sections/Distribution";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Labels } from "@/components/sections/Labels";
import { OnTour } from "@/components/sections/OnTour";
import { Roster } from "@/components/sections/Roster";
import { RunTheLabel } from "@/components/sections/RunTheLabel";
import { Security } from "@/components/sections/Security";
import { Nav } from "@/components/ui";

/**
 * Section composition only (brief §8, in order). Each section below the hero sits in its
 * own Suspense boundary so React hydrates it as a separate, interruptible task instead of
 * one long main-thread block (hero and nav hydrate first).
 */
export default function Home() {
  return (
    <>
      <IntroShell />
      <div id="site">
        <Nav />
        <main id="main" tabIndex={-1} className="outline-none">
          <Hero />
          <Suspense>
            <OnTour />
          </Suspense>
          <Suspense>
            <Roster />
          </Suspense>
          <Suspense>
            <Labels />
          </Suspense>
          <Suspense>
            <Distribution />
          </Suspense>
          <Suspense>
            <HowItWorks />
          </Suspense>
          <Suspense>
            <RunTheLabel />
          </Suspense>
          <Suspense>
            <Security />
          </Suspense>
          <Suspense>
            <ClosingCta />
          </Suspense>
        </main>
        <Footer />
      </div>
      <IntroGate />
    </>
  );
}
