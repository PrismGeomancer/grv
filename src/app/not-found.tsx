import type { Metadata } from "next";
import Link from "next/link";
import { GrooveEye, Logo } from "@/components/brand";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui";
import { copy } from "@/data";

const t = copy.notFound;

export const metadata: Metadata = {
  title: "Off the record · Groove",
  robots: { index: false },
};

/** Custom 404 (exported as 404.html for GitHub Pages). */
export default function NotFound() {
  return (
    <>
      <header className="container-groove flex h-16 items-center md:h-[4.5rem]">
        <Link href="/" aria-label="Groove, home" className="rounded-md">
          <Logo />
        </Link>
      </header>
      <main
        id="main"
        className="container-groove relative flex min-h-[72dvh] flex-col items-center justify-center py-20 text-center"
      >
        <div aria-hidden className="bg-grooves pointer-events-none absolute inset-0" />
        <GrooveEye size="min(56vw, 300px)" className="relative" />
        <p className="mono-label relative mt-10 text-paper-dim">{t.code}</p>
        <h1 className="font-expanded relative mt-4 text-h2">{t.title}</h1>
        <p className="relative mt-5 max-w-[40ch] text-lead text-paper-dim">{t.body}</p>
        <Button href="/" arrow size="lg" className="relative mt-10">
          {t.back}
        </Button>
      </main>
      <Footer />
    </>
  );
}
