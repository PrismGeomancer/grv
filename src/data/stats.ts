import { artists } from "./artists";
import { labels } from "./labels";
import { CHAINS } from "./platforms";

/** Every number on the site is calculated here, never typed into a component. */
export const stats = {
  artistsSigned: artists.length,
  onTour: artists.filter((a) => a.status === "on-tour").length,
  labels: labels.length,
  royaltiesPaid: artists.reduce((sum, a) => sum + a.royaltiesPaid, 0),
  /** Chains the roster actually uses, in canonical order. */
  chains: CHAINS.filter((c) => artists.some((a) => a.chain === c)),
};

export function labelStats(labelId: string) {
  const roster = artists.filter((a) => a.labelId === labelId);
  return {
    signed: roster.length,
    onTour: roster.filter((a) => a.status === "on-tour").length,
    royaltiesPaid: roster.reduce((sum, a) => sum + a.royaltiesPaid, 0),
  };
}
