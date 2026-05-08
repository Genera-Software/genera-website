import { getAdminSupabase } from "@/lib/supabase/admin";
import PageHeader from "../_components/PageHeader";
import SpotsForm from "./SpotsForm";

export const dynamic = "force-dynamic";

export default async function FoundingSpotsPage() {
  const supabase = getAdminSupabase();
  const { data } = await supabase
    .from("founding_spots")
    .select("total_spots, claimed_spots")
    .eq("id", 1)
    .maybeSingle();

  const initial = {
    total_spots: data?.total_spots ?? 100,
    claimed_spots: data?.claimed_spots ?? 0,
  };

  const remaining = Math.max(initial.total_spots - initial.claimed_spots, 0);
  const percent =
    initial.total_spots > 0
      ? Math.min(100, Math.round((initial.claimed_spots / initial.total_spots) * 100))
      : 0;

  return (
    <div>
      <PageHeader
        title="Founding spots"
        description="Update the spots remaining counter shown in the Founding One Hundred section on the landing page."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-teal-mid bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Remaining
          </p>
          <p className="mt-2 font-poppins text-3xl font-extrabold text-forest">
            {remaining}
          </p>
        </div>
        <div className="rounded-2xl border border-teal-mid bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Claimed
          </p>
          <p className="mt-2 font-poppins text-3xl font-extrabold text-ink">
            {initial.claimed_spots}
          </p>
        </div>
        <div className="rounded-2xl border border-teal-mid bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Total
          </p>
          <p className="mt-2 font-poppins text-3xl font-extrabold text-ink">
            {initial.total_spots}
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-cream-dark">
            <div
              className="h-full rounded-full bg-gold"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-teal-mid bg-white p-6">
        <SpotsForm initial={initial} />
      </div>
    </div>
  );
}
