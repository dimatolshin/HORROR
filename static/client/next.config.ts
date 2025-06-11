import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: ["https://quest-house.by"],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "quest-house.by",
      },
    ],
  },
  env: {
    API_URL: process.env.API_URL,
  },
};

export default nextConfig;
