import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Blog — Genera Software",
  description:
    "Practical advice, industry commentary, and lessons learned from 15 years of running a real pet business.",
};

type Post = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  icon: React.ReactNode;
};

const POSTS: Post[] = [
  {
    slug: "xero-integration",
    category: "Integrations",
    title: "Make Running Your Dog Daycare Easier with Xero Integration",
    excerpt:
      "Running a dog daycare or walking business is hard work. Between keeping every dog happy and managing the day-to-day jobs, there is not much time left for paperwork. If you are still doing invoices by hand, chasing payments, or trying to make sense of endless spreadsheets, there is an easier way.",
    author: "Jess",
    date: "Nov 28, 2025",
    readTime: "3 min read",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
  },
  {
    slug: "non-live-booking-risk",
    category: "Industry",
    title:
      "Never Forget a Dog Again: Why Non-Live Booking Systems Create Real Risk",
    excerpt:
      "Forgetting a dog does not usually come from neglect. It comes from bad systems. If your bookings are not live, if information sits in WhatsApp messages, if paper registers get lost — you are already working in a setup where human error is guaranteed.",
    author: "Jess",
    date: "Nov 27, 2025",
    readTime: "2 min read",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </>
    ),
  },
  {
    slug: "transport-times",
    category: "Welfare",
    title:
      "Recent Press Concerns Raise Important Questions About Dog Daycare Transport Times",
    excerpt:
      "Recent coverage in the media has highlighted concerns around dogs spending excessive time in vans before arriving at daycare. Long, inefficient, or poorly managed transport routes can compromise welfare. This conversation is important — and it is overdue.",
    author: "Jess",
    date: "Nov 24, 2025",
    readTime: "3 min read",
    icon: (
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    ),
  },
  {
    slug: "crate-conversation",
    category: "Welfare",
    title: "The Crate Conversation the Dog World Needs to Have",
    excerpt:
      "Dog crates spark strong opinions — some see them as helpful tools, while others worry about cruelty. The key is how they are used. When done right, crates offer security and structure; when misused, they can cause stress.",
    author: "Jess",
    date: "Nov 21, 2025",
    readTime: "1 min read",
    icon: (
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    ),
  },
];

export default function BlogPage() {
  return (
    <>
      <Reveal />

      {/* Page hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-8 py-24 text-white">
        <div className="mx-auto max-w-[860px] text-center">
          <p className="eyebrow !text-gold-soft">Blog</p>
          <h1 className="mt-2 text-white">
            Insights from the <em className="text-gold">front line</em> of pet
            care
          </h1>
          <p className="mx-auto mt-5 max-w-[600px] text-white/80">
            Practical advice, industry commentary, and lessons learned from 15
            years of running a real pet business.
          </p>
        </div>
      </section>

      {/* Blog grid */}
      <section className="bg-cream px-8 py-22">
        <div className="mx-auto grid max-w-[1160px] gap-7 md:grid-cols-2">
          {POSTS.map((p, i) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className={`rev d${(i % 6) + 1} group flex flex-col rounded-2xl border border-cream-dark bg-white p-7 shadow-[0_8px_24px_rgba(0,62,69,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,62,69,0.12)]`}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-gold-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-forest">
                  {p.category}
                </span>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-cream text-forest">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    {p.icon}
                  </svg>
                </span>
              </div>
              <h2 className="mb-3 font-poppins text-xl font-extrabold leading-tight text-forest md:text-[1.4rem]">
                {p.title}
              </h2>
              <p className="mb-5 text-ink-soft">{p.excerpt}</p>

              <div className="mt-auto flex items-center justify-between border-t border-cream-dark pt-4 text-sm">
                <div className="flex items-center gap-2 text-ink-soft">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-forest font-bold text-white">
                    {p.author.charAt(0)}
                  </span>
                  <span className="font-medium text-forest">{p.author}</span>
                  <span className="h-3 w-px bg-cream-dark" />
                  <span>{p.date}</span>
                  <span className="h-3 w-px bg-cream-dark" />
                  <span>{p.readTime}</span>
                </div>
                <span className="text-forest transition-transform group-hover:translate-x-1">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest-dark px-8 py-22 text-center text-white">
        <div className="rev mx-auto max-w-[760px]">
          <h2 className="!text-white">Want to see Genera in action?</h2>
          <p className="mx-auto mt-4 max-w-[560px] text-white/80">
            Start your 3-month free trial today and see how Genera can transform
            the way you run your pet business.
          </p>
          <a
            href="mailto:info@generasoftware.com?subject=Start%20Free%20Trial"
            className="btn btn-gold btn-lg mt-6"
          >
            Start 3-Month Free Trial →
          </a>
        </div>
      </section>
    </>
  );
}
