import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  // Keystatic (GitHub storage mode) redirects the browser from localhost to
  // 127.0.0.1 for its OAuth loopback flow (RFC 8252). Without this, Next 16's
  // dev-origin protection silently blocks the redirected page's dev assets,
  // leaving /keystatic blank with no console/server error.
  allowedDevOrigins: ["127.0.0.1"],
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
