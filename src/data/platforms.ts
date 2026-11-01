import type { Chain, Platform } from "./types";

/** Plain-text wordmarks only. No logos, no brand colours, no implied partnership. */
export const PLATFORMS: Platform[] = ["TikTok", "Instagram", "X", "YouTube Shorts"];

/** Compact forms for dense mono lines ("TikTok · IG · X · YT"). */
export const PLATFORM_SHORT: Record<Platform, string> = {
  TikTok: "TikTok",
  Instagram: "IG",
  X: "X",
  "YouTube Shorts": "YT",
};

/** Hero / platform line spelling. */
export const PLATFORM_LINE = PLATFORMS.join(" · ");

export const CHAINS: Chain[] = ["Robinhood Chain", "Solana"];

/** Coming soon. Never shown as live anywhere on the site. */
export const STORES = [
  "Spotify",
  "Apple Music",
  "YouTube Music",
  "Amazon Music",
  "TIDAL",
  "Deezer",
] as const;
