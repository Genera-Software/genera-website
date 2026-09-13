import type { TestimonialRow } from "@/lib/supabase/types";

/* Landing-page testimonials live in the `testimonials` table and are
   managed at /admin/testimonials. Give one a video link and its card
   grows a play button that opens the video in a popup. The link can be
   Instagram, YouTube or Vimeo, or a direct video file. */

export type TestimonialVideo = {
  url: string;
  /** Poster frame for direct video files (ignored for embeds). */
  poster?: string;
  /** Phone-shot clips are usually portrait; defaults to landscape.
      Instagram embeds always use their own portrait frame. */
  orientation?: "landscape" | "portrait";
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role?: string | null;
  business: string;
  /** Square-ish headshot; falls back to the person's initials. */
  image?: string | null;
  video?: TestimonialVideo;
};

export const TESTIMONIAL_COLUMNS =
  "id, quote, name, role, business, image_url, video_url" as const;

export function testimonialFromRow(
  row: Pick<
    TestimonialRow,
    "id" | "quote" | "name" | "role" | "business" | "image_url" | "video_url"
  >,
): Testimonial {
  return {
    id: row.id,
    quote: row.quote,
    name: row.name,
    role: row.role,
    business: row.business,
    image: row.image_url,
    video: row.video_url ? { url: row.video_url } : undefined,
  };
}
