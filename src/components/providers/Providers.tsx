"use client";

import type { ReactNode } from "react";
import { WaitlistProvider } from "@/components/ui/WaitlistModal";
import { SmoothScrollProvider } from "./SmoothScroll";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SmoothScrollProvider>
      <WaitlistProvider>{children}</WaitlistProvider>
    </SmoothScrollProvider>
  );
}
