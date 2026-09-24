// The comparison posts. These six are the only blog posts Google had indexed on
// 21 September 2026 (the informational guides were crawled and dropped), so they
// are the pages with authority to pass. The landing pages link to them and the
// blog template links every post to the landing pages, so the two sets hold
// each other up. Slugs are the Supabase blog_posts slugs; keep them in step.
export const COMPARISON_POSTS = [
  { slug: "genera-vs-collar-uk-pet-software", title: "Genera vs Collar" },
  { slug: "genera-vs-time-to-pet-uk", title: "Genera vs Time To Pet" },
  { slug: "genera-vs-gingr-uk-alternative", title: "Genera vs Gingr" },
  { slug: "uk-alternative-us-dog-daycare-software", title: "A UK alternative to US dog daycare software" },
  { slug: "dog-daycare-software-gocardless-direct-debit-uk", title: "Direct Debit through GoCardless" },
  { slug: "invoice-payment-tracking-cost-uk", title: "What invoice and payment tracking costs" },
] as const;
