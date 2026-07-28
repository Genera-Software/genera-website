import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookDemoModal from "@/components/BookDemoModal";
import ConsentManager from "@/components/ConsentManager";
import NotFoundContent from "@/components/NotFoundContent";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "This page has wandered off. Head back to the Genera homepage or explore our features, FAQs and blog.",
  robots: { index: false, follow: true },
};

/**
 * 404 for URLs that match no route at all. Because this boundary sits above
 * every route group, it has to bring its own site chrome — routes inside
 * `(site)` use `app/(site)/not-found.tsx` instead so the chrome is not
 * rendered twice.
 */
export default function NotFound() {
  return (
    <ConsentManager>
      <Navbar />
      <main>
        <NotFoundContent />
      </main>
      <Footer />
      <BookDemoModal />
    </ConsentManager>
  );
}
