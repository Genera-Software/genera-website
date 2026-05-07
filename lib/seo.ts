import type { Metadata } from "next";

export const SITE_URL = "https://www.generasoftware.com";
export const SITE_NAME = "Genera Software";
export const DEFAULT_OG_IMAGE = "/images/hero-background-fun.png";

type SeoConfig = {
  title: string;
  description: string;
  path?: string;
  image?: string;
};

export function createMetadata({
  title,
  description,
  path = "/",
  image = DEFAULT_OG_IMAGE,
}: SeoConfig): Metadata {
  const canonical = new URL(path, SITE_URL).toString();

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          alt: `${SITE_NAME} dog daycare software`,
        },
      ],
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

