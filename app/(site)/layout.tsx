import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookDemoModal from "@/components/BookDemoModal";
import ConsentManager from "@/components/ConsentManager";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/genera-svg.svg`,
  sameAs: [
    "https://www.instagram.com/generadogsoftware/",
    "https://www.tiktok.com/@genera.dog",
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description:
    "Dog daycare and pet business management software for bookings, payments, transport, staff scheduling and pet records.",
  // Cheapest tier on sale, so the rich result quotes a price a visitor can actually buy.
  // Mirrors lib/pricing.ts — see the note there about why plans are hard-coded.
  offers: {
    "@type": "Offer",
    price: "50",
    priceCurrency: "GBP",
    description:
      "From £50 per month. Starter £50, Grow £75, Thrive £99, each with a 30-day free trial. No setup fee and no contract.",
  },
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationSchema, softwareSchema]),
        }}
      />
      <ConsentManager>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <BookDemoModal />
      </ConsentManager>
    </>
  );
}
