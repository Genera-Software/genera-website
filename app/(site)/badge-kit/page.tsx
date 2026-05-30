import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import BadgeKit from "./_components/BadgeKit";

export const metadata: Metadata = {
  ...createMetadata({
    title: "Powered by Genera — Badge Kit",
    description:
      "Grab a free “Powered by Genera” badge for your dog daycare website. Pick a style, download the PNG or copy the embed code, and link your families back to Genera.",
    path: "/badge-kit",
  }),
};

export default function BadgeKitPage() {
  return <BadgeKit />;
}
