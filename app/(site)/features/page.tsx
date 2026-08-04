import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { BOOK_DEMO_FORM_SLUG } from "@/lib/cta";
import { isFormActive } from "@/lib/forms";
import FeaturesClient from "./FeaturesClient";

export const revalidate = 60;

export const metadata: Metadata = {
  ...createMetadata({
    title: "Dog Daycare Software Features for Pet Businesses",
    description:
      "Explore Genera features for dog daycares and pet businesses, including online bookings, client and pet records, invoicing, route planning, staff management and compliance.",
    path: "/features",
  }),
};

export default async function FeaturesPage() {
  const showBookDemo = await isFormActive(BOOK_DEMO_FORM_SLUG);
  return <FeaturesClient showBookDemo={showBookDemo} />;
}
