import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages. BASE_PATH is the repo subpath ("/groove") for a
 * project site, or empty for a user site / custom domain. The deploy workflow sets it
 * from actions/configure-pages; locally it defaults to "".
 */
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["gsap"],
  },
};

export default nextConfig;
