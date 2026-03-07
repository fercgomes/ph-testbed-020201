import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/ph/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ph/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
    ];
  },
  // Required to ensure PostHog reverse proxy works correctly
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
