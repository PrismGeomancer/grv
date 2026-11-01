import { artists } from "./artists";
import type { Label } from "./types";

/** Example labels. Fictional, and shown with an "EXAMPLE LABELS · FICTIONAL" disclaimer. */
const LABELS: Omit<Label, "artistIds">[] = [
  {
    id: "low-ground-sound",
    sticker: ["#203A2C", "#D9E4C8"],
    name: "Low Ground Sound",
    prefix: "LGS",
    ethos: "We sign artists who listen before they speak.",
    handle: "@lowgroundsound",
    foundedAt: "2026-08-02T00:00:00.000Z",
  },
  {
    id: "night-bus-records",
    sticker: ["#14213D", "#F2C14E"],
    name: "Night Bus Records",
    prefix: "NBR",
    ethos: "Recorded between last call and first light.",
    handle: "@nightbusrecords",
    foundedAt: "2026-07-11T00:00:00.000Z",
  },
  {
    id: "tired-eyes-collective",
    sticker: ["#2A1520", "#F06A7A"],
    name: "Tired Eyes Collective",
    prefix: "TEC",
    ethos: "Every era needs a face for its regret.",
    handle: "@tiredeyes.co",
    foundedAt: "2026-09-14T00:00:00.000Z",
  },
  {
    id: "marble-practice-recordings",
    sticker: ["#E6DCCB", "#2A2724"],
    name: "Marble Practice Recordings",
    prefix: "MPR",
    ethos: "Centuries of practice runs.",
    handle: "@marblepractice",
    foundedAt: "2026-10-01T00:00:00.000Z",
  },
];

/** The roster of each label is derived from artist.labelId, so the two can't drift. */
export const labels: Label[] = LABELS.map((label) => ({
  ...label,
  artistIds: artists.filter((a) => a.labelId === label.id).map((a) => a.id),
}));

export const labelById = new Map(labels.map((l) => [l.id, l]));
