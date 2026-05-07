import type { Metadata } from "next";
import { Inter, Poppins, Caveat } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  title: "Genera — The Software That Actually Understands Your Daycare",
  description:
    "Genera — purpose-built software for dog daycares, walkers and pet care businesses. Bookings, payments, transport, staff and pet records in one place.",
  icons: {
    icon: "https://d2xsxph8kpxj0f.cloudfront.net/310519663478487775/BxxxoQYbhf7FnKvPttwktS/genera-paw-fixed_92730de9.png",
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
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
