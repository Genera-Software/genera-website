import type { Metadata } from "next";
import DocsShell from "./_components/DocsShell";
import { NAV } from "./_data/sections";

export const metadata: Metadata = {
  title: {
    default: "Help Centre",
    template: "%s | Genera Help Centre",
  },
  description:
    "Learn how to use Genera — a page-by-page guide to the admin portal: bookings, owners, pets, finance, reports, team, routes and settings.",
  robots: { index: true, follow: true },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsShell nav={NAV}>{children}</DocsShell>;
}
