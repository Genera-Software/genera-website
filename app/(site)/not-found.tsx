import type { Metadata } from "next";
import NotFoundContent from "@/components/NotFoundContent";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "This page has wandered off. Head back to the Genera homepage or explore our features, FAQs and blog.",
  robots: { index: false, follow: true },
};

/** Handles `notFound()` from a site route — Navbar/Footer come from the layout. */
export default function SiteNotFound() {
  return <NotFoundContent />;
}
