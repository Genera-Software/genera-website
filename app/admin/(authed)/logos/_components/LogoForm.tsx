"use client";

import Image from "next/image";
import { useState } from "react";
import { AdminBusyButton } from "../../_components/AdminBusyButton";

type Initial = {
  name?: string;
  sort_order?: number;
  is_visible?: boolean;
  logo_url?: string | null;
};

export default function LogoForm({
  initial,
  action,
  submitLabel,
}: {
  initial?: Initial;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}) {
  const [preview, setPreview] = useState<string | null>(initial?.logo_url ?? null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removeLogo, setRemoveLogo] = useState(false);

  return (
    <form
      action={async (fd) => {
        setPending(true);
        setError(null);
        try {
          await action(fd);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong");
          setPending(false);
        }
      }}
      className="flex flex-col gap-5"
    >
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">
          Business name
        </label>
        <input
          type="text"
          name="name"
          required
          maxLength={80}
          defaultValue={initial?.name ?? ""}
          className="w-full rounded-lg border border-teal-mid bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/60"
        />
        <p className="mt-1 text-xs text-ink-soft">
          Shown as a chip if no logo image is uploaded.
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">
          Logo image (optional)
        </label>
        {preview && (
          <div className="mb-3 flex items-center gap-3 rounded-lg border border-teal-mid bg-cream p-3">
            <Image
              src={preview}
              alt="Current logo"
              width={120}
              height={48}
              className="h-12 w-auto"
              unoptimized
            />
            {initial?.logo_url && (
              <label className="flex items-center gap-2 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  name="remove_logo"
                  checked={removeLogo}
                  onChange={(e) => {
                    setRemoveLogo(e.target.checked);
                    if (e.target.checked) setPreview(null);
                  }}
                  className="h-4 w-4 rounded border-teal-mid text-gold focus:ring-gold-soft"
                />
                Remove current logo
              </label>
            )}
          </div>
        )}
        <input
          type="file"
          name="logo_file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              const url = URL.createObjectURL(f);
              setPreview(url);
              setRemoveLogo(false);
            }
          }}
          className="block w-full text-sm text-ink file:mr-4 file:rounded-md file:border-0 file:bg-forest-dark file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-forest"
        />
        <p className="mt-1 text-xs text-ink-soft">
          PNG, JPG, WebP, or SVG. Max 5 MB. Aim for a wide rectangular logo.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Sort order
          </label>
          <input
            type="number"
            name="sort_order"
            min={0}
            step={10}
            defaultValue={initial?.sort_order ?? 0}
            className="w-full rounded-lg border border-teal-mid bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/60"
          />
          <p className="mt-1 text-xs text-ink-soft">
            Lower numbers appear first.
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Visibility
          </label>
          <label className="flex h-[42px] items-center gap-2 rounded-lg border border-teal-mid bg-white px-3">
            <input
              type="checkbox"
              name="is_visible"
              defaultChecked={initial?.is_visible ?? true}
              className="h-4 w-4 rounded border-teal-mid text-gold focus:ring-gold-soft"
            />
            <span className="text-sm text-ink">Show on landing page</span>
          </label>
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <AdminBusyButton
          type="submit"
          variant="gold"
          pending={pending}
          pendingLabel="Saving…"
        >
          {submitLabel}
        </AdminBusyButton>
      </div>
    </form>
  );
}
