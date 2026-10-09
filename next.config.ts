import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gera um servidor Node enxuto em .next/standalone — ideal pra Docker na VPS
  output: "standalone",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
