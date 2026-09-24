import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VerticalPage from "@/components/verticals/VerticalPage";
import { createMetadata } from "@/lib/seo";
import { getVertical } from "@/lib/verticals";

const vertical = getVertical("dog-walker-software");

export const metadata: Metadata = vertical
  ? createMetadata({
      title: vertical.metaTitle,
      description: vertical.description,
      path: "/dog-walker-software",
    })
  : {};

export default async function Page() {
  if (!vertical) notFound();
  return <VerticalPage vertical={vertical} />;
}
