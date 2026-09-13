import Image from "next/image";
import Link from "next/link";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { AdminFormStatusButton } from "../_components/AdminBusyButton";
import PageHeader from "../_components/PageHeader";
import { deleteTestimonial, moveTestimonial } from "./actions";

export const dynamic = "force-dynamic";

function videoHost(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host.endsWith("instagram.com")) return "Instagram";
    if (host.endsWith("youtube.com") || host === "youtu.be") return "YouTube";
    if (host.endsWith("vimeo.com")) return "Vimeo";
    return host;
  } catch {
    return "Video";
  }
}

export default async function TestimonialsPage() {
  const supabase = getAdminSupabase();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("id, quote, name, role, business, image_url, video_url, sort_order, is_visible")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description='Quotes shown in the "In their own words" section on the landing page.'
        action={
          <Link
            href="/admin/testimonials/new"
            className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink transition-all hover:opacity-90 hover:shadow-md hover:shadow-gold/30"
          >
            + Add testimonial
          </Link>
        }
      />

      <div className="overflow-x-auto rounded-2xl border border-teal-mid bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Testimonial</th>
              <th className="px-5 py-3">Video</th>
              <th className="px-5 py-3">Visibility</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {(testimonials ?? []).map((t) => (
              <tr key={t.id} className="hover:bg-cream">
                <td className="px-5 py-3 align-middle">
                  <div className="flex items-center gap-1">
                    <form
                      action={async () => {
                        "use server";
                        await moveTestimonial(t.id, "up");
                      }}
                    >
                      <AdminFormStatusButton
                        type="submit"
                        variant="icon"
                        title="Move up"
                        pendingLabel="Moving…"
                        className="rounded p-1 text-ink-soft/70 hover:bg-cream-dark hover:text-ink"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="18 15 12 9 6 15" />
                        </svg>
                      </AdminFormStatusButton>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await moveTestimonial(t.id, "down");
                      }}
                    >
                      <AdminFormStatusButton
                        type="submit"
                        variant="icon"
                        title="Move down"
                        pendingLabel="Moving…"
                        className="rounded p-1 text-ink-soft/70 hover:bg-cream-dark hover:text-ink"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </AdminFormStatusButton>
                    </form>
                    <span className="ml-2 text-xs text-ink-soft/70">{t.sort_order}</span>
                  </div>
                </td>
                <td className="px-5 py-3 align-middle">
                  <div className="flex items-center gap-3">
                    {t.image_url ? (
                      <Image
                        src={t.image_url}
                        alt={t.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal-soft text-xs font-bold text-forest">
                        {t.name.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0 max-w-md">
                      <p className="font-medium text-ink">
                        {t.name}
                        <span className="font-normal text-ink-soft">
                          {" "}
                          · {t.role ? `${t.role}, ${t.business}` : t.business}
                        </span>
                      </p>
                      <p className="truncate text-xs text-ink-soft">&ldquo;{t.quote}&rdquo;</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 align-middle">
                  {t.video_url ? (
                    <a
                      href={t.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-forest underline decoration-gold underline-offset-2 hover:text-gold"
                    >
                      {videoHost(t.video_url)} ↗
                    </a>
                  ) : (
                    <span className="text-xs text-ink-soft/70">None</span>
                  )}
                </td>
                <td className="px-5 py-3 align-middle">
                  {t.is_visible ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      Visible
                    </span>
                  ) : (
                    <span className="rounded-full bg-cream-dark px-2.5 py-0.5 text-xs font-semibold text-ink-soft">
                      Hidden
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-right align-middle">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      href={`/admin/testimonials/${t.id}/edit`}
                      className="rounded-md border border-teal-mid px-3 py-1.5 text-xs font-semibold text-ink hover:border-forest"
                    >
                      Edit
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteTestimonial(t.id);
                      }}
                    >
                      <AdminFormStatusButton
                        type="submit"
                        variant="outlineDanger"
                        pendingLabel="Deleting…"
                      >
                        Delete
                      </AdminFormStatusButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {(testimonials ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-ink-soft">
                  No testimonials yet. The section is hidden on the landing page until
                  you add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
