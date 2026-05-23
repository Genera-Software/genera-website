import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import Script from "next/script";
import ConsentProvider from "@/components/ConsentProvider";
import { GA_MEASUREMENT_ID } from "@/lib/analytics/ga-measurement-id";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dog Daycare Software for Bookings, Payments & Routes | Genera",
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
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/genera-svg.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
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
      className={caveat.variable}
    >
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/frg5tgd.css" />
      </head>
      <body className="font-agenda text-base leading-relaxed">
        <ConsentProvider>
          <Script id="ga-consent-default" strategy="beforeInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 2000,
              });
            `}
          </Script>
          {children}
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
        </ConsentProvider>
      </body>
    </html>
  );
}
