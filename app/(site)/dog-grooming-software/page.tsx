import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VerticalPage from "@/components/verticals/VerticalPage";
import { createMetadata } from "@/lib/seo";
import { getVertical } from "@/lib/verticals";

const vertical = getVertical("dog-grooming-software");

export const metadata: Metadata = vertical
  ? createMetadata({
      title: vertical.metaTitle,
      description: vertical.description,
      path: "/dog-grooming-software",
    })
  : {};

export default function Page() {
  if (!vertical) notFound();
  return <VerticalPage vertical={vertical} />;
}
