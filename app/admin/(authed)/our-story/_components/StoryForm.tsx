"use client";

import Image from "next/image";
import { useState } from "react";
import { AdminBusyButton } from "../../_components/AdminBusyButton";

type Initial = {
  year?: string;
  body?: string;
  sort_order?: number;
  is_visible?: boolean;
  image_url?: string | null;
};

export default function StoryForm({
  initial,
  action,
  submitLabel,
}: {
  initial?: Initial;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}) {
  const [preview, setPreview] = useState<string | null>(
    initial?.image_url ?? null,
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

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
      <div className="grid gap-5 sm:grid-cols-[1fr_2fr]">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Year label
          </label>
          <input
            type="text"
            name="year"
            required
            maxLength={40}
            defaultValue={initial?.year ?? ""}
            placeholder="2019 or Today"
            className="w-full rounded-lg border border-teal-mid bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/60"
          />
          <p className="mt-1 text-xs text-ink-soft">
            Shown above the description in the timeline card.
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Description
          </label>
          <textarea
            name="body"
            required
            maxLength={600}
            rows={3}
            defaultValue={initial?.body ?? ""}
            className="w-full rounded-lg border border-teal-mid bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/60"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">
          Photo (optional)
        </label>
        {preview && (
          <div className="mb-3 flex items-center gap-3 rounded-lg border border-teal-mid bg-cream p-3">
            <Image
              src={preview}
              alt="Current photo"
              width={120}
              height={120}
              className="h-20 w-20 rounded object-cover"
              unoptimized
            />
            {initial?.image_url && (
              <label className="flex items-center gap-2 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  name="remove_image"
                  checked={removeImage}
                  onChange={(e) => {
                    setRemoveImage(e.target.checked);
                    if (e.target.checked) setPreview(null);
                  }}
                  className="h-4 w-4 rounded border-teal-mid text-gold focus:ring-gold-soft"
                />
                Remove current photo
              </label>
            )}
          </div>
        )}
        <input
          type="file"
          name="image_file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              const url = URL.createObjectURL(f);
              setPreview(url);
              setRemoveImage(false);
            }
          }}
          className="block w-full text-sm text-ink file:mr-4 file:rounded-md file:border-0 file:bg-forest-dark file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-forest"
        />
        <p className="mt-1 text-xs text-ink-soft">
          PNG, JPG, WebP, or SVG. Max 5 MB. Square or 4:3 photos look best in
          the polaroid frame.
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
            <span className="text-sm text-ink">Show on the our-story page</span>
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
