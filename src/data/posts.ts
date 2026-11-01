import { hoursAgo } from "./snapshot";
import type { Post } from "./types";

/**
 * On Tour feed. House voice: markets and moods, sideways, through ordinary life.
 * Never prices, never pumps, never "buy". ~60% text, ~40% vertical video.
 */
export const posts: Post[] = [
  {
    id: "p01",
    artistId: "night-bus",
    platform: "X",
    kind: "text",
    body: "Counted the lit windows on Harbour Street at 2 AM. Eleven last month. Nineteen tonight. Something is keeping people up, and it isn't the same thing as last year.",
    postedAt: hoursAgo(2),
  },
  {
    id: "p02",
    artistId: "velvet-3am",
    platform: "YouTube Shorts",
    kind: "video",
    body: "Exit 41. The only light on this stretch that never changes colour. I trust it more than the weather.",
    durationSec: 14,
    postedAt: hoursAgo(3),
  },
  {
    id: "p03",
    artistId: "cafecito",
    platform: "Instagram",
    kind: "text",
    body: "Two lines outside the bakery this morning. One for bread. One for people who want to be seen in the line for bread. The second one moves faster.",
    postedAt: hoursAgo(5),
  },
  {
    id: "p04",
    artistId: "tired-eyes",
    platform: "X",
    kind: "text",
    body: "Every group chat has one message nobody answered. I keep a folder of them. It is the most honest history of this decade anyone has.",
    postedAt: hoursAgo(6),
  },
  {
    id: "p05",
    artistId: "juno-static",
    platform: "TikTok",
    kind: "video",
    body: "Found a station between 101.3 and 101.5. It only reads the forecast for a city that hasn't been built yet. Tonight: clearing.",
    durationSec: 9,
    postedAt: hoursAgo(9),
  },
  {
    id: "p06",
    artistId: "granny-tape",
    platform: "Instagram",
    kind: "text",
    body: "In '09 the corner shop started selling eggs one at a time. Last spring they started again. Same shopkeeper. Same 'just the one, love?' I have both on tape.",
    postedAt: hoursAgo(11),
  },
  {
    id: "p07",
    artistId: "mx-dowse",
    platform: "YouTube Shorts",
    kind: "video",
    body: "The river rose a hand's width overnight and nobody on the bridge looked down. Water never announces itself. It just arrives where it was always going.",
    durationSec: 22,
    postedAt: hoursAgo(14),
  },
  {
    id: "p08",
    artistId: "marble-practice",
    platform: "Instagram",
    kind: "text",
    body: "The first rep is for the body. The fortieth is for the version of you that quit at thirty-nine.",
    postedAt: hoursAgo(19),
  },
  {
    id: "p09",
    artistId: "velvet-3am",
    platform: "TikTok",
    kind: "text",
    body: "Gas station, 3:12. One clerk, one radio, one song neither of us picked. We both knew the words. Neither of us said so.",
    postedAt: hoursAgo(23),
  },
  {
    id: "p10",
    artistId: "cafecito",
    platform: "TikTok",
    kind: "video",
    body: "Abuela says you can read a neighbourhood by how long people stand at the pharmacy window before they go in.",
    durationSec: 31,
    postedAt: hoursAgo(28),
  },
];
