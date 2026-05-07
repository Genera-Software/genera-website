import type { Metadata } from "next";
import { Inter, Poppins, Caveat } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookDemoModal from "@/components/BookDemoModal";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Dog Daycare Software for Bookings, Payments & Routes | Genera",
    template: "%s | Genera",
  },
  description:
    "Genera is dog daycare software for UK pet businesses, bringing bookings, payments, transport, staff schedules and pet records into one easy system.",
  applicationName: SITE_NAME,
  keywords: [
    "dog daycare software",
    "dog walking software",
    "pet business software",
    "kennel management software",
    "dog daycare booking system",
    "pet care invoicing software",
    "dog daycare route planning",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Dog Daycare Software for Bookings, Payments & Routes | Genera",
    description:
      "Run your pet care business with dog daycare software built for bookings, invoicing, client records, transport routes and staff management.",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: "Genera dog daycare software dashboard",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dog Daycare Software for Bookings, Payments & Routes | Genera",
    description:
      "Bookings, payments, transport, staff schedules and pet records for UK dog daycares and pet care businesses.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "https://d2xsxph8kpxj0f.cloudfront.net/310519663478487775/BxxxoQYbhf7FnKvPttwktS/genera-paw-fixed_92730de9.png",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663478487775/BxxxoQYbhf7FnKvPttwktS/genera-paw-fixed_92730de9.png",
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
    description: "3-month free trial available for new customers.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${caveat.variable}`}
    >
      <body className="font-[family-name:var(--font-inter)] text-base leading-relaxed">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, softwareSchema]),
          }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <BookDemoModal />
      </body>
    </html>
  );
}
