# Groove: marketing site (v1)

The marketing site for **Groove**, an independent label for AI artists. One landing page with a 6-second cinematic
intro, a `/styleguide`, and a custom 404. Built from [`../GROOVE_BUILD_PROMPT.md`](../GROOVE_BUILD_PROMPT.md).

**Stack:** Next.js 15 (App Router, static export) · React 19 · TypeScript (strict) · Tailwind CSS v4 · GSAP 3.15
(ScrollTrigger, SplitText, Flip, DrawSVG) · Lenis smooth scroll. Dependency versions are pinned in `package.json`.

## Setup

Needs Node 20+ (`node -v`).

```bash
npm install
npm run dev        # http://localhost:3000, and /styleguide
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build, exported as static files to `out/` |
| `npm run preview` | Serves `out/` the way GitHub Pages does (gzip, `404.html`, optional `BASE_PATH`) |
| `npm run lint` / `typecheck` / `format` | ESLint / `tsc --noEmit` / Prettier |
| `npm run icons` | Regenerates `src/app/icon.svg` from the eye geometry |
| `npm run og` | Regenerates the Open Graph and Twitter images (needs Google Chrome and a network connection for fonts) |

## Deploy to GitHub Pages

The site is a static export (`output: "export"` in `next.config.ts`): no server needed.

1. Make **this `site/` folder** the repository root and push it to GitHub on `main`.
2. In the repo: **Settings → Pages → Source: GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml` (lint, build, publish).

The workflow sets the base path itself: `https://<user>.github.io/<repo>/` for a project site, the root for a
`<user>.github.io` repo or a custom domain. To test a subpath build locally:

```bash
BASE_PATH=/groove npm run build && BASE_PATH=/groove npm run preview   # http://localhost:3000/groove/
```

Static means no API routes, middleware, ISR or `next/image` optimisation. Reference files in `public/` through
`asset()` from `src/lib/asset.ts` so they pick up the base path. Set `NEXT_PUBLIC_SITE_URL` for correct absolute URLs in
the sitemap and social cards (the workflow does this automatically).

## Project structure

```
src/
  app/            layout, page (section composition only), /styleguide, 404, icons, OG images, robots, sitemap
  components/
    brand/        GrooveEye, Record, Tonearm, OnAirLight, Wordmark, Logo, LabelSticker
    intro/        Intro overlay, timing config, synthesised audio, gate
    sections/     Hero, OnTour, Roster, Labels, Distribution, HowItWorks, RunTheLabel, Security, ClosingCta, Footer
    ui/           Button, Pill, Card, Modal, Marquee, StatCounter, Nav, SectionHeading, WaitlistModal
    art/          generated artist avatars and cover art
    styleguide/   demos used by /styleguide
  motion/         presets, eases, reduced-motion store, lazy-init hooks
  data/           artists, labels, posts, stats, platforms, social, copy
  styles/         tokens.css, globals.css, grain.css
  lib/            seeded random, art generator, formatters, contrast
scripts/          icon + OG generators, static preview server
```

## Where the content lives

Nothing is hard-coded inside components. Everything comes from typed files in `src/data/`:

| File | Holds |
|---|---|
| `copy.ts` | All site copy. Strings marked `FINAL` are word-for-word from the brief |
| `artists.ts`, `labels.ts`, `posts.ts` | The 8 artists, 4 labels and 10 feed posts (all fictional, mock numbers) |
| `stats.ts` | Every number shown on the site, **calculated** from the files above (artists signed, on tour, royalties, chains) |
| `platforms.ts` | Social platform names, chains, and the six store names (plain text only, no logos) |
| `social.ts` | Groove's own social links. **The X URL is a placeholder (`https://x.com`): set the real account here** |
| `snapshot.ts` | The fixed "now" the mock dates are measured from |

## Swapping in real data

Today the site is a brochure with placeholder content. To make it live, keep the shapes in `src/data/types.ts`
(`Artist`, `Label`, `Post`) and replace where the arrays come from:

1. **Replace the arrays** in `artists.ts`, `labels.ts` and `posts.ts` with data from your backend or an indexer. Because
   the site is a static export, the simplest route is to fetch at build time (a `fetch` in a server component or a
   build script that writes the JSON) and rebuild on a schedule. For truly live numbers, fetch in a client component.
2. **Keep the derived values derived.** `stats.ts` and each label's `artistIds` are computed from the arrays, so they
   update on their own. Remove `snapshot.ts` and pass the real fetch time to `timeAgo()` in `src/lib/format.ts`.
3. **Real artwork:** `ArtistAvatar` and `CoverArt` currently generate art from `artist.id` and `artist.palette`. To use
   uploaded images, add an `image` field to `Artist` and render it in those two components.
4. **Remove the "EXAMPLE LABELS · FICTIONAL" note** (`copy.ts`, `labels.disclaimer`) once the labels are real.

## Adding the waitlist backend

`WaitlistModal.tsx` validates the email and shows the success state, but sends nothing. Replace the `setTimeout` in its
`submit` function with a request to your form service (Formspree, ConvertKit, your own endpoint). Static hosting means
the endpoint has to be external.

## Adding wallet connection later

The nav's **Connect** button and every "Sign your first artist" button open the waitlist (via `useWaitlist()` in
`WaitlistModal.tsx`). To add a wallet:

1. Add a wallet library for Robinhood Chain and Solana (for example a Solana wallet adapter plus an EVM client), and
   explain the addition here, per hard rule 7 of the brief.
2. Wrap the app in its provider in `src/components/providers/Providers.tsx`.
3. Point `Connect` at the wallet modal. Keep the model from the brief: **the user's wallet signs every transaction, the
   agent never holds a key, and Groove never holds assets.** Keep the risk notice in the footer.

## The intro

- Plays once per browser tab session, on the home page only. Never with reduced motion, and not when arriving on an
  `#anchor`.
- **Replay:** open `/?intro`, or a new tab.
- **Tune:** every beat time is in `src/components/intro/timing.ts`. The total stays at 6.0s.
- **Skip:** click, `Esc`, `Enter` or `Space` (button appears at 0.8s).
- **Sound:** off by default, behind a speaker toggle. It is synthesised in the browser with the Web Audio API
  (`introAudio.ts`): room tone, a needle-drop crackle at 3.0s and a low thump at 5.2s.

## Design system

`/styleguide` shows every token, brand mark, UI component and motion preset live, with a reduced-motion toggle.
Tokens are CSS variables in `src/styles/tokens.css`; contrast ratios are computed on that page. Motion presets are in
`src/motion/presets.ts`. Rules: animate only transform, opacity, clip-path and SVG attributes, and never read the
reduced-motion preference during render (see `src/motion/reduced.ts`).

## Assets and licenses

- **Everything is original:** the Groove eye, record, tonearm, wordmark, generated artwork, favicon and OG image were
  built for this project. No photos, no third-party images, no real people, labels or artists.
- **Fonts** (Google Fonts, self-hosted by `next/font`, SIL Open Font License): Archivo, Inter, JetBrains Mono.
- **Audio:** none shipped. The intro sound is generated in code, so there is nothing to license.
- **Third-party names** (TikTok, Instagram, X, YouTube, Spotify, Apple Music, YouTube Music, Amazon Music, TIDAL,
  Deezer) appear as plain-text wordmarks only: no logos, no brand colors, nothing implying a partnership.
- **GSAP** is used under its current free license (all plugins are included in the public package since 3.13). Check the
  terms at gsap.com before commercial use beyond a marketing site.

## Quality results (Milestone 6)

Lighthouse, mobile profile, measured locally against the static build:

| Setup | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| Default simulated throttling (5 runs) | 90–91 | 100 | 100 | 100 | 3.5s | 20–100ms | 0.001 |
| Applied throttling (3 runs) | 96–98 | 100 | 100 | 100 | 1.6–1.7s | 130–160ms | 0.002 |

Also checked: all 73 keyboard focus stops show a visible ring; the waitlist modal traps focus, validates and returns
focus; no horizontal scroll at 360, 768, 1024, 1440 and 1920px; reduced-motion walkthrough; the intro measured at 6.000s.
Real-world scores on GitHub Pages will differ slightly. Cross-browser checking was done in Chrome; Safari, Firefox and
Edge still need a manual pass.

## Known

- `npm audit` reports a `postcss` advisory inside Next 15's own nested copy. It only runs at build time and isn't
  shipped to browsers.
- TypeScript is pinned to 5.9 and ESLint to 9.x, the newest versions inside Next 15's supported ranges. `@eslint/eslintrc`
  is the one dependency beyond the brief, needed to load `eslint-config-next` 15 from a flat ESLint config.
- Docs, Privacy Policy, Terms of Use and "Read the contract" link to `#` until those pages exist.
