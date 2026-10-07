import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
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

export default withMDX(nextConfig);
