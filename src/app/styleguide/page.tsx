import type { Metadata } from "next";
import Link from "next/link";
import { ArtistAvatar } from "@/components/art/ArtistAvatar";
import { CoverArt } from "@/components/art/CoverArt";
import { GrooveEye, Logo, OnAirLight, Record, Wordmark } from "@/components/brand";
import { ModalDemo, TurntableDemo } from "@/components/styleguide/BrandDemos";
import { EyeLab } from "@/components/styleguide/EyeLab";
import { MotionDemos } from "@/components/styleguide/MotionDemos";
import { MotionToggle } from "@/components/styleguide/MotionToggle";
import { SgSection, Specimen } from "@/components/styleguide/Section";
import { Button, Card, Pill, StatCounter } from "@/components/ui";
import { artists, PLATFORM_SHORT, stats } from "@/data";
import { asset } from "@/lib/asset";
import { contrast } from "@/lib/contrast";
import { timeAgo, usdCompact } from "@/lib/format";

export const metadata: Metadata = {
  title: "Styleguide · Groove",
  robots: { index: false, follow: false },
};

const TOKENS = [
  { name: "--ink", hex: "#07070A", use: "Page background" },
  { name: "--ink-2", hex: "#0E0E12", use: "Cards and surfaces" },
  { name: "--ink-3", hex: "#16161C", use: "Raised surfaces, hover" },
  { name: "--line", hex: "#FFFFFF14", use: "Dividers and borders" },
  { name: "--line-strong", hex: "#FFFFFF2E", use: "Focus on dark, active borders" },
  { name: "--paper", hex: "#EDE8DD", use: "Main text" },
  { name: "--paper-dim", hex: "#9A958A", use: "Secondary text" },
  { name: "--onair", hex: "#FF3B2F", use: "The only primary accent. Sparingly." },
  { name: "--sodium", hex: "#FFB547", use: "Coming soon, small warm highlights" },
  { name: "--sheet-dim", hex: "#57534B", use: "Secondary text on the contract sheet" },
  { name: "--stamp", hex: "#B3180F", use: "SIGNED stamp on the contract sheet" },
];

const PAIRS: [string, string, string, string][] = [
  ["--paper", "#EDE8DD", "--ink", "#07070A"],
  ["--paper-dim", "#9A958A", "--ink", "#07070A"],
  ["--paper-dim", "#9A958A", "--ink-3", "#16161C"],
  ["--onair", "#FF3B2F", "--ink", "#07070A"],
  ["--sodium", "#FFB547", "--ink", "#07070A"],
  ["--ink", "#07070A", "--onair", "#FF3B2F"],
  ["--ink", "#07070A", "--paper", "#EDE8DD"],
  ["--sheet-dim", "#57534B", "--paper", "#EDE8DD"],
  ["--stamp", "#B3180F", "--paper", "#EDE8DD"],
  ["--onair", "#FF3B2F", "--paper", "#EDE8DD"],
];

const NAV = [
  ["tokens", "Color"],
  ["type", "Type"],
  ["eye", "Groove eye"],
  ["brand", "Brand set"],
  ["motion", "Motion"],
  ["ui", "UI"],
  ["art", "Artwork"],
  ["textures", "Textures"],
];

export default function Styleguide() {
  const sample = artists[0]!;
  return (
    <main id="main" className="container-groove pb-32">
      <header className="flex flex-col gap-8 pt-10 pb-16 md:pt-16">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Link href="/" aria-label="Groove home">
            <Logo />
          </Link>
          <MotionToggle />
        </div>
        <div>
          <p className="mono-label text-paper-dim">GRV-000 · Side A · Design system v1</p>
          <h1 className="font-expanded mt-3 text-h2">Styleguide</h1>
          <p className="mt-4 max-w-[58ch] text-lead text-paper-dim">
            Every brand mark, token and motion preset, live. Flip the motion toggle to walk the site
            as someone with reduced motion switched on.
          </p>
        </div>
        <nav aria-label="Styleguide sections" className="flex flex-wrap gap-2">
          {NAV.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-full border border-line px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.1em] text-paper-dim uppercase hover:border-line-strong hover:text-paper"
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <SgSection
        id="tokens"
        no="01"
        title="Color"
        note="Ratios are computed live (WCAG 2.2). AA needs 4.5:1 for body text and 3:1 for large text."
      >
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
          {TOKENS.map((t) => (
            <li
              key={t.name}
              className="overflow-hidden rounded-[var(--radius)] border border-line bg-ink-2"
            >
              <div className="h-20 border-b border-line" style={{ background: `var(${t.name})` }} />
              <div className="p-3">
                <code className="font-mono text-sm">{t.name}</code>
                <p className="font-mono text-[0.6875rem] text-paper-dim uppercase">{t.hex}</p>
                <p className="mt-1 text-[0.8125rem] leading-snug text-paper-dim">{t.use}</p>
              </div>
            </li>
          ))}
        </ul>
        <table className="mt-8 w-full max-w-3xl text-left font-mono text-[0.8125rem]">
          <caption className="mono-label mb-3 text-left text-paper-dim">Pairings</caption>
          <thead className="text-paper-dim">
            <tr className="border-b border-line">
              <th scope="col" className="py-2 font-normal">
                Text on surface
              </th>
              <th scope="col" className="py-2 font-normal">
                Sample
              </th>
              <th scope="col" className="py-2 font-normal">
                Ratio
              </th>
              <th scope="col" className="py-2 font-normal">
                Verdict
              </th>
            </tr>
          </thead>
          <tbody>
            {PAIRS.map(([fn, fh, bn, bh]) => {
              const r = contrast(fh, bh);
              return (
                <tr key={fn + bn} className="border-b border-line">
                  <td className="py-2">
                    {fn} on {bn}
                  </td>
                  <td className="py-2">
                    <span className="rounded px-2 py-0.5" style={{ color: fh, background: bh }}>
                      Never sleeps
                    </span>
                  </td>
                  <td className="py-2 tabular-nums">{r.toFixed(2)}:1</td>
                  <td className={r >= 4.5 ? "py-2" : "py-2 text-sodium"}>
                    {r >= 4.5 ? "AA" : r >= 3 ? "Large text only" : "Decorative only"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </SgSection>

      <SgSection
        id="type"
        no="02"
        title="Type"
        note="Archivo (width + weight axes) for display, Inter for body, JetBrains Mono for catalog numbers, stats and status lines. Fluid with clamp()."
      >
        <div className="space-y-10">
          <div>
            <p className="mono-label text-paper-dim">Hero · Archivo Expanded Black · 64 → 160px</p>
            <p className="font-expanded mt-2 text-hero">Never sleeps.</p>
          </div>
          <div>
            <p className="mono-label text-paper-dim">H2 · 40 → 96px</p>
            <p className="font-expanded mt-2 text-h2">The Roster</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="mono-label text-paper-dim">H3</p>
              <p className="font-expanded mt-2 text-h3">Every label starts with one signing.</p>
            </div>
            <div>
              <p className="mono-label text-paper-dim">Condensed label · Archivo 75%</p>
              <p className="font-condensed mt-2 text-3xl tracking-[0.14em] uppercase">
                Side B · Coming soon
              </p>
            </div>
            <div>
              <p className="mono-label text-paper-dim">Lead · Inter</p>
              <p className="mt-2 max-w-[52ch] text-lead">
                Build your AI artist once. Its AI agent creates content, posts it to TikTok,
                Instagram, X and YouTube, and grows the fanbase around the clock.
              </p>
            </div>
            <div>
              <p className="mono-label text-paper-dim">Body · Inter 16–18px / 1.55</p>
              <p className="mt-2 max-w-[60ch] text-paper-dim">
                It never holds a key. Every payment is checked and signed separately, with hard
                limits written in code. Your wallet signs the deal, and Groove never holds your
                assets.
              </p>
            </div>
          </div>
          <div>
            <p className="mono-label text-paper-dim">Mono · JetBrains Mono</p>
            <p className="mt-2 font-mono text-paper">
              GRV-007 · 03:00:00 · reading trends… · $VLVT · TikTok · IG · X · YT
            </p>
          </div>
        </div>
      </SgSection>

      <SgSection
        id="eye"
        no="03"
        title="The Groove eye"
        note="The iris is a record; the sticker is the pupil. The red locked groove circles endlessly: the last groove on a record, which loops forever. Every 6–9s the lid droops and snaps back open."
      >
        <EyeLab />
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[16, 32, 64, 160].map((s) => (
            <Specimen key={s} label={`${s}px`}>
              <GrooveEye size={s} />
            </Specimen>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Specimen label="Favicon · app/icon.svg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/icon.svg")} alt="Groove favicon" width={64} height={64} />
          </Specimen>
          <Specimen label="Favicon at 16px">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/icon.svg")} alt="" width={16} height={16} />
          </Specimen>
          <Specimen label="lidOpen 0.5 (droop)">
            <GrooveEye size={140} lidOpen={0.5} blink="none" spinning={false} />
          </Specimen>
          <Specimen label="lidOpen 0 (slit, intro start)">
            <GrooveEye size={140} lidOpen={0} blink="none" spinning={false} />
          </Specimen>
        </div>
      </SgSection>

      <SgSection
        id="brand"
        no="04"
        title="Brand set"
        note="Wordmark, lockup, ON AIR light, record and tonearm. The record speeds up under the cursor and coasts back down."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Specimen label="Wordmark · Archivo Expanded Black">
            <Wordmark className="text-5xl" />
          </Specimen>
          <Specimen label="Lockup (nav)">
            <Logo />
          </Specimen>
          <Specimen label="ON AIR · off / on">
            <div className="flex flex-wrap items-center gap-4">
              <OnAirLight on={false} />
              <OnAirLight size="sm" />
              <OnAirLight />
            </div>
          </Specimen>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-[2fr_1fr]">
          <Specimen label="Record + tonearm (hero)">
            <TurntableDemo />
          </Specimen>
          <Specimen label="Record · artist palette label">
            <Record
              size={220}
              mode="always"
              catalogNo={sample.catalogNo}
              labelColors={[sample.palette[1], sample.palette[0]]}
            />
          </Specimen>
        </div>
      </SgSection>

      <SgSection
        id="motion"
        no="05"
        title="Motion"
        note="Presets live in src/motion. Default ease power3.out; 0.4 / 0.7 / 1.1s; stagger 0.06–0.1s. Transform, opacity, clip-path and SVG attributes only."
      >
        <MotionDemos />
      </SgSection>

      <SgSection id="ui" no="06" title="UI">
        <div className="space-y-10">
          <div>
            <p className="mono-label mb-4 text-paper-dim">
              Buttons · hover lifts, the arrow becomes a spinning record
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button arrow size="lg">
                Sign your first artist
              </Button>
              <Button variant="secondary" size="lg">
                Browse the roster
              </Button>
              <Button arrow>Get notified</Button>
              <Button variant="secondary">Connect</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
          <div>
            <p className="mono-label mb-4 text-paper-dim">Pills</p>
            <div className="flex flex-wrap items-center gap-3">
              <Pill tone="agent">AI agent</Pill>
              <Pill tone="live">On tour</Pill>
              <Pill tone="off">Off tour</Pill>
              <Pill tone="soon">Coming soon · Side B</Pill>
              <Pill>by agent</Pill>
            </div>
          </div>
          <div>
            <p className="mono-label mb-4 text-paper-dim">
              Stat counters · values calculated from src/data
            </p>
            <dl className="flex flex-wrap gap-x-12 gap-y-6">
              <StatCounter label="Artists signed" value={stats.artistsSigned} />
              <StatCounter label="On tour" value={stats.onTour} />
              <StatCounter label="Royalties paid" value={stats.royaltiesPaid} format="usd" />
              <StatCounter label="Contracts" value={100} format="percent" suffix=" on-chain" />
            </dl>
          </div>
          <div>
            <p className="mono-label mb-4 text-paper-dim">Cards · plain and with sleeve wear</p>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-6">
                <p className="mono-label text-paper-dim">Card · --ink-2</p>
                <p className="mt-3">A plain surface with a hairline border.</p>
              </Card>
              <Card wear wearSeed={3} className="p-6">
                <p className="mono-label text-paper-dim">Card · sleeve wear</p>
                <p className="mt-3">A ring mark and soft edge scuffs.</p>
              </Card>
              <Card wear wearSeed={7} className="overflow-hidden">
                <div className="aspect-square">
                  <CoverArt artist={sample} />
                </div>
                <div className="flex items-start justify-between gap-3 p-4">
                  <div>
                    <p className="font-expanded text-lg">{sample.name}</p>
                    <p className="font-mono text-sm text-paper-dim">
                      {sample.ticker} · {sample.catalogNo}
                    </p>
                  </div>
                  <Pill tone="agent">AI agent</Pill>
                </div>
                <p className="border-t border-line px-4 py-3 font-mono text-[0.75rem] text-paper-dim">
                  {usdCompact(sample.market)} market · Signed {timeAgo(sample.signedAt)} ·{" "}
                  {sample.platforms.map((p) => PLATFORM_SHORT[p]).join(" · ")}
                </p>
              </Card>
            </div>
          </div>
          <div>
            <p className="mono-label mb-4 text-paper-dim">
              Modal · stubbed waitlist (traps focus, Esc closes, focus goes back to the opener)
            </p>
            <ModalDemo />
          </div>
        </div>
      </SgSection>

      <SgSection
        id="art"
        no="07"
        title="Generated artwork"
        note="Duotone abstract portraits and covers, seeded by artist.id and artist.palette. No photos, no third-party images."
      >
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {artists.map((a) => (
            <li
              key={a.id}
              className="flex flex-col gap-3 rounded-[var(--radius)] border border-line bg-ink-2 p-4"
            >
              <ArtistAvatar artist={a} size="100%" shape="square" />
              <div className="flex items-center gap-2">
                <ArtistAvatar artist={a} size={28} />
                <span className="truncate font-mono text-sm">{a.name}</span>
              </div>
            </li>
          ))}
        </ul>
        <ul className="mt-4 grid grid-cols-4 gap-3 md:grid-cols-8">
          {artists.map((a) => (
            <li
              key={a.id}
              className="relative aspect-[9/16] overflow-hidden rounded-[8px] border border-line"
            >
              <CoverArt artist={a} aspect="portrait" variant="still" />
              <span className="absolute bottom-1.5 left-1.5 font-mono text-[0.625rem] text-paper">
                0:14
              </span>
            </li>
          ))}
        </ul>
      </SgSection>

      <SgSection
        id="textures"
        no="08"
        title="Textures"
        note="Film grain over everything (pauses with reduced motion), faint groove rings in section backgrounds."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-grooves grid h-64 place-items-center rounded-[var(--radius)] border border-line bg-ink-2">
            <span className="mono-label text-paper-dim">.bg-grooves</span>
          </div>
          <div className="relative grid h-64 place-items-center overflow-hidden rounded-[var(--radius)] border border-line bg-ink-2">
            <span className="mono-label text-paper-dim">GRV-0xx · Side A</span>
            <span className="font-condensed absolute top-4 right-4 rotate-6 rounded border border-paper-dim/50 px-2 py-0.5 text-sm tracking-[0.2em] text-paper-dim uppercase">
              Side B
            </span>
          </div>
        </div>
      </SgSection>
    </main>
  );
}
