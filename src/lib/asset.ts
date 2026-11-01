/** Prefixes a public/ or metadata asset path with the deploy base path (GitHub Pages subpath). */
export function asset(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
