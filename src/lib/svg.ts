/** Concentric circles as ONE path (each ring is two arcs). Keeps groove-heavy art light on DOM. */
export function ringsPath(cx: number, cy: number, radii: number[]): string {
  return radii
    .map((r) => {
      const R = Math.round(r * 100) / 100;
      return `M${cx - R} ${cy}a${R} ${R} 0 1 0 ${R * 2} 0a${R} ${R} 0 1 0 ${-R * 2} 0`;
    })
    .join("");
}

/** Groups items by a style key so each style renders as one element. */
export function groupBy<T>(items: T[], key: (item: T) => string): [string, T[]][] {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    map.set(k, [...(map.get(k) ?? []), item]);
  }
  return [...map.entries()];
}
