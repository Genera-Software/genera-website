import Image from "next/image";
import Link from "next/link";
import { getAdminSupabase } from "@/lib/supabase/admin";
import PageHeader from "../_components/PageHeader";
import { deleteLogo, moveLogo } from "./actions";

export const dynamic = "force-dynamic";

export default async function LogosPage() {
  const supabase = getAdminSupabase();
  const { data: logos } = await supabase
    .from("trust_logos")
    .select("id, name, logo_url, sort_order, is_visible")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageHeader
        title="Trust logos"
        description='Logos shown in the "Businesses already on board" strip on the landing page.'
        action={
          <Link
            href="/admin/logos/new"
            className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink transition-all hover:opacity-90 hover:shadow-md hover:shadow-gold/30"
          >
            + Add logo
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-teal-mid bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Logo</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Visibility</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {(logos ?? []).map((logo) => (
              <tr key={logo.id} className="hover:bg-cream">
                <td className="px-5 py-3 align-middle">
                  <div className="flex items-center gap-1">
                    <form
                      action={async () => {
                        "use server";
                        await moveLogo(logo.id, "up");
                      }}
                    >
                      <button
                        type="submit"
                        className="rounded p-1 text-ink-soft/70 hover:bg-cream-dark hover:text-ink"
                        title="Move up"
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
                      </button>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await moveLogo(logo.id, "down");
                      }}
                    >
                      <button
                        type="submit"
                        className="rounded p-1 text-ink-soft/70 hover:bg-cream-dark hover:text-ink"
                        title="Move down"
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
                      </button>
                    </form>
                    <span className="ml-2 text-xs text-ink-soft/70">
                      {logo.sort_order}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 align-middle">
                  {logo.logo_url ? (
                    <Image
                      src={logo.logo_url}
                      alt={logo.name}
                      width={80}
                      height={32}
                      className="h-8 w-auto"
                      unoptimized
                    />
                  ) : (
                    <span className="rounded-full border border-teal-mid bg-cream px-2.5 py-1 text-xs text-ink-soft">
                      No logo · text chip
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 align-middle font-medium text-ink">
                  {logo.name}
                </td>
                <td className="px-5 py-3 align-middle">
                  {logo.is_visible ? (
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
                      href={`/admin/logos/${logo.id}/edit`}
                      className="rounded-md border border-teal-mid px-3 py-1.5 text-xs font-semibold text-ink hover:border-forest"
                    >
                      Edit
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteLogo(logo.id);
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
            {(logos ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-ink-soft">
                  No logos yet. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
