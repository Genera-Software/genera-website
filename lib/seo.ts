import type { Metadata } from "next";

export const SITE_URL = "https://www.generasoftware.com";
export const SITE_NAME = "Genera Software";
export const DEFAULT_OG_IMAGE = "/images/hero-background-fun.png";

// Author / E-E-A-T. Genera is built by Duncan, who has run Duncan's Doggy
// Daycare for 15 years. Surfacing that real operator experience is a trust
// signal that pure-software competitors cannot match, for both Google and
// AI answer engines.
export const AUTHOR_NAME = "Duncan";
export const AUTHOR_TITLE =
  "Founder of Genera and owner of Duncan's Doggy Daycare";
export const AUTHOR_BIO =
  "Duncan has run Duncan's Doggy Daycare for 15 years. Genera is the software he built to run his own pet business, shaped by what actually works day to day, not theory.";

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

