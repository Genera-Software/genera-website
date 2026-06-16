import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/setup-guide", destination: "/setup-guide/", permanent: false },
      { source: "/setup", destination: "/setup/", permanent: false },
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
