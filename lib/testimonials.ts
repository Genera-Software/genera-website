/* Landing-page testimonials. Add a `video` to any entry and its card
   grows a play button that opens the video in a popup — no other change
   needed. `url` takes a YouTube, Vimeo or Instagram link, or a direct
   video file (e.g. an .mp4 in /public or Supabase storage). */

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
  role?: string;
  business: string;
  /** Square-ish headshot; anything in /public or an allowed remote host. */
  image: string;
  video?: TestimonialVideo;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "ceara-big-bowowski",
    quote:
      "This is stopping us sitting tearing our hair out for hours on end… at 3:00 in the morning doing invoices… The less time that I spend crying behind my laptop and the more time I spend in the field…",
    name: "Ceara",
    business: "The Big Bowowski",
    image: "/images/testimonials/ceara-big-bowowski.jpg",
    video: {
      url: "https://www.instagram.com/reels/DbiGBXBjLzL/",
      orientation: "portrait",
    },
  },
];
