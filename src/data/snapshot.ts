/**
 * All mock dates are relative to this moment, so server and client render the same
 * "3d ago". When real data arrives, replace this with the fetch time.
 */
export const SNAPSHOT_AT = "2026-10-24T03:00:00.000Z";

const BASE = Date.parse(SNAPSHOT_AT);
const HOUR = 3_600_000;

/** ISO timestamp `hours` before the snapshot. Keeps mock data readable. */
export function hoursAgo(hours: number): string {
  return new Date(BASE - hours * HOUR).toISOString();
}
export function daysAgo(days: number): string {
  return hoursAgo(days * 24);
}
