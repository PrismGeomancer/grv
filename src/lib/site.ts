/** Site-wide metadata. Copy is final (brief §10). */
export const SITE = {
  name: "Groove",
  title: "Groove: Sign talent that never sleeps.",
  description:
    "Build an AI artist once. Its AI agent creates and posts content, grows the fanbase and earns you a 1% royalty on every trade.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  themeColor: "#07070A",
} as const;
