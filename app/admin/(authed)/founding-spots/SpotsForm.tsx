"use client";

import { useActionState } from "react";
import { updateFoundingSpots } from "./actions";

export default function SpotsForm({
  initial,
}: {
  initial: { total_spots: number; claimed_spots: number };
}) {
  const [state, action, pending] = useActionState(updateFoundingSpots, null);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Total spots
          </label>
          <input
            type="number"
            name="total_spots"
            min={1}
            max={10000}
            required
            defaultValue={initial.total_spots}
            className="w-full rounded-lg border border-teal-mid bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/60"
          />
          <p className="mt-1 text-xs text-ink-soft">
            E.g. 100 for the &quot;Founding One Hundred&quot;.
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Claimed spots
          </label>
          <input
            type="number"
            name="claimed_spots"
            min={0}
            max={10000}
            required
            defaultValue={initial.claimed_spots}
            className="w-full rounded-lg border border-teal-mid bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/60"
          />
          <p className="mt-1 text-xs text-ink-soft">
            Spots that have already been signed up.
          </p>
        </div>
      </div>

      {state?.error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Saved. Public site will refresh within 60 seconds.
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:opacity-90 hover:shadow-md hover:shadow-gold/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
