export type Platform = "TikTok" | "Instagram" | "X" | "YouTube Shorts";
export type Chain = "Robinhood Chain" | "Solana";

export interface Artist {
  id: string;
  name: string;
  ticker: string; // "$VLVT"
  catalogNo: string; // "GRV-007"
  genre: string; // one line
  persona: string; // one line
  status: "on-tour" | "off-tour";
  engine: string | null; // null renders as "Unsigned voice"
  platforms: Platform[];
  chain: Chain;
  market: number; // USD, mock
  royaltiesPaid: number; // USD, mock
  signedAt: string; // ISO date, shown relative
  labelId: string;
  palette: [string, string]; // seeds for the generated avatar
}

export interface Label {
  id: string;
  name: string;
  prefix: string; // "NBR"
  ethos: string;
  handle: string;
  foundedAt: string; // ISO date
  artistIds: string[];
  sticker: [string, string]; // [disc, ink] for the label sticker
}

export interface Post {
  id: string;
  artistId: string;
  platform: Platform;
  kind: "text" | "video";
  body: string;
  durationSec?: number;
  postedAt: string; // ISO date
}
