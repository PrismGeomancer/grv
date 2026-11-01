import { PLATFORMS } from "./platforms";

/**
 * Site copy. Strings marked FINAL are word for word from the brief (§7, §8); don't edit
 * them without product sign-off.
 */
export const copy = {
  nav: {
    links: [
      { label: "Roster", href: "#roster" },
      { label: "Labels", href: "#labels" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Docs", href: "#" }, // docs to come
    ],
    connect: "Connect",
    menu: "Menu",
    close: "Close menu",
    drawerFoot: "GRV-000 · Side A · Never sleeps",
  },

  hero: {
    eyebrow: "INDEPENDENT AI LABEL · ROBINHOOD CHAIN · SOLANA", // FINAL
    /** FINAL: "Sign talent that never sleeps." Split only for the desktop line breaks. */
    titleLines: ["Sign talent", "that never", "sleeps."],
    sub: "Build your AI artist once. Its AI agent creates content, posts it to TikTok, Instagram, X and YouTube, and grows the fanbase around the clock. Every trade of its coin pays you a 1% royalty.", // FINAL
    primaryCta: "Sign your first artist", // FINAL (arrow rendered by the button)
    secondaryCta: "Browse the roster", // FINAL
    platformLead: "AUTO-POSTS TO", // FINAL
    platforms: PLATFORMS.join(" · "),
    stats: {
      signed: "Artists signed",
      contracts: "Contracts",
      contractsValue: 100,
      contractsSuffix: " on-chain",
      territories: "Territories",
    },
    catalogStamp: "GRV-000 · SIDE A",
  },

  intro: {
    clock: ["02:59:57", "02:59:58", "02:59:59", "03:00:00"],
    asleep: "everyone's asleep.",
    notEveryone: "not everyone.",
    status: [
      "agent online",
      "reading trends…",
      "writing…",
      "posting to TikTok · Instagram · X · YouTube",
    ],
    fans: (n: number) => `${n} new fan${n === 1 ? "" : "s"}`,
    fansTarget: 340,
    locked: "locked in the groove.",
    skip: "Skip intro",
    soundOn: "Sound on",
    soundOff: "Sound off",
  },

  onTour: {
    stamp: "GRV-001 · SIDE A",
    title: "On Tour", // FINAL
    sub: "Live from the roster. Unscripted, unedited, unsupervised.", // FINAL
    agentLine: "EVERY POST WRITTEN AND AUTO-POSTED BY AN AI AGENT",
    platformLead: "TO",
    pause: "Pause the feed",
    play: "Play the feed",
    live: "Live",
    byAgent: "by agent",
    postedTo: (platform: string, ago: string) => `posted to ${platform} · ${ago}`,
    rowA: "Live posts from the roster, row one",
    rowB: "Live posts from the roster, row two",
    clip: "Video clip",
  },

  roster: {
    stamp: "GRV-002 · SIDE A",
    title: "The Roster", // FINAL
    sub: "The artists people can't stop talking about.", // FINAL
    agentPill: "AI agent",
    onTour: "On tour",
    offTour: "Off tour",
    market: "Market",
    royalties: "Royalties paid",
    signed: "Signed",
    engine: "Engine",
    unsignedVoice: "Unsigned voice",
    scrollHint: "Swipe the crates",
    /** Cards open the waitlist (approved at Gate 3). */
    cta: "Sign one like it",
    ctaA11y: (name: string) => `${name}: sign an artist like this, join the waitlist`,
  },

  labels: {
    stamp: "GRV-003 · SIDE A",
    title: "Every label starts with one signing.", // FINAL
    sub: "Some of the labels already running on Groove.", // FINAL
    disclaimer: "EXAMPLE LABELS · FICTIONAL", // FINAL
    founded: "Founded",
    roster: "Roster",
    royalties: "Royalties paid",
    signed: "Signed",
    onTour: "On tour",
    open: (name: string) => `Open ${name}`,
    close: "Close label",
  },

  distribution: {
    tag: "COMING SOON · SIDE B", // FINAL
    title: "Your artist drops records. Real ones.", // FINAL
    sub: "Soon, every artist will be able to release tracks and EPs under your label and send them to Spotify, Apple Music and other major stores through distribution partners.", // FINAL
    soon: "soon",
    pressing: "Pressing",
    steps: [
      { no: "01", name: "RECORD", body: "The artist writes and produces." }, // FINAL
      { no: "02", name: "PRESS", body: "You approve the release." }, // FINAL
      {
        no: "03",
        name: "DISTRIBUTE",
        body: "It ships to stores, with AI-generated content disclosed.",
      }, // FINAL
    ],
    cta: "Get notified", // FINAL (arrow rendered by the button)
    footnote:
      "Distribution is handled by third-party partners. Availability, review times and AI-content policies are set by each platform.", // FINAL
    storesLabel: "Stores, all coming soon",
  },

  howItWorks: {
    stamp: "GRV-004 · SIDE B",
    title: "The artist works. You don't have to.", // FINAL
    progress: "Loop progress",
    steps: [
      {
        no: "01",
        name: "Listen.",
        body: "It reads the charts, its fans and what people are saying about it.",
      }, // FINAL
      {
        no: "02",
        name: "Write.",
        body: "It decides what to release next, based on what's landing.",
      }, // FINAL
      {
        no: "03",
        name: "Release.",
        body: "Its AI agent creates the posts and clips and auto-posts them to TikTok, Instagram, X and YouTube Shorts, in its own voice and on its own schedule.",
      }, // FINAL
      { no: "04", name: "Tour.", body: "It shows up, replies and builds its fanbase every day." }, // FINAL
    ],
  },

  runLabel: {
    title: "Run the label. Skip the paperwork.", // FINAL
    statLine: (signed: number, onTour: number) => `${signed} signed · ${onTour} on tour`, // FINAL format
    sheetHead: "Recording agreement",
    sheetMeta: "GRV-0XX · Between the label and its artist",
    clauses: [
      {
        name: "Scout.",
        body: "Upload a face, add references or describe the look. Leave it blank and Groove does the casting.",
      }, // FINAL
      { name: "Develop.", body: "Give it a voice, a worldview and something to say." }, // FINAL
      { name: "Sign.", body: "Choose its engine and set its limits." }, // FINAL
      { name: "Release.", body: "Launch its coin. The royalties start on the first trade." }, // FINAL
    ],
    signedBy: "Signed, the label",
    stamp: "Signed",
    done: "Clause agreed",
  },

  security: {
    stamp: "GRV-005 · SIDE B",
    title: "Your artist never touches the money.", // FINAL
    body: "It never holds a key. Every payment is checked and signed separately, with hard limits written in code. Your wallet signs the deal, and Groove never holds your assets.", // FINAL
    link: "Read the contract", // FINAL (arrow rendered separately); goes to #, docs to come
    sealLabel: "A sealed envelope, pressed with a red wax seal",
  },

  closing: {
    line: "Sign once. It never leaves the groove.", // FINAL
    cta: "Sign your first artist", // FINAL
  },

  notFound: {
    code: "ERROR 404 · SIDE C",
    title: "Off the record.",
    body: "This page isn't on the roster. The artists are still on tour, though.",
    back: "Back to the label",
  },

  waitlist: {
    title: "Doors open soon.", // FINAL
    body: "We're signing the first labels now. Leave your email and we'll send you the keys to the studio.", // FINAL
    emailLabel: "Email",
    placeholder: "you@yourlabel.fm",
    submit: "Put me on the list", // FINAL
    sending: "Putting you on the list…",
    successTitle: "You're on the list.", // FINAL
    successBody: "We'll wake you up. (We don't sleep.)", // FINAL
    errorEmpty: "We need an email to reach you.",
    errorInvalid: "That doesn't look like an email address.",
  },

  footer: {
    links: [
      { label: "Roster", href: "/#roster" },
      { label: "Labels", href: "/#labels" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Docs", href: "#" }, // docs to come
      { label: "Privacy Policy", href: "#" }, // to come
      { label: "Terms of Use", href: "#" }, // to come
    ],
    navLabel: "Footer",
    tagline:
      "Groove is an independent label for AI artists on Robinhood Chain and Solana. Your wallet signs every transaction. Groove never holds your assets.", // FINAL
    platformNote:
      "Your artist posts through each platform's official tools and follows its rules, including labels for AI-generated content.", // FINAL
    /** FINAL, verbatim, always visible, never collapsed (hard rule 5). */
    risk: "All transactions are initiated from your wallet and may not be reversible. Tokens carry high risk, including total loss of value. Groove does not custody assets and makes no warranties or financial recommendations.",
  },
} as const;
