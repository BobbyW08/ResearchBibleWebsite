import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@payloadcms/next", "@payloadcms/ui"],
  turbopack: {
    resolveAlias: {
      "@payload-config": "./payload.config.ts",
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, string>),
      "@payload-config": path.resolve(process.cwd(), "payload.config.ts"),
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/tech-consequences",
        destination: "/tech-safety",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/about-bobby",
        permanent: true,
      },
      {
        source: "/tools/tech-safety-tool",
        destination: "/tech-safety",
        permanent: true,
      },
      {
        source: "/help",
        destination: "/common-pain-points",
        permanent: true,
      },
      {
        source: "/help/:slug",
        destination: "/common-pain-points/:slug",
        permanent: true,
      },
    ];
  },
};

export default withPayload(nextConfig);
