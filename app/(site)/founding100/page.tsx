import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { getPublicSupabase } from "@/lib/supabase/server";
import CommunityClient from "./CommunityClient";

export const metadata: Metadata = {
  ...createMetadata({
    title: "Founding 100 & Genera Business Network — Community for Pet Professionals",
    description:
      "Join the Genera Founding 100 — 3 months free, founding member pricing, and access to a private network of verified pet care professionals across the UK.",
    path: "/founding100",
  }),
};

export default async function CommunityPage() {
  const supabase = getPublicSupabase();
  const { data } = await supabase
    .from("founding_spots")
    .select("total_spots, claimed_spots")
    .eq("id", 1)
    .maybeSingle();

  const totalSpots = data?.total_spots ?? 100;
  const claimedSpots = data?.claimed_spots ?? 0;

  return (
    <CommunityClient totalSpots={totalSpots} claimedSpots={claimedSpots} />
  );
}
