import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the file-tracing root to this project (a sibling repo has its own lockfile).
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
