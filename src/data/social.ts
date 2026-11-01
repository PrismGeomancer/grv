/**
 * Groove's own social accounts. Third-party names are plain-text wordmarks only (§9):
 * no logos, no brand colours.
 * TODO(product): replace the placeholder with Groove's real X account URL.
 */
export const SOCIAL = {
  x: {
    label: "X",
    /** Stylised handle; the only place "$GROOVE" may appear (§1.2). */
    handle: "$GROOVE",
    href: "https://x.com",
    a11y: "Groove on X (opens in a new tab)",
  },
} as const;
