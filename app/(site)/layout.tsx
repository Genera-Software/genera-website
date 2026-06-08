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
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "GBP",
    description: "Founding 100 onboarding available for new customers.",
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
