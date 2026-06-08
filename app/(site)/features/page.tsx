import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import FeaturesClient from "./FeaturesClient";

export const metadata: Metadata = {
  ...createMetadata({
    title: "Dog Daycare Software Features for Pet Businesses",
    description:
      "Explore Genera features for dog daycares and pet businesses, including online bookings, client and pet records, invoicing, route planning, staff management and compliance.",
    path: "/features",
  }),
};

export default function FeaturesPage() {
  return <FeaturesClient />;
}
