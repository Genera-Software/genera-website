// Build: 2026-06-08-v2
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/community", destination: "/founding100", permanent: true },
      { source: "/founding-100", destination: "/founding100", permanent: true },
      { source: "/about", destination: "/our-story", permanent: true },
      { source: "/about-us", destination: "/our-story", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "d2xsxph8kpxj0f.cloudfront.net" },
      { protocol: "https", hostname: "static.wixstatic.com" },
      { protocol: "https", hostname: "video.wixstatic.com" },
      { protocol: "https", hostname: "ysdwmefuimtryknpgmwc.supabase.co" },
    ],
  },
};

export default nextConfig;
