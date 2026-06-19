import type { Metadata } from "next";
import DocsShell from "./_components/DocsShell";
import { getDocNav, getDocSearchIndex } from "./_data/load";

export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    default: "Help Centre",
    template: "%s | Genera Help Centre",
  },
  description:
    "Learn how to use Genera — a page-by-page guide to the admin portal: bookings, owners, pets, finance, reports, team, routes and settings.",
  robots: { index: true, follow: true },
};

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [nav, searchIndex] = await Promise.all([
    getDocNav(),
    getDocSearchIndex(),
  ]);
  return (
    <DocsShell nav={nav} searchIndex={searchIndex}>
      {children}
    </DocsShell>
  );
}
