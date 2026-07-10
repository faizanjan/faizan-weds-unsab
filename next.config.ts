import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages. The site is served from a project subpath
 * (https://faizanjan.github.io/faizan-weds-unsab/), so the production build
 * prefixes every asset and route with `basePath`. `trailingSlash` makes each
 * route a folder with its own index.html, which Pages serves without any
 * rewrite rules. `basePath` is left off in development so the local dev server
 * stays at the root (http://localhost:3000/).
 */
const repo = "faizan-weds-unsab";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? `/${repo}` : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
