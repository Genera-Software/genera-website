import type { Metadata } from "next";
import Sidebar from "./_components/Sidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Sidebar />
      <div className="lg:pl-64">
        <main className="px-4 pb-12 pt-20 lg:px-8 lg:pt-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
