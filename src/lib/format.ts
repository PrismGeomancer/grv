import { SNAPSHOT_AT } from "@/data/snapshot";

const NOW = Date.parse(SNAPSHOT_AT);

/** "2h ago", "3d ago". Relative to the data snapshot so SSR and hydration agree. */
export function timeAgo(iso: string, now = NOW): string {
  const mins = Math.max(0, Math.round((now - Date.parse(iso)) / 60_000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 60) return `${days}d ago`;
  return `${Math.round(days / 30)}mo ago`;
}

/** "$1.84M", "$23.4K", "$940". */
export function usdCompact(n: number): string {
  if (n >= 1_000_000) return `$${trim(n / 1_000_000, 2)}M`;
  if (n >= 1_000) return `$${trim(n / 1_000, 1)}K`;
  return `$${Math.round(n)}`;
}

function trim(n: number, digits: number) {
  return n.toFixed(digits).replace(/\.?0+$/, "");
}

/** "Jul 2026". */
export function monthYear(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "0:14". */
export function duration(sec: number): string {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
