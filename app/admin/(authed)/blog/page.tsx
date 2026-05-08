import Link from "next/link";
import { getAdminSupabase } from "@/lib/supabase/admin";
import PageHeader from "../_components/PageHeader";
import { deleteBlogPost, togglePublish } from "./actions";

export const dynamic = "force-dynamic";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BlogAdminPage() {
  const supabase = getAdminSupabase();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select(
      "id, slug, title, category, author_name, is_published, published_at, updated_at",
    )
    .order("updated_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Blog posts"
        description="Articles shown on /blog and /blog/[slug]."
        action={
          <Link
            href="/admin/blog/new"
            className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink transition-all hover:opacity-90 hover:shadow-md hover:shadow-gold/30"
          >
            + New post
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-teal-mid bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Published</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {(posts ?? []).map((p) => (
              <tr key={p.id} className="hover:bg-cream">
                <td className="px-5 py-3 align-middle">
                  <Link
                    href={`/admin/blog/${p.id}/edit`}
                    className="font-semibold text-ink hover:text-forest"
                  >
                    {p.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    /blog/{p.slug} · by {p.author_name}
                  </p>
                </td>
                <td className="px-5 py-3 align-middle text-ink-soft">
                  {p.category}
                </td>
                <td className="px-5 py-3 align-middle">
                  {p.is_published ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      Published
                    </span>
                  ) : (
                    <span className="rounded-full bg-cream-dark px-2.5 py-0.5 text-xs font-semibold text-ink-soft">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 align-middle text-ink-soft">
                  {formatDate(p.published_at)}
                </td>
                <td className="px-5 py-3 text-right align-middle">
                  <div className="inline-flex items-center gap-2">
                    <form
                      action={async () => {
                        "use server";
                        await togglePublish(p.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="rounded-md border border-teal-mid px-3 py-1.5 text-xs font-semibold text-ink hover:border-forest"
                      >
                        {p.is_published ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                    <Link
                      href={`/admin/blog/${p.id}/edit`}
                      className="rounded-md border border-teal-mid px-3 py-1.5 text-xs font-semibold text-ink hover:border-forest"
                    >
                      Edit
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteBlogPost(p.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {(posts ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-ink-soft">
                  No posts yet. Click &ldquo;New post&rdquo; to write one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
