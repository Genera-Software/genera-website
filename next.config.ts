// Build: 2026-06-08-v3
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // `next dev` uses Turbopack and `next build` uses webpack, and they write
  // incompatible artifacts. Sharing one .next means running a build and then
  // dev (or vice versa) fails with "Cannot find module
  // '../chunks/ssr/[turbopack]_runtime.js'" until you delete the directory.
  // Separate directories make the two safe to interleave. Netlify only ever
  // runs `next build`, so production still uses plain .next.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  async headers() {
    return [
      {
        // Tell Netlify Edge not to cache HTML pages — always revalidate
        source: "/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "CDN-Cache-Control", value: "no-store" },
          { key: "Netlify-CDN-Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/community", destination: "/founding100", permanent: true },
      { source: "/founding-100", destination: "/founding100", permanent: true },
      { source: "/about", destination: "/our-story", permanent: true },
      { source: "/about-us", destination: "/our-story", permanent: true },
      // Postcard + Instagram campaign (Sep 2026): the printed URL is
      // generasoftware.com/yourapp. Lands on the app's Welcome page (not
      // straight into the register form) with a UTM so sign-ups from the
      // campaign show in analytics. Not permanent, so it can become a real
      // landing page later without a cached 308 getting in the way.
      {
        source: "/yourapp",
        destination:
          "https://app.generasoftware.com/?utm_source=yourapp&utm_medium=outreach&utm_campaign=yourapp",
        permanent: false,
      },
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
