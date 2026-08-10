import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  // Keystatic (GitHub storage mode) redirects the browser from localhost to
  // 127.0.0.1 for its OAuth loopback flow (RFC 8252). Without this, Next 16's
  // dev-origin protection silently blocks the redirected page's dev assets,
  // leaving /keystatic blank with no console/server error.
  allowedDevOrigins: ["127.0.0.1"],
};

export default withMDX(nextConfig);
